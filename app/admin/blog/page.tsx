import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { Plus, Pencil, FileText } from "lucide-react";

export default async function AdminBlogListPage() {
  const posts = await getAllPosts({ includeDrafts: true });

  return (
    <div className="space-y-6">
      <header className="glass-card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            <FileText className="h-4 w-4" />
            Blog CMS
          </p>
          <h1 className="text-2xl font-semibold text-white">Posts</h1>
          <p className="mt-1 text-sm text-slate-400">
            Database posts publish instantly. Repo Markdown files remain available (DB wins on slug collision).
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
        >
          <Plus className="h-4 w-4" />
          New post
        </Link>
      </header>

      <section className="glass-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-800 bg-slate-950/80 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">No posts yet.</td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={`${post.source}-${post.slug}`} className="border-b border-slate-800/80">
                  <td className="px-4 py-3 font-medium text-white">{post.title}</td>
                  <td className="px-4 py-3 font-mono text-xs text-cyan-100">{post.slug}</td>
                  <td className="px-4 py-3 text-slate-400">{post.date || "—"}</td>
                  <td className="px-4 py-3">
                    {post.draft ? (
                      <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-200">
                        Draft
                      </span>
                    ) : (
                      <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-200">
                        Published
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{post.source === "database" ? "Database" : "Markdown file"}</td>
                  <td className="px-4 py-3 text-right">
                    {post.source === "database" && post.id ? (
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                    ) : (
                      <Link href={`/blog/${post.slug}`} className="text-slate-500 hover:text-slate-300" target="_blank">
                        View
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
