'use client';

import { useState } from 'react';
import { FC } from 'react';
import { Package, Star, ShoppingCart, Calendar, Edit, X, Save, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/app/admin/(dashboard)/components/cn';
import { Button } from '@/app/admin/(dashboard)/components/ui/button';

type ProductData = {
  id: string;
  name: string;
  slug: string;
  price_points: number;
  short_description?: string;
  description?: string;
  stock_quantity: number;
  is_active: boolean;
  featured: boolean;
  fulfillment_method: string;
  min_tier: string;
  category_id: string;
  producer_id: string;
  images?: string[];
};

type ProductCompactHeaderProps = {
  productData: ProductData;
  isEditing?: boolean;
  onEditToggle?: (editing: boolean) => void;
  onSave?: () => void;
  isSaving?: boolean;
};

export const ProductCompactHeader: FC<ProductCompactHeaderProps> = ({
  productData,
  isEditing = false,
  onEditToggle,
  onSave,
  isSaving = false
}) => {
  const [showMobileDetails, setShowMobileDetails] = useState(false);

  const getProductStatus = (): 'active' | 'inactive' => {
    return productData.is_active ? 'active' : 'inactive';
  };

  const status = getProductStatus();

  const statusConfig = {
    active: {
      label: 'Actif',
      color: 'bg-green-500',
      bgClass: 'from-green-500/10 to-green-600/5',
      borderClass: 'border-green-500/20'
    },
    inactive: {
      label: 'Inactif',
      color: 'bg-gray-500',
      bgClass: 'from-gray-500/10 to-gray-600/5',
      borderClass: 'border-gray-500/20'
    }
  };

  const statusInfo = statusConfig[status];

  const formatPricePoints = (): string => {
    return `${productData.price_points} points`;
  };

  const formatStock = (): string => {
    return `${productData.stock_quantity} en stock`;
  };

  return (
    <div className='max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6 pb-3 md:pb-4'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6'>
        {}
        <div className='flex items-start md:items-center gap-3 md:gap-4 flex-1 min-w-0'>
          <div className='p-2 md:p-3 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-xl border border-primary/20 backdrop-blur-sm flex-shrink-0'>
            <Package className='h-5 w-5 md:h-6 md:w-6 text-primary' />
          </div>

          <div className='flex-1 min-w-0'>
            {}
            <h1 className='text-lg md:text-2xl font-bold text-foreground leading-tight truncate mb-2 md:mb-2'>
              {productData.name}
            </h1>

            {}
            <div className='flex md:hidden items-center gap-2 flex-wrap'>
              <div
                className={cn(
                  'flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium border',
                  `bg-gradient-to-r ${statusInfo.bgClass} ${statusInfo.borderClass}`
                )}
              >
                <div className={cn('w-2 h-2 rounded-full', statusInfo.color)} />
                {statusInfo.label}
              </div>

              <div className='flex items-center gap-1 px-2 py-1 bg-muted/40 rounded-full text-xs font-medium text-muted-foreground'>
                {formatPricePoints()}
              </div>
            </div>

            {}
            <div className='hidden md:flex items-center gap-4 flex-wrap'>
              <div
                className={cn(
                  'flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border',
                  `bg-gradient-to-r ${statusInfo.bgClass} ${statusInfo.borderClass}`
                )}
              >
                <div className={cn('w-2 h-2 rounded-full', statusInfo.color)} />
                {statusInfo.label}
              </div>

              <div className='flex items-center gap-2 px-3 py-1 bg-muted/40 rounded-full text-xs font-medium'>
                <ShoppingCart className='h-3 w-3' />
                {formatPricePoints()}
              </div>

              <div className='flex items-center gap-2 px-3 py-1 bg-muted/40 rounded-full text-xs font-medium'>
                <Package className='h-3 w-3' />
                {formatStock()}
              </div>

              {productData.featured && (
                <div className='flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 rounded-full text-xs font-medium'>
                  <Star className='h-3 w-3' />
                  En vedette
                </div>
              )}

              <div className='flex items-center gap-2 px-3 py-1 bg-muted/40 rounded-full text-xs font-medium'>
                <Calendar className='h-3 w-3' />
                {productData.min_tier}
              </div>

              <div className='px-3 py-1 bg-gradient-to-r from-primary/10 to-orange-500/10 text-primary border border-primary/20 rounded-full text-xs font-medium'>
                #{productData.id}
              </div>
            </div>
          </div>
        </div>

        {}
        <div className='flex items-center gap-2 flex-shrink-0 self-start md:self-auto'>
          {}
          {!isEditing && (
            <button
              onClick={() => setShowMobileDetails(!showMobileDetails)}
              className='flex md:hidden items-center gap-1 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md border border-border/40 hover:border-border/60'
              aria-label={showMobileDetails ? 'Masquer les détails' : 'Afficher les détails'}
            >
              <Info className='h-3 w-3' />
              {showMobileDetails ? (
                <ChevronUp className='h-3 w-3 transition-transform duration-200' />
              ) : (
                <ChevronDown className='h-3 w-3 transition-transform duration-200' />
              )}
            </button>
          )}

          {onEditToggle && (
            <>
              {isEditing ? (
                <>
                  {}
                  <div className='flex md:hidden items-center gap-2'>
                    <Button
                      variant='outline'
                      size='default'
                      onClick={() => onEditToggle(false)}
                      disabled={isSaving}
                      className='text-sm font-medium px-4 py-2 min-h-[40px] min-w-[80px]'
                    >
                      <X className='h-4 w-4 mr-1' />
                      Annuler
                    </Button>
                    <Button
                      variant='default'
                      size='default'
                      onClick={onSave}
                      disabled={isSaving}
                      className='text-sm font-medium px-4 py-2 min-h-[40px] min-w-[100px] bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80'
                    >
                      <Save className='h-4 w-4 mr-1' />
                      {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </Button>
                  </div>

                  {}
                  <div className='hidden md:flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => onEditToggle(false)}
                      disabled={isSaving}
                      className='text-sm'
                    >
                      <X className='h-4 w-4 mr-1' />
                      Annuler
                    </Button>
                    <Button
                      variant='default'
                      size='sm'
                      onClick={onSave}
                      disabled={isSaving}
                      className='text-sm'
                    >
                      <Save className='h-4 w-4 mr-1' />
                      Sauvegarder
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {}
                  <Button
                    variant='outline'
                    size='default'
                    onClick={() => onEditToggle(true)}
                    className='flex md:hidden text-sm font-medium px-4 py-2 min-h-[40px] min-w-[80px] border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50'
                  >
                    <Edit className='h-4 w-4 mr-1' />
                    Éditer
                  </Button>

                  {}
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => onEditToggle(true)}
                    className='hidden md:flex text-sm'
                  >
                    <Edit className='h-4 w-4 mr-1' />
                    Modifier
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {}
      {showMobileDetails && (
        <div className='flex md:hidden mt-3 pt-3 border-t border-border/30 animate-in slide-in-from-top-2 duration-200 ease-out'>
          <div className='flex items-center gap-2 text-xs text-muted-foreground flex-wrap'>
            <div className='flex items-center gap-1 px-2 py-1 bg-muted/30 rounded-full'>
              <Package className='h-3 w-3' />
              <span>{formatStock()}</span>
            </div>
            {productData.featured && (
              <div className='flex items-center gap-1 px-2 py-1 bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 rounded-full'>
                <Star className='h-3 w-3' />
                <span>Vedette</span>
              </div>
            )}
            <div className='flex items-center gap-1 px-2 py-1 bg-muted/30 rounded-full'>
              <Calendar className='h-3 w-3' />
              <span>{productData.min_tier}</span>
            </div>
            <div className='px-2 py-1 bg-gradient-to-r from-primary/10 to-orange-500/10 text-primary border border-primary/20 rounded-full text-xs font-medium'>
              #{productData.id}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
