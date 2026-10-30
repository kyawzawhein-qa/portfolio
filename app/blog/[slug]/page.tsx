import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogMarkdown from "@/components/BlogMarkdown";
import { getPostBySlug, getSiteUrl } from "@/lib/blog";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post not found" };

  const siteUrl = getSiteUrl();
  return {
    title: `${post.title} | Kyaw Zaw Hein`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `${siteUrl}/blog/${post.slug}`
    },
    alternates: {
      canonical: `/blog/${post.slug}`
    }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article className="space-y-6">
      <div className="glass-card p-8">
        <Link href="/blog" className="text-sm text-cyan-300 hover:text-cyan-200">← Back to blog</Link>
        <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">{post.title}</h1>
        {post.description ? <p className="mt-3 text-slate-400">{post.description}</p> : null}
        {post.date ? <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">{post.date}</p> : null}
      </div>
      <div className="glass-card p-8">
        <BlogMarkdown content={post.content} />
      </div>
    </article>
  );
}
