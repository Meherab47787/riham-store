import { redirect } from "next/navigation";
import { getSession, isAdmin } from "@/lib/auth";
import AdminSidebar from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  if (!isAdmin(session)) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-obsidian">
      <AdminSidebar session={session} />
      <main className="ml-64 min-h-screen">{children}</main>
    </div>
  );
}
