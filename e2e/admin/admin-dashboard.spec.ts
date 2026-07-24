import { test, expect, type Page } from "@playwright/test";

const BASE = "https://yk-academy-web.vercel.app";

async function setupAdminAuth(page: Page): Promise<void> {
  const csrfRes = await page.request.get(`${BASE}/api/auth/csrf`);
  const { csrfToken } = await csrfRes.json();
  await page.request.post(`${BASE}/api/auth/callback/credentials`, {
    form: { csrfToken, email: "yossefkhaled551@gmail.com", password: "admin" },
  });
}

test.describe("Admin - Auth Guard", () => {
  test("redirects to signin when not authenticated", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForURL((url) => url.pathname.includes("/auth/signin"), { timeout: 10000 });
    expect(page.url()).toContain("/auth/signin");
  });
});

test.describe("Admin - Login & Dashboard", () => {
  test("admin login returns valid session via API", async ({ request }) => {
    const csrfRes = await request.get(`${BASE}/api/auth/csrf`);
    const { csrfToken } = await csrfRes.json();
    await request.post(`${BASE}/api/auth/callback/credentials`, {
      form: { csrfToken, email: "yossefkhaled551@gmail.com", password: "admin" },
    });
    const sessionRes = await request.get(`${BASE}/api/auth/session`);
    const session = await sessionRes.json();
    expect(session.user).toBeDefined();
    expect(session.user.role).toMatch(/ADMIN|SUPER_ADMIN/);
  });
});

const ADMIN_PAGES = [
  { name: "dashboard", path: "/admin" },
  { name: "users", path: "/admin/users" },
  { name: "courses", path: "/admin/courses" },
  { name: "blog", path: "/admin/blog" },
  { name: "payments", path: "/admin/payments" },
  { name: "settings", path: "/admin/settings" },
  { name: "enrollments", path: "/admin/enrollments" },
  { name: "testimonials", path: "/admin/testimonials" },
  { name: "messages", path: "/admin/messages" },
  { name: "faq", path: "/admin/faq" },
  { name: "activity", path: "/admin/activity" },
  { name: "certificates", path: "/admin/certificates" },
  { name: "discounts", path: "/admin/discounts" },
  { name: "media", path: "/admin/media" },
  { name: "assignments", path: "/admin/assignments" },
  { name: "attendance", path: "/admin/attendance" },
  { name: "subscribers", path: "/admin/subscribers" },
  { name: "course create", path: "/admin/courses/new" },
  { name: "blog new", path: "/admin/blog/new" },
];

for (const pg of ADMIN_PAGES) {
  test(`Admin - ${pg.name} page loads after API login`, async ({ page, context }) => {
    await setupAdminAuth(page);
    await page.goto(pg.path);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });
}
