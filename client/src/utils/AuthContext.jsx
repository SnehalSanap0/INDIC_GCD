// src/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Verify user authentication status on component mount
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/auth/verify`, {
          withCredentials: true,
        });
        if (res.status === 200) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error('User not authenticated', err);
      }
    };
    verifyUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    // Optionally, call your logout API endpoint to clear the cookie
    axios.get(`http://localhost:3000/api/auth/logout`, { withCredentials: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};