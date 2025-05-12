import { test, expect } from '@playwright/test';

test.describe('RegisterScreen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register'); // Замените на фактический путь к вашей странице регистрации
    await page.evaluate(() => localStorage.clear()); // Очищаем localStorage перед каждым тестом
  });

  test('should allow players to enter their names', async ({ page }) => {
    // Заполняем поля имен игроков
    await page.locator('input[name="player1"]').fill('Alice');
    await page.locator('input[name="player2"]').fill('Bob');

    // Проверяем, что значения полей изменились
    await expect(page.locator('input[name="player1"]')).toHaveValue('Alice');
    await expect(page.locator('input[name="player2"]')).toHaveValue('Bob');
  });

  test('should save player names to localStorage when names are entered', async ({ page }) => {
    // Заполняем поля имен игроков
    await page.locator('input[name="player1"]').fill('Alice');
    await page.locator('input[name="player2"]').fill('Bob');

    // Проверяем, что значения сохранены в localStorage
    const player1Name = await page.evaluate(() => localStorage.getItem('Player1'));
    const player2Name = await page.evaluate(() => localStorage.getItem('Player2'));

    expect(player1Name).toBe('Alice');
    expect(player2Name).toBe('Bob');
  });

  test('should navigate to the first-turn screen when the "Продолжить" button is clicked', async ({ page }) => {
    // Заполняем поля имен игроков
    await page.locator('input[name="player1"]').fill('Alice');
    await page.locator('input[name="player2"]').fill('Bob');

    // Кликаем на кнопку "Продолжить"
    await page.getByRole('button', { name: /Продолжить/i }).click();

    // Дожидаемся, пока произойдет переход на страницу first-turn
    await page.waitForURL('/first-turn', { timeout: 5000 });

    // Проверяем, что мы перешли на страницу first-turn
    await expect(page).toHaveURL('/first-turn');
  });

  test('should navigate back to the settings screen when the "Назад" button is clicked', async ({ page }) => {
    // Кликаем на кнопку "Назад"
    await page.getByRole('button', { name: /Назад/i }).click();

    // Дожидаемся, пока произойдет переход на страницу настроек
    await page.waitForURL('/settings', { timeout: 5000 });

    // Проверяем, что мы перешли на страницу настроек
    await expect(page).toHaveURL('/settings');
  });

  test('should handle special characters in player names', async ({ page }) => {
    const playerName1 = 'Алиса!@#$';
    const playerName2 = 'Боб 123';

    // Заполняем поля имен игроков специальными символами
    await page.locator('input[name="player1"]').fill(playerName1);
    await page.locator('input[name="player2"]').fill(playerName2);

    // Проверяем, что значения полей изменились
    await expect(page.locator('input[name="player1"]')).toHaveValue(playerName1);
    await expect(page.locator('input[name="player2"]')).toHaveValue(playerName2);

    // Проверяем, что значения сохранены в localStorage
    const player1Name = await page.evaluate(() => localStorage.getItem('Player1'));
    const player2Name = await page.evaluate(() => localStorage.getItem('Player2'));

    expect(player1Name).toBe(playerName1);
    expect(player2Name).toBe(playerName2);

     // Кликаем на кнопку "Продолжить"
     await page.getByRole('button', { name: /Продолжить/i }).click();

     // Дожидаемся, пока произойдет переход на страницу first-turn
     await page.waitForURL('/first-turn', { timeout: 5000 });
  });
});