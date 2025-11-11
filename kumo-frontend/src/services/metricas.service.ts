import apiClient from '../lib/api-client';
import type {
  MetricasResponse,
  MetaMensualRequest,
  MetaMensualResponse,
} from '../types/api';

export const metricasService = {
  async obtenerMetricasPorHabito(habitoId: number): Promise<MetricasResponse> {
    const response = await apiClient.get<MetricasResponse>(`/metricas/habito/${habitoId}`);
    return response.data;
  },
};

export const metasService = {
  async obtenerMetas(): Promise<MetaMensualResponse[]> {
    const response = await apiClient.get<MetaMensualResponse[]>('/metas');
    return response.data;
  },

  async obtenerMetasPorHabito(habitoId: number): Promise<MetaMensualResponse[]> {
    const response = await apiClient.get<MetaMensualResponse[]>(`/metas/habito/${habitoId}`);
    return response.data;
  },

  async obtenerMeta(metaId: number): Promise<MetaMensualResponse> {
    const response = await apiClient.get<MetaMensualResponse>(`/metas/${metaId}`);
    return response.data;
  },

  async crearMeta(data: MetaMensualRequest): Promise<MetaMensualResponse> {
    const response = await apiClient.post<MetaMensualResponse>('/metas', data);
    return response.data;
  },

  async actualizarMeta(metaId: number, data: MetaMensualRequest): Promise<MetaMensualResponse> {
    const response = await apiClient.put<MetaMensualResponse>(`/metas/${metaId}`, data);
    return response.data;
  },

  async eliminarMeta(metaId: number): Promise<void> {
    await apiClient.delete(`/metas/${metaId}`);
  },
};
