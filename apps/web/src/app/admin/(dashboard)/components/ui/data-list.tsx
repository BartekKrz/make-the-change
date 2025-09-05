'use client';

import type { FC, PropsWithChildren, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/app/admin/(dashboard)/components/cn';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ProductImage } from '@/components/images/product-image';

// Skeleton pour les cards de la vue grid - correspond exactement à DataCard
const DataCardSkeleton = () => (
  <div className="group relative bg-background backdrop-blur-md rounded-2xl border border-border/60 p-6 shadow-lg overflow-hidden h-full flex flex-col">
    {/* Header skeleton - DataCard.Header > DataCard.Title */}
    <div className="mb-4">
      {/* Icon + Image + Titre en une ligne (comme DataCard.Title) */}
      <div className="flex items-start gap-3">
        {/* Package icon */}
        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse mt-0.5 flex-shrink-0" />
        
        {/* Product image (carrée comme dans les vraies cards) */}
        <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
        
        {/* Title section - texte vertical aligné avec l'image */}
        <div className="flex-1 min-w-0">
          {/* Ligne 1: Nom + slug */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
          {/* Ligne 2: Badge + star */}
          <div className="flex items-center gap-2">
            <div className="w-12 h-5 bg-gray-200 rounded-full animate-pulse" />
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
    
    {/* Content skeleton - DataCard.Content */}
    <div className="flex-1 space-y-3 mb-4">
      {/* Prix - Zap + texte */}
      <div className="flex items-center gap-3 text-sm">
        <div className="w-3.5 h-3.5 bg-gray-200 rounded animate-pulse" />
        <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
      </div>
      
      {/* Stock - Box + texte */}
      <div className="flex items-center gap-3 text-sm">
        <div className="w-3.5 h-3.5 bg-gray-200 rounded animate-pulse" />
        <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
      </div>
      
      {/* Producer badge */}
      <div className="flex items-center gap-3">
        <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
    
    {/* Footer skeleton - DataCard.Footer */}
    <div className="space-y-2">
      {/* Boutons stock +1/-1 */}
      <div className="flex items-center gap-1 md:gap-2">
        <div className="w-8 h-6 bg-gray-200 rounded animate-pulse" />
        <div className="w-8 h-6 bg-gray-200 rounded animate-pulse" />
      </div>
      
      {/* Boutons Feature/Active */}
      <div className="flex items-center gap-1 md:gap-2 flex-wrap">
        <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
        <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

export type DataListProps<T> = {
  items: T[];
  renderItem: (item: T) => ReactNode;
  getItemKey?: (item: T, index: number) => string | number;
  emptyState?: {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: ReactNode;
  };
  isLoading?: boolean;
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
  items,
  renderItem,
  getItemKey,
  className,
  gridCols = 2,
  spacing = 'md',
  testId = 'data-list',
  emptyState,
  isLoading = false
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

  if (isLoading) return (
    <div className={cn('space-y-6', className)} data-testid={testId}>
      <div className={cn('grid', getGridClasses(gridCols), getSpacingClasses(spacing), 'items-stretch')}>
        {Array.from({ length: gridCols * 2 }).map((_, index) => (
          <DataCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );

  if (items.length === 0 && emptyState) {
    const EmptyIcon = emptyState.icon;
    return (
      <div className={cn('space-y-6', className)} data-testid={testId}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-center py-12'
        >
          {EmptyIcon && (
            <div className='flex items-center justify-center mb-4'>
              <div className='p-4 bg-muted/30 rounded-2xl'>
                <EmptyIcon className='w-8 h-8 text-muted-foreground' />
              </div>
            </div>
          )}
          <h3 className='text-lg font-semibold text-foreground mb-2'>{emptyState.title}</h3>
          {emptyState.description && (
            <p className='text-muted-foreground mb-6 max-w-md mx-auto'>{emptyState.description}</p>
          )}
          {emptyState.action}
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)} data-testid={testId}>
      <div className={cn('grid', getGridClasses(gridCols), getSpacingClasses(spacing), 'items-stretch')}>
        {items.map((item, index) => (
          <div key={getKey(item, index)} className='h-full'>
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
};

export type DataCardProps = {
  className?: string;
  href?: string;
  onClick?: () => void;
  testId?: string;
  prefetch?: boolean | null;
  image?: string;
  imageAlt?: string;
};

const DataCardComponent: FC<PropsWithChildren<DataCardProps>> = ({
  children,
  className,
  href,
  onClick,
  testId,
  prefetch = null,
  image,
  imageAlt
}) => {
  const router = useRouter();

  useEffect(() => {
    if (href && prefetch !== false) {
      router.prefetch(href);
    }
  }, [href, prefetch, router]);
  const baseClasses =
    'group relative bg-background backdrop-blur-md rounded-2xl border border-border/60 p-6 shadow-lg overflow-hidden transition-[border-color,box-shadow,backdrop-filter,outline] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] h-full flex flex-col';

  const motionProps = {
    whileHover: {
      y: -4,
      scale: 1.01
    },
    transition: {
      type: 'spring' as const,
      stiffness: 500,
      damping: 30,
      mass: 0.8
    }
  };

  const CardContent = () => (
    <>
      {/* Image de fond optionnelle */}
      {image && imageAlt && (
        <div className='absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl opacity-10 md:group-hover:opacity-20 transition-opacity duration-300'>
          <Image
            src={image}
            alt={imageAlt}
            fill
            className='object-cover scale-110'
            unoptimized={image.includes('unsplash') || image.includes('supabase')}
          />
        </div>
      )}
      
      {}
      <div className='relative [&_a]:relative [&_a]:z-10 [&_button]:relative [&_button]:z-10'>{children}</div>

      {}
      <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-background/20 to-orange-500/5 opacity-0 md:group-hover:opacity-100 group-active:opacity-60 transition-opacity duration-300' />
      <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-background/30 via-background/20 to-background/30' />
      <div className='absolute inset-0 rounded-2xl shadow-2xl shadow-primary/20 opacity-0 md:group-hover:opacity-100 group-active:opacity-50 transition-opacity duration-300 -z-10' />
    </>
  );

  if (href) {
    const handleCardClick = (event: React.MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('a[href]') || target.closest('button')) {
        return;
      }

      router.push(href);
      onClick?.();
    };

    return (
      <motion.div
        className={cn(
          baseClasses,
          className,
          'cursor-pointer',
          'md:hover:border-primary-200/50 md:hover:shadow-[0_0_0_1px_rgb(59_130_246_/_0.4),0_0_0_2px_rgb(251_146_60_/_0.2)]'
        )}
        data-testid={testId}
        onClick={handleCardClick}
        {...motionProps}
      >
        <CardContent />
      </motion.div>
    );
  }

  const handleCardClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('a[href]') || target.closest('button')) {
      return;
    }

    onClick?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick(event as any);
    }
  };

  return (
    <motion.div
      className={cn(
        baseClasses,
        className,
        onClick && 'cursor-pointer',
        'md:hover:border-primary-200/50 md:hover:shadow-[0_0_0_1px_rgb(59_130_246_/_0.4),0_0_0_2px_rgb(251_146_60_/_0.2)]'
      )}
      data-testid={testId}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...motionProps}
    >
      <CardContent />
    </motion.div>
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
        <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-orange-500/10 flex items-center justify-center border border-primary/20 flex-shrink-0'>
          <Icon size={20} className='text-muted-foreground' />
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
  <div className={cn('flex flex-col gap-y-1 flex-wrap gap-x-4 mt-6 mb-6 space-y-4 flex-grow', className)}>
    {children}
  </div>
);

type DataCardFooterProps = {
  className?: string;
};

const DataCardFooter: FC<PropsWithChildren<DataCardFooterProps>> = ({ children, className }) => (
  <div
    className={cn(
      'border-t p-3 text-primary flex items-center justify-between text-sm font-medium group border-border pt-4 mt-auto',
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
