import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Интерфейс для представления карточки
interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// Интерфейс для пропсов компонента GameScreen
interface GameScreenProps {
  pairs?: number;
}

// Основной компонент игры
const GameScreen: React.FC<GameScreenProps> = ({
  // Количество пар карточек. Если не указано, вычисляется на основе размера поля, сохраненного в localStorage.
  pairs = (() => {
    const storedFieldSize = localStorage.getItem('fieldSize');
    const fieldSize = storedFieldSize ? parseInt(storedFieldSize, 10) : 4; // Значение по умолчанию = 4
    return (fieldSize * fieldSize) / 2;
  })(),
}) => {
  // Состояния компонента
  const [player1Name, setPlayer1Name] = useState<string>('Player 1'); // Имя первого игрока
  const [player2Name, setPlayer2Name] = useState<string>('Player 2'); // Имя второго игрока
  const [cards, setCards] = useState<Card[]>([]); // Массив карточек
  const [currentPlayer, setCurrentPlayer] = useState<string>('Player'); // Имя текущего игрока
  const [moves, setMoves] = useState<number>(0); // Количество ходов
  const [time, setTime] = useState<number>(0); // Время игры в секундах
  const [timerRunning, setTimerRunning] = useState<boolean>(true); // Флаг, указывающий, работает ли таймер
  const [flippedCards, setFlippedCards] = useState<Card[]>([]); // Массив перевернутых карточек
  const [player1Score, setPlayer1Score] = useState<number>(0); // Счет первого игрока
  const [player2Score, setPlayer2Score] = useState<number>(0); // Счет второго игрока
  const [gameMode, setGameMode] = useState('2'); // Режим игры ('1' - одиночная, '2' - два игрока, 'computer' - против компьютера)
  const [isWaitingForFlipBack, setIsWaitingForFlipBack] = useState<boolean>(false); // Флаг, указывающий, ждем ли мы, пока карточки перевернутся обратно
  const [isComputerThinking, setIsComputerThinking] = useState<boolean>(false); // Флаг, указывающий, думает ли компьютер
  const [knownCards, setKnownCards] = useState<{ symbol: string; id: number }[]>([]); // Карты, которые компьютер уже видел
  const navigate = useNavigate(); // Хук для навигации

  // Вычисляем размер сетки и символы для карточек на основе количества пар
  const { gridSize, symbols } = useMemo(() => {
    const totalCards = pairs * 2; // Общее количество карточек
    const gridSize = Math.sqrt(totalCards); // Размер сетки (предполагается, что сетка квадратная)

    // Создаем массив символов для карточек
    const symbols = Array.from({ length: pairs }, (_, i) => {
      const charCode = 65 + Math.floor(i / 26); // Вычисляем код символа (A, B, C и т.д.)
      return String.fromCharCode(charCode) + (i % 26 + 1); // Добавляем номер к символу (A1, A2, B1 и т.д.)
    });

    return { gridSize, symbols };
  }, [pairs]);

  // Функция для создания массива карточек
  const createCards = useCallback((): Card[] => {
    const cardSymbols = [...symbols, ...symbols]; // Дублируем массив символов, чтобы создать пары
    return cardSymbols.map((symbol, id) => ({ // Создаем массив объектов карточек
      id,
      symbol,
      isFlipped: false,
      isMatched: false,
    }));
  }, [symbols]);

  // Функция для перемешивания массива карточек
  const shuffleCards = useCallback((cards: Card[]): Card[] => {
    return [...cards].sort(() => Math.random() - 0.5); // Создаем копию массива и перемешиваем ее случайным образом
  }, []);

  // Функция для создания задержки
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  // Функция для проверки, совпали ли две карточки
  const checkMatch = useCallback(
    (secondCard: Card) => {
      const [firstCard] = flippedCards; // Получаем первую перевернутую карточку
        setMoves(m => m + 1); // Увеличиваем количество ходов
      if (firstCard && secondCard) { // Проверяем, что обе карточки существуют
        const isMatch = firstCard.symbol === secondCard.symbol; // Проверяем, совпадают ли символы

        // Обновляем состояние карточек, устанавливая флаг isMatched, если карточки совпали
        setCards(prevCards =>
          prevCards.map(c => {
            if (c.id === firstCard.id || c.id === secondCard.id) {
              return { ...c, isMatched: isMatch, isFlipped: true };
            }
            return c;
          })
        );

        if (isMatch) { // Если карточки совпали
          if (currentPlayer === player1Name || (gameMode==='computer' && currentPlayer==='Player')) {
            setPlayer1Score(score => score + 1); // Увеличиваем счет первого игрока
          } else {
            setPlayer2Score(score => score + 1); // Увеличиваем счет второго игрока
          }
          setFlippedCards([]); // Очищаем массив перевернутых карточек
          // **Не меняем игрока, если карты совпали**
        } else { // Если карточки не совпали
          setIsWaitingForFlipBack(true); // Устанавливаем флаг ожидания

          setTimeout(() => {
            // Через 500 мс переворачиваем карточки обратно
            setCards(prevCards =>
              prevCards.map(c => {
                if (c.id === firstCard.id || c.id === secondCard.id) {
                  return { ...c, isFlipped: false };
                }
                return c;
              })
            );

            // Смена игрока только если карты не совпали
            if (gameMode === '2') {
              setCurrentPlayer(p => p === player1Name ? player2Name : player1Name); // Переключаем игрока
            } else if (gameMode === 'computer') {
              setCurrentPlayer(p => p === 'Player' ? 'Computer' : 'Player'); // Переключаем игрока
            }
            else {setCurrentPlayer('Player')}

            setFlippedCards([]); // Очищаем массив перевернутых карточек
            setIsWaitingForFlipBack(false); // Снимаем флаг ожидания
          }, 500);
        }
      }
      setIsComputerThinking(false); // Снимаем блокировку
    },
    [flippedCards, currentPlayer, player1Name, gameMode, player2Name]
  );

  // Функция для обработки клика по карточке
  const handleCardClick = useCallback(
    (card: Card, player:string, isComputerAction = false): Promise<void> => {
      return new Promise((resolve) => {
        // Проверяем, можно ли перевернуть карточку
        if (
          card.isMatched || // Карточка уже сопоставлена
          card.isFlipped || // Карточка уже перевернута
          flippedCards.length === 2 || // Уже перевернуты две карточки
          (!isComputerAction && player === 'Computer') || // Сейчас ход компьютера
          isWaitingForFlipBack || // Ждем, пока карточки перевернутся обратно
          isComputerThinking // Компьютер сейчас думает
        ) {
          resolve(); // Важно: разрешаем Promise, даже если ничего не делаем
          return;
        }

        // Добавляем открытую карту в известные компьютеру
        setKnownCards(prev => [...prev, { symbol: card.symbol, id: card.id }]);

        // Переворачиваем карточку
        setCards(prevCards =>
          prevCards.map(c => (c.id === card.id ? { ...c, isFlipped: true } : c))
        );

        // Добавляем карточку в массив перевернутых карточек
        setFlippedCards(prev => [...prev, card]);

        if (flippedCards.length === 1) { // Если это вторая перевернутая карточка
          checkMatch(card) // Проверяем, совпали ли карточки

        }
        resolve(); // Разрешаем Promise после завершения
      });
    },
    [flippedCards, isWaitingForFlipBack, isComputerThinking, setKnownCards, setCards, checkMatch]
  );


  // Логика хода компьютера
  const makeComputerMove = useCallback(async () => {
    setIsComputerThinking(true); // Блокируем UI

    let cardToFlip: Card | undefined; // Объявляем переменную для карточки, которую нужно перевернуть

    // Если уже есть одна открытая карта
    if (flippedCards.length === 1) {
      const [firstCard] = flippedCards; // Получаем первую перевернутую карточку
      // Ищем в известных картах пару для первой карточки
      const knownPair = knownCards.find(c => c.symbol === firstCard.symbol && c.id !== firstCard.id);

      if (knownPair) {
        // Найдена известная пара
        cardToFlip = cards.find(c => c.id === knownPair.id && !c.isFlipped && !c.isMatched); // Ищем карточку с таким же id, которая еще не перевернута и не сопоставлена
      } else {
        // Пара не найдена, ищем случайную карту
        const unmatchedCards = cards.filter(c => !c.isMatched && !c.isFlipped && c.id !== firstCard.id); // Получаем массив не сопоставленных и не перевернутых карточек, исключая первую перевернутую карточку
        if (unmatchedCards.length > 0) {
          const randomIndex = Math.floor(Math.random() * unmatchedCards.length); // Выбираем случайный индекс
          cardToFlip = unmatchedCards[randomIndex]; // Получаем карточку по случайному индексу
        }
      }
    } else {
      // Еще нет открытых карт, выбираем случайную
      const unmatchedCards = cards.filter(c => !c.isMatched && !c.isFlipped); // Получаем массив не сопоставленных и не перевернутых карточек
      if (unmatchedCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * unmatchedCards.length); // Выбираем случайный индекс
        cardToFlip = unmatchedCards[randomIndex]; // Получаем карточку по случайному индексу
      }
    }

    if (cardToFlip) { // Если карточка была выбрана
      await handleCardClick(cardToFlip, currentPlayer, true); // Ожидаем завершения переворота первой карты
      await delay(1000); // Пауза между переворотами карт

    }
      setIsComputerThinking(false); // Снимаем блокировку

  }, [cards, flippedCards, knownCards, handleCardClick, setIsComputerThinking, currentPlayer]);

  // Инициализация игры при монтировании компонента или изменении зависимостей
  useEffect(() => {
    const initialCards = createCards(); // Создаем массив карточек
    setCards(shuffleCards(initialCards)); // Перемешиваем карточки
    setTimerRunning(true); // Запускаем таймер
    setTime(0); // Сбрасываем время
    setPlayer1Score(0); // Сбрасываем счет первого игрока
    setPlayer2Score(0); // Сбрасываем счет второго игрока
    setMoves(0); // Сбрасываем количество ходов
    setKnownCards([]); // Сбрасываем известные компьютеру карты
  }, [pairs, gameMode, createCards, shuffleCards]);

  // Загрузка настроек из localStorage при монтировании компонента
  useEffect(() => {
    setPlayer1Name(localStorage.getItem('Player1') || 'Player 1'); // Загружаем имя первого игрока
    setPlayer2Name(localStorage.getItem('Player2') || 'Player 2'); // Загружаем имя второго игрока
    setGameMode(localStorage.getItem('playerCount') || '1'); // Загружаем режим игры
    setCurrentPlayer(localStorage.getItem('FirstPlayer') || 'Player'); // Загружаем имя текущего игрока
  }, []); // Пустой массив зависимостей, чтобы выполнилось только при монтировании

  // Логика компьютера
  useEffect(() => {
    if (gameMode === 'computer' && currentPlayer === 'Computer' && !isComputerThinking && flippedCards.length < 2) {
      makeComputerMove(); // Если сейчас ход компьютера, и он не думает, и перевернуто меньше двух карточек, то делаем ход
    }
  }, [currentPlayer, flippedCards.length, gameMode, isComputerThinking, cards, knownCards, makeComputerMove]);

  // Переход на страницу результатов, когда игра закончена
  useEffect(() => {
    if (player1Score + player2Score === pairs) {
      navigate('/results'); // Переходим на страницу результатов
    }
  }, [player1Score, player2Score, pairs, navigate]);

  // Сохранение данных в localStorage при изменении
  useEffect(() => {
    try {
      localStorage.setItem('Time', time.toString()); // Сохраняем время
      localStorage.setItem('player1Score', player1Score.toString()); // Сохраняем счет первого игрока
      localStorage.setItem('player2Score', player2Score.toString()); // Сохраняем счет второго игрока
    } catch (error) {
      console.error('Error saving settings to localStorage:', error); // Выводим ошибку в консоль, если не удалось сохранить данные
    }
  }, [player1Score, player2Score, time]);

  // Таймер
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => setTime(t => t + 1), 1000); // Устанавливаем интервал для обновления времени каждую секунду
    }
    return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента или изменении зависимостей
  }, [timerRunning]);

  // Функция для форматирования времени
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60); // Вычисляем минуты
    return `${mins}:${(seconds % 60).toString().padStart(2, '0')}`; // Форматируем время в виде "минуты:секунды"
  };

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Поиск пары
        </Typography>

        <Box
          sx={{
            mt: 3,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 3,
            width: '100%',
            maxWidth: '800px',
          }}
        >
          <Typography variant="h5">Ходы: {moves}</Typography>
          <Typography variant="h5">Время: {formatTime(time)}</Typography>
          <Typography variant="h5">Player: {currentPlayer}</Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gap: 1,
            width: 'min(90vw, 600px)',
            aspectRatio: '1/1',
            pointerEvents: isComputerThinking || isWaitingForFlipBack ? 'none' : 'auto', // Блокируем во время хода компьютера и анимации
          }}
        >
          {cards.map(card => (
            <Box
              data-testid="game-card"
              key={card.id}
              sx={{
                aspectRatio: '1/1',
                bgcolor: card.isMatched ? '#4CAF50' : '#2196F3',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: gridSize <= 8 ? '1.5rem' : '1rem',
                cursor: 'pointer',
              }}
              onClick={() => handleCardClick(card, currentPlayer)}
            >
              {card.isFlipped || card.isMatched ? card.symbol : '?'}
            </Box>
          ))}
        </Box>
        {gameMode !== '1' ? (
          <Box sx={{ mt: 2 }}>
            <Typography>
              Счет: {gameMode !== 'computer' ? player1Name : 'Player'} - {player1Score} | 
              {gameMode === 'computer' ? 'Computer' : player2Name} - {player2Score}
            </Typography>
          </Box>
        ) : null}

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/results')}
        >
          Сдаться
        </Button>
      </Box>
    </Container>
  );
};

export default GameScreen;