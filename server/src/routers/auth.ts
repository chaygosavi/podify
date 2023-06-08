import {
  create,
  verifyEmail,
  sendReVerificationToken,
  generateForgetPasswordLink,
} from "#/controllers/user";
import { validate } from "#/middleware/validator";
import {
  CreateUserSchema,
  EmailVerificationBody,
  EmailReVerificationBody,
} from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);
router.post("/verify-email", validate(EmailVerificationBody), verifyEmail);
router.post(
  "/re-verify-email",
  validate(EmailReVerificationBody),
  sendReVerificationToken
);
router.post("/forget-password", generateForgetPasswordLink);

export default router;
