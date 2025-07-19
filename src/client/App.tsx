import '../App.css';
import { modelenceQuery, useQuery } from '@modelence/react-query';
import EcoForm from './components/EcoForm';

function App() {
  const { data: habits = [], isPending, error } = useQuery(modelenceQuery('habit.getAll', {}));
  if (isPending) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message} <button onClick={() => window.location.reload()}>Retry</button></div>;

  const ecoScore = habits.reduce((sum, h) => sum + (h.ecoScore || 0), 0) / Math.max(habits.length, 1) || 0;
  const ecoLevel = ecoScore > 80 ? 'Eco Warrior' : ecoScore > 50 ? 'Green Sprout' : 'Seedling';

  return (
    <div className="app-container">
      <h1>EcoBuddy</h1>
      <EcoForm />
      <div className="score-section">
        <h2>EcoScore: {ecoScore.toFixed(1)}/100</h2>
        <progress value={ecoScore} max="100" />
        <p>Level: <span className={`eco-level eco-level-${ecoLevel.toLowerCase().replace(' ', '-')}`}>{ecoLevel}</span></p>
        <p className="tip-placeholder">Tip: Check console for AI suggestions (coming soon!)</p>
      </div>
    </div>
  );
}

export default App;