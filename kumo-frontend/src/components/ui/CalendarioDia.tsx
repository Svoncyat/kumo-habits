import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

export type EstadoDia = 'cumplido' | 'noCumplido' | 'sinRegistro' | 'futuro';

export interface CalendarioDiaProps {
  dia: number;
  estado: EstadoDia;
  onClick?: () => void;
  isHoy?: boolean;
  isSeleccionado?: boolean;
  className?: string;
}

/**
 * Componente para representar un día en el calendario mensual
 * RF-RAC-RES-004: Cada día debe colorearse de forma diferente para indicar:
 * - "cumplido" (verde)
 * - "no cumplido" (rojo)
 * - "sin registrar" (gris)
 */
export default function CalendarioDia({
  dia,
  estado,
  onClick,
  isHoy = false,
  isSeleccionado = false,
  className,
}: CalendarioDiaProps) {
  const estadoStyles = {
    cumplido: 'bg-cumplido-100 text-cumplido-900 border-cumplido-300 hover:bg-cumplido-200',
    noCumplido: 'bg-noCumplido-100 text-noCumplido-900 border-noCumplido-300 hover:bg-noCumplido-200',
    sinRegistro: 'bg-sinRegistro-50 text-sinRegistro-600 border-sinRegistro-200 hover:bg-sinRegistro-100',
    futuro: 'bg-white text-gray-400 border-gray-100 cursor-not-allowed opacity-60',
  };

  const iconMap = {
    cumplido: <Check className="w-3 h-3" />,
    noCumplido: <X className="w-3 h-3" />,
    sinRegistro: null,
    futuro: null,
  };

  return (
    <button
      type="button"
      onClick={estado !== 'futuro' ? onClick : undefined}
      disabled={estado === 'futuro'}
      className={cn(
        'relative flex flex-col items-center justify-center',
        'aspect-square rounded-lg border-2',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        estadoStyles[estado],
        isHoy && 'ring-2 ring-primary-500 ring-offset-2',
        isSeleccionado && 'ring-2 ring-secondary-500 ring-offset-2',
        estado !== 'futuro' && 'cursor-pointer',
        className
      )}
    >
      {/* Número del día */}
      <span className="font-semibold text-sm">
        {dia}
      </span>

      {/* Icono de estado */}
      {iconMap[estado] && (
        <div className="absolute top-1 right-1">
          {iconMap[estado]}
        </div>
      )}

      {/* Indicador de "hoy" */}
      {isHoy && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
          <div className="w-1 h-1 rounded-full bg-primary-500" />
        </div>
      )}
    </button>
  );
}
