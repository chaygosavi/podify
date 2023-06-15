import { Request, RequestHandler } from "express";
import formidable, { Files } from "formidable";

export interface RequestWithFiles extends Request {
  files?: Files;
}

export const fileParsre: RequestHandler = (
  req: RequestWithFiles,
  res,
  next
) => {
  if (!req.headers["content-type"]?.startsWith("multipart/form-data;"))
    return res.status(422).send("Only accepts form-data!");

  const form = formidable({
    multiples: false,
  });

  form.parse(req, (err, fields, files) => {
    if (err) return next(err);

    req.body = fields;
    req.files = files;

    next();
  });
};
