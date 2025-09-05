import { type FC, type ReactNode, type MouseEvent } from 'react';
import { cn } from '@/lib/utils';

type RoundActionButtonProps = {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export const RoundActionButton: FC<RoundActionButtonProps> = ({ 
  onClick, 
  children, 
  className = '',
  disabled = false 
} ) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'w-12 h-12 bg-background/95 backdrop-blur-sm rounded-full shadow-lg',
      'hover:scale-110 hover:shadow-xl transition-all duration-300',
      'flex items-center justify-center cursor-pointer',
      'border border-border/20 hover:border-primary/30',
      'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
      className
    )}
    type="button"
    aria-label="Action sur l'image"
  >
    {children}
  </button>
);
