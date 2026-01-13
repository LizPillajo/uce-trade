// src/routes/AppRouter.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

import HomePage from '../pages/public/HomePage';
import ExplorePage from '../pages/public/ExplorePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import VentureDetailPage from '../pages/public/VentureDetailPage';
import SellerProfilePage from '../pages/public/SellerProfilePage';

// Student Imports
import StudentDashboard from '../pages/student/StudentDashboard';
import MyVenturesPage from '../pages/student/MyVenturesPage';
import CreateVenturePage from '../pages/student/CreateVenturePage';

// Admin Imports
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminVenturesPage from '../pages/admin/AdminVenturesPage'; // NUEVO
import ManageUsersPage from '../pages/admin/ManageUsersPage';

export const AppRouter = () => {
  return (
    <Routes>
      
      <Route element={<MainLayout />}>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/venture/:id" element={<VentureDetailPage />} />
        <Route path="/seller" element={<SellerProfilePage />} />

        {/* Student */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/my-ventures" element={<MyVenturesPage />} />
        <Route path="/student/create-venture" element={<CreateVenturePage />} />
        <Route path="/profile" element={<MyVenturesPage />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/ventures" element={<AdminVenturesPage />} /> {/* NUEVA RUTA */}
        <Route path="/admin/users" element={<ManageUsersPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};