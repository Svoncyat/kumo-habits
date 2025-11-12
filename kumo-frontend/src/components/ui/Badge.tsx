import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'cumplido' | 'nocumplido' | 'sinregistro';
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
    nocumplido: 'bg-nocumplido-100 text-nocumplido-800 border-nocumplido-200',
    sinregistro: 'bg-sinregistro-100 text-sinregistro-800 border-sinregistro-200',
  };

  // Función para convertir hex a rgba
  const hexToRgba = (hex: string, opacity: number): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
      return hex;
    }
    
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Si se proporciona un color personalizado (desde la API de categorías)
  const customStyle = customColor ? {
    backgroundColor: hexToRgba(customColor, 0.15), // 15% opacity para fondo
    color: customColor,
    borderColor: hexToRgba(customColor, 0.3), // 30% opacity para borde
  } : undefined;

  if (customStyle) {
    console.log('🎨 Badge customStyle:', customStyle);
  }

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
