"use client"
import { type FC, useCallback, useMemo, useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl';
import { RouterOutputs, RouterInputs, trpc } from '@/lib/trpc'
import { useToast } from '@/hooks/use-toast'
import type { ProductFormData } from '@/lib/validators/product'
import { productFormSchema, defaultProductValues } from '@/lib/validators/product'
import { EmptyState } from '@/app/[locale]/admin/(dashboard)/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Package, Info, DollarSign, ImageIcon, Home } from 'lucide-react'
import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout'
import { AdminDetailLayout } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-detail-layout'
import { AdminDetailHeader, AdminDetailActions } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-detail-header'
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view'
import { useAppForm } from '@/app/[locale]/admin/(dashboard)/components/form/app-form'
import { FormTextField, FormTextArea, FormSelect, FormToggle, FormAutocomplete, FormDateField, FormNumberField, FormImagesUploader } from '@/app/[locale]/admin/(dashboard)/components/form'
import { ImageGalleryModal } from "@/components/images/image-gallery";
import { OptimizedImageMasonry } from "@/components/ui/optimized-image-masonry";
import { ProductBlurService, type ProductBlurHash } from "@/lib/services/product-blur-service";


const isValidProductId = (id: string | undefined): id is string => {
  return typeof id === 'string' && id.length > 0
}

type ProductDetail = RouterOutputs['admin']['products']['detail'];
type ProductUpdateInput = RouterInputs['admin']['products']['update'];
type ProductPatch = ProductUpdateInput['patch'];


// Type wrapper pour éviter l'erreur de récursion TypeScript
type MutationContext = {
  prevDetail?: ProductDetail
}

// Types strictement typés sans any
type ProductUpdateMutationInput = {
  id: string
  patch: Partial<ProductDetail>
}

// État pour les blur hashes optimisés
type ProductBlurState = {
  blurHashes: ProductBlurHash[];
  stats: {
    totalImages: number;
    withBlur: number;
    missing: number;
    coverage: number;
  };
  isLoading: boolean;
}

const AdminProductEditPageNew: FC = () => {
  const params = useParams<{ id: string }>()
  const productId = params?.id
  const utils = trpc.useUtils()
  const { toast } = useToast()
  const t = useTranslations()
  
  // État pour le modal de prévisualisation d'images
  const [galleryModal, setGalleryModal] = useState<{
    isOpen: boolean;
    images: string[];
    initialIndex: number;
  }>({
    isOpen: false,
    images: [],
    initialIndex: 0
  });

  // État pour les blur hashes du nouveau système DB
  const [blurState, setBlurState] = useState<ProductBlurState>({
    blurHashes: [],
    stats: { totalImages: 0, withBlur: 0, missing: 0, coverage: 100 },
    isLoading: false
  });

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

  // Solution d'expert : Fonction wrapper pour éviter la récursion TypeScript
  const createUpdateMutation = () => trpc.admin.products.update.useMutation({
    onMutate: async (variables: ProductUpdateMutationInput): Promise<MutationContext> => {
      const { id, patch } = variables
      await utils.admin.products.detail.cancel({ productId: id })
      const prevDetail = utils.admin.products.detail.getData({ productId: id })
        
      if (prevDetail) {
        const optimisticUpdate: ProductDetail = { ...prevDetail, ...patch }
        utils.admin.products.detail.setData({ productId: id }, optimisticUpdate)
      }
        
      return { prevDetail }
    },
    onError: (error: unknown, variables: ProductUpdateMutationInput, context?: MutationContext) => {
      if (context?.prevDetail) {
        utils.admin.products.detail.setData({ productId: variables.id }, context.prevDetail)
      }
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue'
      toast({
        variant: 'destructive',
        title: t('admin.products.edit.toast.error.title'),
        description: errorMessage || t('admin.products.edit.toast.error.description'),
      })
    },
    onSuccess: (data: ProductDetail) => {
      toast({
        variant: 'default',
        title: t('admin.products.edit.toast.success.title'),
        description: t('admin.products.edit.toast.success.description'),
      })
    },
    onSettled: (_data: ProductDetail | undefined, _error: unknown, variables: ProductUpdateMutationInput) => {
      utils.admin.products.detail.invalidate({ productId: variables.id })
      utils.admin.products.list.invalidate()
    }
  })
  
  const updateMutation = createUpdateMutation()
  
  // TanStack Form configuration
  const formDefaultValues = useMemo(() => {
    if (!product) return defaultProductValues
    return { ...defaultProductValues, ...product }
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

  // Auto-save with TanStack Form listeners
  const immediateFields = useMemo(() => [
    'is_active', 'featured', 'is_hero_product', 'min_tier', 'fulfillment_method', 
    'category_id', 'producer_id', 'secondary_category_id'
  ] as (keyof ProductFormData)[], [])

  const autoSaveFields = useMemo(() => [
    'name', 'slug', 'short_description', 'description', 'price_points', 'stock_quantity',
    'price_eur_equivalent', 'weight_grams', 'origin_country', 'partner_source',
    'launch_date', 'discontinue_date', 'seo_title', 'seo_description'
  ] as (keyof ProductFormData)[], [])

  // Auto-save logic with debouncing
  const handleAutoSave = useCallback(async (fieldName: string, value: unknown) => {
    if (!isValidProductId(productId) || !product) {
      return
    }
    
    // Only save if value actually changed
    const currentValue = (lastSavedRef.current as Record<string, unknown>)[fieldName]
    if (currentValue === value) {
      return
    }
    
    const patch = { [fieldName]: value }
    
    try {
      await updateMutation.mutateAsync({ id: productId, patch })
      // Update snapshot
      lastSavedRef.current = { ...lastSavedRef.current, ...(patch as Partial<ProductFormData>) }
      // Reset form dirty state after successful save
      form.reset(form.state.values)
    } catch (error) {
      console.error(`Auto-save failed for ${fieldName}:`, error)
      toast({
        variant: 'destructive',
        title: 'Erreur de sauvegarde automatique',
        description: `Impossible de sauvegarder le champ ${fieldName}`,
      })
    }
  }, [productId, product, updateMutation, toast, form])

  // Auto-save function that actually saves to DB
  const autoSave = useCallback(async () => {
    if (form.state.isDirty) {
      try {
        const values = form.state.values as ProductFormData
        // Only save simple string/number fields that changed
        const simplePatch: Partial<ProductFormData> = {}
        
        // Check each simple field
        const simpleFields: (keyof ProductFormData)[] = ['name', 'slug', 'description', 'short_description', 'price_points', 'stock_quantity']
        
        simpleFields.forEach((field) => {
          const currentValue = values[field]
          const originalValue = lastSavedRef.current[field]
          if (currentValue !== originalValue && currentValue !== null && currentValue !== undefined) {
            simplePatch[field] = currentValue as ProductFormData[keyof ProductFormData]
          }
        })

        if (Object.keys(simplePatch).length > 0) {
          console.log('Auto-saving simple patch:', simplePatch) // Debug log
          await updateMutation.mutateAsync({ id: productId, patch: simplePatch })
          
          // Update last saved snapshot to reflect saved state
          lastSavedRef.current = { ...lastSavedRef.current, ...simplePatch }
          
          console.log('Auto-save successful!') // Debug log
        }
      } catch (error) {
        console.error('Auto-save failed:', error)
      }
    }
  }, [form, productId, updateMutation, formDefaultValues])

  // Debug: Log form state changes
  useEffect(() => {
    console.log('Form state changed:', {
      isDirty: form.state.isDirty,
      values: form.state.values
    })
  }, [form.state.isDirty, form.state.values])

  // Subscribe to form state changes for auto-save
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null
    
    const unsubscribe = form.store.subscribe(() => {
      console.log('Form store changed, isDirty:', form.state.isDirty)
      if (!form.state.isDirty) return;
      console.log('Form is dirty, setting auto-save timeout')
        
      // Clear previous timeout
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
        
      // Set new timeout
      timeoutId = setTimeout(() => {
        console.log('Auto-save timeout triggered')
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
  }, [autoSave])

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
    } catch (error) {
      console.error('Manual save failed:', error)
      toast({
        variant: 'destructive',
        title: 'Erreur de sauvegarde',
        description: 'Impossible de sauvegarder les modifications.',
      })
    }
  }, [form.state.values, productId, product, updateMutation, form, toast])

  const breadcrumbs = [
    { href: '/admin/dashboard', label: t('admin.common.breadcrumbs.dashboard'), icon: Home },
    { href: '/admin/products', label: t('admin.common.breadcrumbs.products'), icon: Package },
    { label: currentData?.name || product?.name || 'Produit' }
  ]
  
  // Récupération des blur hashes depuis la DB
  useEffect(() => {
    if (!productId || !product || !product.images?.length) {
      return;
    }

    const fetchProductWithBlur = async () => {
      setBlurState(prev => ({ ...prev, isLoading: true }));
      
      try {
        const productWithBlur = await ProductBlurService.getProductWithBlur(productId);
        
        if (productWithBlur) {
          const stats = {
            totalImages: productWithBlur.total_images,
            withBlur: productWithBlur.blur_count,
            missing: productWithBlur.total_images - productWithBlur.blur_count,
            coverage: productWithBlur.blur_coverage_percent
          };
          
          setBlurState({
            blurHashes: productWithBlur.computed_blur_hashes,
            stats,
            isLoading: false
          });
        } else {
          // Fallback si pas de données en DB
          const fallbackStats = {
            totalImages: product.images.length,
            withBlur: 0,
            missing: product.images.length,
            coverage: 0
          };
          
          setBlurState({
            blurHashes: [],
            stats: fallbackStats,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Error fetching blurhashes:', error);
        setBlurState(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchProductWithBlur();
  }, [productId, product?.images, product]);

  if (!isValidProductId(productId)) return (
    <AdminPageLayout>
      <div className="p-8">
        <EmptyState
          variant="muted"
          icon={Package}
          title={t('admin.products.edit.errors.missing_id.title')}
          description={t('admin.products.edit.errors.missing_id.description')}
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
            variant="muted"
            icon={Package}
            title={isNotFound ? t('admin.products.edit.errors.not_found.title') : t('admin.products.edit.errors.loading.title')}
            description={
              isNotFound 
                ? t('admin.products.edit.errors.not_found.description')
                : error.message || t('admin.products.edit.errors.loading.description')
            }
            action={
              isServerError ? (
                <Button size="sm" variant="outline" onClick={() => refetch()}>
                  {t('admin.common.retry')}
                </Button>
              ) : undefined
            }
          />
        </div>
      </AdminPageLayout>
    )
  }

  if (isLoading || !product) return (
    <AdminPageLayout>
      <div className="p-8">
        <EmptyState
          variant="muted"
          icon={Package}
          title={t('admin.products.edit.loading.title')}
          description={t('admin.products.edit.loading.description')}
        />
      </div>
    </AdminPageLayout>
  )

  // Ensure form is initialized before accessing state
  if (!form.state.values) {
    return (
      <AdminPageLayout>
        <div className="p-8">
          <EmptyState
            variant="muted"
            icon={Package}
            title="Initialisation du formulaire..."
            description="Veuillez patienter pendant l'initialisation."
          />
        </div>
      </AdminPageLayout>
    )
  }


  return (
    <AdminPageLayout>
      <AdminDetailLayout
        headerContent={
          <AdminDetailHeader
            breadcrumbs={breadcrumbs}
            title={currentData?.name || product?.name || 'Produit'}
            subtitle={`${t('admin.products.edit.subtitle')} • ${currentData?.slug || product?.slug || t('admin.products.edit.no_slug')}`}
            productImage={currentData?.images && currentData.images.length > 0 ? currentData.images[0] : product?.images?.[0]}
            actions={
              <AdminDetailActions
                saveStatus={saveStatus}
                onSaveAll={handleSaveAll}
              />
            }
          />
        }
      >
        <form.AppForm>
        <DetailView variant="cards" spacing="md" gridCols={2}>
          {/* 1. ESSENTIEL - Informations de base */}
          <DetailView.Section icon={Info} title="Informations essentielles">
            <DetailView.Field label={t('admin.products.edit.fields.name')} required>
              <form.AppField name="name">
                {() => (
                  <FormTextField placeholder={t('admin.products.edit.placeholders.name')} />
                )}
              </form.AppField>
            </DetailView.Field>

            <DetailView.Field label={t('admin.products.edit.fields.slug')} required>
              <form.AppField name="slug">
                {() => (
                  <FormTextField placeholder={t('admin.products.edit.placeholders.slug')} />
                )}
              </form.AppField>
            </DetailView.Field>

            <DetailView.Field label={t('admin.products.edit.fields.category_id')} required>
              <form.AppField name="category_id">
                {() => (
                  <FormAutocomplete
                    mode="single"
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
                    placeholder="Rechercher une catégorie..."
                    allowCreate={true}
                  />
                )}
              </form.AppField>
            </DetailView.Field>

            <DetailView.Field label={t('admin.products.edit.fields.min_tier')} required>
              <form.AppField name="min_tier">
                {() => (
                  <FormSelect
                    options={[
                      { value: 'explorateur', label: t('admin.products.edit.tiers.explorateur') },
                      { value: 'protecteur', label: t('admin.products.edit.tiers.protecteur') },
                      { value: 'ambassadeur', label: t('admin.products.edit.tiers.ambassadeur') }
                    ]}
                    placeholder={t('admin.products.edit.placeholders.min_tier')}
                  />
                )}
              </form.AppField>
            </DetailView.Field>
          </DetailView.Section>

          {/* 2. PRIX & STATUTS - Paramètres business */}
          <DetailView.Section icon={DollarSign} title="Prix & Statuts">
            <DetailView.FieldGroup layout="grid-2">
              <DetailView.Field label={t('admin.products.edit.fields.price_points')} required>
                <form.AppField name="price_points">
                  {() => (
                    <FormNumberField
                      placeholder="100"
                      kind="int"
                      emptyValue={0}
                      min={0}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.price_eur_equivalent')}>
                <form.AppField name="price_eur_equivalent">
                  {() => (
                    <FormNumberField
                      placeholder="0.00"
                      kind="float"
                      emptyValue={undefined}
                      step={0.01}
                      min={0}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>
            </DetailView.FieldGroup>

            <DetailView.FieldGroup layout="row" label="Visibilité">
              <DetailView.Field label={t('admin.products.edit.fields.is_active')}>
                <form.AppField name="is_active">
                  {() => (
                    <FormToggle
                      label={t('admin.products.edit.status.active')}
                      description={t('admin.products.edit.status.active_description')}
                      hideLabel
                    />
                  )}
                </form.AppField>
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.featured')}>
                <form.AppField name="featured">
                  {() => (
                    <FormToggle
                      label={t('admin.products.edit.status.featured')}
                      description={t('admin.products.edit.status.featured_description')}
                      hideLabel
                    />
                  )}
                </form.AppField>
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.is_hero_product')}>
                <form.AppField name="is_hero_product">
                  {() => (
                    <FormToggle
                      label={t('admin.products.edit.status.hero')}
                      description={t('admin.products.edit.status.hero_description')}
                      hideLabel
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
                      mode="single"
                      suggestions={['stock', 'dropship', 'ondemand']}
                      placeholder="Rechercher une méthode..."
                      allowCreate={false}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.stock_quantity')}>
                <form.AppField name="stock_quantity">
                  {() => (
                    <FormNumberField
                      placeholder="0"
                      kind="int"
                      emptyValue={0}
                      min={0}
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
          <DetailView.Section icon={Info} title="Métadonnées" span={2}>
            <DetailView.FieldGroup layout="grid-2">
              <DetailView.Field label={t('admin.products.edit.fields.secondary_category_id')}>
                <form.AppField name="secondary_category_id">
                  {() => (
                    <FormAutocomplete
                      mode="single"
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
                      placeholder="Rechercher une catégorie secondaire..."
                      allowCreate={true}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.tags')} description="Recherchez ou créez des tags">
                <form.AppField name="tags">
                  {() => (
                    <FormAutocomplete
                      mode="tags"
                      suggestions={[
                        'bio', 'local', 'artisanal', 'durable', 'équitable', 'miel', 'naturel', 'premium', 'traditionnel', 'madagascar'
                      ]}
                      placeholder="Rechercher des tags..."
                      maxTags={10}
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
              <DetailView.Field label={t('admin.products.edit.fields.seo_title')} description="Max 60 caractères">
                <form.AppField name="seo_title">
                  {() => (
                    <FormTextField
                      placeholder={t('admin.products.edit.placeholders.seo_title')}
                      maxLength={60}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.seo_description')} description="Max 160 caractères">
                <form.AppField name="seo_description">
                  {() => (
                    <FormTextArea
                      placeholder={t('admin.products.edit.placeholders.seo_description')}
                      maxLength={160}
                      rows={2}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>
            </DetailView.FieldGroup>
          </DetailView.Section>

          {/* 5. DÉTAILS - Logistique & Caractéristiques */}
          <DetailView.Section icon={Package} title="Détails produit" span={2}>
            <DetailView.FieldGroup layout="grid-3">
              <DetailView.Field label={t('admin.products.edit.fields.weight_grams')}>
                <form.AppField name="weight_grams">
                  {() => (
                    <FormNumberField
                      placeholder="0"
                      kind="int"
                      emptyValue={undefined}
                      min={0}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.origin_country')}>
                <form.AppField name="origin_country">
                  {() => (
                    <FormAutocomplete
                      mode="single"
                      suggestions={[
                        'France','Madagascar','Belgique','Luxembourg','Espagne','Italie','Allemagne','Pays-Bas','Maroc','Tunisie','Portugal','Suisse'
                      ]}
                      placeholder="Rechercher un pays..."
                      allowCreate={false}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.partner_source')}>
                <form.AppField name="partner_source">
                  {() => (
                    <FormAutocomplete
                      mode="single"
                      suggestions={[
                        'HABEEBEE','ILANGA NATURE','PROMIEL','Producteur local','Coopérative agricole','Artisan local','Ferme biologique'
                      ]}
                      placeholder="Rechercher un partenaire..."
                      allowCreate={true}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>
            </DetailView.FieldGroup>

            <DetailView.FieldGroup layout="grid-2">
              <DetailView.Field label={t('admin.products.edit.fields.allergens')} description="Allergènes officiels selon réglementation EU">
                <form.AppField name="allergens">
                  {() => (
                    <FormAutocomplete
                      mode="tags"
                      suggestions={[
                        'Gluten','Lactose','Fruits à coque','Arachides','Œufs','Poisson','Crustacés','Mollusques','Soja','Céleri','Moutarde','Graines de sésame','Sulfites','Lupin'
                      ]}
                      placeholder="Rechercher des allergènes..."
                      maxTags={8}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.certifications')} description="Labels de qualité et certifications officielles">
                <form.AppField name="certifications">
                  {() => (
                    <FormAutocomplete
                      mode="tags"
                      suggestions={[
                        'Agriculture Biologique','Commerce Équitable','Fair Trade','AOC','AOP','IGP','Label Rouge','Demeter','Nature & Progrès','Rainforest Alliance','UTZ Certified','MSC','ASC','Slow Food','Max Havelaar'
                      ]}
                      placeholder="Rechercher des certifications..."
                      maxTags={5}
                    />
                  )}
                </form.AppField>
              </DetailView.Field>
            </DetailView.FieldGroup>
          </DetailView.Section>

          {/* Section Images - Span sur 2 colonnes */}
          <DetailView.Section icon={ImageIcon} title={t('admin.products.edit.sections.images')} span={2}>
            <div className='w-full space-y-6'>
              {/* 🚀 NOUVEAU : Système DB Blur - Stats debug */}
              {process.env.NODE_ENV === 'development' && currentData?.images && currentData.images.length > 0 && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">{t('admin.products.edit.blur_system.title')}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-blue-700">
                    <div>
                      <span className="font-medium">{t('admin.products.edit.blur_system.images')}:</span> {blurState.stats.totalImages}
                    </div>
                    <div>
                      <span className="font-medium">{t('admin.products.edit.blur_system.with_blur')}:</span> {blurState.stats.withBlur}
                    </div>
                    <div>
                      <span className="font-medium">{t('admin.products.edit.blur_system.missing')}:</span> {blurState.stats.missing}
                    </div>
                    <div>
                      <span className="font-medium">{t('admin.products.edit.blur_system.coverage')}:</span> {blurState.isLoading ? '🔄' : `${blurState.stats.coverage}%`}
                    </div>
                  </div>
                  {blurState.isLoading && (
                    <div className="mt-2">
                      <div className="bg-blue-200 rounded-full h-1">
                        <div className="bg-blue-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }} />
                      </div>
                      <p className="text-xs text-blue-600 mt-1">{t('admin.products.edit.blur_system.loading')}</p>
                    </div>
                  )}
                </div>
              )}

              <div className='w-full space-y-6'>
                {/* 🚀 Galerie avec nouveau système DB Blur */}
                {currentData?.images && currentData.images.length > 0 && (
                  <form.AppField name="images">
                    {(field) => (
                      <OptimizedImageMasonry
                        images={(field.state.value as string[]) || []}
                        className='w-full'
                        showActions={true}
                        enableReorder={true}
                        blurHashes={blurState.blurHashes}
                        productId={productId}
                        onImageClick={(_imageUrl: string, _index: number) => {}}
                        onImagePreview={(_imageUrl: string, index: number) => {
                          setGalleryModal({
                            isOpen: true,
                            images: ((field.state.value as string[]) || []),
                            initialIndex: index
                          });
                        }}
                        onImagesReorder={(_oldIndex: number, _newIndex: number, newImages: string[]) => {
                          field.handleChange(newImages)
                        }}
                        onImageReplace={(_imageUrl: string, index: number) => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.style.display = 'none';
                          input.addEventListener('click', (e) => { e.stopPropagation(); });
                          input.onchange = async (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              try {
                                // Simulation: prévisualisation locale
                                const newImageUrl = URL.createObjectURL(file);
                                const current = (field.state.value as string[]) || []
                                const next = [...current]
                                next[index] = newImageUrl
                                field.handleChange(next)
                              } catch (error) {
                                console.error('❌ Error during replacement:', error);
                              }
                            }
                            document.body.removeChild(input);
                          };
                          document.body.appendChild(input);
                          input.click();
                        }}
                        onImageDelete={(_imageUrl: string, index: number) => {
                          const current = (field.state.value as string[]) || []
                          const next = current.filter((_, i) => i !== index)
                          field.handleChange(next)
                        }}
                      />
                    )}
                  </form.AppField>
                )}

                {/* Zone d'upload d'images */}
                <div className="space-y-4">
                  <label className="text-sm font-medium">{t('admin.products.edit.images.add')}</label>
                  <form.AppField name="images">
                    {() => (
                      <FormImagesUploader
                        multiple={true}
                        productId={productId}
                        disabled={false}
                        width="w-full"
                        height="h-32"
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
      
      {/* Modal de prévisualisation d'images */}
      {galleryModal.isOpen && (
        <ImageGalleryModal
          images={galleryModal.images}
          initialIndex={galleryModal.initialIndex}
          isOpen={galleryModal.isOpen}
          onClose={() => setGalleryModal(prev => ({ ...prev, isOpen: false }))}
          showActions={true}
          onImageReplace={async (imageUrl: string, index: number) => {
            setGalleryModal(prev => ({ ...prev, isOpen: false }));
            // Logique de remplacement ici
          }}
          onImageDelete={async (imageUrl: string, index: number) => {
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
        />
      )}
    </AdminPageLayout>
  )
}

export default AdminProductEditPageNew
