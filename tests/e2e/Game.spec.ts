import { test, expect } from '@playwright/test';

test.describe('GameScreen', () => {
  test.beforeEach(async ({ page }) => {
    // Устанавливаем начальные значения в localStorage
    await page.goto('/setting');
    await page.evaluate(() => {
      localStorage.setItem('fieldSize', '4');
      localStorage.setItem('playerCount', '2');
      localStorage.setItem('Player1', 'Alice');
      localStorage.setItem('Player2', 'Bob');
      localStorage.setItem('FirstPlayer', 'Aliсe');
    });

    // Переходим на страницу игры
    await page.goto('/game');
  });

  test('should display the correct number of moves', async ({ page }) => {
    // Проверяем, что отображается правильное количество ходов
    await expect(page.getByText(/Ходы: 0/)).toBeVisible();
  });

  test('should display the correct number of cards', async ({ page }) => {
    // Проверяем, что отображается правильное количество карт (16 для 4x4 поля)
    await page.waitForSelector('[data-testid="game-card"]');
    const cards = await page.locator('[data-testid="game-card"]').count();
    expect(cards).toBe(16);
  });

  test('should flip a card when clicked', async ({ page }) => {
    // Кликаем на первую карту
    await page.locator('[data-testid="game-card"]').first().click();
    // Проверяем, что карта перевернулась (символ отображается)
    await expect(page.locator('[data-testid="game-card"]').first()).not.toHaveText('?');
  });

  test('should navigate to /results when "Сдаться" is clicked', async ({ page }) => {
    // Кликаем на кнопку "Сдаться"
    await page.locator('text=Сдаться').click();
    // Проверяем, что мы перешли на страницу результатов
    await expect(page).toHaveURL('/results');
  });

  test('should display the correct score for two players', async ({ page }) => {
    // Устанавливаем режим игры на "2 игрока"
    await page.evaluate(() => {
      localStorage.setItem('playerCount', '2');
    });

    // Перезагружаем страницу для применения localStorage
    await page.goto('/game');

    // Проверяем, что отображается правильный счет для двух игроков
    await expect(page.getByText(/Счет: Alice - 0 | Bob - 0/)).toBeVisible();
  });

  test('should display the correct score for single player', async ({ page }) => {
    // Устанавливаем режим игры на "1 игрок"
    await page.evaluate(() => {
      localStorage.setItem('playerCount', '1');
    });

    // Перезагружаем страницу для применения localStorage
    await page.goto('/game');

    // Проверяем, что счет не отображается для одного игрока
    await expect(page.getByText(/Счет:/)).not.toBeVisible();
  });

  test('should display the correct score for game against computer', async ({ page }) => {
    // Устанавливаем режим игры на "игра против компьютера"
    await page.evaluate(() => {
      localStorage.setItem('playerCount', 'computer');
    });

    // Перезагружаем страницу для применения localStorage
    await page.goto('/game');

    // Проверяем, что отображается правильный счет для игры против компьютера
    await expect(page.getByText(/Счет: Player - 0 | Computer - 0/)).toBeVisible();
  });


  test('should update scores correctly in two-player mode', async ({ page }) => {
    // Устанавливаем режим игры на "2 игрока"
    await page.evaluate(() => {
      localStorage.setItem('playerCount', '2');
    });

    // Перезагружаем страницу для применения localStorage
    await page.goto('/game');
    // 1. Дожидаемся загрузки карточек
    await page.waitForSelector('[data-testid="game-card"]');

    // 2. Получаем все символы карт с помощью evaluateAll (менее надежно)
    const symbols = await page.locator('[data-testid="game-card"]').evaluateAll(cards => {
      return cards.map(card => card.textContent);
    });

    // 3. Ищем пару (аналогично предыдущему варианту)
    let firstCardIndex = -1;
    let secondCardIndex = -1;
    for (let i = 0; i < symbols.length; i++) {
      for (let j = i + 1; j < symbols.length; j++) {
        if (symbols[i] === symbols[j]) {
          firstCardIndex = i;
          secondCardIndex = j;
          break;
        }
      }
      if (firstCardIndex !== -1) break;
    }

    // 4. Проверяем, что пара найдена
    expect(firstCardIndex).not.toBe(-1);
    expect(secondCardIndex).not.toBe(-1);

    // 5. Кликаем на пару
    await page.locator('[data-testid="game-card"]').nth(firstCardIndex).click();
    await page.locator('[data-testid="game-card"]').nth(secondCardIndex).click();
      // Проверяем, что счет обновился
      await expect(page.getByText(/Счет: Alice - 0 | Bob - 0/)).toBeVisible();
  });
  test('should update scores correctly in game against computer', async ({ page }) => {
    // Устанавливаем режим игры на "игра против компьютера"
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('fieldSize', '4');
      localStorage.setItem('playerCount', 'computer');
    });

        // Перезагружаем страницу для применения localStorage
    await page.goto('/game');
    // 1. Дожидаемся загрузки карточек
    await page.waitForSelector('[data-testid="game-card"]');

    // 2. Получаем все символы карт с помощью evaluateAll (менее надежно)
    const symbols = await page.locator('[data-testid="game-card"]').evaluateAll(cards => {
      return cards.map(card => card.textContent);
    });

    // 3. Ищем пару (аналогично предыдущему варианту)
    let firstCardIndex = -1;
    let secondCardIndex = -1;
    for (let i = 0; i < symbols.length; i++) {
      for (let j = i + 1; j < symbols.length; j++) {
        if (symbols[i] === symbols[j]) {
          firstCardIndex = i;
          secondCardIndex = j;
          break;
        }
      }
      if (firstCardIndex !== -1) break;
    }

    // 4. Проверяем, что пара найдена
    expect(firstCardIndex).not.toBe(-1);
    expect(secondCardIndex).not.toBe(-1);

    // 5. Кликаем на пару
    await page.locator('[data-testid="game-card"]').nth(firstCardIndex).click();
    await page.locator('[data-testid="game-card"]').nth(secondCardIndex).click();
      // Проверяем, что счет обновился
    await expect(page.getByText(/Счет: Player - 1 | Computer - 0/)).toBeVisible();
  });
});