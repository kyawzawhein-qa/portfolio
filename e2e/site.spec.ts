import { expect, test } from "@playwright/test";
const adminUser = process.env.ADMIN_EMAIL || "admin@example.com";
const adminPass = process.env.ADMIN_PASSWORD || "changeme";

test.describe("portfolio regression", () => {
  test("theme toggle applies light and dark contrast with persistence", async ({ page }) => {
    await page.goto("/");

    const readThemeMetrics = () =>
      page.evaluate(() => {
        const parseRgb = (css: string) => {
          const m = css.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (!m) return null;
          return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) };
        };

        const relativeLuminance = (r: number, g: number, b: number) => {
          const channel = (v: number) => {
            const s = v / 255;
            return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
          };
          const rr = channel(r);
          const gg = channel(g);
          const bb = channel(b);
          return 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
        };

        const bgToken =
          getComputedStyle(document.documentElement).getPropertyValue("--background-rgb").trim() ||
          getComputedStyle(document.documentElement).getPropertyValue("--background").trim();
        const fgToken =
          getComputedStyle(document.documentElement).getPropertyValue("--foreground-rgb").trim() ||
          getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim();

        const bgFromBody = parseRgb(getComputedStyle(document.body).backgroundColor);
        const fgFromBody = parseRgb(getComputedStyle(document.body).color);

        const hexLuminance = (hex: string) => {
          const normalized = hex.replace("#", "");
          const r = parseInt(normalized.slice(0, 2), 16);
          const g = parseInt(normalized.slice(2, 4), 16);
          const b = parseInt(normalized.slice(4, 6), 16);
          return relativeLuminance(r, g, b);
        };

        const rgbTripletLuminance = (triplet: string) => {
          const parts = triplet.split(/\s+/).map((part) => Number(part));
          if (parts.length !== 3 || parts.some((value) => Number.isNaN(value))) return null;
          return relativeLuminance(parts[0], parts[1], parts[2]);
        };

        const bgLum = bgToken.includes(" ")
          ? rgbTripletLuminance(bgToken) ?? 0
          : bgToken.startsWith("#")
            ? hexLuminance(bgToken)
            : bgFromBody
              ? relativeLuminance(bgFromBody.r, bgFromBody.g, bgFromBody.b)
              : 0;
        const fgLum = fgToken.includes(" ")
          ? rgbTripletLuminance(fgToken) ?? 0
          : fgToken.startsWith("#")
            ? hexLuminance(fgToken)
            : fgFromBody
              ? relativeLuminance(fgFromBody.r, fgFromBody.g, fgFromBody.b)
              : 0;
        const contrast = (Math.max(bgLum, fgLum) + 0.05) / (Math.min(bgLum, fgLum) + 0.05);

        return {
          isDark: document.documentElement.classList.contains("dark"),
          theme: localStorage.getItem("theme"),
          bgLum,
          fgLum,
          contrast
        };
      });

    await expect.poll(async () => (await readThemeMetrics()).isDark).toBe(true);
    let metrics = await readThemeMetrics();
    expect(metrics.bgLum).toBeLessThan(0.15);
    expect(metrics.fgLum).toBeGreaterThan(0.5);
    expect(metrics.contrast).toBeGreaterThan(4.5);

    await page.getByRole("button", { name: "Toggle theme" }).click();
    await expect.poll(async () => (await readThemeMetrics()).isDark).toBe(false);
    metrics = await readThemeMetrics();
    expect(metrics.theme).toBe("light");
    expect(metrics.bgLum).toBeGreaterThan(0.85);
    expect(metrics.fgLum).toBeLessThan(0.2);
    expect(metrics.contrast).toBeGreaterThan(4.5);

    await page.reload();
    await expect.poll(async () => (await readThemeMetrics()).isDark).toBe(false);
    metrics = await readThemeMetrics();
    expect(metrics.theme).toBe("light");
    expect(metrics.bgLum).toBeGreaterThan(0.85);

    await page.getByRole("button", { name: "Toggle theme" }).click();
    await expect.poll(async () => (await readThemeMetrics()).isDark).toBe(true);
    await page.reload();
    await expect.poll(async () => (await readThemeMetrics()).isDark).toBe(true);
    metrics = await readThemeMetrics();
    expect(metrics.theme).toBe("dark");
    expect(metrics.bgLum).toBeLessThan(0.15);
  });

  test("homepage and navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Portfolio" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Blog" })).toBeVisible();
    await page.getByRole("link", { name: "Blog" }).click();
    await expect(page).toHaveURL(/\/blog$/);
  });

  test("visitor counter stays non-zero across client navigations", async ({ page }) => {
    await page.goto("/");

    const counter = page.locator(".visitor-counter");
    await expect(counter).toBeVisible();

    const readCount = async () => {
      const label = await counter.getAttribute("aria-label");
      const match = label?.match(/^(\d+) unique visitors$/);
      return match ? Number(match[1]) : 0;
    };

    await expect.poll(readCount, { timeout: 10_000 }).toBeGreaterThan(0);
    const baseline = await readCount();

    await page.getByRole("link", { name: "Blog" }).click();
    await expect(page).toHaveURL(/\/blog$/);
    await expect.poll(readCount).toBeGreaterThan(0);
    expect(await readCount()).toBe(baseline);

    await page.getByRole("link", { name: "Portfolio" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect.poll(readCount).toBeGreaterThan(0);
    expect(await readCount()).toBe(baseline);

    await page.getByRole("button", { name: "Toggle theme" }).click();
    await expect.poll(readCount).toBeGreaterThan(0);
    expect(await readCount()).toBe(baseline);
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
