import { Request } from "express";

export interface CreateUser extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}

export interface VerifyEmailRequest extends Request {
  body: {
    userId: string;
    token: string;
  };
}

export interface ReVerifyEmailRequest extends Request {
  body: {
    userId: string;
  };
}

export interface UpdatePassword extends Request {
  body: {
    password: string;
    userId: string;
  };
}
