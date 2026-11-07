import type { BlogPostMeta } from "@/lib/blog";

/** DB posts win when slugs collide; result sorted newest date first. */
export function mergeBlogPostMeta(databasePosts: BlogPostMeta[], filesystemPosts: BlogPostMeta[]): BlogPostMeta[] {
  const dbSlugs = new Set(databasePosts.map((post) => post.slug));
  const fsOnly = filesystemPosts.filter((post) => !dbSlugs.has(post.slug));
  return [...databasePosts, ...fsOnly].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function filterPublishedPosts(posts: BlogPostMeta[]): BlogPostMeta[] {
  return posts.filter((post) => !post.draft);
}
