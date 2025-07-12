import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const currentUser = users.find(u => u.id === userData.id);
      if (currentUser) {
        setUser(currentUser);
      }
    }
  }, [users]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const signup = async (userData: Omit<User, 'id' | 'favorites' | 'createdAt'>): Promise<boolean> => {
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      favorites: [],
      createdAt: new Date(),
    };

    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};