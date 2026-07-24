import { test, expect } from "@playwright/test";

test.describe("Public Pages", () => {
  test("home page loads with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/YK Academy/i);
  });

  test("home page has hero section", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("h1").first();
    await expect(hero).toBeVisible();
  });

  test("home page has navigation links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /courses/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /about/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /contact/i }).first()).toBeVisible();
  });

  test("about page loads", async ({ page }) => {
    await page.goto("/about");
    await expect(page).toHaveTitle(/YK Academy/i);
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("courses page loads and shows course list", async ({ page }) => {
    await page.goto("/courses");
    await expect(page).toHaveTitle(/YK Academy/i);
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("course detail page loads", async ({ page }) => {
    const response = await page.goto("/courses");
    expect(response?.status()).toBe(200);
    const firstCourseLink = page.locator('a[href*="/courses/"]').first();
    if (await firstCourseLink.isVisible()) {
      await firstCourseLink.click();
      await page.waitForLoadState("networkidle");
      expect(page.url()).toContain("/courses/");
    }
  });

  test("blog page loads", async ({ page }) => {
    await page.goto("/blog");
    await expect(page).toHaveTitle(/YK Academy/i);
  });

  test("contact page loads with form", async ({ page }) => {
    await page.goto("/contact");
    await expect(page).toHaveTitle(/YK Academy/i);
    const form = page.locator("form");
    await expect(form.first()).toBeVisible();
  });

  test("FAQ page loads", async ({ page }) => {
    await page.goto("/faq");
    await expect(page).toHaveTitle(/YK Academy/i);
  });

  test("pricing page loads", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page).toHaveTitle(/YK Academy/i);
  });

  test("404 page shows for unknown routes", async ({ page }) => {
    const response = await page.goto("/nonexistent-page-xyz");
    expect(response?.status()).toBe(404);
  });

  test("manifest.webmanifest is accessible", async ({ page }) => {
    const response = await page.goto("/manifest.webmanifest");
    expect(response?.status()).toBe(200);
  });

  test("robots.txt is accessible", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
    const text = await page.textContent("body");
    expect(text).toContain("User-Agent");
  });

  test("sitemap.xml is accessible", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
  });

  test("favicon.svg is accessible", async ({ page }) => {
    const response = await page.goto("/favicon.svg");
    expect(response?.status()).toBe(200);
  });
});
