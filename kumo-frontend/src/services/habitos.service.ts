import apiClient from '../lib/api-client';
import type {
  HabitoResponse,
  CrearHabitoRequest,
  ActualizarHabitoRequest,
} from '../types/api';

export const habitosService = {
  async obtenerHabitos(): Promise<HabitoResponse[]> {
    const response = await apiClient.get<HabitoResponse[]>('/habitos');
    return response.data;
  },

  async obtenerHabito(id: number): Promise<HabitoResponse> {
    const response = await apiClient.get<HabitoResponse>(`/habitos/${id}`);
    return response.data;
  },

  async crearHabito(data: CrearHabitoRequest): Promise<HabitoResponse> {
    const response = await apiClient.post<HabitoResponse>('/habitos', data);
    return response.data;
  },

  async actualizarHabito(id: number, data: ActualizarHabitoRequest): Promise<HabitoResponse> {
    const response = await apiClient.put<HabitoResponse>(`/habitos/${id}`, data);
    return response.data;
  },

  async eliminarHabito(id: number): Promise<void> {
    await apiClient.delete(`/habitos/${id}`);
  },

  async archivarHabito(id: number): Promise<HabitoResponse> {
    const response = await apiClient.put<HabitoResponse>(`/habitos/${id}`, {
      estaArchivado: true,
    });
    return response.data;
  },
};
