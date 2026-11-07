import { notFound } from "next/navigation";
import { BlogEditor } from "@/components/admin/blog/BlogEditor";
import { DeleteBlogPostButton } from "@/components/admin/blog/DeleteBlogPostButton";
import { getDatabasePostById } from "@/lib/blog";

type PageProps = {
  params: { id: string };
};

export default async function AdminBlogEditPage({ params }: PageProps) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();

  const post = await getDatabasePostById(id);
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <header className="glass-card flex flex-col gap-4 p-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Edit post</h1>
          <p className="mt-1 text-sm text-slate-400">{post.title}</p>
        </div>
        <DeleteBlogPostButton postId={post.id!} title={post.title} />
      </header>
      <div className="glass-card p-6">
        <BlogEditor
          mode="edit"
          initial={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            description: post.description,
            content: post.content,
            date: post.date,
            draft: Boolean(post.draft)
          }}
        />
      </div>
    </div>
  );
}
