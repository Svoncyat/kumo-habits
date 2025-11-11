import type { CategoriaResponse } from '@/types/api';

/**
 * Utilidades para manejar colores de categorías desde el backend
 * 
 * Los colores provienen de la base de datos:
 * - Mindfulness: #8BC34A (verde)
 * - Salud: #FF7043 (naranja)
 * - Productividad: #42A5F5 (azul)
 * - Aprendizaje: #AB47BC (morado)
 * - Bienestar: #FDD835 (amarillo)
 */

/**
 * Convierte un color hexadecimal a RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Crea variantes de un color para uso en la UI
 */
export function createColorVariants(hexColor: string) {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return null;

  return {
    // Color original
    base: hexColor,
    // Versión con opacidad para fondos
    bg: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`,
    bgHover: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`,
    // Versión con opacidad para bordes
    border: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`,
    // Color de texto (más oscuro)
    text: hexColor,
  };
}

/**
 * Obtiene el color principal de una categoría
 */
export function getCategoriaColor(categoria: CategoriaResponse): string {
  return categoria.color;
}

/**
 * Genera un gradiente para gráficos basado en múltiples categorías
 * RF-REP-VIS-003: En reportes comparativos, cada hábito debe ser representado por un color distinto
 */
export function generateChartColors(categorias: CategoriaResponse[]): string[] {
  return categorias.map((cat) => cat.color);
}

/**
 * Obtiene un color de categoría por nombre, con fallback
 */
export function getColorByNombre(
  categorias: CategoriaResponse[],
  nombre: string
): string | undefined {
  return categorias.find((cat) => cat.nombre === nombre)?.color;
}

/**
 * Paleta de colores para casos donde no hay categoría
 */
export const DEFAULT_CHART_COLORS = [
  '#8BC34A', // Verde (Mindfulness)
  '#FF7043', // Naranja (Salud)
  '#42A5F5', // Azul (Productividad)
  '#AB47BC', // Morado (Aprendizaje)
  '#FDD835', // Amarillo (Bienestar)
  '#EC407A', // Rosa
  '#26A69A', // Teal
  '#FF7043', // Naranja profundo
];

/**
 * Obtiene colores para barras de gráficos
 * RF-REP-VIS-001: Barras de días cumplidos vs no cumplidos
 */
export const CHART_ESTADO_COLORS = {
  cumplido: '#22c55e', // Verde (cumplido-500)
  noCumplido: '#ef4444', // Rojo (noCumplido-500)
  sinRegistro: '#9ca3af', // Gris (sinRegistro-400)
} as const;
