import { apiClient } from '../../../core/api/client'
import type { User } from '../../../core/types/domain'

export interface UpdateProfileDto {
    nombre?: string
    email?: string
}

export const profileApi = {
    getProfile: async (): Promise<User> => {
        const { data } = await apiClient.get<User>('/api/perfil/me')
        return data
    },

    updateProfile: async (dto: UpdateProfileDto): Promise<User> => {
        const { data } = await apiClient.put<User>('/api/perfil/me', dto)
        return data
    },
}
