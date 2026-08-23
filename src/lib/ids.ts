import crypto from "crypto";
import bcrypt from "bcryptjs";

const ID_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I ambiguity

export function generatePublicReportId(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += ID_CHARS[crypto.randomInt(0, ID_CHARS.length)];
  }
  return `AR-${code}`;
}

export function generateSecretCode(): string {
  // 10-char alphanumeric secret, cryptographically random
  return crypto.randomBytes(8).toString("hex").slice(0, 10).toUpperCase();
}

export async function hashSecretCode(code: string): Promise<string> {
  return bcrypt.hash(code, 10);
}

export async function verifySecretCode(code: string, hash: string): Promise<boolean> {
  return bcrypt.compare(code, hash);
}
