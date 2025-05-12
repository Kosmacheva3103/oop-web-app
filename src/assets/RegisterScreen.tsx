import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const [player1Name, setPlayer1Name] = useState<string>('');
  const [player2Name, setPlayer2Name] = useState<string>('');
  // useEffect для сохранения значений в localStorage при изменении состояний
  useEffect(() => {
      if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('Player1', player1Name);
      localStorage.setItem('Player2', player2Name);
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }}
  }, [player1Name, player2Name]); // Эффект выполняется при изменении fieldSize или playerCount

  const handleContinue = () => {
    navigate('/first-turn', { state: { player1Name, player2Name } });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Регистрация игроков
        </Typography>

        <TextField
        name='player1'
          label="player1"
          variant="outlined"
          fullWidth
          margin="normal"
          value={player1Name}
          onChange={(e) => setPlayer1Name(e.target.value)}
        />

        <TextField
        name='player2'
          label="player2"
          variant="outlined"
          fullWidth
          margin="normal"
          value={player2Name}
          onChange={(e) => setPlayer2Name(e.target.value)}
        />

        <Button variant="outlined" onClick={() => navigate('/settings')} sx={{ mt: 2 }}>
          Назад
        </Button>
        <Button variant="contained" onClick={handleContinue} sx={{ mt: 2 }}>
          Продолжить
        </Button>
      </Box>
    </Container>
  );
};

export default RegisterScreen;