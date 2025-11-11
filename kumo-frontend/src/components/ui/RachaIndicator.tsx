import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RachaIndicatorProps {
  rachaActual: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Indicador de racha actual con diseño visual distintivo
 * RF-RAC-CAL-005: Debe tener un diseño visual distintivo (icono de fuego)
 */
export default function RachaIndicator({ rachaActual, className, size = 'md' }: RachaIndicatorProps) {
  const sizes = {
    sm: {
      container: 'px-3 py-1.5',
      icon: 'w-4 h-4',
      text: 'text-sm',
    },
    md: {
      container: 'px-4 py-2',
      icon: 'w-5 h-5',
      text: 'text-base',
    },
    lg: {
      container: 'px-5 py-3',
      icon: 'w-6 h-6',
      text: 'text-lg',
    },
  };

  const currentSize = sizes[size];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full font-bold',
        'bg-gradient-to-r from-racha-500 to-racha-600',
        'text-white shadow-lg shadow-racha-500/30',
        'border-2 border-racha-400',
        'transition-all duration-300 hover:scale-105',
        currentSize.container,
        className
      )}
    >
      <Flame
        className={cn(
          currentSize.icon,
          'fill-current animate-pulse'
        )}
      />
      <span className={cn('font-extrabold', currentSize.text)}>
        {rachaActual}
      </span>
      <span className={cn('font-medium opacity-90', currentSize.text)}>
        {rachaActual === 1 ? 'día' : 'días'}
      </span>
    </div>
  );
}
