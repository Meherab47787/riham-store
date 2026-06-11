"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, createSession, deleteSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type AuthState = { error: string } | null;

export async function register(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const phone = (formData.get("phone") as string)?.trim();

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, phone: phone || null },
  });

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    permissions: [],
  });
  revalidatePath("/", "layout");
  redirect("/");
}

export async function login(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { adminRole: true },
  });
  if (!user) {
    return { error: "Invalid email or password." };
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    permissions: user.adminRole?.permissions ?? [],
  });
  revalidatePath("/", "layout");
  redirect(user.role === "SUPER_ADMIN" ? "/admin" : "/");
}

export async function logout() {
  await deleteSession();
  revalidatePath("/", "layout");
  redirect("/");
}
