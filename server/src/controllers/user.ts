import { CreateUser } from "#/@types/user";
import User from "#/models/user";
import { MAILTRAP_PASS, MAILTRAP_USER } from "#/utils/variables";
import { RequestHandler } from "express";
import nodemailer from "nodemailer";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;
  const user = await User.create({ email, password, name });

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });

  transport.sendMail({
    to: user.email,
    from: "jai@shree.ram",
    html: "<h1>999999999</h1>",
  });

  res.status(201).json(user);
};