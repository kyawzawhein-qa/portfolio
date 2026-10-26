import { BlogEditor } from "@/components/admin/blog/BlogEditor";

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function AdminBlogNewPage() {
  return (
    <div className="space-y-6">
      <header className="glass-card p-6">
        <h1 className="text-2xl font-semibold text-white">New blog post</h1>
        <p className="mt-1 text-sm text-slate-400">Write in Markdown with live preview. Slug auto-generates from the title.</p>
      </header>
      <div className="glass-card p-6">
        <BlogEditor
          mode="create"
          initial={{
            title: "",
            slug: "",
            description: "",
            content: "",
            date: todayIsoDate(),
            draft: true
          }}
        />
      </div>
    </div>
  );
}
