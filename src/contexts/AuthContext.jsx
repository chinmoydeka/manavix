import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, token: null });

  useEffect(() => {
    // Allowed domains for login
    const allowedOrigins = ['http://localhost:3000', 'https://rajibelectricals.in'];

    // Check if current origin is allowed
    const currentOrigin = window.location.origin;
    if (!allowedOrigins.includes(currentOrigin)) {
      console.warn('Login not allowed from this domain:', currentOrigin);
      logout();
      return; // Exit early
    }

    // Proceed with token validation
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          logout();
        } else {
          setAuth({ user: decoded.data, token });
        }
      } catch (err) {
        logout();
      }
    }
  }, []);


  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      localStorage.setItem('token', token);
      setAuth({ user: decoded.data, token });
    } catch {
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ user: null, token: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, isAuthenticated: !!auth.token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
