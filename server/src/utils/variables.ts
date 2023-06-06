const { env } = process as { env: { [key: string]: string } };

export const { MONGODB_URI, MAILTRAP_USER, MAILTRAP_PASS, VERIFICATION_EMAIL } =
  env;
