"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession, hasPermission } from "@/lib/auth";
import { PERMISSIONS } from "@/lib/permissions";
import type { OrderStatus } from "@prisma/client";

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  const session = await getSession();
  if (!hasPermission(session, PERMISSIONS.ORDER_UPDATE)) return;

  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/account");
}

export async function deleteOrder(orderId: string): Promise<void> {
  const session = await getSession();
  if (!hasPermission(session, PERMISSIONS.ORDER_DELETE)) return;

  await prisma.order.delete({ where: { id: orderId } });
  revalidatePath("/admin/orders");
}
