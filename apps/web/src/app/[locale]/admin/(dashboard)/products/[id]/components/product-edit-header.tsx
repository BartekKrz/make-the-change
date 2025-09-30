'use client';
import { Package, Home } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useCallback } from 'react';

import {
  AdminDetailHeader,
  AdminDetailActions,
} from '@/app/[locale]/admin/(dashboard)/components/layout/admin-detail-header';
import { useToast } from '@/hooks/use-toast';
import type { AppFormApi } from '@/components/form';

import type { FC } from 'react';

interface ProductEditHeaderProps {
  form: AppFormApi;
}

export const ProductEditHeader: FC<ProductEditHeaderProps> = ({ form }) => {
  console.log('[ProductEditHeader] Rendering with form:', {
    hasForm: !!form,
    formState: form?.state
  });

  const t = useTranslations();
  const { toast } = useToast();

  const currentData = form.state.values;

  console.log('[ProductEditHeader] Current form state:', {
    values: currentData,
    isDirty: form.state.isDirty,
    isSubmitting: form.state.isSubmitting,
    errors: form.state.errors
  });

  // Save status computation (extrait de la logique existante)
  const saveStatus = useMemo(() => {
    // Simplified version - you might need to track mutation state differently
    if (form.state.isSubmitting) {
      return { type: 'saving' as const, message: 'Sauvegarde en cours...' };
    }
    if (form.state.isDirty) {
      return {
        type: 'modified' as const,
        message: 'Modifications en attente',
        count: 1,
        fields: ['form'],
      };
    }
    return {
      type: 'pristine' as const,
      message: 'Tous les changements sont sauvegardés',
    };
  }, [form.state.isSubmitting, form.state.isDirty]);

  // Manual save function
  const handleSaveAll = useCallback(async () => {
    console.log('[ProductEditHeader] handleSaveAll called');
    console.log('[ProductEditHeader] currentData:', currentData);
    console.log('[ProductEditHeader] form.state.isDirty:', form.state.isDirty);

    if (!currentData?.name) {
      console.warn('[ProductEditHeader] No name in currentData, aborting save');
      return;
    }

    try {
      console.log('[ProductEditHeader] Calling form.handleSubmit()');
      await form.handleSubmit();
      console.log('[ProductEditHeader] form.handleSubmit() completed successfully');
      toast({
        variant: 'default',
        title: 'Sauvegarde réussie',
        description: 'Toutes les modifications ont été sauvegardées.',
      });
    } catch (error) {
      console.error('[ProductEditHeader] form.handleSubmit() failed:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur de sauvegarde',
        description: 'Impossible de sauvegarder les modifications.',
      });
    }
  }, [currentData, form, toast]);

  const breadcrumbs = [
    {
      href: '/admin/dashboard',
      label: t('admin.common.breadcrumbs.dashboard'),
      icon: Home,
    },
    {
      href: '/admin/products',
      label: t('admin.common.breadcrumbs.products'),
      icon: Package,
    },
    { label: currentData?.name || 'Produit' },
  ];

  return (
    <AdminDetailHeader
      breadcrumbs={breadcrumbs}
      title={currentData?.name || 'Produit'}
      actions={
        <AdminDetailActions saveStatus={saveStatus} onSaveAll={handleSaveAll} />
      }
      productImage={
        currentData?.images && currentData.images.length > 0
          ? currentData.images[0]
          : undefined
      }
      subtitle={`${t('admin.products.edit.subtitle')} • ${
        currentData?.slug || t('admin.products.edit.no_slug')
      }`}
    />
  );
};
