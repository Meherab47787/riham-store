import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { deleteStaff } from "@/actions/admin/staff";
import DeleteButton from "@/components/admin/DeleteButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus } from "lucide-react";

export const metadata: Metadata = { title: "Staff" };

export default async function AdminStaffPage() {
  const session = await getSession();

  const staff = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
    orderBy: { createdAt: "asc" },
    include: { adminRole: true },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.4em] uppercase text-primary/60 mb-1">Administration</p>
          <h1 className="text-2xl font-extralight tracking-widest text-foreground">Staff Members</h1>
        </div>
        <Button asChild size="sm" className="gap-2">
          <Link href="/admin/staff/new">
            <Plus className="h-3.5 w-3.5" />
            Add Staff
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {staff.map((member) => {
          const isSelf = member.id === session?.userId;
          const isSuperAdmin = member.role === "SUPER_ADMIN";
          const permCount = isSuperAdmin ? "All" : (member.adminRole?.permissions.length ?? 0).toString();

          return (
            <Card key={member.id}>
              <CardContent className="p-5 flex items-center gap-5 flex-wrap">
                <Avatar className="w-10 h-10 rounded-none shrink-0">
                  <AvatarFallback
                    className={`rounded-none text-sm font-medium ${
                      isSuperAdmin ? "bg-primary text-primary-foreground" : "bg-accent text-primary"
                    }`}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-sm text-foreground/80 font-light">{member.name}</p>
                    {isSelf && <Badge variant="outline">You</Badge>}
                  </div>
                  <p className="text-xs text-foreground/30 mt-0.5">{member.email}</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/25 mb-1">Role</p>
                    <Badge variant={isSuperAdmin ? "default" : "secondary"}>
                      {isSuperAdmin ? "Super Admin" : (member.adminRole?.title ?? "Admin")}
                    </Badge>
                  </div>

                  <div className="text-center">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/25 mb-1">Permissions</p>
                    <p className="text-sm text-foreground/50">{permCount}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/25 mb-1">Since</p>
                    <p className="text-xs text-foreground/30">
                      {new Date(member.createdAt).toLocaleDateString("en-GB", {
                        month: "short", year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isSelf && (
                      <Button variant="secondary" size="xs" asChild>
                        <Link href={`/admin/staff/${member.id}`}>Edit</Link>
                      </Button>
                    )}
                    {!isSelf && !isSuperAdmin && (
                      <DeleteButton
                        action={deleteStaff.bind(null, member.id)}
                        confirmMessage={`Remove ${member.name} from staff?`}
                        label="Remove"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {staff.length === 0 && (
          <Card>
            <CardContent className="p-10 text-center text-foreground/20 text-xs tracking-[0.2em] uppercase">
              No staff members found
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
