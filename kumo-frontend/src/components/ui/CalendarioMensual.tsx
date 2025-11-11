import { useState } from 'react';
import CalendarioDia, { type EstadoDia } from './CalendarioDia';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export interface RegistroCalendario {
  fecha: string; // YYYY-MM-DD
  estaCumplido: boolean;
}

export interface CalendarioMensualProps {
  año: number;
  mes: number; // 1-12
  registros: RegistroCalendario[];
  onDiaClick?: (fecha: string) => void;
  onMesChange?: (año: number, mes: number) => void;
}

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

/**
 * Componente de calendario mensual con estados visuales
 * RF-RAC-RES-004: Vista de calendario mensual donde cada día se colorea según:
 * - Cumplido (verde)
 * - No cumplido (rojo)
 * - Sin registrar (gris)
 */
export default function CalendarioMensual({
  año,
  mes,
  registros,
  onDiaClick,
  onMesChange,
}: CalendarioMensualProps) {
  const hoy = new Date();
  const primerDia = new Date(año, mes - 1, 1);
  const ultimoDia = new Date(año, mes, 0);
  const diasEnMes = ultimoDia.getDate();
  const diaSemanaInicio = primerDia.getDay();

  // Crear mapa de registros para búsqueda rápida
  const mapaRegistros = new Map<string, boolean>();
  registros.forEach((reg) => {
    mapaRegistros.set(reg.fecha, reg.estaCumplido);
  });

  // Determinar el estado de un día
  const obtenerEstadoDia = (dia: number): EstadoDia => {
    const fecha = new Date(año, mes - 1, dia);
    const fechaStr = fecha.toISOString().split('T')[0];
    
    // Si es futuro
    if (fecha > hoy) {
      return 'futuro';
    }
    
    // Si hay registro
    if (mapaRegistros.has(fechaStr)) {
      return mapaRegistros.get(fechaStr) ? 'cumplido' : 'noCumplido';
    }
    
    // Sin registro
    return 'sinRegistro';
  };

  const esHoy = (dia: number): boolean => {
    return (
      dia === hoy.getDate() &&
      mes - 1 === hoy.getMonth() &&
      año === hoy.getFullYear()
    );
  };

  const handleDiaClick = (dia: number) => {
    const fecha = new Date(año, mes - 1, dia);
    const fechaStr = fecha.toISOString().split('T')[0];
    onDiaClick?.(fechaStr);
  };

  const handleMesAnterior = () => {
    if (mes === 1) {
      onMesChange?.(año - 1, 12);
    } else {
      onMesChange?.(año, mes - 1);
    }
  };

  const handleMesSiguiente = () => {
    if (mes === 12) {
      onMesChange?.(año + 1, 1);
    } else {
      onMesChange?.(año, mes + 1);
    }
  };

  // Generar días del calendario
  const dias: (number | null)[] = [];
  
  // Días vacíos al inicio
  for (let i = 0; i < diaSemanaInicio; i++) {
    dias.push(null);
  }
  
  // Días del mes
  for (let dia = 1; dia <= diasEnMes; dia++) {
    dias.push(dia);
  }

  return (
    <div className="w-full">
      {/* Header con navegación */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMesAnterior}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h3 className="text-lg font-semibold text-gray-900">
          {MESES[mes - 1]} {año}
        </h3>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleMesSiguiente}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {DIAS_SEMANA.map((dia) => (
          <div
            key={dia}
            className="text-center text-sm font-medium text-gray-600 py-2"
          >
            {dia}
          </div>
        ))}
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-7 gap-2">
        {dias.map((dia, index) => (
          <div key={index}>
            {dia ? (
              <CalendarioDia
                dia={dia}
                estado={obtenerEstadoDia(dia)}
                isHoy={esHoy(dia)}
                onClick={() => handleDiaClick(dia)}
              />
            ) : (
              <div className="aspect-square" />
            )}
          </div>
        ))}
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-cumplido-200 border-2 border-cumplido-300" />
          <span className="text-sm text-gray-600">Cumplido</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-noCumplido-200 border-2 border-noCumplido-300" />
          <span className="text-sm text-gray-600">No cumplido</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-sinRegistro-100 border-2 border-sinRegistro-200" />
          <span className="text-sm text-gray-600">Sin registro</span>
        </div>
      </div>
    </div>
  );
}
