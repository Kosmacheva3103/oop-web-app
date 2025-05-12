import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Игра "Найди Пару"
        </Typography>
        <Button variant="contained" onClick={() => navigate('/settings')} sx={{ mb: 2 }}>
          Начать игру
        </Button>
        <Button variant="outlined" onClick={() => navigate('/rules')} sx={{ mb: 2 }}>
          Правила игры
        </Button>

      </Box>
    </Container>
  );
};

export default HomeScreen;