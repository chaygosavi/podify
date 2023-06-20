import { createAudio } from "#/controllers/audio";
import { isVerified, mustAuth } from "#/middleware/auth";
import { fileParsre } from "#/middleware/fileParser";
import { validate } from "#/middleware/validator";
import { AudioValidationSchema } from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post(
  "/create",
  mustAuth,
  isVerified,
  fileParsre,
  validate(AudioValidationSchema),
  createAudio
);
