import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  draft?: boolean;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function parsePostFile(fileName: string): BlogPost | null {
  const slug = fileName.replace(/\.mdx?$/, "");
  const fullPath = path.join(BLOG_DIR, fileName);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  const title = typeof data.title === "string" ? data.title : slug;
  const description = typeof data.description === "string" ? data.description : "";
  const date =
    typeof data.date === "string"
      ? data.date
      : data.date instanceof Date
        ? data.date.toISOString().slice(0, 10)
        : "";

  return {
    slug,
    title,
    description,
    date,
    draft: Boolean(data.draft),
    content
  };
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((file) => /\.mdx?$/.test(file));

  return files
    .map((file) => {
      const post = parsePostFile(file);
      if (!post) return null;
      const { content: _content, ...meta } = post;
      return meta;
    })
    .filter((post): post is BlogPostMeta => post !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!fs.existsSync(BLOG_DIR)) return null;

  const candidates = [`${slug}.md`, `${slug}.mdx`];
  for (const fileName of candidates) {
    const fullPath = path.join(BLOG_DIR, fileName);
    if (fs.existsSync(fullPath)) {
      return parsePostFile(fileName);
    }
  }
  return null;
}

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://kyawzawhein.com").replace(/\/$/, "");
}
