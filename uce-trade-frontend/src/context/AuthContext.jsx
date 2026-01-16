import { createContext, useState, useContext, useEffect } from 'react';
import { loginUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la página, revisamos si ya había un usuario guardado en localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // FUNCIÓN DE LOGIN REAL
  const login = async (email, password) => {
    try {
      // 1. Llamamos al Backend
      const data = await loginUser({ email, password });
      
      // 2. Si llegamos aquí, el backend ya puso la Cookie HttpOnly automáticamente.
      // Nosotros solo guardamos los datos visibles (Nombre, Rol) para la interfaz.
      const userData = {
        name: data.name,
        role: data.role, 
        email: email,
        avatar: data.name.charAt(0).toUpperCase() 
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData)); // Persistencia visual
      return { success: true };

    } catch (error) {
      return { success: false, message: error.message || "Login fallido" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Nota: Para borrar la cookie HttpOnly deberíamos llamar a un endpoint /logout en el backend
    // Por ahora, esto limpia la sesión visual.
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);