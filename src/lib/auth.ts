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
  role: string;
  permissions: string[];
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({
    userId: payload.userId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    permissions: payload.permissions,
  })
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

  jar.set(
    USER_COOKIE,
    encodeURIComponent(
      JSON.stringify({ name: payload.name, email: payload.email, role: payload.role })
    ),
    { httpOnly: false, sameSite: "lax", maxAge: 7 * 24 * 60 * 60, path: "/" }
  );
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: (payload.role as string) ?? "CUSTOMER",
      permissions: (payload.permissions as string[]) ?? [],
    };
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
  jar.delete(USER_COOKIE);
}

export function hasPermission(
  session: SessionPayload | null,
  permission: string
): boolean {
  if (!session) return false;
  if (session.role === "SUPER_ADMIN") return true;
  return session.permissions.includes(permission);
}

export function isAdmin(session: SessionPayload | null): boolean {
  if (!session) return false;
  return session.role === "ADMIN" || session.role === "SUPER_ADMIN";
}

export function isSuperAdmin(session: SessionPayload | null): boolean {
  return session?.role === "SUPER_ADMIN";
}
