import { prisma } from "@/lib/prisma";
import { getSession, isSuperAdmin } from "@/lib/auth";
import Link from "next/link";
import { deleteStaff } from "@/actions/admin/staff";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminStaffPage() {
  const session = await getSession();
  const superAdmin = isSuperAdmin(session);

  const staff = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
    orderBy: { createdAt: "asc" },
    include: { adminRole: true },
  });

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-2">Administration</p>
          <h1 className="text-3xl font-extralight tracking-[0.2em] uppercase text-foreground">Staff</h1>
        </div>
        {superAdmin && (
          <Link
            href="/admin/staff/new"
            className="px-5 py-2.5 bg-primary text-primary-foreground text-[11px] tracking-[0.2em] uppercase hover:bg-primary/80 transition-colors"
          >
            + New Staff
          </Link>
        )}
      </div>

      <div className="border border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-charcoal">
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Name</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Email</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Title</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Role</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Permissions</th>
              {superAdmin && (
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-normal">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => {
              const isSelf = session?.userId === member.id;
              const boundDelete = deleteStaff.bind(null, member.id);
              return (
                <tr key={member.id} className="border-b border-border last:border-0 hover:bg-white/2 transition-colors bg-charcoal/50">
                  <td className="px-4 py-3">
                    <p className="text-xs font-light text-foreground/80">{member.name}</p>
                    {isSelf && (
                      <span className="text-[9px] tracking-widest uppercase text-primary/50">You</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs font-light text-foreground/60">{member.email}</td>
                  <td className="px-4 py-3 text-xs font-light text-foreground/50">{member.adminRole?.title ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] tracking-widest uppercase ${member.role === "SUPER_ADMIN" ? "text-primary" : "text-foreground/50"}`}>
                      {member.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-light text-foreground/40">
                    {member.role === "SUPER_ADMIN" ? "All" : member.adminRole?.permissions.length ?? 0}
                  </td>
                  {superAdmin && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/staff/${member.id}`}
                          className="text-[10px] tracking-[0.15em] uppercase text-primary hover:text-primary/70 transition-colors px-3 py-1.5 border border-primary/30 hover:border-primary/60"
                        >
                          Edit
                        </Link>
                        {!isSelf && (
                          <DeleteButton
                            action={boundDelete}
                            confirmMessage={`Remove "${member.name}" from staff? This will delete their account.`}
                            label="Delete"
                          />
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
            {staff.length === 0 && (
              <tr>
                <td colSpan={superAdmin ? 6 : 5} className="px-4 py-12 text-center text-xs text-foreground/30 tracking-widest uppercase bg-charcoal/50">
                  No staff members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
