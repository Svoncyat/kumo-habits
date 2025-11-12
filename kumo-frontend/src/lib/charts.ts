/**
 * Tipos y utilidades para gráficos de reportes
 * Implementa los requerimientos del SRS:
 * 
 * RF-REP-VIS-001: Gráfico de barras apiladas con colores diferentes para:
 *   - Días cumplidos (verde)
 *   - Días no cumplidos (rojo)
 * 
 * RF-REP-VIS-003: Gráfico de líneas comparativo donde:
 *   - Cada hábito debe ser representado por un color distinto
 *   - Se usan los colores de las categorías desde el backend
 */

import type { CategoriaResponse } from '@/types/api';
import { CHART_ESTADO_COLORS } from '@/lib/colors';

export interface DatosGraficoBarras {
  fecha: string;
  cumplidos: number;
  nocumplidos: number;
}

export interface DatosGraficoLinea {
  fecha: string;
  valores: Record<string, number>; // habitoId -> valor
}

export interface ConfiguracionGrafico {
  colores: {
    cumplido: string;
    nocumplido: string;
    categorias: Record<number, string>; // categoriaId -> color
  };
}

/**
 * Genera la configuración de colores para gráficos
 */
export function generarConfiguracionGrafico(
  categorias: CategoriaResponse[]
): ConfiguracionGrafico {
  const coloresCategorias: Record<number, string> = {};
  
  categorias.forEach((cat) => {
    coloresCategorias[cat.id] = cat.colorHex;
  });

  return {
    colores: {
      cumplido: CHART_ESTADO_COLORS.cumplido,
      nocumplido: CHART_ESTADO_COLORS.nocumplido,
      categorias: coloresCategorias,
    },
  };
}

/**
 * Ejemplo de configuración para Chart.js o Recharts
 */
export const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom' as const,
    },
    tooltip: {
      enabled: true,
      mode: 'index' as const,
      intersect: false,
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      grid: {
        borderDash: [5, 5],
      },
    },
  },
};

/**
 * Colores de fondo y borde para datasets de Chart.js
 */
export function obtenerColoresDataset(color: string) {
  return {
    backgroundColor: color,
    borderColor: color,
    borderWidth: 2,
    hoverBackgroundColor: color,
    hoverBorderColor: color,
  };
}
