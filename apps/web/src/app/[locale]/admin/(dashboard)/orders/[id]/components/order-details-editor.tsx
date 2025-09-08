'use client';

import { useCallback } from 'react';
import type { FC, PropsWithChildren } from 'react';
import { User, Truck, Hash, Package } from 'lucide-react';
import { TextArea } from '@/app/[locale]/admin/(dashboard)/components/ui/textarea';
import { SimpleSelect } from '@/app/[locale]/admin/(dashboard)/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/[locale]/admin/(dashboard)/components/ui/card';

type OrderData = {
  id: string;
  customerName: string;
  email: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  items?: { productId: string; name: string; quantity: number; price: number }[];
  shippingAddress: string;
};
type OrderDetailsEditorProps = { orderData: OrderData; isEditing: boolean; isSaving?: boolean; onDataChange?: (data: Partial<OrderData>) => void; };

const OrderCardsGrid: FC<PropsWithChildren> = ({ children }) => <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>{children}</div>;

export const OrderDetailsEditor: FC<OrderDetailsEditorProps> = ({ orderData, isEditing, onDataChange }) => {
  const handleChange = useCallback((field: keyof OrderData, value: any) => { onDataChange?.({ [field]: value }); }, [onDataChange]);

  return (
    <div className='space-y-6 md:space-y-8'>
      <OrderCardsGrid>
        <Card className='lg:col-span-2'>
          <CardHeader><CardTitle className='flex items-center gap-3 text-lg'><Package className='h-5 w-5 text-primary' />Articles</CardTitle></CardHeader>
          <CardContent><div className='space-y-3'>{orderData.items?.map(item => (
            <div key={item.productId} className='flex justify-between items-center p-2 rounded-md bg-muted/50'>
              <div><span className='font-semibold'>{item.name}</span><span className='text-muted-foreground'> (x{item.quantity})</span></div>
              <div className='font-mono text-sm'>{(item.price * item.quantity).toFixed(2)} €</div>
            </div>)) || (
            <div className='text-center text-muted-foreground py-4'>
              Aucun article dans cette commande
            </div>
          )}
          </div></CardContent>
        </Card>
        <div className='space-y-6 lg:space-y-8'>
          <Card>
            <CardHeader><CardTitle className='flex items-center gap-3 text-lg'><User className='h-5 w-5 text-primary' />Client</CardTitle></CardHeader>
            <CardContent className='space-y-2 text-sm'>
              <p className='font-medium'>{orderData.customerName}</p>
              <p className='text-muted-foreground'>{orderData.email}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className='flex items-center gap-3 text-lg'><Truck className='h-5 w-5 text-primary' />Livraison</CardTitle></CardHeader>
            <CardContent className='space-y-3'>
              <div><label className='block text-sm font-medium mb-1'>Statut</label><SimpleSelect value={orderData.status} onValueChange={(v) => handleChange('status', v)} options={[{ value: 'pending', label: 'En attente' }, { value: 'shipped', label: 'Expédiée' }, { value: 'delivered', label: 'Livrée' }, { value: 'cancelled', label: 'Annulée' }]} disabled={!isEditing} /></div>
              <div><label className='block text-sm font-medium mb-1'>Adresse</label><TextArea value={orderData.shippingAddress} onChange={(e) => handleChange('shippingAddress', e.target.value)} placeholder='Adresse de livraison' disabled={!isEditing} className={!isEditing ? 'bg-muted/30' : ''} /></div>
            </CardContent>
          </Card>
        </div>
      </OrderCardsGrid>
    </div>
  );
};
