import { describe, expect, it } from "vitest";
import { isValidBlogSlug, normalizeBlogSlug, slugifyTitle } from "@/lib/blog-slug";

describe("blog slug helpers", () => {
  it("slugifies titles", () => {
    expect(slugifyTitle("Hello World — QA Notes!")).toBe("hello-world-qa-notes");
  });

  it("validates slug pattern", () => {
    expect(isValidBlogSlug("good-slug-2")).toBe(true);
    expect(isValidBlogSlug("Bad_Slug")).toBe(false);
    expect(isValidBlogSlug("")).toBe(false);
  });

  it("normalizes manual slug input", () => {
    expect(normalizeBlogSlug("My Post Title")).toBe("my-post-title");
    expect(normalizeBlogSlug("already-good")).toBe("already-good");
  });
});
