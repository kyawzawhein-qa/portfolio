"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isBlogSlugTaken } from "@/lib/blog";
import { isValidBlogSlug, normalizeBlogSlug } from "@/lib/blog-slug";
import { requireAdminAction, UnauthorizedError } from "@/lib/requireAdmin";

export { UnauthorizedError };

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function revalidateBlogPaths(slug: string) {
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/feed.xml");
  revalidatePath("/sitemap.xml");
}

type BlogPostInput = {
  title: string;
  slug: string;
  description: string;
  content: string;
  date: string;
  draft: boolean;
};

async function validateBlogInput(input: BlogPostInput, excludeId?: number) {
  const title = input.title.trim();
  if (!title) throw new Error("Title is required.");

  const slug = normalizeBlogSlug(input.slug || title);
  if (!isValidBlogSlug(slug)) {
    throw new Error("Slug must use lowercase letters, numbers, and hyphens only.");
  }
  if (await isBlogSlugTaken(slug, excludeId)) {
    throw new Error("This slug is already in use.");
  }

  const date = input.date.trim() || todayIsoDate();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Date must be YYYY-MM-DD.");
  }

  return { title, slug, description: input.description.trim(), content: input.content, date, draft: input.draft };
}

export async function createBlogPost(input: BlogPostInput) {
  await requireAdminAction();
  const data = await validateBlogInput(input);

  const post = await prisma.blogPost.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      content: data.content,
      date: data.date,
      draft: data.draft
    }
  });

  revalidateBlogPaths(post.slug);
  return { id: post.id, slug: post.slug };
}

export async function updateBlogPost(id: number, input: BlogPostInput) {
  await requireAdminAction();
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new Error("Post not found.");

  const data = await validateBlogInput(input, id);
  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      content: data.content,
      date: data.date,
      draft: data.draft
    }
  });

  if (existing.slug !== post.slug) {
    revalidateBlogPaths(existing.slug);
  }
  revalidateBlogPaths(post.slug);
  return { id: post.id, slug: post.slug };
}

export async function deleteBlogPost(id: number) {
  await requireAdminAction();
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new Error("Post not found.");

  await prisma.blogPost.delete({ where: { id } });
  revalidateBlogPaths(existing.slug);
}

export async function setBlogPostDraft(id: number, draft: boolean) {
  await requireAdminAction();
  const post = await prisma.blogPost.update({
    where: { id },
    data: { draft }
  });
  revalidateBlogPaths(post.slug);
  return { id: post.id, draft: post.draft };
}
