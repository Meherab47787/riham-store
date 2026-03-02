import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { phone: true },
  });

  return <CheckoutClient defaultPhone={user?.phone ?? ""} />;
}
