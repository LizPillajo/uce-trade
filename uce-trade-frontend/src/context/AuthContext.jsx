import { createContext, useState, useContext, useEffect } from 'react';
import { loginUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On page load, check if a user was already saved in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // REAL LOGIN FUNCTION
  const login = async (email, password) => {
    try {
      // 1. Call the Backend
      const data = await loginUser({ email, password });
      
      // 2. If we get here, the backend has already set the HttpOnly Cookie automatically.
      // We only save the visible data (Name, Role) for the UI.
      const userData = {
        name: data.name,
        role: data.role, 
        email: email,
        avatar: data.name.charAt(0).toUpperCase() 
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData)); // Visual persistence
      return { success: true };

    } catch (error) {
      return { success: false, message: error.message || "Login failed" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Note: To delete the HttpOnly cookie, we should call a /logout endpoint in the backend
    // For now, this only clears the visual session.
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);