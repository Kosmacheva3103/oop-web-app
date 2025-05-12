import { test, expect } from '@playwright/test';

test.describe('SettingsScreen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
  });

  test('should navigate back to the main menu when the "Назад" button is clicked', async ({ page }) => {
    await page.locator('[data-testid="back-button"]').click();
    await expect(page).toHaveURL('/');
  });

  test('should save field size to localStorage when selected', async ({ page }) => {
    // 1. Кликаем на выпадающий список "Размер поля"
    await page.locator('[data-testid="field-size-select"]').click();

    // 2. Кликаем на опцию "6x6"
    await page.locator('[data-testid="field-size-option-6"]').click();

    // Проверяем, что значение fieldSize сохранено в localStorage
    const fieldSize = await page.evaluate(() => localStorage.getItem('fieldSize'));
    expect(fieldSize).toBe('6');
  });

  test('should save player count to localStorage when selected', async ({ page }) => {
    // 1. Кликаем на выпадающий список "Количество участников"
    await page.locator('[data-testid="player-count-select"]').click();

    // 2. Кликаем на опцию "2 игрока"
    await page.locator('[data-testid="player-count-option-2"]').click();

    // Проверяем, что значение playerCount сохранено в localStorage
    const playerCount = await page.evaluate(() => localStorage.getItem('playerCount'));
    expect(playerCount).toBe('2');
  });

  test('should navigate to the register screen when "2 игрока" and "Продолжить" are selected', async ({ page }) => {
    // 1. Кликаем на выпадающий список "Количество участников"
    await page.locator('[data-testid="player-count-select"]').click();

    // 2. Кликаем на опцию "2 игрока"
    await page.locator('[data-testid="player-count-option-2"]').click();

    // Кликаем на кнопку "Продолжить"
    await page.locator('[data-testid="continue-button"]').click();

    // Проверяем, что мы перешли на страницу регистрации
    await expect(page).toHaveURL('/register');
  });

  test('should navigate to the game screen when "1 игрок" and "Продолжить" are selected', async ({ page }) => {
    // 1. Кликаем на выпадающий список "Количество участников"
    await page.locator('[data-testid="player-count-select"]').click();

    // 2. Кликаем на опцию "1 игрок"
    await page.locator('[data-testid="player-count-option-1"]').click();

    // Кликаем на кнопку "Продолжить"
    await page.locator('[data-testid="continue-button"]').click();

    // Проверяем, что мы перешли на страницу игры
    await expect(page).toHaveURL('/game');
  });

  test('should navigate to the game screen when "Игра с компьютером" and "Продолжить" are selected', async ({ page }) => {
    // 1. Кликаем на выпадающий список "Количество участников"
    await page.locator('[data-testid="player-count-select"]').click();

    // 2. Кликаем на опцию "Игра с компьютером"
    await page.locator('[data-testid="player-count-option-computer"]').click();

    // Кликаем на кнопку "Продолжить"
    await page.locator('[data-testid="continue-button"]').click();

    // Проверяем, что мы перешли на страницу игры
    await expect(page).toHaveURL('/game');
  });

  test('should save the default field size when the page is loaded', async ({ page }) => {
    const fieldSize = await page.evaluate(() => localStorage.getItem('fieldSize'));
    expect(fieldSize).toBe('4');
  });

  test('should save the default player count when the page is loaded', async ({ page }) => {
    const playerCount = await page.evaluate(() => localStorage.getItem('playerCount'));
    expect(playerCount).toBe('1');
  });
});