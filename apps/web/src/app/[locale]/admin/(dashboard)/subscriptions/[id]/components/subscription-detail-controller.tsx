'use client';

import { useState } from 'react';
import { type FC } from 'react';

import { SubscriptionBreadcrumbs } from '@/app/[locale]/admin/(dashboard)/subscriptions/[id]/components/subscription-breadcrumbs';
import { SubscriptionCompactHeader } from '@/app/[locale]/admin/(dashboard)/subscriptions/[id]/components/subscription-compact-header';
import { SubscriptionDetailLayout } from '@/app/[locale]/admin/(dashboard)/subscriptions/[id]/components/subscription-detail-layout';
import { SubscriptionDetailsEditor } from '@/app/[locale]/admin/(dashboard)/subscriptions/[id]/components/subscription-details-editor';
import type { Subscription } from '@/lib/types/subscription';

type SubscriptionDetailControllerProps = {
  subscriptionData: Subscription;
  onSave: (patch: Partial<Subscription>) => Promise<void>;
};

export const SubscriptionDetailController: FC<
  SubscriptionDetailControllerProps
> = ({ subscriptionData, onSave }) => {
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
        'subscription_tier',
        'billing_frequency',
        'amount_eur',
        'status',
        'points_total',
        'bonus_percentage',
      ] as const) {
        if (
          key in pendingData &&
          (subscriptionData as any)[key] !== (pendingData as any)[key]
        ) {
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
      content={
        <SubscriptionDetailsEditor
          isEditing={isEditing}
          subscription={displayData}
          onChange={handleDataChange}
        />
      }
      header={
        <SubscriptionCompactHeader
          hasChanges={Object.keys(pendingData).length > 0}
          isEditing={isEditing}
          isSaving={isSaving}
          subscription={displayData}
          onEditToggle={handleEditToggle}
          onSave={handleSave}
        />
      }
    />
  );
};
