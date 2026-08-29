import { test, expect } from "@playwright/test";

test("home renders the brand and a hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Marvel's Online Clothings/i }).first()).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("browse a collection and open a product", async ({ page }) => {
  await page.goto("/collections/kurtis");
  await expect(page.getByRole("heading", { name: /Kurtis/i })).toBeVisible();
  const firstProduct = page.locator("a[href^='/products/']").first();
  await firstProduct.click();
  await expect(page).toHaveURL(/\/products\//);
  await expect(page.getByRole("button", { name: /add to bag/i })).toBeVisible();
});

test("guest can add to bag and reach checkout", async ({ page }) => {
  await page.goto("/collections/dresses");
  await page.locator("a[href^='/products/']").first().click();
  // pick the first in-stock size
  const size = page.locator("button", { hasText: /^(S|M|L|XL)$/ }).first();
  await size.click();
  await page.getByRole("button", { name: /add to bag/i }).click();
  await page.goto("/cart");
  await expect(page.getByRole("heading", { name: /your bag/i })).toBeVisible();
  await page.getByRole("link", { name: /checkout/i }).first().click();
  await expect(page).toHaveURL(/\/checkout/);
  await expect(page.getByText(/Cash on delivery/i)).toBeVisible();
});

test("coming-soon page is reachable", async ({ page }) => {
  await page.goto("/coming-soon");
  await expect(page.getByText(/Launching Soon/i)).toBeVisible();
});
