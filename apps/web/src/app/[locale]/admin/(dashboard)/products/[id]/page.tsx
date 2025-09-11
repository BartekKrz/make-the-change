"use client"
import { Package, Info, DollarSign, ImageIcon, Home } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl';
import { type FC, useCallback, useMemo, useState, useEffect, useRef } from 'react'

import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout'
import { FormTextField, FormTextArea, FormSelect, FormToggle, FormAutocomplete, FormDateField, FormNumberField, FormImagesUploader } from '@/app/[locale]/admin/(dashboard)/components/form'
import { useAppForm } from '@/app/[locale]/admin/(dashboard)/components/form/app-form'
import { AdminDetailHeader, AdminDetailActions } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-detail-header'
import { AdminDetailLayout } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-detail-layout'
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view'
import { EmptyState } from '@/app/[locale]/admin/(dashboard)/components/ui/empty-state'
import { ImageGalleryModal } from "@/components/images/image-gallery";
import { Button } from '@/components/ui/button'
import { OptimizedImageMasonry } from "@/components/ui/optimized-image-masonry";
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/lib/trpc'
import type { RouterOutputs, RouterInputs as _RouterInputs} from '@/lib/trpc';
import { productFormSchema, defaultProductValues } from '@/lib/validators/product'
import type { ProductFormData } from '@/lib/validators/product'
import { type ProductBlurHash } from "@/types/blur";


const isValidProductId = (id: string | undefined): id is string => {
  return typeof id === 'string' && id.length > 0
}

type ProductDetail = RouterOutputs['admin']['products']['detail_enriched'];


// Type wrapper pour éviter l'erreur de récursion TypeScript
type MutationContext = {
  prevDetail?: ProductDetail
}

// Types strictement typés sans any
type ProductUpdateMutationInput = {
  id: string
  patch: Partial<ProductDetail>
}

// Plus d'état local pour les blur: on dérive directement depuis le produit enrichi

const AdminProductEditPageNew: FC = () => {
  const params = useParams<{ id: string }>()
  const productId = params?.id
  const utils = trpc.useUtils()
  const { toast } = useToast()
  const t = useTranslations()
  
  
  const [galleryModal, setGalleryModal] = useState<{
    isOpen: boolean;
    images: string[];
    initialIndex: number;
  }>({
    isOpen: false,
    images: [],
    initialIndex: 0
  });


  const { 
    data: product, 
    isLoading, 
    error, 
    refetch 
  } = trpc.admin.products.detail_enriched.useQuery(
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


  const imageBlurMap = useMemo(() => {
    const map = (product)?.image_blur_map 
    if (!map) return {}
    const normalized: Record<string, ProductBlurHash> = {}
    for (const [url, v] of Object.entries(map)) {
      normalized[url] = { url, ...(v ) }
    }
    return normalized
  }, [product])






  
  const createUpdateMutation = () => trpc.admin.products.update.useMutation({
    onMutate: async (variables: ProductUpdateMutationInput): Promise<MutationContext> => {
      const { id, patch } = variables
      await utils.admin.products.detail_enriched.cancel({ productId: id })
      const prevDetail = utils.admin.products.detail_enriched.getData({ productId: id })
        
      if (prevDetail) {
        const optimisticUpdate: ProductDetail = { ...prevDetail, ...patch }
        utils.admin.products.detail_enriched.setData({ productId: id }, optimisticUpdate)
      }
        
      return { prevDetail }
    },
    onError: (error: unknown, variables: ProductUpdateMutationInput, context?: MutationContext) => {
      if (context?.prevDetail) {
        utils.admin.products.detail_enriched.setData({ productId: variables.id }, context.prevDetail)
      }
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue'
      toast({
        variant: 'destructive',
        title: t('admin.products.edit.toast.error.title'),
        description: errorMessage || t('admin.products.edit.toast.error.description'),
      })
    },
    onSuccess: (_data: ProductDetail) => {
      toast({
        variant: 'default',
        title: t('admin.products.edit.toast.success.title'),
        description: t('admin.products.edit.toast.success.description'),
      })
    },
    onSettled: (_data: ProductDetail | undefined, _error: unknown, variables: ProductUpdateMutationInput) => {
      utils.admin.products.detail_enriched.invalidate({ productId: variables.id })
      utils.admin.products.list.invalidate()
    }
  })
  
  const updateMutation = createUpdateMutation()
  
  
  const formDefaultValues = useMemo(() => {
    if (!product) return defaultProductValues
    return {
      ...defaultProductValues,
      ...(product),
      images: Array.isArray((product).images)
        ? (((product ).images))
        : [],
      tags: Array.isArray((product).tags)
        ? (((product ).tags ))
        : [],
    }
  }, [product])

  const form = useAppForm({
    defaultValues: formDefaultValues,
    validators: {
      onSubmit: productFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      if (!isValidProductId(productId)) return
      // value a déjà été validé par zodValidator
      const patch: Partial<ProductFormData> = {}
      (Object.keys(value) as Array<keyof ProductFormData>).forEach((k) => {
        if (value[k] !== lastSavedRef.current[k]) {
          patch[k] = value[k] as ProductFormData[keyof ProductFormData]
        }
      })
      if (Object.keys(patch).length === 0) return
      await updateMutation.mutateAsync({ id: productId, patch })
      lastSavedRef.current = { ...lastSavedRef.current, ...patch }
      formApi.reset(value)
    },
  })

  // Track last saved snapshot for comparisons
  const lastSavedRef = useRef<ProductFormData>(formDefaultValues)
  useEffect(() => {
    lastSavedRef.current = formDefaultValues
  }, [formDefaultValues])

  
  useEffect(() => {
    if (product) form.reset(formDefaultValues)
  }, [product,  formDefaultValues, form])

  


  const autoSave = useCallback(async () => {
    if (form.state.isDirty) {
      try {
        const values = form.state.values as ProductFormData
        // Only save simple string/number fields that changed
        const simplePatch: Partial<ProductFormData> = {}
        
        // Check each simple field
        const simpleFields: (keyof ProductFormData)[] = ['name', 'slug', 'description', 'short_description', 'price_points', 'stock_quantity']
        
        for (const field of simpleFields) {
          const currentValue = values[field]
          const originalValue = lastSavedRef.current[field]
          if (currentValue !== originalValue && currentValue !== null && currentValue !== undefined) {
            simplePatch[field] = currentValue as ProductFormData[keyof ProductFormData]
          }
        }

        if (Object.keys(simplePatch).length > 0) {
          // Auto-saving simple patch
          await updateMutation.mutateAsync({ id: productId, patch: simplePatch })
          
          // Update last saved snapshot to reflect saved state
          lastSavedRef.current = { ...lastSavedRef.current, ...simplePatch }
          
          // Auto-save successful
        }
      } catch {
        // Auto-save failed silently
      }
    }
  }, [form, productId, updateMutation])

  
  // Subscribe to form state changes for auto-save
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null
    
    const unsubscribe = form.store.subscribe(() => {
      // Form store changed - debug disabled
      if (!form.state.isDirty) return;
      // Form is dirty - starting auto-save
        
      // Clear previous timeout
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
        
      // Set new timeout
      timeoutId = setTimeout(() => {
        // Auto-save timeout triggered
        autoSave()
        timeoutId = null
      }, 2000)
    })
    
    return () => {
      unsubscribe()
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [form, autoSave])

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (form.state.isDirty) {
        autoSave()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [autoSave, form.state.isDirty])

  // Prepare data before early returns
  const currentData = (form.state.values as ProductFormData) || defaultProductValues
  const saveStatus = useMemo(() => {
    // Priority: saving > error > modified > pristine
    if (updateMutation.isPending) {
      return { 
        type: 'saving' as const, 
        message: 'Sauvegarde en cours...' 
      }
    }
    
    if (updateMutation.error) {
      return { 
        type: 'error' as const, 
        message: `Erreur: ${updateMutation.error.message}`,
        retryable: true 
      }
    }
    
    // Only show modified if form is dirty AND not currently saving
    if (form.state.isDirty && !updateMutation.isPending) {
      return { 
        type: 'modified' as const, 
        message: 'Modifications en attente',
        count: 1,
        fields: ['form']
      }
    }
    
    return { 
      type: 'pristine' as const, 
      message: 'Tous les changements sont sauvegardés' 
    }
  }, [updateMutation.isPending, updateMutation.error, form.state.isDirty])

  // Manual save function for save-all button
  const handleSaveAll = useCallback(async () => {
    if (!isValidProductId(productId) || !product) return
    
    const currentValues = form.state.values as ProductFormData
    
    // Calculate patch from current form values vs original product
    const patch: Partial<ProductFormData> = {}
    (Object.keys(currentValues) as Array<keyof ProductFormData>).forEach((k) => {
      if (currentValues[k] !== lastSavedRef.current[k]) {
        patch[k] = currentValues[k] as ProductFormData[keyof ProductFormData]
      }
    })
    
    if (Object.keys(patch).length === 0) {
      return
    }
    
    try {
      await updateMutation.mutateAsync({ id: productId, patch })
      lastSavedRef.current = { ...lastSavedRef.current, ...patch }
      // Reset form dirty state after successful save
      form.reset(form.state.values)
      toast({
        variant: 'default',
        title: 'Sauvegarde réussie',
        description: 'Toutes les modifications ont été sauvegardées.',
      })
    } catch {
      // Manual save failed silently
      toast({
        variant: 'destructive',
        title: 'Erreur de sauvegarde',
        description: 'Impossible de sauvegarder les modifications.',
      })
    }
  }, [ productId, product, updateMutation, form, toast])

  const breadcrumbs = [
    { href: '/admin/dashboard', label: t('admin.common.breadcrumbs.dashboard'), icon: Home },
    { href: '/admin/products', label: t('admin.common.breadcrumbs.products'), icon: Package },
    { label: currentData?.name || product?.name || 'Produit' }
  ]
  
  

  if (!isValidProductId(productId)) return (
    <AdminPageLayout>
      <div className="p-8">
        <EmptyState
          description={t('admin.products.edit.errors.missing_id.description')}
          icon={Package}
          title={t('admin.products.edit.errors.missing_id.title')}
          variant="muted"
        />
      </div>
    </AdminPageLayout>
  )

  if (error) {
    const isNotFound = error.data?.httpStatus === 404
    const isServerError = error.data?.httpStatus && error.data.httpStatus >= 500
    
    return (
      <AdminPageLayout>
        <div className="p-8">
          <EmptyState
            icon={Package}
            title={isNotFound ? t('admin.products.edit.errors.not_found.title') : t('admin.products.edit.errors.loading.title')}
            variant="muted"
            action={
              isServerError ? (
                <Button size="sm" variant="outline" onClick={() => refetch()}>
                  {t('admin.common.retry')}
                </Button>
              ) : undefined
            }
            description={
              isNotFound 
                ? t('admin.products.edit.errors.not_found.description')
                : error.message || t('admin.products.edit.errors.loading.description')
            }
          />
        </div>
      </AdminPageLayout>
    )
  }

  if (isLoading ) return (
    <AdminPageLayout>
      <div className="p-8">
        <EmptyState
          description={t('admin.products.edit.loading.description')}
          icon={Package}
          title={t('admin.products.edit.loading.title')}
          variant="muted"
        />
      </div>
    </AdminPageLayout>
  )



  return (
    <AdminPageLayout>
      <AdminDetailLayout
        headerContent={
          <AdminDetailHeader
            breadcrumbs={breadcrumbs}
            productImage={currentData?.images && currentData.images.length > 0 ? currentData.images[0] : product?.images?.[0]}
            subtitle={`${t('admin.products.edit.subtitle')} • ${currentData?.slug || product?.slug || t('admin.products.edit.no_slug')}`}
            title={currentData?.name || product?.name || 'Produit'}
            actions={
              <AdminDetailActions
                saveStatus={saveStatus}
                onSaveAll={handleSaveAll}
              />
            }
          />
        }
      >
        <form.AppForm key={product?.id || 'new'}>
        <DetailView gridCols={2} spacing="md" variant="cards">
          {/* 1. ESSENTIEL - Informations de base */}
          <DetailView.Section icon={Info} title="Informations essentielles">
            <DetailView.Field required label={t('admin.products.edit.fields.name')}>
              <form.AppField name="name">
                {() => (
                  <FormTextField placeholder={t('admin.products.edit.placeholders.name')} />
                )}
              </form.AppField>
            </DetailView.Field>

            <DetailView.Field required label={t('admin.products.edit.fields.slug')}>
              <form.AppField name="slug">
                {() => (
                  <FormTextField placeholder={t('admin.products.edit.placeholders.slug')} />
                )}
              </form.AppField>
            </DetailView.Field>

            <DetailView.Field required label={t('admin.products.edit.fields.category_id')}>
              <form.AppField name="category_id">
                {() => (
                  <FormAutocomplete
                    allowCreate
                    mode="single"
                    placeholder="Rechercher une catégorie..."
                    suggestions={[
                      'Miels & Apiculture',
                      'Huiles & Olives',
                      'Produits transformés',
                      'Épices & Condiments',
                      'Cosmétiques naturels',
                      'Artisanat local',
                      'Produits saisonniers',
                      'Agriculture biologique',
                      'Commerce équitable',
                      'Produits de la mer'
                    ]}
                  />
                )}
              </form.AppField>
            </DetailView.Field>

            <DetailView.Field required label={t('admin.products.edit.fields.min_tier')}>
              <form.AppField name="min_tier">
                {() => (
                  <FormSelect
                    placeholder={t('admin.products.edit.placeholders.min_tier')}
                    options={[
                      { value: 'explorateur', label: t('admin.products.edit.tiers.explorateur') },
                      { value: 'protecteur', label: t('admin.products.edit.tiers.protecteur') },
                      { value: 'ambassadeur', label: t('admin.products.edit.tiers.ambassadeur') }
                    ]}
                  />
                )}
              </form.AppField>
            </DetailView.Field>
          </DetailView.Section>

          {/* 2. PRIX & STATUTS - Paramètres business */}
          <DetailView.Section icon={DollarSign} title="Prix & Statuts">
            <DetailView.FieldGroup layout="grid-2">
              <DetailView.Field required label={t('admin.products.edit.fields.price_points')}>
                <form.AppField name="price_points">
                  {() => (
                    <FormNumberField
                      emptyValue={0}
                      kind="int"
                      min={0}
                      placeholder="100"
                    />
                  )}
                </form.AppField>
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.price_eur_equivalent')}>
                <form.AppField name="price_eur_equivalent">
                  {() => (
                    <FormNumberField
                      emptyValue={undefined}
                      kind="float"
                      min={0}
                      placeholder="0.00"
                      step={0.01}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>
            </DetailView.FieldGroup>

            <DetailView.FieldGroup label="Visibilité" layout="row">
              <DetailView.Field label={t('admin.products.edit.fields.is_active')}>
                <form.AppField name="is_active">
                  {() => (
                    <FormToggle
                      hideLabel
                      description={t('admin.products.edit.status.active_description')}
                      label={t('admin.products.edit.status.active')}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.featured')}>
                <form.AppField name="featured">
                  {() => (
                    <FormToggle
                      hideLabel
                      description={t('admin.products.edit.status.featured_description')}
                      label={t('admin.products.edit.status.featured')}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.is_hero_product')}>
                <form.AppField name="is_hero_product">
                  {() => (
                    <FormToggle
                      hideLabel
                      description={t('admin.products.edit.status.hero_description')}
                      label={t('admin.products.edit.status.hero')}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>
            </DetailView.FieldGroup>
          </DetailView.Section>

          {/* 3. CONFIGURATION - Stock & Descriptions */}
          <DetailView.Section icon={Package} title="Configuration">
            <DetailView.FieldGroup layout="grid-2">
              <DetailView.Field label={t('admin.products.edit.fields.fulfillment_method')}>
                <form.AppField name="fulfillment_method">
                {(field) => (
                  <field.FormAutocomplete
                      allowCreate={false}
                      mode="single"
                      placeholder="Rechercher une méthode..."
                      suggestions={['stock', 'dropship', 'ondemand']}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.stock_quantity')}>
                <form.AppField name="stock_quantity">
                  {() => (
                    <FormNumberField
                      emptyValue={0}
                      kind="int"
                      min={0}
                      placeholder="0"
                    />
                  )}
                </form.AppField>
              </DetailView.Field>
            </DetailView.FieldGroup>

            <DetailView.Field label={t('admin.products.edit.fields.short_description')}>
              <form.AppField name="short_description">
                {() => (
                  <FormTextArea
                    placeholder={t('admin.products.edit.placeholders.short_description')}
                    rows={2}
                  />
                )}
              </form.AppField>
            </DetailView.Field>

            <DetailView.Field label={t('admin.products.edit.fields.description')}>
              <form.AppField name="description">
                {() => (
                  <FormTextArea
                    placeholder={t('admin.products.edit.placeholders.description')}
                    rows={4}
                  />
                )}
              </form.AppField>
            </DetailView.Field>
          </DetailView.Section>

          {/* 4. MÉTADONNÉES - SEO, Tags, Dates */}
          <DetailView.Section icon={Info} span={2} title="Métadonnées">
            <DetailView.FieldGroup layout="grid-2">
              <DetailView.Field label={t('admin.products.edit.fields.secondary_category_id')}>
                <form.AppField name="secondary_category_id">
                  {() => (
                    <FormAutocomplete
                      allowCreate
                      mode="single"
                      placeholder="Rechercher une catégorie secondaire..."
                      suggestions={[
                        'Miels & Apiculture',
                        'Huiles & Olives', 
                        'Produits transformés',
                        'Épices & Condiments',
                        'Cosmétiques naturels',
                        'Artisanat local',
                        'Produits saisonniers',
                        'Agriculture biologique',
                        'Commerce équitable',
                        'Produits de la mer'
                      ]}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>

              <DetailView.Field description="Recherchez ou créez des tags" label={t('admin.products.edit.fields.tags')}>
                <form.AppField name="tags">
                  {() => (
                    <FormAutocomplete
                      maxTags={10}
                      mode="tags"
                      placeholder="Rechercher des tags..."
                      suggestions={[
                        'bio', 'local', 'artisanal', 'durable', 'équitable', 'miel', 'naturel', 'premium', 'traditionnel', 'madagascar'
                      ]}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>
            </DetailView.FieldGroup>

            <DetailView.FieldGroup layout="grid-2">
              <DetailView.Field label={t('admin.products.edit.fields.launch_date')}>
                <form.AppField name="launch_date">
                  {() => (
                    <FormDateField />
                  )}
                </form.AppField>
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.discontinue_date')}>
                <form.AppField name="discontinue_date">
                  {() => (
                    <FormDateField />
                  )}
                </form.AppField>
              </DetailView.Field>
            </DetailView.FieldGroup>

            <DetailView.FieldGroup layout="grid-2">
              <DetailView.Field description="Max 60 caractères" label={t('admin.products.edit.fields.seo_title')}>
                <form.AppField name="seo_title">
                  {() => (
                    <FormTextField
                      maxLength={60}
                      placeholder={t('admin.products.edit.placeholders.seo_title')}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>

              <DetailView.Field description="Max 160 caractères" label={t('admin.products.edit.fields.seo_description')}>
                <form.AppField name="seo_description">
                  {() => (
                    <FormTextArea
                      maxLength={160}
                      placeholder={t('admin.products.edit.placeholders.seo_description')}
                      rows={2}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>
            </DetailView.FieldGroup>
          </DetailView.Section>

          {/* 5. DÉTAILS - Logistique & Caractéristiques */}
          <DetailView.Section icon={Package} span={2} title="Détails produit">
            <DetailView.FieldGroup layout="grid-3">
              <DetailView.Field label={t('admin.products.edit.fields.weight_grams')}>
                <form.AppField name="weight_grams">
                  {() => (
                    <FormNumberField
                      emptyValue={undefined}
                      kind="int"
                      min={0}
                      placeholder="0"
                    />
                  )}
                </form.AppField>
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.origin_country')}>
                <form.AppField name="origin_country">
                  {() => (
                    <FormAutocomplete
                      allowCreate={false}
                      mode="single"
                      placeholder="Rechercher un pays..."
                      suggestions={[
                        'France','Madagascar','Belgique','Luxembourg','Espagne','Italie','Allemagne','Pays-Bas','Maroc','Tunisie','Portugal','Suisse'
                      ]}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.partner_source')}>
                <form.AppField name="partner_source">
                  {() => (
                    <FormAutocomplete
                      allowCreate
                      mode="single"
                      placeholder="Rechercher un partenaire..."
                      suggestions={[
                        'HABEEBEE','ILANGA NATURE','PROMIEL','Producteur local','Coopérative agricole','Artisan local','Ferme biologique'
                      ]}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>
            </DetailView.FieldGroup>

            <DetailView.FieldGroup layout="grid-2">
              <DetailView.Field description="Allergènes officiels selon réglementation EU" label={t('admin.products.edit.fields.allergens')}>
                <form.AppField name="allergens">
                  {() => (
                    <FormAutocomplete
                      maxTags={8}
                      mode="tags"
                      placeholder="Rechercher des allergènes..."
                      suggestions={[
                        'Gluten','Lactose','Fruits à coque','Arachides','Œufs','Poisson','Crustacés','Mollusques','Soja','Céleri','Moutarde','Graines de sésame','Sulfites','Lupin'
                      ]}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>

              <DetailView.Field description="Labels de qualité et certifications officielles" label={t('admin.products.edit.fields.certifications')}>
                <form.AppField name="certifications">
                  {() => (
                    <FormAutocomplete
                      maxTags={5}
                      mode="tags"
                      placeholder="Rechercher des certifications..."
                      suggestions={[
                        'Agriculture Biologique','Commerce Équitable','Fair Trade','AOC','AOP','IGP','Label Rouge','Demeter','Nature & Progrès','Rainforest Alliance','UTZ Certified','MSC','ASC','Slow Food','Max Havelaar'
                      ]}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>
            </DetailView.FieldGroup>
          </DetailView.Section>

          {/* Section Images - Span sur 2 colonnes */}
          <DetailView.Section icon={ImageIcon} span={2} title={t('admin.products.edit.sections.images')}>
            <div className='w-full space-y-6'>
              

              <div className='w-full space-y-6'>
                
                {(Array.isArray(currentData?.images) && currentData.images.length > 0) ||
                 (Array.isArray(product?.images) && (product!.images as string[]).length > 0) ? (
                  <form.AppField name="images">
                    {(field) => (
                      <OptimizedImageMasonry
                        enableReorder
                        showActions
                        imageBlurMap={imageBlurMap}
                        className='w-full'
                        images={(() => {
                          const v = (field.state.value as string[] | undefined)
                          if (Array.isArray(v) && v.length > 0) return v
                          return Array.isArray(product?.images) ? (product!.images as string[]) : []
                        })()}
                        productId={productId}
                        onImageClick={(_imageUrl: string, _index: number) => {}}
                        onImageDelete={async (imageUrl: string, index: number) => {
                          try {
                            if (!productId) return;
                            const current = (field.state.value as string[]) || []
                            const next = current.filter((_, i) => i !== index)

                            // Essayer de supprimer du storage si c'est une image Supabase
                            let filePath = ''
                            const marker = '/storage/v1/object/public/products/'
                            if (imageUrl.includes(marker)) {
                              filePath = imageUrl.split(marker)[1]
                            }

                            if (filePath) {
                              const url = new URL('/api/upload/product-images', window.location.origin)
                              url.searchParams.set('path', filePath)
                              url.searchParams.set('productId', productId)
                              url.searchParams.set('imageUrl', imageUrl)
                              const del = await fetch(url.toString(), { method: 'DELETE' })
                              if (!del.ok) throw new Error('Erreur suppression image')
                              const result = await del.json()
                              field.handleChange(result.images)
                            } else {
                              // Fallback: juste mettre à jour l'ordre/array côté DB (sans storage)
                              const response = await fetch('/api/upload/product-images', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ productId, images: next })
                              })
                              if (!response.ok) throw new Error('Erreur mise à jour des images')
                              const result = await response.json()
                              field.handleChange(result.images)
                            }

                            // pas de refresh: la map sera à jour lors du prochain fetch
                            toast({ variant: 'default', title: t('common.updated'), description: t('admin.products.edit.images.deleted') })
                          } catch {
                            toast({ variant: 'destructive', title: t('common.error'), description: t('admin.products.edit.images.delete_error') })
                          }
                        }}
                        onImagePreview={(_imageUrl: string, index: number) => {
                          setGalleryModal({
                            isOpen: true,
                            images: (() => {
                              const v = (field.state.value as string[] | undefined)
                              if (Array.isArray(v) && v.length > 0) return v
                              return Array.isArray(product?.images) ? (product!.images as string[]) : []
                            })(),
                            initialIndex: index
                          });
                        }}
                        onImageReplace={(imageUrl: string, index: number) => {
                          const input = document.createElement('input')
                          input.type = 'file'
                          input.accept = 'image/*'
                          input.style.display = 'none'
                          input.addEventListener('click', (e) => { e.stopPropagation() })
                          input.addEventListener('change', async (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0]
                            if (!file || !productId) {
                              input.remove()
                              return
                            }
                            try {
                              const formData = new FormData()
                              formData.append('file', file)
                              formData.append('productId', productId)
                              formData.append('oldImageUrl', imageUrl)
                              formData.append('imageIndex', String(index))
                              const response = await fetch('/api/upload/product-images', { method: 'PUT', body: formData })
                              if (!response.ok) throw new Error('Erreur remplacement image')
                              const result = await response.json()
                              field.handleChange(result.images)
                              // pas de refresh: la map sera à jour lors du prochain fetch
                              toast({ variant: 'default', title: t('common.updated'), description: t('admin.products.edit.images.replaced') })
                            } catch {
                              toast({ variant: 'destructive', title: t('common.error'), description: t('admin.products.edit.images.replace_error') })
                            } finally {
                              input.remove()
                            }
                          })
                          document.body.append(input)
                          input.click()
                        }}
                        onImagesReorder={async (_oldIndex: number, _newIndex: number, newImages: string[]) => {
                          try {
                            if (!productId) return;
                            const response = await fetch('/api/upload/product-images', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ productId, images: newImages })
                            })
                            if (!response.ok) throw new Error('Erreur mise à jour ordre des images')
                            const result = await response.json()
                            field.handleChange(result.images)
                            // pas de refresh: la map sera à jour lors du prochain fetch
                            toast({ variant: 'default', title: t('common.updated'), description: t('admin.products.edit.images.order_updated') })
                          } catch {
                            toast({ variant: 'destructive', title: t('common.error'), description: t('admin.products.edit.images.order_update_error') })
                          }
                        }}
                      />
                    )}
                  </form.AppField>
                ) : null}

                {/* Zone d'upload d'images */}
                <div className="space-y-4">
                  <label className="text-sm font-medium">{t('admin.products.edit.images.add')}</label>
                  <form.AppField name="images">
                    {() => (
                      <FormImagesUploader
                        multiple
                        disabled={false}
                        height="h-32"
                        productId={productId}
                        width="w-full"
                      />
                    )}
                  </form.AppField>
                </div>
              </div>
            </div>
          </DetailView.Section>
        </DetailView>
        </form.AppForm>
      </AdminDetailLayout>
      
      
      {galleryModal.isOpen && (
        <ImageGalleryModal
          showActions
          images={galleryModal.images}
          initialIndex={galleryModal.initialIndex}
          isOpen={galleryModal.isOpen}
          imageBlurMap={imageBlurMap}
          onClose={() => setGalleryModal(prev => ({ ...prev, isOpen: false }))}
          onImageDelete={async (_imageUrl: string, index: number) => {
            const newImages = currentData?.images?.filter((_: string, i: number) => i !== index) || [];
            form.setFieldValue('images', newImages);
            setGalleryModal(prev => ({ 
              ...prev, 
              images: newImages,
              initialIndex: index >= newImages.length ? Math.max(0, newImages.length - 1) : index
            }));
            if (newImages.length === 0) {
              setGalleryModal(prev => ({ ...prev, isOpen: false }));
            }
          }}
          onImageReplace={async (_imageUrl: string, _index: number) => {
            setGalleryModal(prev => ({ ...prev, isOpen: false }));
            
          }}
        />
      )}
    </AdminPageLayout>
  )
}

export default AdminProductEditPageNew
