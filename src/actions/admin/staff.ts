"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession, isSuperAdmin, hashPassword } from "@/lib/auth";

export type StaffFormState = { error?: string; success?: boolean } | null;

export async function createStaff(
  prevState: StaffFormState,
  formData: FormData
): Promise<StaffFormState> {
  const session = await getSession();
  if (!isSuperAdmin(session)) return { error: "Unauthorized" };

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const title = (formData.get("title") as string)?.trim() || "Admin";
  const permissions = formData.getAll("permissions") as string[];

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "An account with this email already exists." };

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: "ADMIN" },
  });

  await prisma.adminRole.create({
    data: {
      userId: user.id,
      title,
      permissions,
      createdById: session!.userId,
    },
  });

  revalidatePath("/admin/staff");
  redirect("/admin/staff");
}

export async function updateStaff(
  userId: string,
  prevState: StaffFormState,
  formData: FormData
): Promise<StaffFormState> {
  const session = await getSession();
  if (!isSuperAdmin(session)) return { error: "Unauthorized" };

  const title = (formData.get("title") as string)?.trim() || "Admin";
  const permissions = formData.getAll("permissions") as string[];
  const role = formData.get("role") as string;

  await prisma.user.update({
    where: { id: userId },
    data: { role: role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN" },
  });

  await prisma.adminRole.upsert({
    where: { userId },
    create: { userId, title, permissions, createdById: session!.userId },
    update: { title, permissions },
  });

  revalidatePath("/admin/staff");
  redirect("/admin/staff");
}

export async function deleteStaff(userId: string): Promise<void> {
  const session = await getSession();
  if (!isSuperAdmin(session)) return;
  if (userId === session!.userId) return; // can't delete yourself

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/staff");
}
