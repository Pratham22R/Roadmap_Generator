import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/RoadMap-Generator|Roadmap/i);
});

test('redirects to login when accessing dashboard unauthenticated', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/.*login/);
});

test('redirects to login when accessing onboarding unauthenticated', async ({ page }) => {
  await page.goto('/onboarding');
  await expect(page).toHaveURL(/.*login/);
});
