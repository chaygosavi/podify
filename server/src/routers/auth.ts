import {
  create,
  generateForgetPasswordLink,
  grantValid,
  sendProfile,
  sendReVerificationToken,
  signIn,
  updatePassword,
  updateProfile,
  verifyEmail,
  logOut,
} from "#/controllers/auth";
import { isValidPassResetToken, mustAuth } from "#/middleware/auth";
import { fileParsre } from "#/middleware/fileParser";
import { validate } from "#/middleware/validator";
import {
  CreateUserSchema,
  EmailReVerificationBody,
  SignInValidationSchema,
  TokenAndIdValidation,
  UpdatePasswordSchema,
} from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);
router.post("/verify-email", validate(TokenAndIdValidation), verifyEmail);
router.post(
  "/re-verify-email",
  validate(EmailReVerificationBody),
  sendReVerificationToken
);
router.post("/forget-password", generateForgetPasswordLink);
router.post(
  "/verify-pass-reset-token",
  validate(TokenAndIdValidation),
  isValidPassResetToken,
  grantValid
);
router.post(
  "/update-password",
  validate(UpdatePasswordSchema),
  isValidPassResetToken,
  updatePassword
);
router.post("/sign-in", validate(SignInValidationSchema), signIn);
router.get("/is-auth", mustAuth, sendProfile);
router.post("/update-profile", mustAuth, fileParsre, updateProfile);
router.post("/log-out", mustAuth, logOut);

export default router;
