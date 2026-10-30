import { describe, expect, it } from "vitest";
import type { BlogPostMeta } from "@/lib/blog";
import { filterPublishedPosts, mergeBlogPostMeta } from "@/lib/blog-merge";

const base = (overrides: Partial<BlogPostMeta>): BlogPostMeta => ({
  slug: "slug",
  title: "Title",
  description: "",
  date: "2026-01-01",
  source: "filesystem",
  ...overrides
});

describe("mergeBlogPostMeta", () => {
  it("prefers database posts on slug collision", () => {
    const db = [base({ slug: "shared", title: "DB version", source: "database", id: 1 })];
    const fs = [base({ slug: "shared", title: "File version" }), base({ slug: "fs-only", title: "FS only" })];
    const merged = mergeBlogPostMeta(db, fs);
    expect(merged).toHaveLength(2);
    expect(merged.find((p) => p.slug === "shared")?.title).toBe("DB version");
  });

  it("sorts by date descending", () => {
    const merged = mergeBlogPostMeta(
      [base({ slug: "a", date: "2026-01-01", source: "database" })],
      [base({ slug: "b", date: "2026-06-01" })]
    );
    expect(merged.map((p) => p.slug)).toEqual(["b", "a"]);
  });
});

describe("filterPublishedPosts", () => {
  it("removes drafts", () => {
    const posts = [base({ slug: "pub", draft: false }), base({ slug: "draft", draft: true })];
    expect(filterPublishedPosts(posts).map((p) => p.slug)).toEqual(["pub"]);
  });
});
