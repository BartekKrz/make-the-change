'use client';

import type { FC, PropsWithChildren, ReactNode, KeyboardEvent, MouseEvent } from 'react';
import type { LucideIcon } from 'lucide-react';
import { useCallback } from 'react';
import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import Image from 'next/image';
import Link from 'next/link';
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
          <div className="space-y-5">
            {Array.from({ length: skeletonItems }).map((_, index) => (
              <div key={index} className="py-1">
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
              <div className='p-4 bg-muted/30 dark:bg-muted/20 rounded-2xl animate-in fade-in-0 scale-in-95 duration-500 delay-150'>
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
        <div className="space-y-5">
          {items.map((item, index) => (
            <div key={getKey(item, index)} className="py-1">
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
    // Base styling with dark theme support
    'group relative bg-background dark:bg-card border border-border/50 dark:border-border/30 rounded-xl p-6 overflow-hidden h-full flex flex-col',
   
    // Transitions and transforms
    'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
    'hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:border-border dark:hover:border-border/50',
    'hover:-translate-y-2',
   
    // Active states with dark theme
    'active:translate-y-0 active:scale-[0.98] active:shadow-[0_2px_10px_rgb(0,0,0,0.1)] dark:active:shadow-[0_2px_10px_rgb(0,0,0,0.4)]',
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
        <div className='w-21 h-21 [border-radius:var(--radius-surface)] bg-gradient-to-br from-primary/10 dark:from-primary/15 to-orange-500/10 dark:to-orange-500/15 flex items-center justify-center border border-primary/20 dark:border-primary/30 flex-shrink-0'>
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
      'border-t px-0 pb-3 text-primary dark:text-primary flex items-center justify-between text-sm font-medium group border-border dark:border-border/50 pt-4 mt-auto',
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
    // Base layout & behavior
    'group relative cursor-pointer',
    '[padding:var(--density-spacing-md)] [margin:calc(var(--density-spacing-md)*-1)]',
    'rounded-[var(--radius-surface)] border border-transparent',
    'will-change-transform backdrop-blur-sm',
    
    // Unified transition system 2025
    'transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]',
    
    // Modern hover states with design system colors
    'md:hover:bg-gradient-to-r md:hover:from-primary/8 dark:md:hover:from-primary/12 md:hover:via-background/60 dark:md:hover:via-card/80 md:hover:to-accent/5 dark:md:hover:to-accent/8',
    'md:hover:shadow-[var(--shadow-card)] md:hover:shadow-primary/12 dark:md:hover:shadow-black/30',
    'md:hover:border-primary/30 dark:md:hover:border-primary/40 md:hover:scale-[1.001] md:hover:-translate-y-0.5',
    'md:hover:z-10 md:hover:relative',
    
    // Refined active states
    'active:bg-gradient-to-r active:from-primary/12 dark:active:from-primary/16 active:via-background/70 dark:active:via-card/90 active:to-accent/8 dark:active:to-accent/12',
    'active:shadow-[var(--shadow-surface)] active:shadow-primary/8 dark:active:shadow-black/20',
    'active:border-primary/40 dark:active:border-primary/50 active:scale-[0.999] active:translate-y-0',
    
    // Enhanced focus with design system - only for keyboard navigation
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 dark:focus-visible:ring-primary/80',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-offset-card',
    
    // Remove focus styling for mouse interactions
    'focus:not(:focus-visible):ring-0 focus:not(:focus-visible):ring-offset-0',
    
    // Modern glass effect
    'md:hover:backdrop-blur-md',
    className
  );

  const handleCardClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('a[href]') || target.closest('button')) {
      // Remove focus from the container when clicking on interactive elements
      (event.currentTarget as HTMLElement)?.blur();
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
      {/* Invisible navigation overlay with improved accessibility */}
      {href && (
        <Link
          href={href}
          className="absolute inset-0 z-10 block rounded-[var(--radius-surface)]"
          aria-label="Accéder aux détails de cet élément"
          tabIndex={-1}
        />
      )}

      {/* Contenu avec z-index plus élevé */}
      <div className="relative z-20 flex items-center justify-between pointer-events-none">
        <div className="flex-1 min-w-0">
          {children}
        </div>

          {/* Modern chevron indicator 2025 */}
        {href && (
          <div className="flex-shrink-0 ml-4 transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)] md:group-hover:translate-x-1.5 md:group-hover:scale-110 group-active:translate-x-0.5 group-active:scale-105">
            <div className="relative">
              {/* Animated background bubble */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/15 rounded-[var(--radius-pill)] scale-0 opacity-0 md:group-hover:scale-150 md:group-hover:opacity-100 transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
              
              {/* Enhanced chevron with micro-interaction */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 drop-shadow-sm transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]"
              >
                <path
                  d="m9 18 6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary opacity-50 md:group-hover:opacity-100 md:group-hover:stroke-[3] group-active:opacity-80 transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Advanced visual effects 2025 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/3 dark:via-primary/5 to-accent/2 dark:to-accent/4 opacity-0 md:group-hover:opacity-100 transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none rounded-[var(--radius-surface)]" />
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 dark:via-white/4 to-transparent opacity-0 md:group-hover:opacity-100 transition-all duration-[var(--transition-slow)] ease-out pointer-events-none rounded-[var(--radius-surface)] translate-x-[-100%] md:group-hover:translate-x-[100%]" />
      
      {/* Enhanced focus ring */}
      <div className="absolute inset-0 ring-2 ring-primary/40 dark:ring-primary/60 ring-offset-2 ring-offset-background dark:ring-offset-card opacity-0 group-focus-within:opacity-100 transition-all duration-[var(--transition-fast)] ease-out rounded-[var(--radius-surface)] pointer-events-none" />
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
    // Enhanced content spacing and typography 2025
    'space-y-[var(--density-spacing-sm)] text-sm text-muted-foreground',
    'transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]',
    'md:group-hover:text-foreground/95 md:group-hover:scale-[1.01]',
    'group-active:text-foreground/85',
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
        // Enhanced actions area with modern styling
        'relative z-30 mt-[var(--density-spacing-md)] pt-[var(--density-spacing-sm)]',
        'border-t border-border/30 dark:border-border/20 pointer-events-auto',
        'transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]',
        'md:group-hover:border-border/50 dark:md:group-hover:border-border/40 md:group-hover:pt-[calc(var(--density-spacing-sm)*1.1)]',
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
