import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateStaff } from "@/actions/admin/staff";
import StaffForm from "@/components/admin/StaffForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Edit Staff" };

interface Props { params: Promise<{ id: string }> }

export default async function EditStaffPage({ params }: Props) {
  const { id } = await params;

  const member = await prisma.user.findUnique({
    where: { id, role: { in: ["ADMIN", "SUPER_ADMIN"] } },
    include: { adminRole: true },
  });
  if (!member) notFound();

  const boundAction = updateStaff.bind(null, id);

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" size="xs" asChild className="mb-4 -ml-2">
          <Link href="/admin/staff">← Back to Staff</Link>
        </Button>
        <p className="text-xs tracking-[0.4em] uppercase text-primary/60 mb-1">Editing</p>
        <h1 className="text-2xl font-extralight tracking-widest text-foreground">{member.name}</h1>
      </div>
      <Card>
        <CardContent className="p-6">
          <StaffForm action={boundAction} member={member} />
        </CardContent>
      </Card>
    </div>
  );
}
