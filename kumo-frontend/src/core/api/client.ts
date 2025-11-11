import axios from 'axios'
import { env } from '../config/env'
import { tokenStorage } from '../security/tokenStorage'
import { toaster } from '../providers/toaster'

export const apiClient = axios.create({
    baseURL: env.apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor: añade token de autenticación
apiClient.interceptors.request.use(
    (config) => {
        const token = tokenStorage.get()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor: manejo global de errores
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Error 401: token inválido o expirado - logout automático
        if (error.response?.status === 401) {
            tokenStorage.clear()
            toaster.create({
                title: 'Sesión expirada',
                description: 'Por favor, inicia sesión nuevamente',
                type: 'error',
                duration: 5000,
            })
            window.location.href = '/login'
        }

        // Error 403: sin permisos
        if (error.response?.status === 403) {
            toaster.create({
                title: 'Acceso denegado',
                description: 'No tienes permisos para realizar esta acción',
                type: 'error',
                duration: 5000,
            })
        }

        // Error 500: error del servidor
        if (error.response?.status >= 500) {
            toaster.create({
                title: 'Error del servidor',
                description: 'Ocurrió un error inesperado. Por favor, intenta más tarde',
                type: 'error',
                duration: 5000,
            })
        }

        return Promise.reject(error)
    }
)
