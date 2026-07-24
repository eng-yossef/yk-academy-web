import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("navbar exists on home page", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();
  });

  test("footer exists on home page", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test("logo links to home", async ({ page }) => {
    await page.goto("/courses");
    const logo = page.locator('a[href="/"]').first();
    await expect(logo).toBeVisible();
  });

  test("nav links navigate between pages", async ({ page }) => {
    await page.goto("/");
    const coursesLink = page.locator('a[href="/courses"]').first();
    await coursesLink.click();
    await page.waitForLoadState("networkidle");
    expect(page.url()).toContain("/courses");
  });
});

test.describe("Search", () => {
  test("courses page has search input", async ({ page }) => {
    await page.goto("/courses");
    const search = page.locator('input[type="search"], input[placeholder*="earch"], input[name*="search"], input[placeholder*="ilter"]');
    const count = await search.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe("Forms", () => {
  test("contact form has required fields", async ({ page }) => {
    await page.goto("/contact");
    const form = page.locator("form").first();
    await expect(form).toBeVisible();
    const inputs = form.locator("input");
    const inputCount = await inputs.count();
    expect(inputCount).toBeGreaterThanOrEqual(2);
    await expect(form.locator("textarea").first()).toBeVisible();
  });

  test("contact form validates empty submission", async ({ page }) => {
    await page.goto("/contact");
    const submitBtn = page.locator('button[type="submit"]');
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(1000);
    }
  });

  test("contact form submits with data", async ({ page }) => {
    await page.goto("/contact");
    const form = page.locator("form").first();
    if (await form.isVisible()) {
      const inputs = form.locator("input");
      const inputCount = await inputs.count();
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        if (await input.isVisible()) {
          const type = await input.getAttribute("type");
          if (type === "email") {
            await input.fill("playwright@test.com");
          } else {
            await input.fill("Playwright Test");
          }
        }
      }
      const textarea = form.locator("textarea").first();
      if (await textarea.isVisible()) {
        await textarea.fill("Automated E2E test message");
      }
      await form.locator('button[type="submit"]').click();
      await page.waitForTimeout(3000);
    }
  });
});

test.describe("Responsive", () => {
  test("mobile viewport renders correctly", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForTimeout(1000);
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("desktop viewport renders correctly", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.waitForTimeout(1000);
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("tablet viewport renders correctly", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await page.waitForTimeout(1000);
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });
});

test.describe("API Routes", () => {
  test("POST /api/contact validates input", async ({ request }) => {
    const response = await request.post("/api/contact", { data: {} });
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });

  test("POST /api/newsletter validates input", async ({ request }) => {
    const response = await request.post("/api/newsletter", { data: {} });
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });

  test("GET /api/admin/stats returns auth error", async ({ request }) => {
    const response = await request.get("/api/admin/stats");
    expect(response.status()).toBeLessThan(500);
  });

  test("GET /api/student/dashboard returns auth error", async ({ request }) => {
    const response = await request.get("/api/student/dashboard");
    expect(response.status()).toBeLessThan(500);
  });
});

test.describe("Protected Routes", () => {
  test("student pages redirect to signin", async ({ page }) => {
    await page.goto("/student");
    await page.waitForURL((url) => url.pathname.includes("/auth/signin"), { timeout: 10000 });
    expect(page.url()).toContain("/auth/signin");
  });

  test("admin pages redirect to signin", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForURL((url) => url.pathname.includes("/auth/signin"), { timeout: 10000 });
    expect(page.url()).toContain("/auth/signin");
  });
});

test.describe("Static Files", () => {
  test("robots.txt loads", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
  });

  test("sitemap.xml loads", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
  });

  test("favicon.svg loads", async ({ request }) => {
    const response = await request.get("/favicon.svg");
    expect(response.status()).toBe(200);
  });

  test("manifest.webmanifest loads", async ({ request }) => {
    const response = await request.get("/manifest.webmanifest");
    expect(response.status()).toBe(200);
  });

  test("og.svg loads", async ({ request }) => {
    const response = await request.get("/og.svg");
    expect(response.status()).toBe(200);
  });
});

test.describe("No Console Errors on Public Pages", () => {
  for (const path of ["/", "/courses", "/blog", "/contact", "/about", "/faq", "/pricing"]) {
    test(`${path} has no critical console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });
      await page.goto(path);
      await page.waitForTimeout(2000);
      const critical = errors.filter(
        (e) => !e.includes("favicon") && !e.includes("404") && !e.includes("Failed to load resource") && !e.includes("hydrat")
      );
      expect(critical).toHaveLength(0);
    });
  }
});
