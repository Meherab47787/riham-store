import type { Metadata } from "next";
import Link from "next/link";
import { createStaff } from "@/actions/admin/staff";
import StaffForm from "@/components/admin/StaffForm";

export const metadata: Metadata = { title: "New Staff Member" };

export default function NewStaffPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/admin/staff" className="text-[10px] tracking-[0.2em] uppercase text-[#f5f0e8]/25 hover:text-[#c9a84c] transition-colors mb-4 inline-block">
          ← Back to Staff
        </Link>
        <p className="text-xs tracking-[0.4em] uppercase text-[#c9a84c]/60 mb-1">New Member</p>
        <h1 className="text-2xl font-extralight tracking-[0.1em] text-[#f5f0e8]">Add Staff</h1>
      </div>
      <div className="bg-[#111] border border-[#1a1a1a] p-6">
        <StaffForm action={createStaff} isNew />
      </div>
    </div>
  );
}
