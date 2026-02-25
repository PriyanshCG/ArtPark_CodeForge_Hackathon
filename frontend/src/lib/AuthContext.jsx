import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from './api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    const initAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token) {
        localStorage.setItem('artpark_token', token);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const storedToken = localStorage.getItem('artpark_token');
      
      // Handle Demo Mode
      if (storedToken === 'demo_token_judge_12345') {
        setUser({
          id: 'DEMO_12345',
          name: 'Judge Demo User',
          email: 'judge@example.com',
          avatar: 'https://ui-avatars.com/api/?name=Judge+Demo&background=indigo&color=fff',
          role: 'Judge / Reviewer'
        });
        setIsLoggedIn(true);
        setIsLoading(false);
        return;
      }

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await api.getCurrentUser();
        if (userData?.user) {
          setUser(userData.user);
          setIsLoggedIn(true);
        }
      } catch (err) {
        localStorage.removeItem('artpark_token');
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = () => {
    api.loginWithGoogle();
  };

  const demoLogin = () => {
    const fakeToken = 'demo_token_judge_12345';
    localStorage.setItem('artpark_token', fakeToken);
    setUser({
      id: 'DEMO_12345',
      name: 'Judge Demo User',
      email: 'judge@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Judge+Demo&background=indigo&color=fff',
      role: 'Judge / Reviewer'
    });
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      if (localStorage.getItem('artpark_token') !== 'demo_token_judge_12345') {
        await api.logout();
      }
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem('artpark_token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
