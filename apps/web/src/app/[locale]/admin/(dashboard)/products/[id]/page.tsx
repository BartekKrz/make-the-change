"use client"

import { type FC, useCallback, useMemo, useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl';
import { RouterOutputs, RouterInputs, trpc } from '@/lib/trpc'
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
import { FormSelect, FormToggle } from '@/app/[locale]/admin/(dashboard)/components/ui/form-components'
import { Input } from '../../components/ui/input';
import { TextArea } from '../../components/ui/textarea';
import { TagsAutocomplete } from '@/app/[locale]/admin/(dashboard)/components/ui/tags-autocomplete';
import { SingleAutocomplete } from '@/app/[locale]/admin/(dashboard)/components/ui/single-autocomplete';

import { ImageGalleryModal } from "@/components/images/image-gallery";
import { OptimizedImageMasonry } from "@/components/ui/optimized-image-masonry";
import { ProductBlurService, type ProductBlurHash } from "@/lib/services/product-blur-service";
import { ImageUploaderField } from "@/components/images/image-uploader";
import { ModernDatePicker } from "@/components/ui/date-picker";

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
  const createUpdateMutation = () => {
    return trpc.admin.products.update.useMutation({
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
  }
  
  const updateMutation = createUpdateMutation()
  
  const handleSave = useCallback(async (patch: Partial<ProductFormData>) => {
    if (isValidProductId(productId)) {
      await updateMutation.mutateAsync({ id: productId, patch })
    }
  }, [productId, updateMutation])

  // Configuration des champs pour auto-save
  const formConfig = useMemo(() => ({
    initialData: product as ProductFormData & { id: string },
    onSave: handleSave,
    immediateFields: [
      'is_active', 'featured', 'is_hero_product', 'min_tier', 'fulfillment_method', 
      'category_id', 'producer_id', 'secondary_category_id'
    ] as (keyof ProductFormData)[],
    autoSaveFields: [
      'name', 'slug', 'short_description', 'description', 'price_points', 'stock_quantity',
      'price_eur_equivalent', 'weight_grams', 'origin_country', 'partner_source',
      'launch_date', 'discontinue_date', 'seo_title', 'seo_description'
    ] as (keyof ProductFormData)[],
    autoSaveDelay: 3000
  }), [product, handleSave])

  const entityForm = useEntityForm(formConfig)
  
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
  }, [productId, product?.images]);

  if (!isValidProductId(productId)) {
    return (
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

  if (isLoading || !product) {
    return (
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
  }

  const currentData = entityForm.getCurrentData()
  const saveStatus = entityForm.getSaveStatus()

  const breadcrumbs = [
    { href: '/admin/dashboard', label: t('admin.common.breadcrumbs.dashboard'), icon: Home },
    { href: '/admin/products', label: t('admin.common.breadcrumbs.products'), icon: Package },
    { label: currentData.name }
  ]

  return (
    <AdminPageLayout>
      <AdminDetailLayout
        headerContent={
          <AdminDetailHeader
            breadcrumbs={breadcrumbs}
            title={currentData.name}
            subtitle={`${t('admin.products.edit.subtitle')} • ${currentData.slug || t('admin.products.edit.no_slug')}`}
            productImage={currentData.images && currentData.images.length > 0 ? currentData.images[0] : undefined}
            actions={
              <AdminDetailActions
                saveStatus={saveStatus}
                onSaveAll={entityForm.saveAll}
                
              />
            }
          />
        }
      >
        <DetailView variant="cards" spacing="md" gridCols={2}>
          {/* 1. ESSENTIEL - Informations de base */}
          <DetailView.Section icon={Info} title="Informations essentielles">
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

            <DetailView.Field label={t('admin.products.edit.fields.category_id')} required>
              <SingleAutocomplete
                value={currentData.category_id}
                onChange={(value) => entityForm.updateField('category_id', value || '')}
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
            </DetailView.Field>

            <DetailView.Field label={t('admin.products.edit.fields.min_tier')} required>
              <FormSelect
                value={currentData.min_tier || ''}
                onChange={(value) => entityForm.updateField('min_tier', value)}
                options={[
                  { value: 'explorateur', label: t('admin.products.edit.tiers.explorateur') },
                  { value: 'protecteur', label: t('admin.products.edit.tiers.protecteur') },
                  { value: 'ambassadeur', label: t('admin.products.edit.tiers.ambassadeur') }
                ]}
                placeholder={t('admin.products.edit.placeholders.min_tier')}
              />
            </DetailView.Field>
          </DetailView.Section>

          {/* 2. PRIX & STATUTS - Paramètres business */}
          <DetailView.Section icon={DollarSign} title="Prix & Statuts">
            <DetailView.FieldGroup layout="grid-2">
              <DetailView.Field label={t('admin.products.edit.fields.price_points')} required>
                <Input
                  type="number"
                  placeholder="100"
                  value={currentData.price_points?.toString() || ''}
                  onChange={(e) => entityForm.updateField('price_points', parseInt(e.target.value) || 0)}
                />
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.price_eur_equivalent')}>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={currentData.price_eur_equivalent?.toString() || ''}
                  onChange={(e) => entityForm.updateField('price_eur_equivalent', parseFloat(e.target.value) || undefined)}
                />
              </DetailView.Field>
            </DetailView.FieldGroup>

            <DetailView.FieldGroup layout="row" label="Visibilité">
              <DetailView.Field label={t('admin.products.edit.fields.is_active')}>
                <FormToggle
                  checked={currentData.is_active || false}
                  onChange={(checked) => entityForm.updateField('is_active', checked)}
                  label={t('admin.products.edit.status.active')}
                  description={t('admin.products.edit.status.active_description')}
                />
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.featured')}>
                <FormToggle
                  checked={currentData.featured || false}
                  onChange={(checked) => entityForm.updateField('featured', checked)}
                  label={t('admin.products.edit.status.featured')}
                  description={t('admin.products.edit.status.featured_description')}
                />
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.is_hero_product')}>
                <FormToggle
                  checked={currentData.is_hero_product || false}
                  onChange={(checked) => entityForm.updateField('is_hero_product', checked)}
                  label={t('admin.products.edit.status.hero')}
                  description={t('admin.products.edit.status.hero_description')}
                />
              </DetailView.Field>
            </DetailView.FieldGroup>
          </DetailView.Section>

          {/* 3. CONFIGURATION - Stock & Descriptions */}
          <DetailView.Section icon={Package} title="Configuration">
            <DetailView.FieldGroup layout="grid-2">
              <DetailView.Field label={t('admin.products.edit.fields.fulfillment_method')}>
                <SingleAutocomplete
                  value={currentData.fulfillment_method}
                  onChange={(value) => entityForm.updateField('fulfillment_method', value)}
                  suggestions={[
                    'stock',
                    'dropship', 
                    'ondemand'
                  ]}
                  placeholder="Rechercher une méthode..."
                  allowCreate={false}
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

            <DetailView.Field label={t('admin.products.edit.fields.short_description')}>
              <TextArea
                placeholder={t('admin.products.edit.placeholders.short_description')}
                rows={2}
                value={currentData.short_description || ''}
                onChange={(e) => entityForm.updateField('short_description', e.target.value)}
              />
            </DetailView.Field>

            <DetailView.Field label={t('admin.products.edit.fields.description')}>
              <TextArea
                placeholder={t('admin.products.edit.placeholders.description')}
                rows={4}
                value={currentData.description || ''}
                onChange={(e) => entityForm.updateField('description', e.target.value)}
              />
            </DetailView.Field>
          </DetailView.Section>

          {/* 4. MÉTADONNÉES - SEO, Tags, Dates */}
          <DetailView.Section icon={Info} title="Métadonnées" span={2}>
            <DetailView.FieldGroup layout="grid-2">
              <DetailView.Field label={t('admin.products.edit.fields.secondary_category_id')}>
                <SingleAutocomplete
                  value={currentData.secondary_category_id}
                  onChange={(value) => entityForm.updateField('secondary_category_id', value)}
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
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.tags')} description="Recherchez ou créez des tags">
                <TagsAutocomplete
                  value={currentData.tags || []}
                  onChange={(newTags) => entityForm.updateField('tags', newTags)}
                  suggestions={['bio', 'local', 'artisanal', 'durable', 'équitable', 'miel', 'naturel', 'premium', 'traditionnel', 'madagascar']}
                  placeholder="Rechercher des tags..."
                  maxTags={10}
                />
              </DetailView.Field>
            </DetailView.FieldGroup>

            <DetailView.FieldGroup layout="grid-2">
              <DetailView.Field label={t('admin.products.edit.fields.launch_date')}>
                <Input
                  type="date"
                  value={currentData.launch_date || ''}
                  onChange={(e) => entityForm.updateField('launch_date', e.target.value || undefined)}
                />
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.discontinue_date')}>
                <Input
                  type="date"
                  value={currentData.discontinue_date || ''}
                  onChange={(e) => entityForm.updateField('discontinue_date', e.target.value || undefined)}
                />
              </DetailView.Field>
            </DetailView.FieldGroup>

            <DetailView.FieldGroup layout="grid-2">
              <DetailView.Field label={t('admin.products.edit.fields.seo_title')} description="Max 60 caractères">
                <Input
                  placeholder={t('admin.products.edit.placeholders.seo_title')}
                  value={currentData.seo_title || ''}
                  maxLength={60}
                  onChange={(e) => entityForm.updateField('seo_title', e.target.value || undefined)}
                />
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.seo_description')} description="Max 160 caractères">
                <TextArea
                  placeholder={t('admin.products.edit.placeholders.seo_description')}
                  value={currentData.seo_description || ''}
                  maxLength={160}
                  rows={2}
                  onChange={(e) => entityForm.updateField('seo_description', e.target.value || undefined)}
                />
              </DetailView.Field>
            </DetailView.FieldGroup>
          </DetailView.Section>

          {/* 5. DÉTAILS - Logistique & Caractéristiques */}
          <DetailView.Section icon={Package} title="Détails produit" span={2}>
            <DetailView.FieldGroup layout="grid-3">
              <DetailView.Field label={t('admin.products.edit.fields.weight_grams')}>
                <Input
                  type="number"
                  placeholder="0"
                  value={currentData.weight_grams?.toString() || ''}
                  onChange={(e) => entityForm.updateField('weight_grams', parseInt(e.target.value) || undefined)}
                />
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.origin_country')}>
                <SingleAutocomplete
                  value={currentData.origin_country}
                  onChange={(value) => entityForm.updateField('origin_country', value)}
                  suggestions={[
                    'France',
                    'Madagascar',
                    'Belgique',
                    'Luxembourg',
                    'Espagne',
                    'Italie',
                    'Allemagne',
                    'Pays-Bas',
                    'Maroc',
                    'Tunisie',
                    'Portugal',
                    'Suisse'
                  ]}
                  placeholder="Rechercher un pays..."
                  allowCreate={false}
                />
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.partner_source')}>
                <SingleAutocomplete
                  value={currentData.partner_source}
                  onChange={(value) => entityForm.updateField('partner_source', value)}
                  suggestions={[
                    'HABEEBEE',
                    'ILANGA NATURE', 
                    'PROMIEL',
                    'Producteur local',
                    'Coopérative agricole',
                    'Artisan local',
                    'Ferme biologique'
                  ]}
                  placeholder="Rechercher un partenaire..."
                  allowCreate={true}
                />
              </DetailView.Field>
            </DetailView.FieldGroup>

            <DetailView.FieldGroup layout="grid-2">
              <DetailView.Field label={t('admin.products.edit.fields.allergens')} description="Allergènes officiels selon réglementation EU">
                <TagsAutocomplete
                  value={currentData.allergens || []}
                  onChange={(newAllergens) => entityForm.updateField('allergens', newAllergens)}
                  suggestions={[
                    'Gluten',
                    'Lactose', 
                    'Fruits à coque',
                    'Arachides',
                    'Œufs',
                    'Poisson',
                    'Crustacés',
                    'Mollusques',
                    'Soja',
                    'Céleri',
                    'Moutarde',
                    'Graines de sésame',
                    'Sulfites',
                    'Lupin'
                  ]}
                  placeholder="Rechercher des allergènes..."
                  maxTags={8}
                />
              </DetailView.Field>

              <DetailView.Field label={t('admin.products.edit.fields.certifications')} description="Labels de qualité et certifications officielles">
                <TagsAutocomplete
                  value={currentData.certifications || []}
                  onChange={(newCertifications) => entityForm.updateField('certifications', newCertifications)}
                  suggestions={[
                    'Agriculture Biologique',
                    'Commerce Équitable',
                    'Fair Trade',
                    'AOC',
                    'AOP',
                    'IGP',
                    'Label Rouge',
                    'Demeter',
                    'Nature & Progrès',
                    'Rainforest Alliance',
                    'UTZ Certified',
                    'MSC',
                    'ASC',
                    'Slow Food',
                    'Max Havelaar'
                  ]}
                  placeholder="Rechercher des certifications..."
                  maxTags={5}
                />
              </DetailView.Field>
            </DetailView.FieldGroup>
          </DetailView.Section>

          {/* Section Images - Span sur 2 colonnes */}
          <DetailView.Section icon={ImageIcon} title={t('admin.products.edit.sections.images')} span={2}>
            <div className='w-full space-y-6'>
              {/* 🚀 NOUVEAU : Système DB Blur - Stats debug */}
              {process.env.NODE_ENV === 'development' && currentData.images && currentData.images.length > 0 && (
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
                {currentData.images && currentData.images.length > 0 && (
                  <OptimizedImageMasonry
                    images={currentData.images}
                    className='w-full'
                    showActions={true}
                    enableReorder={true}
                    blurHashes={blurState.blurHashes}  // 🚀 NOUVEAU : Blur hashes depuis DB
                    productId={productId}        // 🚀 NOUVEAU : ID pour diagnostics
                    onImageClick={(_imageUrl: string, _index: number) => {
                      // Image click handler
                    }}
                    onImagePreview={(_imageUrl: string, index: number) => {
                      setGalleryModal({
                        isOpen: true,
                        images: currentData.images || [],
                        initialIndex: index
                      });
                    }}
                    onImagesReorder={async (_oldIndex: number, _newIndex: number, newImages: string[]) => {
                      entityForm.updateField('images', newImages);
                    }}
                    onImageReplace={async (_imageUrl: string, index: number) => {
                      // Créer un input file pour sélectionner une nouvelle image
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.style.display = 'none';
                      
                      input.addEventListener('click', (e) => {
                        e.stopPropagation();
                      });
                      
                      input.onchange = async (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          try {
                            // TODO: Upload du fichier vers Supabase
                            // Simuler l'upload pour le moment
                            const newImageUrl = URL.createObjectURL(file);
                            const newImages = [...(currentData.images || [])];
                            newImages[index] = newImageUrl;
                            
                            entityForm.updateField('images', newImages);
                          } catch (error) {
                            console.error('❌ Error during replacement:', error);
                          }
                        }
                        document.body.removeChild(input);
                      };
                      
                      document.body.appendChild(input);
                      input.click();
                    }}
                    onImageDelete={async (_imageUrl: string, index: number) => {
                      const newImages = currentData.images?.filter((_, i) => i !== index) || [];
                      entityForm.updateField('images', newImages);
                    }}
                  />
                )}

                {/* Zone d'upload d'images */}
                <div className="space-y-4">
                  <label className="text-sm font-medium">{t('admin.products.edit.images.add')}</label>
                  <ImageUploaderField
                    field={{
                      state: {
                        value: currentData.images || []
                      },
                      handleChange: (updater) => {
                        const newImages = typeof updater === 'function' 
                          ? updater(currentData.images || [])
                          : updater;
                        console.log('🔄 [DEBUG] ImageUploaderField handleChange appelé avec:', newImages);
                        console.log('🔄 [DEBUG] Images actuelles avant mise à jour:', currentData.images);
                        console.log('🔄 [DEBUG] Appel de entityForm.updateField("images", newImages)');
                        entityForm.updateField('images', newImages);
                      }
                    }}
                    onImagesChange={(images) => {
                      console.log('📷 [DEBUG] onImagesChange appelé avec:', images);
                      console.log('📷 [DEBUG] Déclenchement de entityForm.updateField("images", images)');
                      entityForm.updateField('images', images);
                    }}
                    multiple={true}
                    productId={productId}
                    disabled={false}
                    width="w-full"
                    height="h-32"
                  />
                </div>
              </div>
            </div>
          </DetailView.Section>
        </DetailView>
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
            console.log('🔄 Replace image from modal:', imageUrl, 'index:', index);
            setGalleryModal(prev => ({ ...prev, isOpen: false }));
            // Logique de remplacement ici
          }}
          onImageDelete={async (imageUrl: string, index: number) => {
            console.log('🗑️ Delete image from modal:', imageUrl, 'index:', index);
            const newImages = currentData.images?.filter((_: string, i: number) => i !== index) || [];
            entityForm.updateField('images', newImages);
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