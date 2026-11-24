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
          className="rounded-lg border border-border bg-card/80 px-3 py-1.5 font-medium text-foreground transition hover:border-accent/50 hover:text-accent"
        >
          Portfolio
        </Link>
        <Link
          href="/blog"
          className="rounded-lg border border-border bg-card/80 px-3 py-1.5 font-medium text-foreground transition hover:border-accent/50 hover:text-accent"
        >
          Blog
        </Link>
      </nav>
      <div className="flex items-center gap-3 sm:ml-auto">
        <VisitorCounter initialCount={visitorCount} />
        <ThemeToggle />
      </div>
    </header>
  );
}