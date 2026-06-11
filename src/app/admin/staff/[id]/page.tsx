import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession, isSuperAdmin } from "@/lib/auth";
import { updateStaff } from "@/actions/admin/staff";
import StaffForm from "@/components/admin/StaffForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditStaffPage({ params }: Props) {
  const session = await getSession();
  if (!isSuperAdmin(session)) {
    redirect("/admin/staff");
  }

  const { id } = await params;

  const member = await prisma.user.findUnique({
    where: { id },
    include: { adminRole: true },
  });

  if (!member || (member.role !== "ADMIN" && member.role !== "SUPER_ADMIN")) {
    notFound();
  }

  const boundAction = updateStaff.bind(null, member.id);

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-2">Administration</p>
        <h1 className="text-3xl font-extralight tracking-[0.2em] uppercase text-foreground">
          Edit Staff — {member.name}
        </h1>
      </div>
      <StaffForm
        action={boundAction}
        member={{
          name: member.name,
          email: member.email,
          role: member.role,
          adminRole: member.adminRole
            ? { title: member.adminRole.title, permissions: member.adminRole.permissions }
            : null,
        }}
      />
    </div>
  );
}
