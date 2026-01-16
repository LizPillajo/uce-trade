import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

// allowedRoles: Array with the allowed roles for this route ['ADMIN'], ['STUDENT'], etc.
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // 1. While loading user info, show a spinner
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // 2. If not logged in, redirect to Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. If logged in but role is not in the allowed list
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If a student tries to access admin, redirect to home
    return <Navigate to="/" replace />;
  }

  // 4. If all checks pass, render the page
  return <Outlet />;
};

export default ProtectedRoute;