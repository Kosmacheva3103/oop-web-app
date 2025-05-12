
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeScreen from './HomeScreen';
import RulesScreen from './RulesScreen';
import SettingsScreen from './SettingsScreen';
import RegisterScreen from './RegisterScreen';
import FirstTurnScreen from './FirstTurnScreen';
import GameScreen from './GameScreen';
import ResultsScreen from './ResultsScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/rules" element={<RulesScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/first-turn" element={<FirstTurnScreen />} />
        <Route path="/game" element={<GameScreen />} />
        <Route path="/results" element={<ResultsScreen />} />
      </Routes>
    </Router>
  );
}

export default App;