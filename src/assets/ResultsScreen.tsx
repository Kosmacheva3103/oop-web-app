import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate} from 'react-router-dom';


const ResultsScreen: React.FC = () => {
    const navigate = useNavigate();

    const player1Score = localStorage.getItem('player1Score') || '0';
    const player2Score = localStorage.getItem('player2Score') || '0';
    const time = localStorage.getItem('Time') || '0';
    const player1Name = localStorage.getItem('Player1') || 'Player';
    const player2Name = localStorage.getItem('Player2') || 'Computer';
    const gameMode = localStorage.getItem('playerCount') || '1'; // Получаем режим игры из localStorage
    let winner: string; // Объявляем winner здесь

        const playerResults = [
            { name: player1Name, score: player1Score },
            { name: player2Name, score: player2Score },
        ];

        // Определяем победителя в игре с двумя игроками
    //В случае ничьи winner - "Ничья"
    if (player1Score === player2Score) {
        winner = "Ничья";
    }
    else if(player1Score>player2Score){winner= player1Name}
    else{winner=player2Name}

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Результаты игры
                </Typography>
                {gameMode==='1'? null:  
                <>        
                <Typography variant="body1">
                    Победитель: {winner} - {winner === player1Name ? player1Score : player2Score} очков
                </Typography>
                <Typography variant="subtitle1">Результаты: </Typography>
                {playerResults.map((player) => (
                    <Typography key={player.name} variant="body2">
                        {player.name}: {player.score}
                    </Typography>
                ))}
                </>}

                <Typography variant="body2">
                    Затраченное время: {time} сек.
                </Typography>

                <Button variant="contained" onClick={() => navigate('/settings')} sx={{ mt: 2 }}>
                    Начать новую игру
                </Button>
                <Button variant="outlined" onClick={() => navigate('/')} sx={{ mt: 2 }}>
                    Выход
                </Button>
            </Box>
        </Container>
    );
};

export default ResultsScreen;