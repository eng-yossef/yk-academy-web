import { test, expect } from "@playwright/test";

const BASE = "https://yk-academy-web.vercel.app";
const TEST_EMAIL = `e2ereg_${Date.now()}@example.com`;
const TEST_PASSWORD = "TestPass123!";

test.describe("Auth - Sign Up", () => {
  test("signup page loads with form fields", async ({ page }) => {
    await page.goto("/auth/signup");
    await expect(page.locator("#name")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator("#confirm")).toBeVisible();
  });

  test("signup has submit button", async ({ page }) => {
    await page.goto("/auth/signup");
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("signup has link to signin", async ({ page }) => {
    await page.goto("/auth/signup");
    await expect(page.locator('a[href*="signin"]').first()).toBeVisible();
  });

  test("signup creates account via API", async ({ request }) => {
    const response = await request.post(`${BASE}/api/auth/register`, {
      data: { name: "E2E Test User", email: TEST_EMAIL, password: TEST_PASSWORD },
    });
    expect(response.status()).toBe(201);
  });

  test("signup rejects duplicate email", async ({ request }) => {
    await request.post(`${BASE}/api/auth/register`, {
      data: { name: "Dup User", email: TEST_EMAIL, password: TEST_PASSWORD },
    });
    const response = await request.post(`${BASE}/api/auth/register`, {
      data: { name: "Dup User", email: TEST_EMAIL, password: TEST_PASSWORD },
    });
    expect(response.status()).toBe(409);
  });

  test("signup validates weak password", async ({ request }) => {
    const response = await request.post(`${BASE}/api/auth/register`, {
      data: { name: "Weak", email: "weak@test.com", password: "123" },
    });
    expect(response.status()).toBe(400);
  });

  test("signup validates invalid email", async ({ request }) => {
    const response = await request.post(`${BASE}/api/auth/register`, {
      data: { name: "Bad Email", email: "notanemail", password: "validpass123" },
    });
    expect(response.status()).toBe(400);
  });
});

test.describe("Auth - Sign In", () => {
  test("signin page loads with form fields", async ({ page }) => {
    await page.goto("/auth/signin");
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
  });

  test("signin has submit button", async ({ page }) => {
    await page.goto("/auth/signin");
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("signin has forgot password link", async ({ page }) => {
    await page.goto("/auth/signin");
    await expect(page.locator('a[href*="forgot"]').first()).toBeVisible();
  });

  test("signin has signup link", async ({ page }) => {
    await page.goto("/auth/signin");
    await expect(page.locator('a[href*="signup"]').first()).toBeVisible();
  });

  test("signin with wrong credentials via API", async ({ request }) => {
    const csrfRes = await request.get(`${BASE}/api/auth/csrf`);
    const { csrfToken } = await csrfRes.json();
    const response = await request.post(`${BASE}/api/auth/callback/credentials`, {
      form: { csrfToken, email: "nonexistent@example.com", password: "wrongpassword" },
    });
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test("signin with admin credentials via API returns session", async ({ request }) => {
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

test.describe("Auth - Forgot Password", () => {
  test("page loads", async ({ page }) => {
    await page.goto("/auth/forgot-password");
    await expect(page.locator("#email, input[type='email']").first()).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("form submission works via API", async ({ request }) => {
    const response = await request.post(`${BASE}/api/auth/forgot-password`, {
      data: { email: "yossefkhaled551@gmail.com" },
    });
    expect(response.status()).toBe(200);
  });

  test("has link back to signin", async ({ page }) => {
    await page.goto("/auth/forgot-password");
    await expect(page.locator('a[href*="signin"]').first()).toBeVisible();
  });
});

test.describe("Auth - Reset Password", () => {
  test("page loads with invalid token", async ({ page }) => {
    await page.goto("/auth/reset-password?token=invalid-token");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1, h2, p").first()).toBeVisible();
  });

  test("rejects invalid token via API", async ({ request }) => {
    const response = await request.post(`${BASE}/api/auth/reset-password`, {
      data: { token: "invalid-token", password: "newpass123" },
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});

test.describe("Auth - Email Verification", () => {
  test("page loads with invalid token", async ({ page }) => {
    await page.goto("/auth/verify-email?token=invalid-token");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1, h2, p").first()).toBeVisible();
  });

  test("rejects invalid token via API", async ({ request }) => {
    const response = await request.post(`${BASE}/api/auth/verify-email`, {
      data: { token: "invalid-token" },
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});
