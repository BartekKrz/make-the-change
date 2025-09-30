'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { ProductImage } from '@/app/[locale]/admin/(dashboard)/components/images/product-image';

import type { LucideIcon } from 'lucide-react';
import type {
  FC,
  PropsWithChildren,
  ReactNode,
  KeyboardEvent,
  MouseEvent,
} from 'react';

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
    4: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
  };
  return gridMap[cols as keyof typeof gridMap];
};

const getSpacingClasses = (spacing: 'sm' | 'md' | 'lg') => {
  const spacingMap = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
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
  testId = 'data-list',
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
          <div
            className={cn(
              'grid',
              getGridClasses(gridCols),
              getSpacingClasses(spacing),
              'items-stretch'
            )}
          >
            {Array.from({ length: skeletonItems }).map((_, index) => (
              <div key={index} className="h-full">
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
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 py-12 text-center duration-700 ease-out">
          {EmptyIcon && (
            <div className="mb-4 flex items-center justify-center">
              <div className="bg-muted/30 dark:bg-muted/20 animate-in fade-in-0 scale-in-95 rounded-2xl p-4 delay-150 duration-500">
                <EmptyIcon className="text-muted-foreground h-8 w-8" />
              </div>
            </div>
          )}
          <h3 className="text-foreground animate-in fade-in-0 slide-in-from-bottom-2 mb-2 text-lg font-semibold delay-300 duration-500">
            {emptyState.title}
          </h3>
          {emptyState.description && (
            <p className="text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-1 mx-auto mb-6 max-w-md delay-500 duration-500">
              {emptyState.description}
            </p>
          )}
          <div className="animate-in fade-in-0 slide-in-from-bottom-1 delay-700 duration-500">
            {emptyState.action}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)} data-testid={testId}>
      {variant === 'grid' ? (
        <div
          className={cn(
            'grid',
            getGridClasses(gridCols),
            getSpacingClasses(spacing),
            'items-stretch',
            'auto-rows-fr'
          )}
        >
          {items.map((item, index) => (
            <div key={getKey(item, index)} className="h-full">
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
  imageAlt,
}) => {
  const router = useRouter();

  const baseClasses = cn(
    // Base styling with dark theme support
    'group bg-background dark:bg-card border-border/50 dark:border-border/30 relative flex h-full flex-col overflow-hidden rounded-xl border p-6',

    // Transitions and transforms
    'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
    'hover:border-border dark:hover:border-border/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)]',
    'hover:-translate-y-2',

    // Active states with dark theme
    'active:translate-y-0 active:scale-[0.98] active:shadow-[0_2px_10px_rgb(0,0,0,0.1)] dark:active:shadow-[0_2px_10px_rgb(0,0,0,0.4)]',
    'active:duration-100 active:ease-out',
    'will-change-transform'
  );

  const handleCardClick = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('a[href]') || target.closest('button')) {
        return;
      }

      if (href) {
        router.push(href);
      }

      onClick?.();
    },
    [href, router, onClick]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleCardClick(event as any);
      }
    },
    [handleCardClick]
  );

  const CardContent = () => (
    <>
      {/* Image d'arrière-plan */}
      {image && imageAlt && (
        <div className="absolute top-0 right-0 h-20 w-20 overflow-hidden [border-radius:var(--radius-surface)_var(--radius-surface)_0_0] opacity-10 transition-opacity duration-300 md:group-hover:opacity-20">
          <Image
            fill
            alt={imageAlt}
            className="scale-110 object-cover"
            src={image}
            unoptimized={
              image.includes('unsplash') || image.includes('supabase')
            }
          />
        </div>
      )}

      {/* Contenu principal */}
      <div className="relative flex h-full flex-col [&_a]:relative [&_a]:z-10 [&_button]:relative [&_button]:z-10">
        {children}
      </div>
    </>
  );

  return (
    <div
      data-testid={testId}
      role={href || onClick ? 'button' : undefined}
      tabIndex={href || onClick ? 0 : undefined}
      className={cn(
        baseClasses,
        className,

        (href || onClick) && 'cursor-pointer'
      )}
      onClick={href || onClick ? handleCardClick : undefined}
      onKeyDown={href || onClick ? handleKeyDown : undefined}
    >
      <CardContent />
    </div>
  );
};

type DataCardHeaderProps = {
  className?: string;
};

const DataCardHeader: FC<PropsWithChildren<DataCardHeaderProps>> = ({
  children,
  className,
}) => (
  <div className={cn('mb-6 flex items-start justify-between', className)}>
    {children}
  </div>
);

type DataCardTitleProps = {
  icon?: LucideIcon;
  image?: string;
  imageAlt?: string;
  images?: string[];
  imageBlurDataURL?: string;
  onImageClick?: () => void;
  className?: string;
};

const DataCardTitle: FC<PropsWithChildren<DataCardTitleProps>> = ({
  children,
  icon: Icon,
  image,
  imageAlt,
  images,
  imageBlurDataURL,
  onImageClick,
  className,
}) => {
  const shouldShowIcon = Icon && !image;
  const shouldShowImage = image && imageAlt;

  return (
    <div className="relative flex w-full items-center gap-3">
      {shouldShowImage && (
        <ProductImage
          alt={imageAlt}
          blurDataURL={imageBlurDataURL}
          className="flex-shrink-0"
          images={images}
          size="md"
          src={image}
          onImageClick={onImageClick}
        />
      )}
      {shouldShowIcon && (
        <div className="from-primary/10 dark:from-primary/15 border-primary/20 dark:border-primary/30 flex h-21 w-21 flex-shrink-0 items-center justify-center [border-radius:var(--radius-surface)] border bg-gradient-to-br to-orange-500/10 dark:to-orange-500/15">
          <Icon className="text-muted-foreground" size={32} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h2
          className={cn(
            'text-foreground line-clamp-2 text-lg font-semibold',
            className
          )}
        >
          {children}
        </h2>
      </div>
    </div>
  );
};

type DataCardContentProps = {
  className?: string;
};

const DataCardContent: FC<PropsWithChildren<DataCardContentProps>> = ({
  children,
  className,
}) => (
  <div className={cn('mb-4 flex flex-1 flex-col gap-2', className)}>
    {children}
  </div>
);

type DataCardFooterProps = {
  className?: string;
};

const DataCardFooter: FC<PropsWithChildren<DataCardFooterProps>> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      'text-primary dark:text-primary group border-border dark:border-border/50 mt-auto flex items-center justify-between border-t px-0 pt-4 pb-3 text-sm font-medium',
      className
    )}
  >
    {children}
  </div>
);

type DataCardContentItemProps = {
  icon: LucideIcon;
};

const DataCardContentItem: FC<PropsWithChildren<DataCardContentItemProps>> = ({
  icon: Icon,
  children,
}) => (
  <div className="text-muted-foreground flex items-center gap-3 text-sm">
    <Icon className="h-4 w-4" />
    <span className="[&>a]:md:group-hover:text-primary [&>a]:transition-all [&>a]:duration-200 [&>a]:hover:!font-medium [&>a]:hover:!text-blue-600 [&>a]:md:group-hover:underline">
      {children}
    </span>
  </div>
);

export const DataCard = Object.assign(DataCardComponent, {
  Header: DataCardHeader,
  Title: DataCardTitle,
  Content: DataCardContent,
  ContentItem: DataCardContentItem,
  Footer: DataCardFooter,
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
  testId,
}) => {
  const router = useRouter();

  const baseClasses = cn(
    // Base layout & behavior
    'group relative cursor-pointer',
    '[margin:calc(var(--density-spacing-md)*-1)] [padding:var(--density-spacing-md)]',
    'rounded-[var(--radius-surface)] border border-transparent',
    'backdrop-blur-sm will-change-transform',

    // Unified transition system 2025
    'transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]',

    // Modern hover states with design system colors
    'md:hover:from-primary/8 dark:md:hover:from-primary/12 md:hover:via-background/60 dark:md:hover:via-card/80 md:hover:to-accent/5 dark:md:hover:to-accent/8 md:hover:bg-gradient-to-r',
    'md:hover:shadow-primary/12 md:hover:shadow-[var(--shadow-card)] dark:md:hover:shadow-black/30',
    'md:hover:border-primary/30 dark:md:hover:border-primary/40 md:hover:-translate-y-0.5 md:hover:scale-[1.001]',
    'md:hover:relative md:hover:z-10',

    // Refined active states
    'active:from-primary/12 dark:active:from-primary/16 active:via-background/70 dark:active:via-card/90 active:to-accent/8 dark:active:to-accent/12 active:bg-gradient-to-r',
    'active:shadow-primary/8 active:shadow-[var(--shadow-surface)] dark:active:shadow-black/20',
    'active:border-primary/40 dark:active:border-primary/50 active:translate-y-0 active:scale-[0.999]',

    // Enhanced focus with design system - only for keyboard navigation
    'focus-visible:ring-primary/60 dark:focus-visible:ring-primary/80 focus:outline-none focus-visible:ring-2',
    'focus-visible:ring-offset-background dark:focus-visible:ring-offset-card focus-visible:ring-offset-2',

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
      role={onClick || href ? 'button' : undefined}
      tabIndex={onClick || href ? 0 : undefined}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
    >
      {/* Invisible navigation overlay with improved accessibility */}
      {href && (
        <Link
          aria-label="Accéder aux détails de cet élément"
          className="absolute inset-0 z-10 block rounded-[var(--radius-surface)]"
          href={href}
          tabIndex={-1}
        />
      )}

      {/* Contenu avec z-index plus élevé */}
      <div className="pointer-events-none relative z-20 flex items-center justify-between">
        <div className="min-w-0 flex-1">{children}</div>

        {/* Modern chevron indicator 2025 */}
        {href && (
          <div className="ml-4 flex-shrink-0 transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)] group-active:translate-x-0.5 group-active:scale-105 md:group-hover:translate-x-1.5 md:group-hover:scale-110">
            <div className="relative">
              {/* Animated background bubble */}
              <div className="from-primary/20 to-accent/15 absolute inset-0 scale-0 rounded-[var(--radius-pill)] bg-gradient-to-r opacity-0 transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.34,1.56,0.64,1)] md:group-hover:scale-150 md:group-hover:opacity-100" />

              {/* Enhanced chevron with micro-interaction */}
              <svg
                className="relative z-10 drop-shadow-sm transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]"
                fill="none"
                height="20"
                viewBox="0 0 24 24"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="text-primary opacity-50 transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)] group-active:opacity-80 md:group-hover:stroke-[3] md:group-hover:opacity-100"
                  d="m9 18 6-6-6-6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Advanced visual effects 2025 */}
      <div className="via-primary/3 dark:via-primary/5 to-accent/2 dark:to-accent/4 pointer-events-none absolute inset-0 rounded-[var(--radius-surface)] bg-gradient-to-r from-transparent opacity-0 transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)] md:group-hover:opacity-100" />

      {/* Shimmer effect on hover */}
      <div className="pointer-events-none absolute inset-0 translate-x-[-100%] rounded-[var(--radius-surface)] bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 transition-all duration-[var(--transition-slow)] ease-out md:group-hover:translate-x-[100%] md:group-hover:opacity-100 dark:via-white/4" />

      {/* Enhanced focus ring */}
      <div className="ring-primary/40 dark:ring-primary/60 ring-offset-background dark:ring-offset-card pointer-events-none absolute inset-0 rounded-[var(--radius-surface)] opacity-0 ring-2 ring-offset-2 transition-all duration-[var(--transition-fast)] ease-out group-focus-within:opacity-100" />
    </div>
  );
};

type DataListItemHeaderProps = {
  className?: string;
};

const DataListItemHeader: FC<PropsWithChildren<DataListItemHeaderProps>> = ({
  children,
  className,
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
  className,
}) => (
  <div
    className={cn(
      // Enhanced content spacing and typography 2025
      'text-muted-foreground space-y-[var(--density-spacing-sm)] text-sm',
      'transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]',
      'md:group-hover:text-foreground/95 md:group-hover:scale-[1.01]',
      'group-active:text-foreground/85',
      className
    )}
  >
    {children}
  </div>
);

type DataListItemActionsProps = {
  className?: string;
};

const DataListItemActions: FC<PropsWithChildren<DataListItemActionsProps>> = ({
  children,
  className,
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
        'border-border/30 dark:border-border/20 pointer-events-auto border-t',
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
  Actions: DataListItemActions,
});
