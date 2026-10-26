import { describe, expect, it, vi } from "vitest";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn().mockResolvedValue(null)
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn()
}));

describe("blog server actions auth", () => {
  it("rejects unauthenticated createBlogPost", async () => {
    const { createBlogPost, UnauthorizedError } = await import("@/app/api/actions/blog/actions");
    await expect(
      createBlogPost({
        title: "Blocked",
        slug: "blocked",
        description: "",
        content: "nope",
        date: "2026-10-26",
        draft: true
      })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
