'use client';

import { useState } from 'react';
import { type FC } from 'react';

import { OrderBreadcrumbs } from '@/app/[locale]/admin/(dashboard)/orders/[id]/components/order-breadcrumbs';
import { OrderCompactHeader } from '@/app/[locale]/admin/(dashboard)/orders/[id]/components/order-compact-header';
import { OrderDetailLayout } from '@/app/[locale]/admin/(dashboard)/orders/[id]/components/order-detail-layout';
import { OrderDetailsEditor } from '@/app/[locale]/admin/(dashboard)/orders/[id]/components/order-details-editor';

type OrderData = {
  id: string;
  customerName: string;
  email: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  total: number;
  items: { productId: string; name: string; quantity: number; price: number }[];
  shippingAddress: string;
};

type OrderDetailControllerProps = {
  orderData: OrderData;
  onSave: (patch: Partial<OrderData>) => Promise<void>;
};

export const OrderDetailController: FC<OrderDetailControllerProps> = ({
  orderData,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingData, setPendingData] = useState<Partial<OrderData>>({});

  const handleEditToggle = (editing: boolean) => {
    if (!editing) {
      setPendingData({});
    }
    setIsEditing(editing);
  };

  const handleDataChange = (data: Partial<OrderData>) => {
    setPendingData(prev => ({ ...prev, ...data }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const patch: Partial<OrderData> = {};
      for (const key of ['status', 'shippingAddress'] as const) {
        if (
          key in pendingData &&
          (orderData as any)[key] !== (pendingData as any)[key]
        ) {
          (patch as any)[key] = (pendingData as any)[key];
        }
      }

      if (Object.keys(patch).length > 0) {
        await onSave(patch);
      }

      setIsEditing(false);
      setPendingData({});
    } catch (error) {
      console.error('Error saving order:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const displayData = { ...orderData, ...pendingData };

  return (
    <OrderDetailLayout
      toolbar={<div />}
      content={
        <OrderDetailsEditor
          isEditing={isEditing}
          isSaving={isSaving}
          orderData={displayData}
          onDataChange={handleDataChange}
        />
      }
      header={
        <>
          <OrderBreadcrumbs orderData={orderData} />
          <OrderCompactHeader
            isEditing={isEditing}
            isSaving={isSaving}
            orderData={displayData}
            onEditToggle={handleEditToggle}
            onSave={handleSave}
          />
        </>
      }
    />
  );
};
