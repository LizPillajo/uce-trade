// src/App.jsx
import { AppRouter } from './routes/AppRouter';
import { useWebSocket } from './hooks/useWebSocket';

function App() {

  useWebSocket();
  
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;