import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

// allowedRoles: Array con los roles permitidos para esta ruta ['ADMIN'], ['STUDENT'], etc.
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // 1. Mientras carga la info del usuario, mostramos un spinner
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // 2. Si no está logueado, mandar al Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si está logueado pero su rol no está en la lista permitida
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Si intenta entrar a admin siendo estudiante, lo mandamos a su dashboard o home
    return <Navigate to="/" replace />;
  }

  // 4. Si pasa todas las pruebas, renderizar la página (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;