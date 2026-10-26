import { expect, test } from "@playwright/test";
const adminUser = process.env.ADMIN_EMAIL || "admin@example.com";
const adminPass = process.env.ADMIN_PASSWORD || "changeme";

test.describe("portfolio regression", () => {
  test("homepage and navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Portfolio" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Blog" })).toBeVisible();
    await page.getByRole("link", { name: "Blog" }).click();
    await expect(page).toHaveURL(/\/blog$/);
  });

  test("visitor counter does not double-count on repeat visit", async ({ page, context }) => {
    await page.goto("/");
    const counter = page.locator("text=/visitor/i").first();
    await expect(counter).toBeVisible();
    const firstText = await counter.textContent();
    await page.reload();
    const secondText = await counter.textContent();
    expect(secondText).toBe(firstText);

    const fresh = await context.browser()?.newContext();
    const freshPage = await fresh!.newPage();
    await freshPage.goto("/");
    await freshPage.close();
  });

  test("admin login and blog CRUD", async ({ page }) => {
    const slug = `e2e-post-${Date.now()}`;
    const title = `E2E Published ${Date.now()}`;

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);

    await page.locator("#email").fill(adminUser);
    await page.locator("#password").fill(adminPass);
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/admin/);

    await page.goto("/admin/blog/new");
    await page.getByPlaceholder("Post title").fill(title);
    await page.locator('input[placeholder="my-post-slug"], input.font-mono').fill(slug);
    await page.getByPlaceholder("Short summary").fill("Automated regression post");
    await page.locator("textarea").first().fill(`# ${title}\n\nRegression body.`);
    await page.getByRole("button", { name: /save & publish/i }).click();
    await expect(page).toHaveURL(/\/admin\/blog\/\d+\/edit/);

    const publicPage = await page.context().newPage();
    await publicPage.goto(`/blog/${slug}`);
    await expect(publicPage.locator("article .glass-card h1").first()).toContainText(title);
    await publicPage.close();
  });

  test("admin subpages require login", async ({ page }) => {
    await page.goto("/admin/blog");
    await expect(page).toHaveURL(/\/login/);
  });

  test("draft filesystem post hidden from public blog list", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByText("Sample Post — Draft Placeholder")).toHaveCount(0);
  });

  test("RSS and sitemap exclude drafts", async ({ request }) => {
    const feed = await request.get("/feed.xml");
    expect(feed.ok()).toBeTruthy();
    const feedText = await feed.text();
    expect(feedText).not.toContain("Sample Post — Draft Placeholder");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    const sitemapText = await sitemap.text();
    expect(sitemapText).not.toContain("sample-draft-placeholder");
  });

  test("XSS payload is not rendered as live script", async ({ page }) => {
    await page.goto("/blog");
    const html = await page.content();
    expect(html.toLowerCase()).not.toContain("<script>alert(");
  });

  test("mobile viewport smoke", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Blog" })).toBeVisible();
  });
});
