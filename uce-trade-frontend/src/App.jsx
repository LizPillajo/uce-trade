import { AppRouter } from './routes/AppRouter';
import { useWebSocket } from './hooks/useWebSocket';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // 1. ESTA ALERTA DEBE SALIR SÍ O SÍ AL REFRESCAR LA PÁGINA
  // Si no sale, reinicia el servidor (npm run dev)
  // alert("¡ESTOY VIVO! App.jsx se cargó correctamente"); 
  
  // Te dejo el alert comentado para que no moleste luego, 
  // pero DESCOMÉNTALO (quita las //) para la prueba ahora mismo.
  
  console.log("📢📢📢 EJECUTANDO APP.JSX 📢📢📢");
  
  useWebSocket();
  
  return (
    <div className="App">
      <AppRouter />
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}

export default App;