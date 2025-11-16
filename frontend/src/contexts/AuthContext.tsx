import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, password2: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      await api.login({ username, password });
      setIsAuthenticated(true);
      toast({
        title: "Добро пожаловать!",
        description: "Вы успешно вошли в систему",
      });
    } catch (error) {
      toast({
        title: "Ошибка входа",
        description: error instanceof Error ? error.message : "Неверные учетные данные",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string, password2: string) => {
    try {
      await api.register({ username, email, password, password2 });
      toast({
        title: "Аккаунт создан!",
        description: "Пожалуйста, войдите, используя свои данные",
      });
    } catch (error) {
      toast({
        title: "Ошибка регистрации",
        description: error instanceof Error ? error.message : "Не удалось создать аккаунт",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    api.logout();
    setIsAuthenticated(false);
      toast({
        title: "Выход выполнен",
        description: "До свидания!",
      });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
