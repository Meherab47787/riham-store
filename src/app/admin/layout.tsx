import { redirect } from "next/navigation";
import { getSession, isAdmin } from "@/lib/auth";
import AdminSidebar from "@/components/admin/Sidebar";

export const metadata = { title: { template: "%s | Admin", default: "Admin" } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!isAdmin(session)) {
    redirect("/auth/login?from=admin");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f0e8]">
      <AdminSidebar session={session!} />
      <div className="ml-64 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
}
