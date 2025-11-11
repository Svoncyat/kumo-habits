import apiClient from '../lib/api-client';
import type {
  RecordatorioRequest,
  RecordatorioUpdateRequest,
  RecordatorioResponse,
} from '../types/api';

export const recordatoriosService = {
  async obtenerRecordatoriosPorHabito(habitoId: number): Promise<RecordatorioResponse[]> {
    const response = await apiClient.get<RecordatorioResponse[]>(`/recordatorios/habito/${habitoId}`);
    return response.data;
  },

  async crearRecordatorio(data: RecordatorioRequest): Promise<RecordatorioResponse> {
    const response = await apiClient.post<RecordatorioResponse>('/recordatorios', data);
    return response.data;
  },

  async actualizarRecordatorio(
    recordatorioId: number,
    data: RecordatorioUpdateRequest
  ): Promise<RecordatorioResponse> {
    const response = await apiClient.put<RecordatorioResponse>(
      `/recordatorios/${recordatorioId}`,
      data
    );
    return response.data;
  },

  async eliminarRecordatorio(recordatorioId: number): Promise<void> {
    await apiClient.delete(`/recordatorios/${recordatorioId}`);
  },
};
