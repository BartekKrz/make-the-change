'use client';

import { useState } from 'react';
import { type FC } from 'react';
import { SubscriptionDetailLayout } from '@/app/admin/(dashboard)/subscriptions/[id]/components/subscription-detail-layout';
import { SubscriptionCompactHeader } from '@/app/admin/(dashboard)/subscriptions/[id]/components/subscription-compact-header';
import { SubscriptionDetailsEditor } from '@/app/admin/(dashboard)/subscriptions/[id]/components/subscription-details-editor';
import { SubscriptionBreadcrumbs } from '@/app/admin/(dashboard)/subscriptions/[id]/components/subscription-breadcrumbs';
import type { Subscription } from '@/lib/types/subscription';

type SubscriptionDetailControllerProps = {
  subscriptionData: Subscription;
  onSave: (patch: Partial<Subscription>) => Promise<void>;
};

export const SubscriptionDetailController: FC<SubscriptionDetailControllerProps> = ({
  subscriptionData,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingData, setPendingData] = useState<Partial<Subscription>>({});

  const handleEditToggle = (editing: boolean) => {
    if (!editing) {
      setPendingData({});
    }
    setIsEditing(editing);
  };

  const handleDataChange = (data: Partial<Subscription>) => {
    setPendingData(prev => ({ ...prev, ...data }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const patch: Partial<Subscription> = {};
      for (const key of [
        'subscription_tier', 'billing_frequency', 'amount_eur', 'status', 'points_total', 'bonus_percentage'
      ] as const) {
        if (key in pendingData && (subscriptionData as any)[key] !== (pendingData as any)[key]) {
          (patch as any)[key] = (pendingData as any)[key];
        }
      }

      if (Object.keys(patch).length > 0) {
        await onSave(patch);
        setPendingData({});
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const displayData = { ...subscriptionData, ...pendingData };

  return (
    <SubscriptionDetailLayout
      breadcrumbs={<SubscriptionBreadcrumbs subscription={subscriptionData} />}
      header={
        <SubscriptionCompactHeader
          subscription={displayData}
          isEditing={isEditing}
          isSaving={isSaving}
          onEditToggle={handleEditToggle}
          onSave={handleSave}
          hasChanges={Object.keys(pendingData).length > 0}
        />
      }
      content={
        <SubscriptionDetailsEditor
          subscription={displayData}
          isEditing={isEditing}
          onChange={handleDataChange}
        />
      }
    />
  );
};
