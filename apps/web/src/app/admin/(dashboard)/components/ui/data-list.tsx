'use client';

import type { FC, PropsWithChildren, ReactNode, KeyboardEvent, MouseEvent } from 'react';
import type { LucideIcon } from 'lucide-react';
import { useCallback } from 'react';
import { cn } from '@/app/admin/(dashboard)/components/cn';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProductImage } from '@/components/images/product-image';

export type DataListProps<T> = {
  variant?: 'grid' | 'list';
  items: T[];
  renderItem: (item: T) => ReactNode;
  renderSkeleton: () => ReactNode;
  emptyState: {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: ReactNode;
  };
  isLoading: boolean;
  getItemKey?: (item: T, index: number) => string | number;
  className?: string;
  gridCols?: 1 | 2 | 3 | 4;
  spacing?: 'sm' | 'md' | 'lg';
  testId?: string;
};

const getGridClasses = (cols: number) => {
  const gridMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',
    4: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
  };
  return gridMap[cols as keyof typeof gridMap];
};

const getSpacingClasses = (spacing: 'sm' | 'md' | 'lg') => {
  const spacingMap = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6'
  };
  return spacingMap[spacing];
};

export const DataList = <T,>({
  variant = 'grid',
  items,
  renderItem,
  renderSkeleton,
  emptyState,
  isLoading,
  getItemKey,
  className,
  gridCols = 3,
  spacing = 'md',
  testId = 'data-list'
}: DataListProps<T>) => {
  const getKey = (item: T, index: number): string | number => {
    if (getItemKey) {
      return getItemKey(item, index);
    }

    if (item && typeof item === 'object') {
      const obj = item as any;
      if (obj.dbid !== undefined) return obj.dbid;
      if (obj.id !== undefined) return obj.id;
      if (obj.uuid !== undefined) return obj.uuid;
    }

    return index;
  };

  if (isLoading) {
    const skeletonItems = variant === 'grid' ? gridCols * 2 : 6;
    
    return (
      <div className={cn('space-y-6', className)} data-testid={testId}>
        {variant === 'grid' ? (
          <div className={cn('grid', getGridClasses(gridCols), getSpacingClasses(spacing), 'items-stretch')}>
            {Array.from({ length: skeletonItems }).map((_, index) => (
              <div key={index} className='h-full'>
                {renderSkeleton()}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {Array.from({ length: skeletonItems }).map((_, index) => (
              <div key={index}>
                {renderSkeleton()}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (items.length === 0 && emptyState) {
    const EmptyIcon = emptyState.icon;
    return (
      <div className={cn('space-y-6', className)} data-testid={testId}>
        <div className='text-center py-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 ease-out'>
          {EmptyIcon && (
            <div className='flex items-center justify-center mb-4'>
              <div className='p-4 bg-muted/30 rounded-2xl animate-in fade-in-0 scale-in-95 duration-500 delay-150'>
                <EmptyIcon className='w-8 h-8 text-muted-foreground' />
              </div>
            </div>
          )}
          <h3 className='text-lg font-semibold text-foreground mb-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-300'>
            {emptyState.title}
          </h3>
          {emptyState.description && (
            <p className='text-muted-foreground mb-6 max-w-md mx-auto animate-in fade-in-0 slide-in-from-bottom-1 duration-500 delay-500'>
              {emptyState.description}
            </p>
          )}
          <div className="animate-in fade-in-0 slide-in-from-bottom-1 duration-500 delay-700">
            {emptyState.action}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)} data-testid={testId}>
      {variant === 'grid' ? (
        <div className={cn('grid', getGridClasses(gridCols), getSpacingClasses(spacing), 'items-stretch', 'auto-rows-fr')}>
          {items.map((item, index) => (
            <div key={getKey(item, index)} className='h-full'>
              {renderItem(item)}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={getKey(item, index)}>
              {renderItem(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export type DataCardProps = {
  className?: string;
  href?: string;
  onClick?: () => void;
  testId?: string;
  image?: string;
  imageAlt?: string;
};

const DataCardComponent: FC<PropsWithChildren<DataCardProps>> = ({
  children,
  className,
  href,
  onClick,
  testId,
  image,
  imageAlt
}) => {
  const router = useRouter();

  const baseClasses = cn(
    'group relative bg-white border border-border/50 rounded-xl p-6 overflow-hidden h-full flex flex-col',
   
    'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
    'hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-border',
    'hover:-translate-y-2',
   
    'active:translate-y-0 active:scale-[0.98] active:shadow-[0_2px_10px_rgb(0,0,0,0.1)]',
    'active:duration-100 active:ease-out',
    'will-change-transform'
  );

 
  const handleCardClick = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('a[href]') || target.closest('button')) {
      return;
    }

   
    if (href) {
      router.push(href);
    }
    
   
    onClick?.();
  }, [href, router, onClick]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick(event as any);
    }
  }, [handleCardClick]);

  const CardContent = () => (
    <>
      {/* Image d'arrière-plan */}
      {image && imageAlt && (
        <div className='absolute top-0 right-0 w-20 h-20 overflow-hidden [border-radius:var(--radius-surface)_var(--radius-surface)_0_0] opacity-10 md:group-hover:opacity-20 transition-opacity duration-300'>
          <Image
            src={image}
            alt={imageAlt}
            fill
            className='object-cover scale-110'
            unoptimized={image.includes('unsplash') || image.includes('supabase')}
          />
        </div>
      )}
      
      {/* Contenu principal */}
      <div className='relative flex flex-col h-full [&_a]:relative [&_a]:z-10 [&_button]:relative [&_button]:z-10'>{children}</div>

    </>
  );

 
  return (
    <div
      className={cn(
        baseClasses,
        className,
       
        (href || onClick) && 'cursor-pointer'
      )}
      data-testid={testId}
      onClick={href || onClick ? handleCardClick : undefined}
      onKeyDown={href || onClick ? handleKeyDown : undefined}
      role={href || onClick ? 'button' : undefined}
      tabIndex={href || onClick ? 0 : undefined}
    >
      <CardContent />
    </div>
  );
};

type DataCardHeaderProps = {
  className?: string;
};

const DataCardHeader: FC<PropsWithChildren<DataCardHeaderProps>> = ({ children, className }) => (
  <div className={cn('flex items-start justify-between mb-6', className)}>{children}</div>
);

type DataCardTitleProps = {
  icon?: LucideIcon;
  image?: string;
  imageAlt?: string;
  images?: string[];
  onImageClick?: () => void;
  className?: string;
};

const DataCardTitle: FC<PropsWithChildren<DataCardTitleProps>> = ({ 
  children, 
  icon: Icon, 
  image, 
  imageAlt, 
  images,
  onImageClick,
  className 
}) => {
  const shouldShowIcon = Icon && !image;
  const shouldShowImage = image && imageAlt;

  return (
    <div className='flex w-full items-center gap-3 relative'>
      {shouldShowImage && (
        <ProductImage
          src={image}
          alt={imageAlt}
          size="md"
          images={images}
          onImageClick={onImageClick}
          className="flex-shrink-0"
        />
      )}
      {shouldShowIcon && (
        <div className='w-21 h-21 [border-radius:var(--radius-surface)] bg-gradient-to-br from-primary/10 to-orange-500/10 flex items-center justify-center border border-primary/20 flex-shrink-0'>
          <Icon size={32} className='text-muted-foreground' />
        </div>
      )}
      <div className='flex-1 min-w-0'>
        <h2 className={cn('text-foreground font-semibold line-clamp-2 text-lg', className)}>{children}</h2>
      </div>
    </div>
  );
};

type DataCardContentProps = {
  className?: string;
};

const DataCardContent: FC<PropsWithChildren<DataCardContentProps>> = ({ children, className }) => (
  <div className={cn('flex flex-col  gap-2 flex-1 mb-4', className)}>
    {children}
  </div>
);

type DataCardFooterProps = {
  className?: string;
};

const DataCardFooter: FC<PropsWithChildren<DataCardFooterProps>> = ({ children, className }) => (
  <div
    className={cn(
      'border-t px-0 pb-3 text-primary flex items-center justify-between text-sm font-medium group border-border pt-4 mt-auto',
      className
    )}
  >
    {children}
  </div>
);

type DataCardContentItemProps = {
  icon: LucideIcon;
};

const DataCardContentItem: FC<PropsWithChildren<DataCardContentItemProps>> = ({ icon: Icon, children }) => (
  <div className='flex items-center gap-3 text-sm text-muted-foreground'>
    <Icon className='h-4 w-4' />
    <span className='[&>a]:md:group-hover:text-primary [&>a]:md:group-hover:underline [&>a]:hover:!text-blue-600 [&>a]:hover:!font-medium [&>a]:transition-all [&>a]:duration-200'>
      {children}
    </span>
  </div>
);

export const DataCard = Object.assign(DataCardComponent, {
  Header: DataCardHeader,
  Title: DataCardTitle,
  Content: DataCardContent,
  ContentItem: DataCardContentItem,
  Footer: DataCardFooter
});

// DataListItem - Composant pour les vues en liste avec composition
export type DataListItemProps = {
  href?: string;
  onClick?: () => void;
  className?: string;
  testId?: string;
};

const DataListItemComponent: FC<PropsWithChildren<DataListItemProps>> = ({
  children,
  href,
  onClick,
  className,
  testId
}) => {
  const router = useRouter();

  const baseClasses = cn(
    'group relative cursor-pointer',
    '[padding:var(--density-spacing-md)] [margin:calc(var(--density-spacing-md)*-1)]',
   
    'transition-all duration-200 ease-out',
    'border border-transparent [border-radius:var(--radius-surface)]',
    'will-change-transform',
   
    'md:hover:bg-gradient-to-r md:hover:from-primary/6 md:hover:via-background/40 md:hover:to-orange-500/6',
    'md:hover:shadow-md md:hover:shadow-primary/8 md:hover:border-primary/25',
    'md:hover:scale-[1.003] md:hover:-translate-y-0.5',
   
    'active:bg-gradient-to-r active:from-primary/8 active:via-background/50 active:to-orange-500/8',
    'active:shadow-sm active:shadow-primary/6 active:border-primary/30',
    'active:scale-[0.997] active:translate-y-0',
   
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
    'backdrop-blur-sm',
    className
  );

  const handleCardClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('a[href]') || target.closest('button')) {
      return;
    }

    if (href) {
      router.push(href);
    }
    onClick?.();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick(event as any);
    }
  };

  return (
    <div
      className={baseClasses}
      data-testid={testId}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role={onClick || href ? 'button' : undefined}
      tabIndex={onClick || href ? 0 : undefined}
    >
      {/* Link invisible pour la navigation */}
      {href && (
        <div
          className="absolute inset-0 z-10 block"
          aria-label="Accéder aux détails"
        />
      )}

      {/* Contenu avec z-index plus élevé */}
      <div className="relative z-20 flex items-center justify-between pointer-events-none">
        <div className="flex-1 min-w-0">
          {children}
        </div>

        {/* Chevron indicator amélioré */}
        {href && (
          <div className="flex-shrink-0 ml-4 transition-all duration-200 ease-out md:group-hover:translate-x-1 md:group-hover:scale-110 group-active:translate-x-0.5 group-active:scale-105">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/15 [border-radius:var(--radius-pill)] scale-150 opacity-0 md:group-hover:opacity-100 transition-all duration-200 ease-out" />
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-sm relative z-10 transition-transform duration-200 ease-out"
              >
                <path
                  d="m9 18 6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-60 text-primary md:group-hover:opacity-100 group-active:opacity-80 transition-all duration-200 ease-out"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Effets visuels modernes 2025 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/4 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none [border-radius:var(--radius-surface)]" />
      <div className="absolute inset-0 ring-2 ring-primary/30 ring-offset-2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 ease-out [border-radius:var(--radius-surface)] pointer-events-none" />
    </div>
  );
};

type DataListItemHeaderProps = {
  className?: string;
};

const DataListItemHeader: FC<PropsWithChildren<DataListItemHeaderProps>> = ({ 
  children, 
  className 
}) => (
  <div className={cn('[margin-bottom:var(--density-spacing-sm)]', className)}>
    {children}
  </div>
);

type DataListItemContentProps = {
  className?: string;
};

const DataListItemContent: FC<PropsWithChildren<DataListItemContentProps>> = ({ 
  children, 
  className 
}) => (
  <div className={cn(
    'space-y-2  text-sm text-muted-foreground transition-colors duration-300 md:group-hover:text-foreground/90',
    className
  )}>
    {children}
  </div>
);

type DataListItemActionsProps = {
  className?: string;
};

const DataListItemActions: FC<PropsWithChildren<DataListItemActionsProps>> = ({ 
  children, 
  className 
}) => {
  const handleActionClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      className={cn(
        'relative z-30 [margin-top:var(--density-spacing-md)] [padding-top:var(--density-spacing-sm)] border-t border-border/20 pointer-events-auto',
        className
      )}
      onClick={handleActionClick}
    >
      {children}
    </div>
  );
};

export const DataListItem = Object.assign(DataListItemComponent, {
  Header: DataListItemHeader,
  Content: DataListItemContent,
  Actions: DataListItemActions
});
