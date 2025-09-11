'use client';

import { ShoppingCart, User, Calendar, DollarSign, Edit, X, Save } from 'lucide-react';
import { type FC } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { Button } from '@/components/ui/button';

type OrderData = { id: string; customerName: string; status: string; createdAt: string; total?: number; };
type OrderCompactHeaderProps = { orderData: OrderData; isEditing?: boolean; onEditToggle?: (editing: boolean) => void; onSave?: () => void; isSaving?: boolean; };

export const OrderCompactHeader: FC<OrderCompactHeaderProps> = ({ orderData, isEditing = false, onEditToggle, onSave, isSaving = false }) => {
  const statusConfig = {
    pending: { label: 'En attente', color: 'bg-yellow-500', bgClass: 'from-yellow-500/10', borderClass: 'border-yellow-500/20' },
    shipped: { label: 'Expédiée', color: 'bg-blue-500', bgClass: 'from-blue-500/10', borderClass: 'border-blue-500/20' },
    delivered: { label: 'Livrée', color: 'bg-green-500', bgClass: 'from-green-500/10', borderClass: 'border-green-500/20' },
    cancelled: { label: 'Annulée', color: 'bg-red-500', bgClass: 'from-red-500/10', borderClass: 'border-red-500/20' },
  };
  const statusInfo = statusConfig[orderData.status as keyof typeof statusConfig] || { label: 'Inconnu', color: 'bg-gray-500', bgClass: 'from-gray-500/10', borderClass: 'border-gray-500/20' };

  return (
    <div className='max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6 pb-3 md:pb-4'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6'>
        <div className='flex items-start md:items-center gap-3 md:gap-4 flex-1 min-w-0'>
          <div className='p-2 md:p-3 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-xl border border-primary/20 backdrop-blur-sm flex-shrink-0'><ShoppingCart className='h-5 w-5 md:h-6 md:w-6 text-primary' /></div>
          <div className='flex-1 min-w-0'>
            <h1 className='text-lg md:text-2xl font-bold text-foreground leading-tight truncate mb-2 md:mb-2'>Commande #{orderData.id.slice(0, 8)}</h1>
            <div className='hidden md:flex items-center gap-4 flex-wrap'>
              <div className={cn('flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border', `bg-gradient-to-r ${statusInfo.bgClass} ${statusInfo.borderClass}`)}><div className={cn('w-2 h-2 rounded-full', statusInfo.color)} />{statusInfo.label}</div>
              <div className='flex items-center gap-2 px-3 py-1 bg-muted/40 rounded-full text-xs font-medium'><User className='h-3 w-3' />{orderData.customerName}</div>
              <div className='flex items-center gap-2 px-3 py-1 bg-muted/40 rounded-full text-xs font-medium'><Calendar className='h-3 w-3' />{new Date(orderData.createdAt).toLocaleDateString()}</div>
              <div className='flex items-center gap-2 px-3 py-1 bg-muted/40 rounded-full text-xs font-medium'><DollarSign className='h-3 w-3' />{orderData.total?.toFixed(2) ?? '0.00'} €</div>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2 flex-shrink-0 self-start md:self-auto'>
          {onEditToggle && (
            <>{isEditing ? (
                <div className='flex items-center gap-2'>
                  <Button className='text-sm' disabled={isSaving} size='sm' variant='outline' onClick={() => onEditToggle(false)}><X className='h-4 w-4 mr-1' />Annuler</Button>
                  <Button className='text-sm' disabled={isSaving} size='sm' variant='default' onClick={onSave}><Save className='h-4 w-4 mr-1' />{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</Button>
                </div>
              ) : (<Button className='text-sm' size='sm' variant='outline' onClick={() => onEditToggle(true)}><Edit className='h-4 w-4 mr-1' />Modifier</Button>)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
