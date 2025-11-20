import { test, expect } from '@playwright/test';
import { getSiteTitle, getUsername } from './utils';

test('has correct title', async ({ page }) => {
  await page.goto('/');

  // Expect the title to match the configured site title
  const expectedTitle = getSiteTitle();
  await expect(page).toHaveTitle(expectedTitle);
});

test('hero section is visible and contains username', async ({ page }) => {
  await page.goto('/');

  // Expect the hero section to be visible
  await expect(page.locator('.hero')).toBeVisible();

  // Expect the hero to contain the username
  const username = getUsername();
  await expect(page.locator('.hero')).toContainText(username);
});
