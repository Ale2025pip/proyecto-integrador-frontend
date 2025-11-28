import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
    // ✅ RECUPERAR USER DE LOCALSTORAGE SI EXISTE
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser({ email: 'Usuario' });
      }
    } else {
      setUser({ email: 'Usuario' });
    }
    }
    setLoading(false);
  }, [token]);
const login = async (email, password) => {
  try {
    const data = await authService.login({ email, password });
    console.log("🔐 LOGIN RESPONSE COMPLETA:", data); 
    
    if (data.token) {
      setToken(data.token);
      
      // ✅ USAR DIRECTAMENTE EL USER DEL BACKEND (ahora viene completo)
      const userData = data.user || {
        email: email,
        role: (email.includes('admin') ? 'admin' : 'user')
      };
      
      console.log("🔐 USER DATA FINAL:", userData);
      
      setUser(userData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: data.error };
  } catch (error) {
    return { success: false, error: 'Error de conexión' };
  }
 };

  const register = async (email, password) => {
    try {
      const data = await authService.register({ email, password });
      if (data.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
