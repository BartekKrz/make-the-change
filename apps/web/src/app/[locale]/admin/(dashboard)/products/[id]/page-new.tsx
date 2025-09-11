"use client"

import { type FC, useCallback, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl';
import { RouterOutputs, trpc } from '@/lib/trpc'
import { useToast } from '@/hooks/use-toast'
import { useEntityForm } from '@/hooks/use-entity-form'
import type { ProductFormData } from '@/lib/validators/product'
import { EmptyState } from '@/app/[locale]/admin/(dashboard)/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Package, Info, DollarSign, ImageIcon, Home } from 'lucide-react'
import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout'
import { AdminDetailLayout } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-detail-layout'
import { AdminDetailHeader, AdminDetailActions } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-detail-header'
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormSelect, FormToggle } from '@/app/[locale]/admin/(dashboard)/components/ui/form-components'

const isValidProductId = (id: string | undefined): id is string => {
  return typeof id === 'string' && id.length > 0
}

type ProductDetail = RouterOutputs['admin']['products']['detail'];

const AdminProductEditPageNew: FC = () => {
  const params = useParams<{ id: string }>()
  const productId = params?.id
  const utils = trpc.useUtils()
  const { toast } = useToast()
  const t = useTranslations()

  const { 
    data: product, 
    isLoading, 
    error, 
    refetch 
  } = trpc.admin.products.detail.useQuery(
    { productId: productId! },
    {
      enabled: isValidProductId(productId),
      staleTime: 2 * 60 * 1000, 
      retry: (failureCount, error) => {
        if (error?.data?.httpStatus === 404 || (error?.data?.httpStatus && error.data.httpStatus < 500)) {
          return false
        }
        return failureCount < 2
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30_000)
    }
  )

  const updateMutation = trpc.admin.products.update.useMutation({
    onMutate: async (variables) => {
      const { id, patch } = variables
      await utils.admin.products.detail.cancel({ productId: id })
      const prevDetail = utils.admin.products.detail.getData({ productId: id })
      if (prevDetail) {
        utils.admin.products.detail.setData({ productId: id }, { ...prevDetail, ...patch })
      }
      return { prevDetail }
    },
    onError: (err, variables, context) => {
      if (context?.prevDetail) {
        utils.admin.products.detail.setData({ productId: variables.id }, context.prevDetail)
      }
      toast({
        variant: 'destructive',
        title: 'Erreur de sauvegarde',
        description: err.message || 'Une erreur inconnue est survenue lors de la sauvegarde.',
      })
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Produit mis à jour',
        description: 'Les modifications ont été sauvegardées avec succès.',
      })
    },
    onSettled: (data, error, variables) => {
      utils.admin.products.detail.invalidate({ productId: variables.id })
      utils.admin.products.list.invalidate()
    }
  })
  
  const handleSave = useCallback(async (patch: Partial<ProductFormData>) => {
    if (isValidProductId(productId)) {
      return updateMutation.mutateAsync({ id: productId, patch })
    }
  }, [productId, updateMutation])

  // Configuration des champs pour auto-save
  const formConfig = useMemo(() => ({
    initialData: product as ProductFormData & { id: string },
    onSave: handleSave,
    immediateFields: ['is_active', 'featured', 'min_tier', 'fulfillment_method', 'category_id', 'producer_id'] as (keyof ProductFormData)[],
    autoSaveFields: ['name', 'slug', 'short_description', 'description', 'price_points', 'stock_quantity'] as (keyof ProductFormData)[],
    autoSaveDelay: 3000
  }), [product, handleSave])

  const entityForm = useEntityForm(formConfig)

  if (!isValidProductId(productId)) {
    return (
      <AdminPageLayout>
        <div className="p-8">
          <EmptyState
            variant="muted"
            icon={Package}
            title="ID de produit manquant"
            description="L'identifiant du produit n'est pas valide ou manquant dans l'URL."
          />
        </div>
      </AdminPageLayout>
    )
  }

  if (error) {
    const isNotFound = error.data?.httpStatus === 404
    const isServerError = error.data?.httpStatus && error.data.httpStatus >= 500
    
    return (
      <AdminPageLayout>
        <div className="p-8">
          <EmptyState
            variant="muted"
            icon={Package}
            title={isNotFound ? 'Produit non trouvé' : 'Erreur de chargement'}
            description={
              isNotFound 
                ? 'Le produit demandé n\'existe pas ou a été supprimé.' 
                : error.message || 'Une erreur est survenue lors du chargement du produit.'
            }
            action={
              isServerError ? (
                <Button size="sm" variant="outline" onClick={() => refetch()}>
                  Réessayer
                </Button>
              ) : undefined
            }
          />
        </div>
      </AdminPageLayout>
    )
  }

  if (isLoading || !product) {
    return (
      <AdminPageLayout>
        <div className="p-8">
          <EmptyState
            variant="muted"
            icon={Package}
            title="Chargement du produit"
            description="Veuillez patienter pendant le chargement des données..."
          />
        </div>
      </AdminPageLayout>
    )
  }

  const currentData = entityForm.getCurrentData()
  const saveStatus = entityForm.getSaveStatus()

  const breadcrumbs = [
    { href: '/admin/dashboard', label: 'Tableau de bord', icon: Home },
    { href: '/admin/products', label: 'Produits', icon: Package },
    { label: currentData.name }
  ]

  return (
    <AdminPageLayout>
      <AdminDetailLayout
        headerContent={
          <>
            <AdminDetailHeader
              breadcrumbs={breadcrumbs}
              title={currentData.name}
              subtitle={`Produit • ${currentData.slug || 'Sans slug'}`}
              actions={
                <AdminDetailActions
                  saveStatus={saveStatus}
                  onSaveAll={entityForm.saveAll}
                  primaryActions={
                    <Button size="sm" variant="outline">
                      Aperçu
                    </Button>
                  }
                />
              }
            />
          </>
        }
      >
        <DetailView variant="cards" spacing="md" gridCols={2}>
          {/* Section Informations générales */}
          <DetailView.Section icon={Info} title={t('admin.products.edit.sections.general')}>
            <DetailView.Field 
              label={t('admin.products.edit.fields.name')} 
              required
            >
              <Input
                placeholder={t('admin.products.edit.placeholders.name')}
                value={currentData.name}
                onChange={(e) => entityForm.updateField('name', e.target.value)}
              />
            </DetailView.Field>

            <DetailView.Field label={t('admin.products.edit.fields.slug')} required>
              <Input
                placeholder={t('admin.products.edit.placeholders.slug')}
                value={currentData.slug}
                onChange={(e) => entityForm.updateField('slug', e.target.value)}
              />
            </DetailView.Field>

            <DetailView.Field label={t('admin.products.edit.fields.short_description')}>
              <Textarea
                placeholder={t('admin.products.edit.placeholders.short_description')}
                rows={3}
                value={currentData.short_description || ''}
                onChange={(e) => entityForm.updateField('short_description', e.target.value)}
              />
            </DetailView.Field>

            <DetailView.Field label={t('admin.products.edit.fields.description')}>
              <Textarea
                placeholder={t('admin.products.edit.placeholders.description')}
                rows={6}
                value={currentData.description || ''}
                onChange={(e) => entityForm.updateField('description', e.target.value)}
              />
            </DetailView.Field>
          </DetailView.Section>

          {/* Section Prix & Stock */}
          <DetailView.Section icon={DollarSign} title={t('admin.products.edit.sections.pricing')}>
            <DetailView.FieldGroup layout="grid-2">
              <DetailView.Field label={t('admin.products.edit.fields.price_points')} required>
                <Input
                  type="number"
                  placeholder="100"
                  value={currentData.price_points?.toString() || ''}
                  onChange={(e) => entityForm.updateField('price_points', parseInt(e.target.value) || 0)}
                />
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.stock_quantity')}>
                <Input
                  type="number"
                  placeholder="0"
                  value={currentData.stock_quantity?.toString() || ''}
                  onChange={(e) => entityForm.updateField('stock_quantity', parseInt(e.target.value) || 0)}
                />
              </DetailView.Field>
            </DetailView.FieldGroup>

            <DetailView.FieldGroup layout="grid-2" label="Paramètres avancés">
              <DetailView.Field label="Méthode d'expédition">
                <FormSelect
                  value={currentData.fulfillment_method || ''}
                  onChange={(value) => entityForm.updateField('fulfillment_method', value)}
                  options={[
                    { value: '', label: 'Sélectionner...' },
                    { value: 'dropship', label: 'Dropshipping' },
                    { value: 'stock', label: 'En stock' },
                    { value: 'ondemand', label: 'Sur commande' }
                  ]}
                  placeholder="Méthode d'expédition"
                />
              </DetailView.Field>

              <DetailView.Field label="Niveau minimum">
                <FormSelect
                  value={currentData.min_tier || ''}
                  onChange={(value) => entityForm.updateField('min_tier', value)}
                  options={[
                    { value: '', label: 'Tous niveaux' },
                    { value: 'explorateur', label: 'Explorateur' },
                    { value: 'protecteur', label: 'Protecteur' },
                    { value: 'ambassadeur', label: 'Ambassadeur' }
                  ]}
                  placeholder="Niveau minimum requis"
                />
              </DetailView.Field>
            </DetailView.FieldGroup>

            <DetailView.FieldGroup layout="row" label="Statut et visibilité">
              <DetailView.Field label="Produit actif">
                <FormToggle
                  checked={currentData.is_active || false}
                  onChange={(checked) => entityForm.updateField('is_active', checked)}
                  label="Actif"
                  description="Le produit est visible pour les utilisateurs"
                />
              </DetailView.Field>

              <DetailView.Field label="Produit en vedette">
                <FormToggle
                  checked={currentData.featured || false}
                  onChange={(checked) => entityForm.updateField('featured', checked)}
                  label="En vedette"
                  description="Affichage prioritaire dans les listes"
                />
              </DetailView.Field>
            </DetailView.FieldGroup>
          </DetailView.Section>

          {/* Section Images - Span sur 2 colonnes */}
          <DetailView.Section icon={ImageIcon} title={t('admin.products.edit.sections.images')} span={2}>
            <DetailView.Field 
              label={t('admin.products.edit.images.current')}
              description={`${currentData.images?.length || 0} image(s) actuellement`}
            >
              <div className="p-8 border-2 border-dashed border-border rounded-lg text-center text-muted-foreground">
                <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                <p>Gestionnaire d'images à implémenter</p>
                <p className="text-xs">Images actuelles : {JSON.stringify(currentData.images?.slice(0, 2)) || '[]'}</p>
              </div>
            </DetailView.Field>
          </DetailView.Section>
        </DetailView>
      </AdminDetailLayout>
    </AdminPageLayout>
  )
}

export default AdminProductEditPageNew
