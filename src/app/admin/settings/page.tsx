import { prisma } from "@/lib/prisma";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await prisma.storeSettings.findFirst();

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-2">Administration</p>
        <h1 className="text-3xl font-extralight tracking-[0.2em] uppercase text-foreground">Store Settings</h1>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
