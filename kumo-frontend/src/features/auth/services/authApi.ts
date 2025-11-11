import { apiClient } from '../../../core/api/client'
import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(255),
})

export type LoginRequest = z.infer<typeof loginSchema>
export type AuthResponse = { token: string; tipoToken: string; expiraEn: string }

export async function login(data: LoginRequest): Promise<AuthResponse> {
    const res = await apiClient.post('/api/auth/login', data)
    return res.data
}

export const registerSchema = z.object({
    nombre: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8).max(255),
})

export type RegisterRequest = z.infer<typeof registerSchema>

export async function register(data: RegisterRequest): Promise<AuthResponse> {
    const res = await apiClient.post('/api/auth/register', data)
    return res.data
}
