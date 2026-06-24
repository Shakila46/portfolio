import crypto from "crypto";
import { cookies } from "next/headers";

const SECRET = process.env.ADMIN_SECRET || "default-secret-key-change-me";

export interface SessionData {
  email: string;
  expiresAt: number;
}

export function signToken(data: SessionData): string {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64");
  const signature = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

export function verifyToken(token: string): SessionData | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;
  const expectedSignature = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");

  // Constant-time comparison to prevent timing attacks
  const signatureBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expectedSignature, "hex");
  
  if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const data: SessionData = JSON.parse(Buffer.from(payload, "base64").toString("utf-8"));
    if (data.expiresAt < Date.now()) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function checkAuth(): boolean {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return false;
  return verifyToken(token) !== null;
}
