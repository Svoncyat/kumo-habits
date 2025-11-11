import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'cumplido' | 'noCumplido' | 'sinRegistro';
  customColor?: string; // Para colores de categorías desde el backend
}

export default function Badge({ className, variant = 'default', customColor, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    // Estados del calendario según SRS (RF-RAC-CAL-005, RF-RAC-RES-004)
    cumplido: 'bg-cumplido-100 text-cumplido-800 border-cumplido-200',
    noCumplido: 'bg-noCumplido-100 text-noCumplido-800 border-noCumplido-200',
    sinRegistro: 'bg-sinRegistro-100 text-sinRegistro-800 border-sinRegistro-200',
  };

  // Si se proporciona un color personalizado (desde la API de categorías)
  const customStyle = customColor ? {
    backgroundColor: `${customColor}20`, // 20 = 12.5% opacity
    color: customColor,
    borderColor: `${customColor}40`, // 40 = 25% opacity
  } : undefined;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        !customColor && variants[variant],
        className
      )}
      style={customStyle}
      {...props}
    />
  );
}
