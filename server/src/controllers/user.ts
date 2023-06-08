import {
  CreateUser,
  ReVerifyEmailRequest,
  VerifyEmailRequest,
} from "#/@types/user";
import EmailVerificationToken from "#/models/emailVerificationToken";
import PasswordResetToken from "#/models/passwordResetToken";
import User from "#/models/user";
import { generateToken } from "#/utils/helper";
import { sendVerificationMail } from "#/utils/mail";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import crypto from "crypto";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;
  const user = await User.create({ email, password, name });

  const token = generateToken();

  await EmailVerificationToken.create({
    owner: user._id,
    token,
  });

  sendVerificationMail(token, { name, email, userId: user._id.toString() });

  res.status(201).json({ user: { id: user._id, name, email } });
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;

  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (!verificationToken)
    return res.status(403).json({ message: "Invalid token" });

  const matched = await verificationToken.compareToken(token);

  if (!matched) return res.status(403).json({ message: "Invalid token" });

  await User.findByIdAndUpdate(userId, { verified: true });

  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.json({ message: "Your email is verified" });
};

export const sendReVerificationToken: RequestHandler = async (
  req: ReVerifyEmailRequest,
  res
) => {
  const { userId } = req.body;

  if (!isValidObjectId(userId))
    return res.status(403).json({ message: "Invalid request!" });

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ message: "Invalid request!" });

  await EmailVerificationToken.findOneAndDelete({
    owner: userId,
  });

  const token = generateToken();

  await EmailVerificationToken.create({
    owner: userId,
    token,
  });

  sendVerificationMail(token, {
    name: user.name,
    email: user.email,
    userId: user._id.toString(),
  });

  res.json({ message: "Please check your mail" });
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "Account not found!" });

  const token = crypto.randomBytes(36).toString("hex");

  await PasswordResetToken.create({
    owner: user._id,
    token,
  });
};
