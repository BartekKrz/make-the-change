import { type FC, type ReactNode, type MouseEvent } from 'react';

import { cn } from '@/lib/utils';

type RoundActionButtonProps = {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
};

export const RoundActionButton: FC<RoundActionButtonProps> = ({
  onClick,
  children,
  className = '',
  disabled = false,
}) => (
  <button
    aria-label="Action sur l'image"
    disabled={disabled}
    type="button"
    className={cn(
      'bg-background/95 h-12 w-12 rounded-full shadow-lg backdrop-blur-sm',
      'transition-all duration-300 hover:scale-110 hover:shadow-xl',
      'flex cursor-pointer items-center justify-center',
      'border-border/20 hover:border-primary/30 border',
      'focus:ring-primary/20 focus:ring-2 focus:ring-offset-2 focus:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100',
      className
    )}
    onClick={onClick}
  >
    {children}
  </button>
);
