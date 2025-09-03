'use client';

import { useState, useEffect } from 'react';
import { FC } from 'react';
import { Package, Star, Info, ChevronDown, ChevronUp, CheckCircle, AlertCircle, Save, Building, Dot, Upload } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { trpc } from '@/lib/trpc';
import { cn } from '@/app/admin/(dashboard)/components/cn';
import { Button } from '@/app/admin/(dashboard)/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/app/admin/(dashboard)/components/ui/dialog';
import type { SaveStatus } from '@/app/admin/(dashboard)/products/[id]/types';

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
  saveStatus?: SaveStatus;
  onSaveAll?: () => void;
  onStatusChange?: (newStatus: 'active' | 'inactive') => void;
};

/**
 * Guide d'utilisation du ProductCompactHeader :
 * 
 * SaveStatus amélioré :
 * - 'pristine': Aucune modification → Rien n'est affiché
 * - 'modified': Modifications en attente → Badge compact amber avec compteur
 * - 'saving': Sauvegarde en cours → Badge bleu avec animation
 * - 'saved': Succès → Badge vert qui devrait auto-disappear après 2-3s
 * - 'error': Erreur → Badge rouge persistant avec ring d'attention
 * 
 * Pour l'auto-reset du succès, utiliser un useEffect dans le parent :
 * useEffect(() => {
 *   if (saveStatus?.type === 'saved') {
 *     const timer = setTimeout(() => setSaveStatus(null), 2500);
 *     return () => clearTimeout(timer);
 *   }
 * }, [saveStatus]);
 * 
 * Toggle de statut :
 * - Le badge statut devient cliquable si onStatusChange est fourni
 * - Confirmation automatique avant changement
 * - Feedback visuel pendant la transition
 * - États disabled pendant le changement
 */

export const ProductCompactHeader: FC<ProductCompactHeaderProps> = ({
  productData,
  saveStatus,
  onSaveAll,
  onStatusChange
}) => {
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<'active' | 'inactive' | null>(null);
  
  // Récupération des données du partenaire directement avec l'UUID
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


  // Helper pour afficher le nom du partenaire
  const getPartnerDisplayName = (): string => {
    if (partner?.name) {
      return partner.name;
    }
    
    if (!productData.producer_id) {
      return 'Aucun partenaire';
    }
    
    if (shouldFetchPartner) {
      if (partnerLoading) {
        return 'Chargement...';
      }
      if (partnerError) {
        return `Partenaire introuvable`;
      }
    }
    
    // Si aucun mapping n'a été trouvé
    return `${productData.producer_id}`;
  };

  // Fonction pour ouvrir la modal de confirmation
  const handleStatusToggle = () => {
    if (!onStatusChange) return;
    
    const currentStatus = productData.is_active ? 'active' : 'inactive';
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    setPendingStatusChange(newStatus);
    setShowConfirmModal(true);
  };

  // Fonction pour confirmer le changement de statut
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

  // Fonction pour annuler le changement
  const cancelStatusChange = () => {
    setShowConfirmModal(false);
    setPendingStatusChange(null);
  };

  // Composant pour l'indicateur de statut de sauvegarde moderne et subtil
  const SaveStatusIndicator = () => {
    if (!saveStatus) return null;

    // Mapping des anciens types vers les nouveaux pour compatibilité
    const mapLegacyType = (type: string) => {
      const mapping: Record<string, string> = {
        'idle': 'pristine',
        'pending': 'modified'
      };
      return mapping[type] || type;
    };

    const normalizedType = mapLegacyType(saveStatus.type);

    const statusConfig = {
      pristine: { 
        icon: null,
        color: 'text-gray-400', 
        bgColor: '', 
        show: false,
        message: '',
        compact: false,
        animate: false,
        temporary: false,
        priority: false
      },
      modified: { 
        icon: Dot,
        color: 'text-amber-500', 
        bgColor: 'bg-amber-50/80', 
        show: true,
        message: 'Modifications non sauvegardées',
        compact: true,
        animate: false,
        temporary: false,
        priority: false
      },
      saving: { 
        icon: Upload,
        color: 'text-blue-500', 
        bgColor: 'bg-blue-50/80', 
        show: true,
        message: 'Sauvegarde...',
        compact: false,
        animate: true,
        temporary: false,
        priority: false
      },
      saved: { 
        icon: CheckCircle,
        color: 'text-emerald-500', 
        bgColor: 'bg-emerald-50/80', 
        show: true,
        message: 'Sauvegardé',
        compact: false,
        animate: false,
        temporary: true,
        priority: false
      },
      error: { 
        icon: AlertCircle,
        color: 'text-red-500', 
        bgColor: 'bg-red-50/80', 
        show: true,
        message: saveStatus.message || 'Erreur de sauvegarde',
        compact: false,
        animate: false,
        temporary: false,
        priority: true
      }
    };

    const config = statusConfig[normalizedType as keyof typeof statusConfig];
    
    // N'affiche rien si le config n'existe pas, si pristine ou si le statut ne doit pas être montré
    if (!config || !config.show) return null;

    const Icon = config.icon;

    // Version compacte pour 'modified'
    if (config.compact) {
      return (
        <div className={cn(
          'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200',
          config.bgColor,
          config.color
        )}>
          {Icon && <Icon size={12} className="shrink-0" />}
          <span className="hidden sm:inline truncate">
            {saveStatus.count && saveStatus.count > 0 
              ? `${saveStatus.count} modification${saveStatus.count > 1 ? 's' : ''}`
              : config.message
            }
          </span>
          {saveStatus.count && saveStatus.count > 0 && onSaveAll && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onSaveAll}
              className="ml-1 px-1.5 py-0.5 h-5 text-xs hover:bg-amber-100"
            >
              <Save size={10} className="mr-0.5" />
              <span className="hidden md:inline">Sauvegarder</span>
            </Button>
          )}
        </div>
      );
    }

    // Version normale pour saving/saved/error
    return (
      <div className={cn(
        'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm font-medium transition-all duration-300',
        config.bgColor,
        config.color,
        config.temporary && 'animate-in fade-in slide-in-from-right-2',
        config.priority && 'ring-1 ring-current ring-opacity-20'
      )}>
        {Icon && (
          <Icon 
            size={14} 
            className={cn(
              'shrink-0',
              config.animate && 'animate-pulse'
            )} 
          />
        )}
        <span className="truncate max-w-[180px]">{config.message}</span>
      </div>
    );
  };

  return (
    <div className='max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6 pb-3 md:pb-4'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6'>
        {}
        <div className='flex items-start md:items-center gap-3 md:gap-4 flex-1 min-w-0'>
          {productData.images && productData.images.length > 0 ? (
            <div className='relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 to-orange-500/10'>
              <Image
                src={productData.images[0]}
                alt={productData.name}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 48px, 64px'
              />
            </div>
          ) : (
            <div className='p-2 md:p-3 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-xl border border-primary/20 backdrop-blur-sm flex-shrink-0'>
              <Package className='h-5 w-5 md:h-6 md:w-6 text-primary' />
            </div>
          )}

          <div className='flex-1 min-w-0'>
            {}
            <h1 className='text-lg md:text-2xl font-bold text-foreground leading-tight truncate mb-2 md:mb-2'>
              {productData.name}
            </h1>

            {}
            <div className='flex md:hidden items-center gap-2 flex-wrap'>
              <button
                onClick={handleStatusToggle}
                disabled={!onStatusChange || isChangingStatus}
                className={cn(
                  'flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium border transition-all duration-200',
                  `bg-gradient-to-r ${statusInfo.bgClass} ${statusInfo.borderClass}`,
                  onStatusChange && !isChangingStatus && 'hover:scale-105 hover:shadow-sm cursor-pointer',
                  !onStatusChange && 'cursor-default',
                  isChangingStatus && 'opacity-50 cursor-wait'
                )}
                title={onStatusChange ? `Cliquer pour ${productData.is_active ? 'désactiver' : 'activer'} le produit` : undefined}
              >
                <div className={cn(
                  'w-2 h-2 rounded-full transition-transform', 
                  statusInfo.color,
                  isChangingStatus && 'animate-pulse'
                )} />
                {isChangingStatus ? 'Changement...' : statusInfo.label}
              </button>

              {productData.featured && (
                <div className='flex items-center gap-1 px-2 py-1 bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 rounded-full text-xs font-medium'>
                  <Star className='h-3 w-3' />
                  <span>Vedette</span>
                </div>
              )}
            </div>

            {}
            <div className='hidden md:flex items-center gap-4 flex-wrap'>
              <button
                onClick={handleStatusToggle}
                disabled={!onStatusChange || isChangingStatus}
                className={cn(
                  'flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200',
                  `bg-gradient-to-r ${statusInfo.bgClass} ${statusInfo.borderClass}`,
                  onStatusChange && !isChangingStatus && 'hover:scale-105 hover:shadow-sm cursor-pointer',
                  !onStatusChange && 'cursor-default',
                  isChangingStatus && 'opacity-50 cursor-wait'
                )}
                title={onStatusChange ? `Cliquer pour ${productData.is_active ? 'désactiver' : 'activer'} le produit` : undefined}
              >
                <div className={cn(
                  'w-2 h-2 rounded-full transition-transform', 
                  statusInfo.color,
                  isChangingStatus && 'animate-pulse'
                )} />
                {isChangingStatus ? 'Changement...' : statusInfo.label}
              </button>

              {productData.featured && (
                <div className='flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 rounded-full text-xs font-medium'>
                  <Star className='h-3 w-3' />
                  En vedette
                </div>
              )}

              {shouldFetchPartner && partner ? (
                <Link 
                  href={`/admin/partners/${productData.producer_id}`}
                  className='flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-full text-xs font-medium hover:from-blue-500/15 hover:to-blue-600/10 transition-colors duration-200'
                  title={`Voir le partenaire ${partner.name}`}
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

        {}
        <div className='flex items-center gap-2 flex-shrink-0 self-start md:self-auto'>
          {}
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

          {}
          <SaveStatusIndicator />
        </div>
      </div>

      {}
      {showMobileDetails && (
        <div className='flex md:hidden mt-3 pt-3 border-t border-border/30 animate-in slide-in-from-top-2 duration-200 ease-out'>
          <div className='flex items-center gap-2 text-xs text-muted-foreground flex-wrap'>
            {shouldFetchPartner && partner ? (
              <Link 
                href={`/admin/partners/${productData.producer_id}`}
                className='flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-full text-xs font-medium'
                title={`Voir le partenaire ${partner.name}`}
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

      {/* Modal de confirmation pour changement de statut */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent size="sm" className="max-w-md bg-white dark:bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle>
              {pendingStatusChange === 'active' ? 'Activer' : 'Désactiver'} le produit
            </DialogTitle>
            <DialogDescription>
              {pendingStatusChange === 'active'
                ? 'Le produit sera visible dans la boutique et disponible à la vente.'
                : 'Le produit sera retiré de la boutique et ne sera plus disponible à la vente.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              {productData.images && productData.images.length > 0 ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                  <Image
                    src={productData.images[0]}
                    alt={productData.name}
                    fill
                    className="object-cover"
                    sizes="64px"
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
              Annuler
            </Button>
            <Button 
              onClick={confirmStatusChange}
              variant={pendingStatusChange === 'active' ? 'default' : 'destructive'}
            >
              {pendingStatusChange === 'active' ? 'Activer' : 'Désactiver'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
