import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./tests/e2e",
  timeout: 60 * 1000,
  workers: 1,
  expect: {
    timeout: 5 * 1000,
  },
  use: {
    actionTimeout: 0,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    // { name: "Mobile Chrome", use: { ...devices["Pixel 5"] } },
    // { name: "Mobile Safari", use: { ...devices["iPhone 12"] } },
  ],
  webServer: {
    command: "npm run start",
    port: 8080,
    timeout: 60 * 1000,
  },
};

export default config;
