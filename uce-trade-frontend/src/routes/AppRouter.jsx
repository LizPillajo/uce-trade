import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/common/ProtectedRoute'; // <--- IMPORTAR

// Public Imports
import HomePage from '../pages/public/HomePage';
import ExplorePage from '../pages/public/ExplorePage';
import VentureDetailPage from '../pages/public/VentureDetailPage';
import SellerProfilePage from '../pages/public/SellerProfilePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Student Imports
import StudentDashboard from '../pages/student/StudentDashboard';
import MyVenturesPage from '../pages/student/MyVenturesPage';
import CreateVenturePage from '../pages/student/CreateVenturePage';

// Admin Imports
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminVenturesPage from '../pages/admin/AdminVenturesPage';
import ManageUsersPage from '../pages/admin/ManageUsersPage';

export const AppRouter = () => {
  return (
    <Routes>
      
      {/* RUTAS PÚBLICAS (Dentro del Layout Principal) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/venture/:id" element={<VentureDetailPage />} />
        <Route path="/seller" element={<SellerProfilePage />} />

        {/* --- ZONA ESTUDIANTE (Solo rol STUDENT) --- */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/my-ventures" element={<MyVenturesPage />} />
            <Route path="/student/create-venture" element={<CreateVenturePage />} />
            {/* Perfil personal reutiliza MyVentures por ahora */}
            <Route path="/profile" element={<MyVenturesPage />} />
        </Route>

        {/* --- ZONA ADMIN (Solo rol ADMIN) --- */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/ventures" element={<AdminVenturesPage />} />
            <Route path="/admin/users" element={<ManageUsersPage />} />
        </Route>
      </Route>

      {/* Auth Routes (Sin Layout Principal o con Layout Auth) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};