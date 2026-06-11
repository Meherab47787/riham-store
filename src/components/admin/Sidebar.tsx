"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SessionPayload } from "@/lib/auth";
import { PERMISSIONS } from "@/lib/permissions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  Ticket,
  BarChart3,
  UserCog,
  Settings,
  ArrowLeft,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  permission?: string;
  superAdminOnly?: boolean;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: "/admin/products", label: "Products", permission: PERMISSIONS.PRODUCT_VIEW, icon: <Package className="w-4 h-4" /> },
  { href: "/admin/orders", label: "Orders", permission: PERMISSIONS.ORDER_VIEW, icon: <ClipboardList className="w-4 h-4" /> },
  { href: "/admin/customers", label: "Customers", permission: PERMISSIONS.CUSTOMER_VIEW, icon: <Users className="w-4 h-4" /> },
  { href: "/admin/coupons", label: "Coupons", permission: PERMISSIONS.COUPON_MANAGE, icon: <Ticket className="w-4 h-4" /> },
  { href: "/admin/reports", label: "Reports", permission: PERMISSIONS.REPORT_VIEW, icon: <BarChart3 className="w-4 h-4" /> },
  { href: "/admin/staff", label: "Staff", permission: PERMISSIONS.USER_MANAGE, superAdminOnly: true, icon: <UserCog className="w-4 h-4" /> },
  { href: "/admin/settings", label: "Settings", permission: PERMISSIONS.SETTINGS_MANAGE, superAdminOnly: true, icon: <Settings className="w-4 h-4" /> },
];

interface SidebarProps {
  session: SessionPayload;
}

export default function AdminSidebar({ session }: SidebarProps) {
  const pathname = usePathname();
  const isSuperAdmin = session.role === "SUPER_ADMIN";

  const visible = navItems.filter((item) => {
    if (item.superAdminOnly && !isSuperAdmin) return false;
    if (!item.permission) return true;
    if (isSuperAdmin) return true;
    return session.permissions.includes(item.permission);
  });

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-charcoal border-r border-border flex flex-col z-40">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-border">
        <p className="text-lg font-light tracking-[0.3em] uppercase text-gold-gradient">Riham</p>
        <p className="text-[10px] tracking-[0.25em] uppercase text-foreground/25 mt-0.5">
          {isSuperAdmin ? "Super Admin" : "Admin Panel"}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="flex flex-col gap-0.5">
          {visible.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-xs tracking-[0.15em] uppercase transition-all duration-200",
                    isActive
                      ? "text-primary bg-primary/8 border-r-2 border-primary"
                      : "text-foreground/40 hover:text-foreground/70 hover:bg-white/4"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-8 h-8 rounded-none">
            <AvatarFallback className="rounded-none text-xs">
              {session.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-xs text-foreground/70 truncate">{session.name}</p>
            <p className="text-[10px] text-foreground/30 truncate">{session.email}</p>
          </div>
        </div>
        <Separator className="mb-3" />
        <button
          type="button"
          onClick={() => { window.location.href = "/"; }}
          className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-foreground/30 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Store
        </button>
      </div>
    </aside>
  );
}
