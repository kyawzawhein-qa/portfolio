import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, FileText } from "lucide-react";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | Kyaw Zaw Hein",
  description: "Notes on quality engineering, test automation, and delivery practices.",
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "Kyaw Zaw Hein — Blog RSS" }]
    }
  }
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <div className="space-y-6">
      <section className="glass-card p-8">
        <p className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-accent">
          <FileText className="h-4 w-4" />
          Blog
        </p>
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">Writing & notes</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          QA engineering notes on test automation, delivery practices, and quality leadership. Posts may be authored in
          the admin CMS or stored as Markdown under <code className="text-accent">content/blog</code>.
        </p>
      </section>

      <section className="space-y-4">
        {posts.length === 0 ? (
          <div className="glass-card p-6 text-muted-foreground">No posts yet.</div>
        ) : (
          posts.map((post) => (
            <article key={post.slug} className="glass-card p-6 transition hover:border-accent/30">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {post.date || "Undated"}
                </span>
              </div>
              <h2 className="text-xl font-semibold normal-case tracking-normal text-foreground">
                <Link href={`/blog/${post.slug}`} className="hover:text-accent">
                  {post.title}
                </Link>
              </h2>
              {post.description ? <p className="mt-2 text-sm text-muted-foreground">{post.description}</p> : null}
              <Link href={`/blog/${post.slug}`} className="mt-4 inline-block text-sm font-medium text-accent hover:text-accent/80">
                Read post →
              </Link>
            </article>
          ))
        )}
      </section>
    </div>
  );
}