"use client"

import { ArrowLeft, Package, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FC } from 'react'

import { Badge as _Badge } from '@/app/[locale]/admin/(dashboard)/components/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/[locale]/admin/(dashboard)/components/ui/card'
import { useAppForm, FormInput, FormTextArea, FormSelect, FormCheckbox } from '@/components/form'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { generateSlug as _generateSlug } from '@/lib/form-utils'
import { trpc } from '@/lib/trpc'
import {
  defaultProductValues,
  tierLabels,
  fulfillmentMethodLabels,
  type ProductFormData
} from '@/lib/validators/product'


const NewProductPage: FC = () => {
  const router = useRouter()
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const createProduct = trpc.admin.products.create.useMutation({
    onMutate: async () => {
      await utils.admin.products.list.cancel()
      const prevData = utils.admin.products.list.getData()
      return { prevData }
    },
    onSuccess: (data) => {
      utils.admin.products.list.invalidate()
      router.push(`/admin/products/${data.id}`)
    },
    onError: (_error, _vars, ctx) => {
      if (ctx?.prevData) {
        utils.admin.products.list.setData(undefined, ctx.prevData)
      }
    },
    onSettled: () => {
      utils.admin.products.list.invalidate()
    }
  })

  const form = useAppForm({
    defaultValues: defaultProductValues,
    onSubmit: async ({ value }: { value: ProductFormData }) => {
      try {
        await createProduct.mutateAsync(value)

        toast({
          variant: 'success',
          title: 'Produit créé',
          description: 'Le produit a été créé avec succès'
        })

      } catch (error: unknown) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: error instanceof Error ? error.message : 'Impossible de créer le produit'
        })
      }
    },
  })

  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center gap-4">
        <Link
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          href="/admin/products"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux produits
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Package className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Nouveau produit</h1>
      </div>

      {}
      <form className="space-y-6" onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Informations principales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form.Field name="name">
                {() => (
                  <FormInput
                    required
                    label="Nom du produit"
                    placeholder="Miel de Lavande Bio"
                  />
                )}
              </form.Field>

              <form.Field name="slug">
                {() => (
                  <FormInput
                    required
                    description="Utilisé dans l'URL du produit"
                    label="Slug (URL)"
                    placeholder="miel-lavande-bio"
                  />
                )}
              </form.Field>

              <form.Field name="short_description">
                {() => (
                  <FormInput
                    label="Description courte"
                    placeholder="Miel artisanal de lavande sauvage"
                  />
                )}
              </form.Field>

              <form.Field name="description">
                {() => (
                  <FormTextArea
                    label="Description détaillée"
                    placeholder="Description complète du produit..."
                    rows={5}
                  />
                )}
              </form.Field>
            </CardContent>
          </Card>

          {}
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form.Field name="price_points">
                {() => (
                  <FormInput
                    required
                    label="Prix en points"
                    min="1"
                    placeholder="450"
                    type="number"
                  />
                )}
              </form.Field>

              <form.Field name="stock_quantity">
                {() => (
                  <FormInput
                    label="Stock initial"
                    min="0"
                    placeholder="25"
                    type="number"
                  />
                )}
              </form.Field>

              <form.Field name="min_tier">
                {() => (
                  <FormSelect
                    label="Niveau minimum requis"
                    options={Object.entries(tierLabels).map(([value, label]) => ({ value, label }))}
                  />
                )}
              </form.Field>

              <form.Field name="fulfillment_method">
                {() => (
                  <FormSelect
                    label="Méthode de livraison"
                    options={Object.entries(fulfillmentMethodLabels).map(([value, label]) => ({ value, label }))}
                  />
                )}
              </form.Field>

              <form.Field name="category_id">
                {() => (
                  <FormInput
                    label="Catégorie ID"
                    placeholder="cat_honey"
                  />
                )}
              </form.Field>

              <form.Field name="producer_id">
                {() => (
                  <FormInput
                    label="Producteur ID"
                    placeholder="prod_habeebee"
                  />
                )}
              </form.Field>
            </CardContent>
          </Card>
        </div>

        {}
        <Card>
          <CardHeader>
            <CardTitle>Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <form.Field name="is_active">
                {() => (
                  <FormCheckbox
                    description="Si coché, le produit sera visible et disponible à la vente."
                    falseBadge="Inactif"
                    label="Produit actif"
                    trueBadge="Actif"
                  />
                )}
              </form.Field>

              <form.Field name="featured">
                {() => (
                  <FormCheckbox
                    description="Les produits vedettes peuvent être mis en avant sur certaines pages."
                    falseBadge="Standard"
                    label="Produit vedette"
                    trueBadge="Vedette"
                  />
                )}
              </form.Field>
            </div>
          </CardContent>
        </Card>

        {}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Annuler
          </Button>

          <Button
            className="flex items-center gap-2"
            disabled={!form.state.canSubmit || form.state.isSubmitting}
            type="submit"
          >
            {form.state.isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Création...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Créer le produit
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
export default NewProductPage
