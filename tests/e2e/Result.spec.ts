import { test, expect } from '@playwright/test';

test.describe('ResultsScreen', () => {
  test.beforeEach(async ({ page }) => {
    // Устанавливаем тестовые значения в localStorage (при необходимости)
    await page.goto('/results');
  });

  test('1 player', async ({ page }) => {
    // Устанавливаем значения в localStorage для двух игроков
    await page.evaluate(() => {
      localStorage.setItem('player1Score', '10');

      localStorage.setItem('Time', '60');

      localStorage.setItem('playerCount', '1'); // Устанавливаем режим игры на "2 игрока"
    });

    await page.goto('/results'); // Перезагружаем страницу для применения localStorage

    // Проверяем время
    await expect(page.getByText(/Затраченное время: 60 сек./)).toBeVisible();
    await expect(page.getByText(/Победитель: Player/)).not.toBeVisible();
    await expect(page.getByText(/Результаты:/)).not.toBeVisible();
  });

  test('should display "Ничья" when scores are equal', async ({ page }) => {
    // Устанавливаем одинаковые значения в localStorage
    await page.evaluate(() => {
      localStorage.setItem('player1Score', '7');
      localStorage.setItem('player2Score', '7');
      localStorage.setItem('Time', '45');
      localStorage.setItem('Player1', 'Charlie');
      localStorage.setItem('Player2', 'David');
      localStorage.setItem('playerCount', '2');
    });

    await page.goto('/results');

    // Проверяем, что отображается "Ничья"
    await expect(page.getByText(/Победитель: Ничья/)).toBeVisible();

    //Проверяем результаты игроков
    await expect(page.getByText(/Charlie: 7/)).toBeVisible();
    await expect(page.getByText(/David: 7/)).toBeVisible();
      // Проверяем время
    await expect(page.getByText(/Затраченное время: 45 сек./)).toBeVisible();
  });

  test('should navigate to /settings when "Начать новую игру" is clicked', async ({ page }) => {
    await page.locator('text=Начать новую игру').click();
    await expect(page).toHaveURL('/settings');
  });

  test('should navigate to / when "Выход" is clicked', async ({ page }) => {
    await page.locator('text=Выход').click();
    await expect(page).toHaveURL('/');
  });

    test('should not display player and computer', async ({ page }) => {
    // Устанавливаем значения в localStorage для одного игрока
    await page.evaluate(() => {
      localStorage.setItem('player1Score', '15');
      localStorage.setItem('player2Score', '0');
      localStorage.setItem('Time', '30');
      localStorage.setItem('playerCount', 'computer'); // Устанавливаем режим игры на "1 игрок"
    });

    await page.goto('/results');

    // Проверяем, что результаты игроков не отображаются
    await expect(page.getByText(/Победитель: Player/)).toBeVisible();
    await expect(page.getByText(/Результаты:/)).toBeVisible();
    await expect(page.getByText(/Player: 15/)).toBeVisible();
    await expect(page.getByText(/Computer: 0/)).toBeVisible();
      // Проверяем время
    await expect(page.getByText(/Затраченное время: 30 сек./)).toBeVisible();
  });
});