"use client"

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { useToast } from '@/hooks/use-toast'
import {
  defaultProductValues,
  tierLabels,
  fulfillmentMethodLabels,
  type ProductFormData
} from '@/lib/validators/product'
import { generateSlug } from '@/lib/form-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/admin/(dashboard)/components/ui/card'
import { Button } from '@/app/admin/(dashboard)/components/ui/button'
import { Badge } from '@/app/admin/(dashboard)/components/badge'
import { useAppForm, FormInput, FormTextArea, FormSelect } from '@/components/form'
import { ArrowLeft, Package, Plus } from 'lucide-react'
import Link from 'next/link'

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
    onError: (error, vars, ctx) => {
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

      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: error.message || 'Impossible de créer le produit'
        })
      }
    },
  })

  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
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
      <form onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }} className="space-y-6">
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
                    label="Nom du produit"
                    placeholder="Miel de Lavande Bio"
                    required
                  />
                )}
              </form.Field>

              <form.Field name="slug">
                {() => (
                  <FormInput
                    label="Slug (URL)"
                    placeholder="miel-lavande-bio"
                    required
                    description="Utilisé dans l'URL du produit"
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
                    label="Prix en points"
                    type="number"
                    min="1"
                    placeholder="450"
                    required
                  />
                )}
              </form.Field>

              <form.Field name="stock_quantity">
                {() => (
                  <FormInput
                    label="Stock initial"
                    type="number"
                    min="0"
                    placeholder="25"
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
            <div className="flex flex-wrap gap-4">
              <form.Field name="is_active">
                {(field) => (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(field.state.value)}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      onBlur={field.handleBlur}
                    />
                    <span className="text-sm">Produit actif</span>
                    <Badge color={field.state.value ? "green" : "gray"}>
                      {field.state.value ? 'Actif' : 'Inactif'}
                    </Badge>
                  </label>
                )}
              </form.Field>

              <form.Field name="featured">
                {(field) => (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(field.state.value)}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      onBlur={field.handleBlur}
                    />
                    <span className="text-sm">Produit vedette</span>
                    <Badge color={field.state.value ? "blue" : "gray"}>
                      {field.state.value ? 'Vedette' : 'Standard'}
                    </Badge>
                  </label>
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
            type="submit"
            disabled={!form.state.canSubmit || form.state.isSubmitting}
            className="flex items-center gap-2"
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
