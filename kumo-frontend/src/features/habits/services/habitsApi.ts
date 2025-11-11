import { apiClient } from '../../../core/api/client'
import type { Habito, CreateHabitoDto, UpdateHabitoDto } from '../../../core/types/domain'

export const habitsApi = {
    list: async (): Promise<Habito[]> => {
        const { data } = await apiClient.get<Habito[]>('/api/habitos')
        return data
    },

    getById: async (id: number): Promise<Habito> => {
        const { data } = await apiClient.get<Habito>(`/api/habitos/${id}`)
        return data
    },

    create: async (dto: CreateHabitoDto): Promise<Habito> => {
        const { data } = await apiClient.post<Habito>('/api/habitos', dto)
        return data
    },

    update: async (id: number, dto: UpdateHabitoDto): Promise<Habito> => {
        const { data } = await apiClient.put<Habito>(`/api/habitos/${id}`, dto)
        return data
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/habitos/${id}`)
    },
}
