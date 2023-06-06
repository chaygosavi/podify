import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import EmailVerificationToken from "#/models/emailVerificationToken";
import User from "#/models/user";
import { generateToken } from "#/utils/helper";
import { sendVerificationMail } from "#/utils/mail";
import { RequestHandler } from "express";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;
  const user = await User.create({ email, password, name });

  const token = generateToken();

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

  if (!verificationToken) return res.status(403).json({ message: "Invalid token" }
  verificationToken?.compareToken(token);
};
