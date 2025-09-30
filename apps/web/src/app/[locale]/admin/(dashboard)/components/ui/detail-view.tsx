'use client';

import { memo } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

import type { LucideIcon } from 'lucide-react';
import type { FC, PropsWithChildren } from 'react';

export type DetailViewProps = {
  variant?: 'cards' | 'sections' | 'sidebar';
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
  gridCols?: 1 | 2 | 3 | 4;
  testId?: string;
};

const getSpacingClasses = (spacing: 'sm' | 'md' | 'lg') => {
  const spacingMap = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };
  return spacingMap[spacing];
};

const DetailViewComponent: FC<PropsWithChildren<DetailViewProps>> = ({
  children,
  variant = 'cards',
  className,
  spacing = 'md',
  gridCols = 2,
  testId = 'detail-view',
}) => {
  const baseClasses = cn(
    'w-full',
    variant === 'cards' && [
      // ✅ Grid EXACT identique à ProductCardsGrid de l'original
      'grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 [&>*]:h-full',
      // Surcharge si gridCols spécifié
      gridCols === 1 && 'md:grid-cols-1',
      gridCols === 3 && 'xl:grid-cols-3',
      gridCols === 4 && '2xl:grid-cols-4',
    ],
    variant === 'sections' && [
      'space-y-6 md:space-y-8', // Espacement identique à l'original
    ],
    variant === 'sidebar' && [
      'grid grid-cols-1 lg:grid-cols-4',
      getSpacingClasses(spacing),
    ],
    className
  );

  return (
    <div className={baseClasses} data-testid={testId}>
      {children}
    </div>
  );
};

export type DetailSectionProps = {
  title: string;
  icon?: LucideIcon;
  span?: 1 | 2 | 3 | 4;
  collapsible?: boolean;
  defaultOpen?: boolean;
  loading?: boolean;
  className?: string;
  testId?: string;
};

const DetailSectionComponent: FC<PropsWithChildren<DetailSectionProps>> = memo(
  ({
    children,
    title,
    icon: Icon,
    span,
    loading = false,
    className,
    testId = 'detail-section',
  }) => {
    const spanClasses = span
      ? {
          1: 'lg:col-span-1',
          2: 'lg:col-span-2',
          3: 'lg:col-span-3',
          4: 'lg:col-span-4',
        }[span]
      : '';

    return (
      <div
        data-testid={testId}
        className={cn(
          // ✅ Styles EXACTS de Card de l'ancienne version
          'border-border bg-background/50 text-card-foreground rounded-2xl border shadow-sm backdrop-blur-md transition-all duration-300',
          spanClasses,
          className
        )}
      >
        {/* Header EXACT identique à CardHeader */}
        <div className="border-border/50 from-primary/5 to-secondary/5 flex flex-col space-y-2 border-b bg-gradient-to-r p-8">
          <h3 className="text-foreground flex items-center gap-3 text-lg leading-tight font-semibold tracking-tight">
            {Icon && (
              <div className="from-primary/20 border-primary/20 rounded-lg border bg-gradient-to-br to-orange-500/20 p-2">
                <Icon className="text-primary h-5 w-5" />
              </div>
            )}
            {title}
            {loading && (
              <div className="ml-auto">
                <div className="border-primary/30 border-t-primary h-4 w-4 animate-spin rounded-full border-2" />
              </div>
            )}
          </h3>
        </div>

        {/* Content EXACT identique à CardContent */}
        <div className="space-y-4 px-8 pt-4 pb-8">{children}</div>
      </div>
    );
  }
);

DetailSectionComponent.displayName = 'DetailSectionComponent';

export type DetailFieldProps = {
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  loading?: boolean;
  className?: string;
  testId?: string;
};

const DetailFieldComponent: FC<PropsWithChildren<DetailFieldProps>> = memo(
  ({
    children,
    label,
    description,
    error,
    required = false,
    loading = false,
    className,
    testId = 'detail-field',
  }) => {
    return (
      <div className={cn('space-y-2', className)} data-testid={testId}>
        <div className="flex items-center gap-2">
          <label className="text-foreground text-sm font-medium">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
          {loading && (
            <div className="border-primary/30 border-t-primary h-3 w-3 animate-spin rounded-full border" />
          )}
        </div>

        {description && (
          <p className="text-muted-foreground text-xs">{description}</p>
        )}

        <div className="relative">{children}</div>

        {error && (
          <p className="text-destructive flex items-center gap-1 text-xs">
            <span>⚠️</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

DetailFieldComponent.displayName = 'DetailFieldComponent';

export type DetailFieldGroupProps = {
  layout?: 'row' | 'column' | 'grid-2' | 'grid-3';
  label?: string;
  description?: string;
  className?: string;
  testId?: string;
};

const DetailFieldGroupComponent: FC<PropsWithChildren<DetailFieldGroupProps>> =
  memo(
    ({
      children,
      layout = 'column',
      label,
      description,
      className,
      testId = 'detail-field-group',
    }) => {
      const layoutClasses = {
        row: 'flex flex-col sm:flex-row gap-4',
        column: 'space-y-4',
        'grid-2': 'grid grid-cols-1 sm:grid-cols-2 gap-4',
        'grid-3': 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
      };

      return (
        <div className={cn('space-y-4', className)} data-testid={testId}>
          {(label || description) && (
            <div className="space-y-1">
              {label && (
                <h4 className="text-foreground text-sm font-medium">{label}</h4>
              )}
              {description && (
                <p className="text-muted-foreground text-xs">{description}</p>
              )}
            </div>
          )}

          <div className={layoutClasses[layout]}>{children}</div>
        </div>
      );
    }
  );

DetailFieldGroupComponent.displayName = 'DetailFieldGroupComponent';

export const DetailView = Object.assign(DetailViewComponent, {
  Section: DetailSectionComponent,
  Field: DetailFieldComponent,
  FieldGroup: DetailFieldGroupComponent,
});

export type { DetailViewProps as DetailViewComponentProps };
