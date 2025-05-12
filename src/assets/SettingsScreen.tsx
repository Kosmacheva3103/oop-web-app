import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  localStorage.clear();

  // Состояния
  const [fieldSize, setFieldSize] = useState<number>(4); // Значение по умолчанию 4
  const [playerCount, setPlayerCount] = useState<string>('1'); // Значение по умолчанию '1'
useEffect(()=> {
  try{localStorage.clear()} 
catch(error){      
  console.error('Error saving settings to localStorage:', error);
}}, [])
  // useEffect для сохранения значений в localStorage при изменении состояний
  useEffect(() => {
    try {
      localStorage.setItem('fieldSize', fieldSize.toString());
      localStorage.setItem('playerCount', playerCount);
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  }, [fieldSize, playerCount]); // Эффект выполняется при изменении fieldSize или playerCount

  // Обработчики событий
  const handleFieldSizeChange = (event: { target: { value: React.SetStateAction<number>; }; }) => {
    setFieldSize(event.target.value);
  };

  const handlePlayerCountChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setPlayerCount(event.target.value);
  };

  const handleContinue = () => {
    if (playerCount === '2') {
      navigate('/register');
    } else {
      navigate('/game');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Настройки игры
        </Typography>

        <FormControl fullWidth margin="normal" data-testid="field-size-form">
          <InputLabel id="field-size-label" data-testid="field-size-label" >Размер поля</InputLabel>
          <Select
          label="Размер поля"
            value={fieldSize}
            onChange={handleFieldSizeChange}
            data-testid="field-size-select"
            id="FieldSize"
          >
            <MenuItem value={4} data-testid="field-size-option-4">4x4</MenuItem>
            <MenuItem value={6} data-testid="field-size-option-6">6x6</MenuItem>
            <MenuItem value={8} data-testid="field-size-option-8">8x8</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" data-testid="player-count-form">
          <InputLabel id="player-count-label" data-testid="player-count-label">Количество участников</InputLabel>
          <Select
          label="Количество участников"
            value={playerCount}
            onChange={handlePlayerCountChange}
            data-testid="player-count-select"
            id="PlayerCount"
          >
            <MenuItem value="1" data-testid="player-count-option-1">1 игрок</MenuItem>
            <MenuItem value="2" data-testid="player-count-option-2">2 игрока</MenuItem>
            <MenuItem value="computer" data-testid="player-count-option-computer">Игра с компьютером</MenuItem>
          </Select>
        </FormControl>

        <Button variant="outlined" onClick={() => navigate('/')} sx={{ mt: 2 }} data-testid="back-button">
          Назад
        </Button>
        <Button variant="contained" onClick={handleContinue} sx={{ mt: 2 }} data-testid="continue-button">
          Продолжить
        </Button>
      </Box>
    </Container>
  );
};

export default SettingsScreen;