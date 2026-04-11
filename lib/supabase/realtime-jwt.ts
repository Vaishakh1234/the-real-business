import { createHash, randomUUID } from "node:crypto";
import { SignJWT } from "jose";

/** Deterministic UUID-shaped subject from email (stable across token refreshes). */
function stableSubFromEmail(email: string): string {
  const hash = createHash("sha256").update(email.toLowerCase().trim()).digest();
  const buf = Buffer.alloc(16);
  hash.copy(buf, 0, 0, 16);
  buf[6] = (buf[6]! & 0x0f) | 0x40;
  buf[8] = (buf[8]! & 0x3f) | 0x80;
  const hex = buf.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

/**
 * Short-lived JWT for Supabase Realtime + RLS as `authenticated`, with `email` for policies.
 * Signed with the project JWT secret (Dashboard → Settings → API).
 */
export async function signAdminRealtimeJwt(adminEmail: string): Promise<string> {
  const secret = process.env.SUPABASE_JWT_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!secret?.trim()) {
    throw new Error("Missing SUPABASE_JWT_SECRET");
  }
  if (!baseUrl?.trim()) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  const issuer = `${baseUrl.replace(/\/$/, "")}/auth/v1`;
  const key = new TextEncoder().encode(secret);

  return new SignJWT({
    role: "authenticated",
    email: adminEmail,
    aal: "aal1",
    session_id: randomUUID(),
    phone: "",
    is_anonymous: false,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(stableSubFromEmail(adminEmail))
    .setIssuedAt()
    .setExpirationTime("1h")
    .setAudience("authenticated")
    .setIssuer(issuer)
    .sign(key);
}
