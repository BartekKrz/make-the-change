'use client';

import type { FC, ReactNode } from 'react';
import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import Image from 'next/image';
import { Package } from 'lucide-react';

export type BreadcrumbItem = {
  href?: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export type AdminDetailHeaderProps = {
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  statusIndicator?: ReactNode;
  productImage?: string;
  className?: string;
  testId?: string;
};

export const AdminDetailHeader: FC<AdminDetailHeaderProps> = ({
  breadcrumbs = [],
  title,
  subtitle,
  actions,
  statusIndicator,
  productImage,
  className,
  testId = 'admin-detail-header'
}) => {
  return (
    <div className={cn('max-w-7xl mx-auto px-4 md:px-8', className)} data-testid={testId}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground pt-3 pb-1">
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              {item.href ? (
                <a
                  href={item.href}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </a>
              ) : (
                <span className={cn(
                  'flex items-center gap-1',
                  index === breadcrumbs.length - 1 ? 'text-foreground font-medium truncate max-w-[200px] md:max-w-none' : ''
                )}>
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Main Header */}
      <div className="flex items-start justify-between py-3 pb-4">
        <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
          {/* Image du produit */}
          {productImage ? (
            <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 to-orange-500/10">
              <Image
                src={productImage}
                alt={title || 'Product image'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 48px, 64px"
              />
            </div>
          ) : title && (
            <div className="p-2 md:p-3 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-xl border border-primary/20 backdrop-blur-sm flex-shrink-0">
              <Package className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            {title && (
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">
                  {title}
                </h1>
                {statusIndicator && (
                  <div className="flex-shrink-0">
                    {statusIndicator}
                  </div>
                )}
              </div>
            )}
            
            {subtitle && (
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex-shrink-0 ml-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export type SaveStatusType = 'saving' | 'saved' | 'error' | 'modified' | 'pristine';

export type SaveStatus = {
  type: SaveStatusType;
  message: string;
  count?: number;
  fields?: string[];
  timestamp?: Date;
  retryable?: boolean;
};

export type AdminDetailActionsProps = {
  saveStatus?: SaveStatus;
  onSaveAll?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  primaryActions?: ReactNode;
  secondaryActions?: ReactNode;
  className?: string;
  testId?: string;
};

export const AdminDetailActions: FC<AdminDetailActionsProps> = ({
  saveStatus,
  onSaveAll,
  onCancel,
  onDelete,
  primaryActions,
  secondaryActions,
  className,
  testId = 'admin-detail-actions'
}) => {
  const getStatusColor = (type: SaveStatusType) => {
    const colors = {
      saving: 'text-blue-600 dark:text-blue-400',
      saved: 'text-green-600 dark:text-green-400',
      error: 'text-red-600 dark:text-red-400',
      modified: 'text-yellow-600 dark:text-yellow-400',
      pristine: 'text-muted-foreground'
    };
    return colors[type];
  };

  const getStatusIcon = (type: SaveStatusType) => {
    const icons = {
      saving: '⏳',
      saved: '✅', 
      error: '❌',
      modified: '📝',
      pristine: '💾'
    };
    return icons[type];
  };

  return (
    <div className={cn('flex items-center gap-3', className)} data-testid={testId}>
      {/* Status Indicator */}
      {saveStatus && (
        <div className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors',
          saveStatus.type === 'saving' && 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
          saveStatus.type === 'saved' && 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
          saveStatus.type === 'error' && 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
          saveStatus.type === 'modified' && 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800',
          saveStatus.type === 'pristine' && 'bg-muted/50 border-border'
        )}>
          <span className={getStatusColor(saveStatus.type)}>
            {getStatusIcon(saveStatus.type)}
          </span>
          <span className={getStatusColor(saveStatus.type)}>
            {saveStatus.message}
          </span>
          {saveStatus.type === 'error' && saveStatus.retryable && onSaveAll && (
            <button
              onClick={onSaveAll}
              className="ml-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
            >
              Réessayer
            </button>
          )}
        </div>
      )}

      {/* Secondary Actions */}
      {secondaryActions}

      
      {/* Primary Actions */}
      {primaryActions}

      {/* Cancel Button */}
      {onCancel && (
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
        >
          Annuler
        </button>
      )}

      {/* Delete Button */}
      {onDelete && (
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors text-sm font-medium"
        >
          Supprimer
        </button>
      )}
    </div>
  );
};