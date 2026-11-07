import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { prisma } from "@/lib/prisma";
import { filterPublishedPosts, mergeBlogPostMeta } from "@/lib/blog-merge";

export type BlogPostSource = "database" | "filesystem";

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  draft?: boolean;
  source: BlogPostSource;
  /** Present when source is database */
  id?: number;
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
    source: "filesystem",
    content
  };
}

function getFilesystemPostsMeta(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((file) => /\.mdx?$/.test(file));

  return files
    .map((file) => {
      const post = parsePostFile(file);
      if (!post) return null;
      const { content: _content, ...meta } = post;
      return meta;
    })
    .filter((post): post is BlogPostMeta => post !== null);
}

function getFilesystemPostBySlug(slug: string): BlogPost | null {
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

function mapDbRowToMeta(row: {
  id: number;
  slug: string;
  title: string;
  description: string;
  date: string;
  draft: boolean;
}): BlogPostMeta {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    date: row.date,
    draft: row.draft,
    source: "database"
  };
}

async function getDatabasePostsMeta(): Promise<BlogPostMeta[]> {
  const rows = await prisma.blogPost.findMany({ orderBy: [{ date: "desc" }, { updatedAt: "desc" }] });
  return rows.map(mapDbRowToMeta);
}

async function getMergedPostsMeta(includeDrafts: boolean): Promise<BlogPostMeta[]> {
  const [databasePosts, filesystemPosts] = await Promise.all([
    getDatabasePostsMeta(),
    Promise.resolve(getFilesystemPostsMeta())
  ]);
  const merged = mergeBlogPostMeta(databasePosts, filesystemPosts);
  return includeDrafts ? merged : filterPublishedPosts(merged);
}

export async function getAllPosts(options?: { includeDrafts?: boolean }): Promise<BlogPostMeta[]> {
  return getMergedPostsMeta(Boolean(options?.includeDrafts));
}

export async function getPostBySlug(slug: string, options?: { includeDrafts?: boolean }): Promise<BlogPost | null> {
  const includeDrafts = Boolean(options?.includeDrafts);

  const dbPost = await prisma.blogPost.findUnique({ where: { slug } });
  if (dbPost) {
    if (!includeDrafts && dbPost.draft) return null;
    return {
      ...mapDbRowToMeta(dbPost),
      content: dbPost.content
    };
  }

  const fsPost = getFilesystemPostBySlug(slug);
  if (!fsPost) return null;
  if (!includeDrafts && fsPost.draft) return null;
  return fsPost;
}

export async function getDatabasePostById(id: number): Promise<BlogPost | null> {
  const row = await prisma.blogPost.findUnique({ where: { id } });
  if (!row) return null;
  return { ...mapDbRowToMeta(row), content: row.content };
}

export async function isBlogSlugTaken(slug: string, excludeId?: number): Promise<boolean> {
  const existing = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } });
  if (!existing) return false;
  if (excludeId !== undefined && existing.id === excludeId) return false;
  return true;
}

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://kyawzawhein.com").replace(/\/$/, "");
}

/** @internal Exported for unit tests */
export function __testGetFilesystemPostsMeta() {
  return getFilesystemPostsMeta();
}
