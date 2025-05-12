// tests/e2e/HomeScreen.spec.ts
import { test, expect } from '@playwright/test';

test.describe('HomeScreen E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/'); // Замените на URL вашей главной страницы
  });

  test('should display navigation links/buttons', async ({ page }) => {
    await expect(page.locator('text=/Начать игру/i')).toBeVisible();
    // await expect(page.locator('text=/Настройки/i')).toBeVisible();
    await expect(page.locator('text=/Правила/i')).toBeVisible();
  });

  test('should navigate to the settings page when the settings link is clicked', async ({ page }) => {
    await page.locator('text=/Начать игру/i').click();
    await expect(page).toHaveURL('/settings');
  });
});