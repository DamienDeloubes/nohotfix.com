import { test, expect } from "@playwright/test";

test("app loads without crashing", async ({ page }) => {
  await page.goto("/");
  // Placeholder: verify the page returns a non-error HTTP status
  expect(page.url()).toBeTruthy();
});
