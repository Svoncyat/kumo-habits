import apiClient from '@/lib/api-client';
import type { CategoriaResponse } from '@/types/api';

class CategoriasService {
  async obtenerCategorias(): Promise<CategoriaResponse[]> {
    const response = await apiClient.get<CategoriaResponse[]>('/categorias');
    return response.data;
  }
}

export const categoriasService = new CategoriasService();
