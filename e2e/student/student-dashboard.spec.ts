import { test, expect, type Page } from "@playwright/test";

const BASE = "https://yk-academy-web.vercel.app";
const STUDENT_EMAIL = `e2estudent_${Date.now()}@test.com`;
const STUDENT_PASSWORD = "Student123!";

async function registerStudent(request: any): Promise<void> {
  await request.post(`${BASE}/api/auth/register`, {
    data: { name: "E2E Student", email: STUDENT_EMAIL, password: STUDENT_PASSWORD },
  });
}

async function setupStudentAuth(page: Page): Promise<void> {
  const csrfRes = await page.request.get(`${BASE}/api/auth/csrf`);
  const { csrfToken } = await csrfRes.json();
  await page.request.post(`${BASE}/api/auth/callback/credentials`, {
    form: { csrfToken, email: STUDENT_EMAIL, password: STUDENT_PASSWORD },
  });
  await page.goto("/student");
  await page.waitForLoadState("networkidle");
}

test.describe("Student - Auth Guard", () => {
  test("redirects to signin when not authenticated", async ({ page }) => {
    await page.goto("/student");
    await page.waitForURL((url) => url.pathname.includes("/auth/signin"), { timeout: 10000 });
    expect(page.url()).toContain("/auth/signin");
  });
});

test.describe("Student - Registration & Login", () => {
  test("register and login as student", async ({ page, request }) => {
    await registerStudent(request);
    await setupStudentAuth(page);
    await page.waitForTimeout(1000);
  });
});

const STUDENT_PAGES = [
  { name: "dashboard", path: "/student" },
  { name: "profile", path: "/student/profile" },
  { name: "courses", path: "/student/courses" },
  { name: "certificates", path: "/student/certificates" },
  { name: "assignments", path: "/student/assignments" },
  { name: "notifications", path: "/student/notifications" },
  { name: "bookmarks", path: "/student/bookmarks" },
  { name: "attendance", path: "/student/attendance" },
  { name: "calendar", path: "/student/calendar" },
  { name: "grades", path: "/student/grades" },
  { name: "downloads", path: "/student/downloads" },
];

test.describe("Student - Page Loads", () => {
  test("register student for tests", async ({ request }) => {
    await registerStudent(request);
  });

  for (const pg of STUDENT_PAGES) {
    test(`Student - ${pg.name} page loads`, async ({ page }) => {
      await setupStudentAuth(page);
      if (page.url() !== `${BASE}${pg.path}`) {
        await page.goto(pg.path);
        await page.waitForLoadState("networkidle");
      }
      await expect(page.locator("h1, h2").first()).toBeVisible();
    });
  }
});
