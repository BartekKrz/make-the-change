'use client';

import { User, Truck, Package } from 'lucide-react';
import { useCallback } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/[locale]/admin/(dashboard)/components/ui/card';
import { SimpleSelect } from '@/app/[locale]/admin/(dashboard)/components/ui/select';
import { TextArea } from '@/app/[locale]/admin/(dashboard)/components/ui/textarea';

import type { FC, PropsWithChildren } from 'react';

type OrderData = {
  id: string;
  customerName: string;
  email: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  items?: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: string;
};
type OrderDetailsEditorProps = {
  orderData: OrderData;
  isEditing: boolean;
  isSaving?: boolean;
  onDataChange?: (data: Partial<OrderData>) => void;
};

const OrderCardsGrid: FC<PropsWithChildren> = ({ children }) => (
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
    {children}
  </div>
);

export const OrderDetailsEditor: FC<OrderDetailsEditorProps> = ({
  orderData,
  isEditing,
  onDataChange,
}) => {
  const handleChange = useCallback(
    (field: keyof OrderData, value: any) => {
      onDataChange?.({ [field]: value });
    },
    [onDataChange]
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <OrderCardsGrid>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <Package className="text-primary h-5 w-5" />
              Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orderData.items?.map(item => (
                <div
                  key={item.productId}
                  className="bg-muted/50 flex items-center justify-between rounded-md p-2"
                >
                  <div>
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-muted-foreground">
                      {' '}
                      (x{item.quantity})
                    </span>
                  </div>
                  <div className="font-mono text-sm">
                    {(item.price * item.quantity).toFixed(2)} €
                  </div>
                </div>
              )) || (
                <div className="text-muted-foreground py-4 text-center">
                  Aucun article dans cette commande
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6 lg:space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <User className="text-primary h-5 w-5" />
                Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{orderData.customerName}</p>
              <p className="text-muted-foreground">{orderData.email}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <Truck className="text-primary h-5 w-5" />
                Livraison
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Statut</label>
                <SimpleSelect
                  disabled={!isEditing}
                  value={orderData.status}
                  options={[
                    { value: 'pending', label: 'En attente' },
                    { value: 'shipped', label: 'Expédiée' },
                    { value: 'delivered', label: 'Livrée' },
                    { value: 'cancelled', label: 'Annulée' },
                  ]}
                  onValueChange={v => handleChange('status', v)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Adresse
                </label>
                <TextArea
                  className={isEditing ? '' : 'bg-muted/30'}
                  disabled={!isEditing}
                  placeholder="Adresse de livraison"
                  value={orderData.shippingAddress}
                  onChange={e =>
                    handleChange('shippingAddress', e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </OrderCardsGrid>
    </div>
  );
};
