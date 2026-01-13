// src/context/AuthContext.jsx
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado del usuario: null (visitante), 'student', o 'admin'
  const [user, setUser] = useState(null);

  // Función para simular Login
  const login = (role) => {
    // Simulamos datos de usuario según el rol
    const userData = role === 'admin' 
      ? { name: 'Admin User', role: 'admin', avatar: 'AD' }
      : { name: 'Liz Pillajo', role: 'student', avatar: 'LP', career: 'Systems Engineering' };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Persistencia simple
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);
