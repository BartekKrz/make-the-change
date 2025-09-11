'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import { type LucideIcon } from 'lucide-react';
import { type FC, type ReactNode } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';


const emptyStateVariants = cva(
  'text-center',
  {
    variants: {
      size: {
        sm: 'py-4',
        md: 'py-8',
        lg: 'py-12',
      },
      variant: {
        default: '',
        muted: 'bg-muted/30 rounded-lg',
        card: 'bg-background border border-border rounded-lg shadow-sm',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

const iconSizeVariants = cva(
  'text-muted-foreground mx-auto mb-4',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
} & VariantProps<typeof emptyStateVariants>;

const EmptyState: FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
  size,
  variant,
}) => (
  <div className={cn(emptyStateVariants({ size, variant }), className)}>
    {Icon && (
      <Icon className={iconSizeVariants({ size })} />
    )}
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    {description && (
      <p className="text-muted-foreground mb-4">{description}</p>
    )}
    {action}
  </div>
);

export { EmptyState };
