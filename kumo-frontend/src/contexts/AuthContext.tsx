import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService, perfilService } from '../services/auth.service';
import type { PerfilResponse, LoginRequest, RegistroUsuarioRequest } from '../types/api';

interface AuthContextType {
  user: PerfilResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegistroUsuarioRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PerfilResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario al montar
  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem('kumo_token');
      if (savedToken) {
        setToken(savedToken);
        try {
          const userData = await perfilService.obtenerPerfil();
          setUser(userData);
        } catch (error) {
          console.error('Error al cargar usuario:', error);
          localStorage.removeItem('kumo_token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    localStorage.setItem('kumo_token', response.token);
    setToken(response.token);

    // Obtener datos del usuario
    const userData = await perfilService.obtenerPerfil();
    setUser(userData);
  };

  const register = async (data: RegistroUsuarioRequest) => {
    const response = await authService.register(data);
    localStorage.setItem('kumo_token', response.token);
    setToken(response.token);

    // Obtener datos del usuario
    const userData = await perfilService.obtenerPerfil();
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    authService.logout();
  };

  const refreshUser = async () => {
    if (token) {
      const userData = await perfilService.obtenerPerfil();
      setUser(userData);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
