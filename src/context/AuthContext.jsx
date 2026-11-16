import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loginAs = async (email) => {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    localStorage.setItem('campus_token', res.token);
    localStorage.setItem('campus_user', JSON.stringify(res.user));
    setUser(res.user);
  };

  useEffect(() => {
    async function initAuth() {
      try {
        const users = await apiFetch('/auth/users');
        setAvailableUsers(users);

        const savedUser = localStorage.getItem('campus_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          await loginAs('andrei.popescu@student.usv.ro');
        }
      } catch (err) {
        console.error('Auth init failed:', err);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, availableUsers, loginAs, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);