"use client"

import { Package, Info, DollarSign, ImageIcon, Home } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl';
import { type FC, useCallback, useMemo } from 'react'

import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout'
import { AdminDetailHeader, AdminDetailActions } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-detail-header'
import { AdminDetailLayout } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-detail-layout'
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view'
import { EmptyState } from '@/app/[locale]/admin/(dashboard)/components/ui/empty-state'
import { FormSelect, FormToggle } from '@/app/[locale]/admin/(dashboard)/components/ui/form-components'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useEntityForm } from '@/hooks/use-entity-form'
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/lib/trpc'
import type { ProductFormData } from '@/lib/validators/product'

const isValidProductId = (id: string | undefined): id is string => {
  return typeof id === 'string' && id.length > 0
}


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
    onSettled: (_data, _error, variables) => {
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
            description="L'identifiant du produit n'est pas valide ou manquant dans l'URL."
            icon={Package}
            title="ID de produit manquant"
            variant="muted"
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
            icon={Package}
            title={isNotFound ? 'Produit non trouvé' : 'Erreur de chargement'}
            variant="muted"
            action={
              isServerError ? (
                <Button size="sm" variant="outline" onClick={() => refetch()}>
                  Réessayer
                </Button>
              ) : undefined
            }
            description={
              isNotFound 
                ? 'Le produit demandé n\'existe pas ou a été supprimé.' 
                : error.message || 'Une erreur est survenue lors du chargement du produit.'
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
            description="Veuillez patienter pendant le chargement des données..."
            icon={Package}
            title="Chargement du produit"
            variant="muted"
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
              subtitle={`Produit • ${currentData.slug || 'Sans slug'}`}
              title={currentData.name}
              actions={
                <AdminDetailActions
                  saveStatus={saveStatus}
                  primaryActions={
                    <Button size="sm" variant="outline">
                      Aperçu
                    </Button>
                  }
                  onSaveAll={entityForm.saveAll}
                />
              }
            />
          </>
        }
      >
        <DetailView gridCols={2} spacing="md" variant="cards">
          {/* Section Informations générales */}
          <DetailView.Section icon={Info} title={t('admin.products.edit.sections.general')}>
            <DetailView.Field 
              required 
              label={t('admin.products.edit.fields.name')}
            >
              <Input
                placeholder={t('admin.products.edit.placeholders.name')}
                value={currentData.name}
                onChange={(e) => entityForm.updateField('name', e.target.value)}
              />
            </DetailView.Field>

            <DetailView.Field required label={t('admin.products.edit.fields.slug')}>
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
              <DetailView.Field required label={t('admin.products.edit.fields.price_points')}>
                <Input
                  placeholder="100"
                  type="number"
                  value={currentData.price_points?.toString() || ''}
                  onChange={(e) => entityForm.updateField('price_points', Number.parseInt(e.target.value) || 0)}
                />
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.stock_quantity')}>
                <Input
                  placeholder="0"
                  type="number"
                  value={currentData.stock_quantity?.toString() || ''}
                  onChange={(e) => entityForm.updateField('stock_quantity', Number.parseInt(e.target.value) || 0)}
                />
              </DetailView.Field>
            </DetailView.FieldGroup>

            <DetailView.FieldGroup label="Paramètres avancés" layout="grid-2">
              <DetailView.Field label="Méthode d'expédition">
                <FormSelect
                  placeholder="Méthode d'expédition"
                  value={currentData.fulfillment_method || ''}
                  options={[
                    { value: '', label: 'Sélectionner...' },
                    { value: 'dropship', label: 'Dropshipping' },
                    { value: 'stock', label: 'En stock' },
                    { value: 'ondemand', label: 'Sur commande' }
                  ]}
                  onChange={(value) => entityForm.updateField('fulfillment_method', value)}
                />
              </DetailView.Field>

              <DetailView.Field label="Niveau minimum">
                <FormSelect
                  placeholder="Niveau minimum requis"
                  value={currentData.min_tier || ''}
                  options={[
                    { value: '', label: 'Tous niveaux' },
                    { value: 'explorateur', label: 'Explorateur' },
                    { value: 'protecteur', label: 'Protecteur' },
                    { value: 'ambassadeur', label: 'Ambassadeur' }
                  ]}
                  onChange={(value) => entityForm.updateField('min_tier', value)}
                />
              </DetailView.Field>
            </DetailView.FieldGroup>

            <DetailView.FieldGroup label="Statut et visibilité" layout="row">
              <DetailView.Field label="Produit actif">
                <FormToggle
                  checked={currentData.is_active || false}
                  description="Le produit est visible pour les utilisateurs"
                  label="Actif"
                  onChange={(checked) => entityForm.updateField('is_active', checked)}
                />
              </DetailView.Field>

              <DetailView.Field label="Produit en vedette">
                <FormToggle
                  checked={currentData.featured || false}
                  description="Affichage prioritaire dans les listes"
                  label="En vedette"
                  onChange={(checked) => entityForm.updateField('featured', checked)}
                />
              </DetailView.Field>
            </DetailView.FieldGroup>
          </DetailView.Section>

          {/* Section Images - Span sur 2 colonnes */}
          <DetailView.Section icon={ImageIcon} span={2} title={t('admin.products.edit.sections.images')}>
            <DetailView.Field 
              description={`${currentData.images?.length || 0} image(s) actuellement`}
              label={t('admin.products.edit.images.current')}
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
