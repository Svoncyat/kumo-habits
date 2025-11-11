import apiClient from '../lib/api-client';
import type { RegistroRequest, RegistroResponse } from '../types/api';

export const seguimientoService = {
  async obtenerRegistrosPorHabito(habitoId: number): Promise<RegistroResponse[]> {
    const response = await apiClient.get<RegistroResponse[]>(`/registros/habito/${habitoId}`);
    return response.data;
  },

  async crearRegistro(data: RegistroRequest): Promise<RegistroResponse> {
    const response = await apiClient.post<RegistroResponse>('/registros', data);
    return response.data;
  },

  async eliminarRegistro(registroId: number): Promise<void> {
    await apiClient.delete(`/registros/${registroId}`);
  },
};
