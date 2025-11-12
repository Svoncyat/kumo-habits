import apiClient from '../lib/api-client';
import type { RegistroRequest, RegistroResponse } from '../types/api';

export const seguimientoService = {
  async obtenerRegistrosPorHabito(habitoId: number): Promise<RegistroResponse[]> {
    console.log(`📥 Obteniendo registros para hábito ${habitoId}`);
    const response = await apiClient.get<RegistroResponse[]>(`/registros/habito/${habitoId}`);
    console.log(`✅ Registros obtenidos: ${response.data.length}`);
    return response.data;
  },

  async crearRegistro(data: RegistroRequest): Promise<RegistroResponse> {
    console.log('📤 Creando nuevo registro:', data);
    try {
      const response = await apiClient.post<RegistroResponse>('/registros', data);
      console.log('✅ Registro creado exitosamente:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al crear registro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  async eliminarRegistro(registroId: number): Promise<void> {
    console.log(`🗑️ Eliminando registro ${registroId}`);
    await apiClient.delete(`/registros/${registroId}`);
    console.log('✅ Registro eliminado');
  },
};
