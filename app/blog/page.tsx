import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, FileText } from "lucide-react";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Kyaw Zaw Hein",
  description: "Notes on quality engineering, test automation, and delivery practices.",
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "Kyaw Zaw Hein — Blog RSS" }]
    }
  }
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="space-y-6">
      <section className="glass-card p-8">
        <p className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-cyan-300">
          <FileText className="h-4 w-4" />
          Blog
        </p>
        <h1 className="text-3xl font-bold text-white md:text-4xl">Writing & notes</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Markdown posts live in <code className="text-cyan-200">content/blog</code> in the repo — simple to edit, review, and deploy.
        </p>
      </section>

      <section className="space-y-4">
        {posts.length === 0 ? (
          <div className="glass-card p-6 text-slate-400">No posts yet.</div>
        ) : (
          posts.map((post) => (
            <article key={post.slug} className="glass-card p-6 transition hover:border-cyan-500/30">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {post.date || "Undated"}
                </span>
                {post.draft ? (
                  <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-semibold uppercase tracking-wider text-amber-200">
                    Sample / draft
                  </span>
                ) : null}
              </div>
              <h2 className="text-xl font-semibold normal-case tracking-normal text-white">
                <Link href={`/blog/${post.slug}`} className="hover:text-cyan-300">
                  {post.title}
                </Link>
              </h2>
              {post.description ? <p className="mt-2 text-sm text-slate-400">{post.description}</p> : null}
              <Link href={`/blog/${post.slug}`} className="mt-4 inline-block text-sm font-medium text-cyan-300 hover:text-cyan-200">
                Read post →
              </Link>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
