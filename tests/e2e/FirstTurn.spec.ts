// tests/e2e/firstTurnScreen.spec.ts
import { test, expect } from '@playwright/test';

test.describe('FirstTurn', () => {
  test.beforeEach(async ({ page }) => {
    // Устанавливаем имена игроков в localStorage перед переходом на страницу
    await page.goto('/register')
    await page.evaluate(() => {
      localStorage.setItem('Player1', 'Alice');
      localStorage.setItem('Player2', 'Bob');
    });
    await page.goto('/first-turn'); // Замените на фактический путь, если необходимо
  });

  test('should display the first player\'s name', async ({ page }) => {
    // Ждем, пока не появится элемент с именем первого игрока
    await page.waitForSelector('text=/Первым ходит:/i', { timeout: 5000 });

    // Получаем текст элемента, отображающего имя первого игрока
    const firstPlayerText = await page.locator('text=/Первым ходит:/i').textContent();

    // Проверяем, что текст содержит либо "Alice", либо "Bob" (так как первый игрок выбирается случайно)
    expect(firstPlayerText).toMatch(/Alice||Bob/);
  });

  test('should navigate to the game screen when the "Начать игру" button is clicked', async ({ page }) => {
    // Кликаем на кнопку "Начать игру"
    await page.getByRole('button', { name: /Начать игру/i }).click();

    // Ждем, пока не произойдет переход на страницу игры
    await page.waitForURL('/game', { timeout: 5000 });

    // Проверяем, что мы перешли на страницу игры (замените "/game" на фактический путь)
    await expect(page).toHaveURL('/game');
  });

  test('should set FirstPlayer in localStorage', async ({ page }) => {
    // Ждем, пока не появится элемент с именем первого игрока
    await page.waitForSelector('text=/Первым ходит:/i', { timeout: 5000 });

    // Получаем имя первого игрока из localStorage
    const firstPlayerName = await page.evaluate(() => localStorage.getItem('FirstPlayer'));

    // Проверяем, что имя первого игрока не пустое
    expect(firstPlayerName).not.toBeNull();

    // Проверяем, что имя первого игрока - это Alice или Bob
    expect(firstPlayerName).toMatch(/Alice||Bob/);
  });
});