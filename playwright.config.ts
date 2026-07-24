import { defineConfig } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "https://yk-academy-web.vercel.app";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    headless: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    navigationTimeout: 30_000,
    actionTimeout: 15_000,
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
  ],
});
