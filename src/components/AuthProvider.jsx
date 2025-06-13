// src/components/AuthProvider.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  VIEWER: 'viewer',
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('admin_user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = ({ email, role }) => {
    const userData = { email, role };
    localStorage.setItem('admin_user', JSON.stringify(userData));
    setUser(userData);
    navigate('/admin/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('admin_user');
    setUser(null);
    navigate('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, ROLES }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
