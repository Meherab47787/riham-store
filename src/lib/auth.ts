import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "riham-fallback-secret"
);
const COOKIE = "riham-session";
const USER_COOKIE = "riham-user";

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(
  userId: string,
  email: string,
  name: string
) {
  const token = await new SignJWT({ userId, email, name })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);

  const jar = await cookies();
  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  };

  jar.set(COOKIE, token, cookieOpts);

  // Plain cookies for client-side reading (navbar state)
  jar.set(USER_COOKIE, encodeURIComponent(JSON.stringify({ name, email })), {
    httpOnly: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
  jar.delete(USER_COOKIE);
}
