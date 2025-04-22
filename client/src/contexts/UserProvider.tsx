import React, { useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { UserContext } from './UserContext';

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('tripMeldUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Error parsing saved user:', err);
        localStorage.removeItem('tripMeldUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const mockUser: User = {
        id: '1',
        name: 'Demo User',
        email: email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(mockUser);
      localStorage.setItem('tripMeldUser', JSON.stringify(mockUser));
    } catch (err) {
      setError((err instanceof Error && err.message) || 'Login failed');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tripMeldUser');
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const updatedUser = {
        ...user,
        ...userData,
        updatedAt: new Date().toISOString(),
      };
      setUser(updatedUser);
      localStorage.setItem('tripMeldUser', JSON.stringify(updatedUser));
    } catch (err) {
      setError((err instanceof Error && err.message) || 'Update failed');
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, loading, error, login, logout, updateUser }}
    >
      {children}
    </UserContext.Provider>
  );
};
