import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RulesScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Правила игры "Найди Пару"
        </Typography>
        <Typography variant="body1">
          1. Цель игры: Найти все пары одинаковых карточек.
        </Typography>
        <Typography variant="body1">
          2. В свой ход вы переворачиваете две карточки.
        </Typography>
        <Typography variant="body1">
          3. Если карточки совпадают, вы забираете пару.
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Назад
        </Button>
      </Box>
    </Container>
  );
};

export default RulesScreen;