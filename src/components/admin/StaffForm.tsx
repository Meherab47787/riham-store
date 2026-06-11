"use client";

import { useActionState } from "react";
import { PERMISSION_CATEGORIES, PERMISSION_LABELS, ROLE_PRESETS, type Permission } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";

type FormAction = (
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) => Promise<{ error?: string; success?: boolean } | null>;

interface StaffFormProps {
  action: FormAction;
  member?: {
    name: string;
    email: string;
    role: string;
    adminRole?: { title: string; permissions: string[] } | null;
  };
  isNew?: boolean;
}

export default function StaffForm({ action, member, isNew }: StaffFormProps) {
  const [state, dispatch, isPending] = useActionState(action, null);
  const currentPerms = member?.adminRole?.permissions ?? [];

  return (
    <form action={dispatch} className="space-y-6">
      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" name="name" defaultValue={member?.name} required readOnly={!isNew} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" defaultValue={member?.email} required readOnly={!isNew} />
        </div>

        {isNew && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password *</Label>
            <Input id="password" name="password" type="password" required minLength={6} />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Role Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={member?.adminRole?.title ?? "Admin"}
            placeholder="e.g. Store Manager"
          />
        </div>

        {!isNew && (
          <div className="flex flex-col gap-1.5">
            <Label>System Role</Label>
            <Select name="role" defaultValue={member?.role}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Role Presets */}
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 mb-3">Quick Presets</p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(ROLE_PRESETS).map((preset) => (
            <Button
              key={preset}
              type="button"
              variant="secondary"
              size="xs"
              onClick={() => {
                const perms = ROLE_PRESETS[preset];
                document.querySelectorAll<HTMLInputElement>('input[name="permissions"]').forEach((cb) => {
                  cb.checked = perms.includes(cb.value as Permission);
                });
              }}
            >
              {preset}
            </Button>
          ))}
          <Button
            type="button"
            variant="destructive"
            size="xs"
            onClick={() => {
              document.querySelectorAll<HTMLInputElement>('input[name="permissions"]').forEach((cb) => {
                cb.checked = false;
              });
            }}
          >
            Clear All
          </Button>
        </div>
      </div>

      <Separator />

      {/* Permissions */}
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 mb-4">Permissions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(PERMISSION_CATEGORIES).map(([category, perms]) => (
            <Card key={category}>
              <CardHeader className="py-3 px-4">
                <CardTitle>{category}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="flex flex-col gap-2.5">
                  {perms.map((perm) => (
                    <label key={perm} className="flex items-center gap-3 cursor-pointer group">
                      <Checkbox
                        name="permissions"
                        value={perm}
                        defaultChecked={currentPerms.includes(perm)}
                      />
                      <span className="text-xs text-foreground/50 group-hover:text-foreground/70 transition-colors">
                        {PERMISSION_LABELS[perm]}
                      </span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={isPending} className="gap-2">
          <Save className="h-3.5 w-3.5" />
          {isPending ? "Saving…" : isNew ? "Create Staff Member" : "Update Staff Member"}
        </Button>
      </div>
    </form>
  );
}
