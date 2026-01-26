import { createContext, useState, useContext, useEffect } from 'react';
import { loginUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario al inicio
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const data = await loginUser({ email, password });
      
      // Guardamos TODO lo que viene del backend
      const userData = {
        name: data.name,
        role: data.role,
        email: data.email, // Asegúrate que tu backend devuelva esto
        avatar: data.avatar || data.name.charAt(0).toUpperCase(),
        faculty: data.faculty,
        phoneNumber: data.phoneNumber,
        description: data.description,
        githubUser: data.githubUser
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || "Login failed" };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // --- NUEVA FUNCIÓN: ACTUALIZAR USUARIO EN VIVO ---
  // Esto arreglará que "guardas y no pasa nada"
  const updateUserSession = (newUserData) => {
    // Mezclamos los datos viejos con los nuevos
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserSession, isAuthenticated: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);