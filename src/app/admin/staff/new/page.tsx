import { redirect } from "next/navigation";
import { getSession, isSuperAdmin } from "@/lib/auth";
import { createStaff } from "@/actions/admin/staff";
import StaffForm from "@/components/admin/StaffForm";

export default async function NewStaffPage() {
  const session = await getSession();
  if (!isSuperAdmin(session)) {
    redirect("/admin/staff");
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-2">Administration</p>
        <h1 className="text-3xl font-extralight tracking-[0.2em] uppercase text-foreground">New Staff Member</h1>
      </div>
      <StaffForm action={createStaff} isNew />
    </div>
  );
}
