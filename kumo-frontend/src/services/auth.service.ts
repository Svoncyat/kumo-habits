import apiClient from '../lib/api-client';
import type {
  LoginRequest,
  RegistroUsuarioRequest,
  AuthResponse,
  PerfilResponse,
  ActualizarPerfilRequest,
} from '../types/api';

// ==================== AUTH SERVICES ====================
export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    console.log('authService: Enviando request de login a /auth/login', data);
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', data);
      console.log('authService: Login exitoso', response.data);
      return response.data;
    } catch (error) {
      console.error('authService: Error en login', error);
      throw error;
    }
  },

  async register(data: RegistroUsuarioRequest): Promise<AuthResponse> {
    console.log('authService: Enviando request de registro a /auth/register');
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    console.log('authService: Registro exitoso', response.data);
    return response.data;
  },

  logout() {
    localStorage.removeItem('kumo_token');
    localStorage.removeItem('kumo_user');
    window.location.href = '/login';
  },
};

// ==================== PERFIL SERVICES ====================
export const perfilService = {
  async obtenerPerfil(): Promise<PerfilResponse> {
    const response = await apiClient.get<PerfilResponse>('/perfil/me');
    return response.data;
  },

  async actualizarPerfil(data: ActualizarPerfilRequest): Promise<PerfilResponse> {
    const response = await apiClient.put<PerfilResponse>('/perfil/me', data);
    return response.data;
  },

  async eliminarCuenta(): Promise<void> {
    await apiClient.delete('/perfil/me');
    authService.logout();
  },
};
