import Link from "next/link";
import { requireAdmin } from "@/lib/requireAdmin";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { FileText, LayoutDashboard } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <header className="glass-card flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-1.5 text-slate-200 hover:border-cyan-500/40"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-1.5 text-slate-200 hover:border-cyan-500/40"
          >
            <FileText className="h-4 w-4" />
            Blog
          </Link>
        </nav>
        <SignOutButton />
      </header>
      {children}
    </div>
  );
}
