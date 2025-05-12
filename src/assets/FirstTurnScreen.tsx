import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FirstTurnScreen: React.FC = () => {
  const navigate = useNavigate();
  const [firstPlayer, setFirstPlayer] = useState<string>('');
  const [firstPlayerSet, setFirstPlayerSet] = useState<boolean>(false); // Добавляем состояние

  useEffect(() => {
    if (!firstPlayerSet) { // Проверяем, установлен ли уже firstPlayer
      // Получение имен игроков из localStorage
      const Player1Name = localStorage.getItem('Player1') || 'Player 1';
      const Player2Name = localStorage.getItem('Player2') || 'Player 2';
      // Выбор первого игрока случайным образом
      const random = Math.random();
      const determinedFirstPlayer = random > 0.5 ? Player1Name : Player2Name;
      setFirstPlayer(determinedFirstPlayer);
      localStorage.setItem('FirstPlayer', determinedFirstPlayer); // Устанавливаем localStorage
      setFirstPlayerSet(true); // Устанавливаем флаг
      console.log("First player determined:", determinedFirstPlayer); // Добавляем лог
    }
  }, [firstPlayerSet]);

  const handleStartGame = () => {
    navigate('/game');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Определение первого хода
        </Typography>
        <Typography variant="body1">
          Подбрасываем монетку...
        </Typography>
        <Typography variant="body1" data-testid="first-player-name">
          Первым ходит: {firstPlayer}!
        </Typography>
        <Button variant="contained" onClick={handleStartGame} sx={{ mt: 2 }}>
          Начать игру
        </Button>
      </Box>
    </Container>
  );
};

export default FirstTurnScreen;