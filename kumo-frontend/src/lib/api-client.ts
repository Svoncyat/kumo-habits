import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = (import.meta as any).env.PUBLIC_API_URL || 'http://localhost:8080/api';

// Crear instancia de axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

console.log('API Client configurado con baseURL:', API_BASE_URL);

// Interceptor de request - Agregar token JWT
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('kumo_token');
    
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token agregado al header');
    } else {
      console.log('No hay token para agregar');
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

// Interceptor de response - Manejo de errores
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    
    // Si el token ha expirado o es inválido (401)
    if (error.response?.status === 401) {
      console.log('Token inválido o expirado, limpiando localStorage');
      localStorage.removeItem('kumo_token');
      localStorage.removeItem('kumo_user');
      
      // Redirigir al login si no estamos ya ahí
      if (window.location.pathname !== '/login') {
        console.log('Redirigiendo a /login');
        window.location.href = '/login';
      }
    }
    
    // Si no tiene permisos (403)
    if (error.response?.status === 403) {
      console.error('No tienes permisos para realizar esta acción');
    }
    
    // Error de red o servidor no disponible
    if (!error.response) {
      console.error('Error de conexión. Verifica tu conexión a internet.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
