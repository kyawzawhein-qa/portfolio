import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogMarkdown from "@/components/BlogMarkdown";
import { getAllPosts, getPostBySlug, getSiteUrl } from "@/lib/blog";

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getPostBySlug(params.slug);
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

export default function BlogPostPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article className="space-y-6">
      <div className="glass-card p-8">
        <Link href="/blog" className="text-sm text-cyan-300 hover:text-cyan-200">← Back to blog</Link>
        {post.draft ? (
          <p className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
            Sample / draft placeholder — not published editorial content.
          </p>
        ) : null}
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
