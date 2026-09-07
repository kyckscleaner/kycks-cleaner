import { authenticator } from "otplib";

export function generateTotpSecret() {
  return authenticator.generateSecret();
}

export function buildOtpAuthUrl(email: string, secret: string) {
  return authenticator.keyuri(email, "Kycks Cleaner Admin", secret);
}

export function verifyTotpCode(code: string, secret: string) {
  try {
    return authenticator.verify({ token: code.trim(), secret });
  } catch {
    return false;
  }
}
