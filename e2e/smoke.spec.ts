import { test, expect } from "@playwright/test";

test.describe("Portfolio smoke", () => {
  test("homepage shows profile hero and key sections", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /download resume/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /skills/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /get in touch/i })).toBeVisible();
  });

  test("contact form accepts a message", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Name").fill("Playwright Bot");
    await page.getByLabel("Email").fill("bot@example.com");
    await page.getByLabel("Message").fill("Smoke test contact message.");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByRole("status")).toContainText(/thanks/i);
  });

  test("admin requires authentication", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/login/);
  });
});
