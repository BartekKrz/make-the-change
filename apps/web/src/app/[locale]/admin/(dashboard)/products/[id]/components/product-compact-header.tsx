'use client';

import { Package, Star, Info, ChevronDown, ChevronUp, Building } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { type FC, useState } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/app/[locale]/admin/(dashboard)/components/ui/dialog';
import type { SaveStatus } from '@/app/[locale]/admin/(dashboard)/products/[id]/types';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

import { SaveStatusIndicator } from './save-status-indicator';

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
  saveStatus?: SaveStatus | null;
  onSaveAll?: () => void;
  onStatusChange?: (newStatus: 'active' | 'inactive') => void;
};

export const ProductCompactHeader: FC<ProductCompactHeaderProps> = ({
  productData,
  saveStatus,
  onSaveAll,
  onStatusChange
}) => {
  const t = useTranslations();
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<'active' | 'inactive' | null>(null);
  
  const shouldFetchPartner = !!productData.producer_id;
  
  const { data: partner, error: partnerError, isLoading: partnerLoading } = trpc.admin.partners.byId.useQuery(
    { id: productData.producer_id },
    {
      enabled: shouldFetchPartner,
      retry: 1,
    }
  );

  const getProductStatus = (): 'active' | 'inactive' => {
    return productData.is_active ? 'active' : 'inactive';
  };

  const status = getProductStatus();

  const statusConfig = {
    active: {
      label: t('admin.products.status.active'),
      color: 'bg-green-500',
      bgClass: 'from-green-500/10 to-green-600/5',
      borderClass: 'border-green-500/20'
    },
    inactive: {
      label: t('admin.products.status.inactive'),
      color: 'bg-gray-500',
      bgClass: 'from-gray-500/10 to-gray-600/5',
      borderClass: 'border-gray-500/20'
    }
  };

  const statusInfo = statusConfig[status];

  const getPartnerDisplayName = (): string => {
    if (partner?.name) return partner.name;
    if (!productData.producer_id) return t('admin.products.partner.none');
    if (shouldFetchPartner) {
      if (partnerLoading) return t('admin.products.partner.loading');
      if (partnerError) return t('admin.products.partner.not_found');
    }
    return `${productData.producer_id}`;
  };

  const handleStatusToggle = () => {
    if (!onStatusChange) return;
    const newStatus = productData.is_active ? 'inactive' : 'active';
    setPendingStatusChange(newStatus);
    setShowConfirmModal(true);
  };

  const confirmStatusChange = async () => {
    if (!onStatusChange || !pendingStatusChange) return;
    setShowConfirmModal(false);
    setIsChangingStatus(true);
    try {
      await onStatusChange(pendingStatusChange);
    } finally {
      setIsChangingStatus(false);
      setPendingStatusChange(null);
    }
  };

  const cancelStatusChange = () => {
    setShowConfirmModal(false);
    setPendingStatusChange(null);
  };

  return (
    <div className='max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6 pb-3 md:pb-4'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6'>
        <div className='flex items-start md:items-center gap-3 md:gap-4 flex-1 min-w-0'>
          {productData.images && productData.images.length > 0 ? (
            <div className='relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 to-orange-500/10'>
              <Image
                fill
                alt={productData.name}
                className='object-cover'
                sizes='(max-width: 768px) 48px, 64px'
                src={productData.images[0]}
              />
            </div>
          ) : (
            <div className='p-2 md:p-3 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-xl border border-primary/20 backdrop-blur-sm flex-shrink-0'>
              <Package className='h-5 w-5 md:h-6 md:w-6 text-primary' />
            </div>
          )}

          <div className='flex-1 min-w-0'>
            <h1 className='text-lg md:text-2xl font-bold text-foreground leading-tight truncate mb-2 md:mb-2'>
              {productData.name}
            </h1>

            <div className='flex md:hidden items-center gap-2 flex-wrap'>
              <button
                disabled={!onStatusChange || isChangingStatus}
                className={cn(
                  'flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium border transition-all duration-200',
                  `bg-gradient-to-r ${statusInfo.bgClass} ${statusInfo.borderClass}`,
                  onStatusChange && !isChangingStatus && 'hover:scale-105 hover:shadow-sm cursor-pointer',
                  !onStatusChange && 'cursor-default',
                  isChangingStatus && 'opacity-50 cursor-wait'
                )}
                title={onStatusChange ? t('admin.products.status.toggle_tooltip', { 
                  action: productData.is_active ? t('admin.products.status.deactivate') : t('admin.products.status.activate')
                }) : undefined}
                onClick={handleStatusToggle}
              >
                <div className={cn('w-2 h-2 rounded-full transition-transform', statusInfo.color, isChangingStatus && 'animate-pulse')} />
                {isChangingStatus ? t('admin.products.status.changing') : statusInfo.label}
              </button>

              {productData.featured && (
                <div className='flex items-center gap-1 px-2 py-1 bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 rounded-full text-xs font-medium'>
                  <Star className='h-3 w-3' />
                  <span>{t('admin.products.featured.short')}</span>
                </div>
              )}
            </div>

            <div className='hidden md:flex items-center gap-4 flex-wrap'>
              <button
                disabled={!onStatusChange || isChangingStatus}
                className={cn(
                  'flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200',
                  `bg-gradient-to-r ${statusInfo.bgClass} ${statusInfo.borderClass}`,
                  onStatusChange && !isChangingStatus && 'hover:scale-105 hover:shadow-sm cursor-pointer',
                  !onStatusChange && 'cursor-default',
                  isChangingStatus && 'opacity-50 cursor-wait'
                )}
                title={onStatusChange ? t('admin.products.status.toggle_tooltip', { 
                  action: productData.is_active ? t('admin.products.status.deactivate') : t('admin.products.status.activate')
                }) : undefined}
                onClick={handleStatusToggle}
              >
                <div className={cn('w-2 h-2 rounded-full transition-transform', statusInfo.color, isChangingStatus && 'animate-pulse')} />
                {isChangingStatus ? t('admin.products.status.changing') : statusInfo.label}
              </button>

              {productData.featured && (
                <div className='flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 rounded-full text-xs font-medium'>
                  <Star className='h-3 w-3' />
{t('admin.products.featured.full')}
                </div>
              )}

              {shouldFetchPartner && partner ? (
                <Link 
                  className='flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-full text-xs font-medium hover:from-blue-500/15 hover:to-blue-600/10 transition-colors duration-200'
                  href={`/admin/partners/${productData.producer_id}`}
                  title={t('admin.products.partner.view_tooltip', { name: partner.name })}
                >
                  <Building className='h-3 w-3' />
                  <span className="text-blue-600 hover:text-blue-700">{getPartnerDisplayName()}</span>
                </Link>
              ) : (
                <div className='flex items-center gap-2 px-3 py-1 bg-gray-500/10 border border-gray-500/20 rounded-full text-xs font-medium'>
                  <Building className='h-3 w-3' />
                  <span className="text-gray-600">{getPartnerDisplayName()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2 flex-shrink-0 self-start md:self-auto'>
          <button
            aria-label={showMobileDetails ? t('admin.products.details.hide') : t('admin.products.details.show')}
            className='flex md:hidden items-center gap-1 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md border border-border/40 hover:border-border/60'
            onClick={() => setShowMobileDetails(!showMobileDetails)}
          >
            <Info className='h-3 w-3' />
            {showMobileDetails ? (
              <ChevronUp className='h-3 w-3 transition-transform duration-200' />
            ) : (
              <ChevronDown className='h-3 w-3 transition-transform duration-200' />
            )}
          </button>

          <SaveStatusIndicator saveStatus={saveStatus} onSaveAll={onSaveAll} />
        </div>
      </div>

      {showMobileDetails && (
        <div className='flex md:hidden mt-3 pt-3 border-t border-border/30 animate-in slide-in-from-top-2 duration-200 ease-out'>
          <div className='flex items-center gap-2 text-xs text-muted-foreground flex-wrap'>
            {shouldFetchPartner && partner ? (
              <Link 
                className='flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-full text-xs font-medium'
                href={`/admin/partners/${productData.producer_id}`}
                title={t('admin.products.partner.view_tooltip', { name: partner.name })}
              >
                <Building className='h-3 w-3' />
                <span className="text-blue-600">{getPartnerDisplayName()}</span>
              </Link>
            ) : (
              <div className='flex items-center gap-1 px-2 py-1 bg-gray-500/10 border border-gray-500/20 rounded-full text-xs font-medium'>
                <Building className='h-3 w-3' />
                <span className="text-gray-600">{getPartnerDisplayName()}</span>
              </div>
            )}
            <div className='px-2 py-1 bg-gradient-to-r from-primary/10 to-orange-500/10 text-primary border border-primary/20 rounded-full text-xs font-medium'>
              #{productData.id}
            </div>
          </div>
        </div>
      )}

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md bg-white dark:bg-white border-gray-200" size="sm">
          <DialogHeader>
            <DialogTitle>
              {t('admin.products.status.modal.title', { 
                action: pendingStatusChange === 'active' ? t('admin.products.status.activate') : t('admin.products.status.deactivate')
              })}
            </DialogTitle>
            <DialogDescription>
              {pendingStatusChange === 'active'
                ? t('admin.products.status.modal.description.activate')
                : t('admin.products.status.modal.description.deactivate')
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              {productData.images && productData.images.length > 0 ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                  <Image
                    fill
                    alt={productData.name}
                    className="object-cover"
                    sizes="64px"
                    src={productData.images[0]}
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                  <Package className="h-8 w-8 text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base truncate text-gray-900">{productData.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  ID: {productData.id}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={cancelStatusChange}>
              {t('admin.products.status.modal.cancel')}
            </Button>
            <Button 
              variant={pendingStatusChange === 'active' ? 'default' : 'destructive'}
              onClick={confirmStatusChange}
            >
              {pendingStatusChange === 'active' ? t('admin.products.status.activate') : t('admin.products.status.deactivate')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};