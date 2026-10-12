import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import VisitorCounter from "@/components/VisitorCounter";

type SiteHeaderProps = {
  visitorCount: number;
};

export default function SiteHeader({ visitorCount }: SiteHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <nav className="flex flex-wrap items-center gap-2 text-sm">
        <Link
          href="/"
          className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-1.5 font-medium text-slate-200 hover:border-cyan-500/40 hover:text-cyan-300"
        >
          Portfolio
        </Link>
        <Link
          href="/blog"
          className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-1.5 font-medium text-slate-200 hover:border-cyan-500/40 hover:text-cyan-300"
        >
          Blog
        </Link>
        <Link
          href="/feed.xml"
          className="rounded-lg border border-transparent px-3 py-1.5 text-slate-500 hover:text-cyan-300"
        >
          RSS
        </Link>
      </nav>
      <div className="flex items-center gap-3 sm:ml-auto">
        <VisitorCounter initialCount={visitorCount} />
        <ThemeToggle />
      </div>
    </header>
  );
}
