import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import SettingsForm from "@/components/admin/SettingsForm";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const settings = await prisma.storeSettings.findUnique({ where: { id: "singleton" } });

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <p className="text-xs tracking-[0.4em] uppercase text-primary/60 mb-1">Super Admin</p>
        <h1 className="text-2xl font-extralight tracking-widest text-foreground">Store Settings</h1>
      </div>
      <Card>
        <CardContent className="p-6">
          <SettingsForm settings={settings} />
        </CardContent>
      </Card>
    </div>
  );
}
