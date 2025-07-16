import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

// statik kullanıcı verileri
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin',
    role: 'admin'
  },
  {
    id: 2,
    email: 'user@example.com',
    password: 'user123',
    name: 'Kullanıcı',
    role: 'user'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // localStorage'dan bilgi yükle
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Kullanıcı bilgisi okunamadı:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      // Gecikme ekle
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Kullanıcıyı bul
      const foundUser = MOCK_USERS.find(
        user => user.email === email && user.password === password
      );

      if (!foundUser) {
        throw new Error('Geçersiz e-posta veya şifre');
      }

      // Kullanıcıyı localStorage'a kaydet
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role
      };
      
      const token = `mock-jwt-token-${foundUser.id}`;
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Giriş sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.' 
      };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // Giriş kontrolü
  const isAuthenticated = useCallback(() => {
    return !!user && !!localStorage.getItem('token');
  }, [user]);

  // Role göre yetki kontrolü
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
  }), [user, loading, login, logout, isAuthenticated, hasRole]);

  // loading
  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
