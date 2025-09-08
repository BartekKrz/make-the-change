"use client"

import { useState, type FC } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/[locale]/admin/(dashboard)/components/ui/card'
import { Input } from '@/app/[locale]/admin/(dashboard)/components/ui/input'
import { Button } from '@/components/ui/button'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/lib/trpc'

const NewSubscriptionPage: FC = () => {
  const router = useRouter()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    user_id: '',
    subscription_tier: 'ambassadeur_standard' as 'ambassadeur_standard' | 'ambassadeur_premium',
    billing_frequency: 'monthly' as 'monthly' | 'annual',
    amount_eur: 18,
    points_total: 1800,
    bonus_percentage: 30,
    start_date: new Date().toISOString().split('T')[0],
  })

  const createSubscription = trpc.admin.subscriptions.create.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Succès",
        description: "Abonnement créé avec succès",
      })
      router.push(`/admin/subscriptions/${data.id}`)
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive"
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createSubscription.mutate(formData)
  }

  const handleTierChange = (tier: 'ambassadeur_standard' | 'ambassadeur_premium') => {
    setFormData(prev => ({
      ...prev,
      subscription_tier: tier,
      amount_eur: tier === 'ambassadeur_standard' ? (prev.billing_frequency === 'monthly' ? 18 : 180) : (prev.billing_frequency === 'monthly' ? 32 : 320),
      points_total: tier === 'ambassadeur_standard' ? (prev.billing_frequency === 'monthly' ? 1800 : 18000) : (prev.billing_frequency === 'monthly' ? 3200 : 32000),
      bonus_percentage: tier === 'ambassadeur_standard' ? 30 : 50
    }))
  }

  const handleFrequencyChange = (frequency: 'monthly' | 'annual') => {
    setFormData(prev => ({
      ...prev,
      billing_frequency: frequency,
      amount_eur: prev.subscription_tier === 'ambassadeur_standard' ? (frequency === 'monthly' ? 18 : 180) : (frequency === 'monthly' ? 32 : 320),
      points_total: prev.subscription_tier === 'ambassadeur_standard' ? (frequency === 'monthly' ? 1800 : 18000) : (frequency === 'monthly' ? 3200 : 32000)
    }))
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Nouvel Abonnement"
        description="Créer un nouvel abonnement ambassadeur"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations de l&apos;abonnement</CardTitle>
            <CardDescription>Configurez les détails du nouvel abonnement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">ID Utilisateur</label>
              <Input
                value={formData.user_id}
                onChange={(e) => setFormData(prev => ({ ...prev, user_id: e.target.value }))}
                placeholder="UUID de l'utilisateur"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Niveau d&apos;abonnement</label>
                <select 
                  value={formData.subscription_tier}
                  onChange={(e) => handleTierChange(e.target.value as any)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  required
                >
                  <option value="ambassadeur_standard">Standard</option>
                  <option value="ambassadeur_premium">Premium</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Fréquence de facturation</label>
                <select 
                  value={formData.billing_frequency}
                  onChange={(e) => handleFrequencyChange(e.target.value as any)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  required
                >
                  <option value="monthly">Mensuelle</option>
                  <option value="annual">Annuelle</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Montant (€)</label>
                <Input
                  type="number"
                  value={formData.amount_eur}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount_eur: Number(e.target.value) }))}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Points total</label>
                <Input
                  type="number"
                  value={formData.points_total}
                  onChange={(e) => setFormData(prev => ({ ...prev, points_total: Number(e.target.value) }))}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Bonus (%)</label>
                <Input
                  type="number"
                  value={formData.bonus_percentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, bonus_percentage: Number(e.target.value) }))}
                  min="0"
                  max="100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Date de début</label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                required
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={createSubscription.isPending}>
            {createSubscription.isPending ? 'Création...' : 'Créer l&apos;abonnement'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push('/admin/subscriptions')}>
            Annuler
          </Button>
        </div>
      </form>
    </AdminPageContainer>
  )
}

export default NewSubscriptionPage
