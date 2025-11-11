import { api } from '../../../core/api/client'

export type Habit = { id: number; nombre: string; descripcion?: string | null }

export async function listHabits(): Promise<Habit[]> {
    const res = await api.get('/api/habitos')
    return res.data
}
