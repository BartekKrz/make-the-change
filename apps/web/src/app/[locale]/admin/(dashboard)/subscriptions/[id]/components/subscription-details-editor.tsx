'use client';

import { type FC, type ChangeEvent } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/[locale]/admin/(dashboard)/components/ui/card';
import { Input } from '@/app/[locale]/admin/(dashboard)/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/[locale]/admin/(dashboard)/components/ui/select';
import { TextArea } from '@/app/[locale]/admin/(dashboard)/components/ui/textarea';

type SubscriptionData = {
  id: string;
  user_id: string;
  subscription_tier?: string;
  billing_frequency?: string;
  amount_eur?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  auto_renew?: boolean;
  notes?: string;
};

type SubscriptionDetailsEditorProps = {
  subscription: SubscriptionData;
  isEditing: boolean;
  onChange?: (data: Partial<SubscriptionData>) => void;
};

export const SubscriptionDetailsEditor: FC<SubscriptionDetailsEditorProps> = ({
  subscription,
  isEditing,
  onChange,
}) => {
  const handleChange = (key: keyof SubscriptionData, value: any) => {
    onChange?.({ [key]: value });
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                htmlFor="subscription_tier"
              >
                Type d&apos;abonnement
              </label>
              {isEditing ? (
                <Select
                  value={subscription.subscription_tier}
                  onValueChange={value =>
                    handleChange('subscription_tier', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ambassadeur_standard">
                      Ambassadeur Standard
                    </SelectItem>
                    <SelectItem value="ambassadeur_premium">
                      Ambassadeur Premium
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="bg-muted rounded-md p-2">
                  {subscription.subscription_tier === 'ambassadeur_standard' &&
                    'Ambassadeur Standard'}
                  {subscription.subscription_tier === 'ambassadeur_premium' &&
                    'Ambassadeur Premium'}
                  {!subscription.subscription_tier && 'Non défini'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="status">
                Statut
              </label>
              {isEditing ? (
                <Select
                  value={subscription.status}
                  onValueChange={value => handleChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                    <SelectItem value="suspended">Suspendu</SelectItem>
                    <SelectItem value="past_due">En retard</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="bg-muted rounded-md p-2">
                  {subscription.status === 'active' && 'Actif'}
                  {subscription.status === 'cancelled' && 'Annulé'}
                  {subscription.status === 'suspended' && 'Suspendu'}
                  {subscription.status === 'past_due' && 'En retard'}
                  {!subscription.status && 'Non défini'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                htmlFor="billing_frequency"
              >
                Fréquence de facturation
              </label>
              {isEditing ? (
                <Select
                  value={subscription.billing_frequency}
                  onValueChange={value =>
                    handleChange('billing_frequency', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une fréquence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                    <SelectItem value="quarterly">Trimestriel</SelectItem>
                    <SelectItem value="yearly">Annuel</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="bg-muted rounded-md p-2">
                  {subscription.billing_frequency === 'monthly' && 'Mensuel'}
                  {subscription.billing_frequency === 'quarterly' &&
                    'Trimestriel'}
                  {subscription.billing_frequency === 'yearly' && 'Annuel'}
                  {!subscription.billing_frequency && 'Non défini'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="amount_eur">
                Montant (€)
              </label>
              {isEditing ? (
                <Input
                  id="amount_eur"
                  placeholder="0.00"
                  type="number"
                  value={subscription.amount_eur || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange(
                      'amount_eur',
                      Number.parseFloat(e.target.value) || 0
                    )
                  }
                />
              ) : (
                <div className="bg-muted rounded-md p-2">
                  {subscription.amount_eur
                    ? `${subscription.amount_eur} €`
                    : 'Non défini'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="start_date">
                Date de début
              </label>
              {isEditing ? (
                <Input
                  id="start_date"
                  type="date"
                  value={formatDate(subscription.start_date)}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange('start_date', e.target.value)
                  }
                />
              ) : (
                <div className="bg-muted rounded-md p-2">
                  {subscription.start_date
                    ? new Date(subscription.start_date).toLocaleDateString(
                        'fr-FR'
                      )
                    : 'Non défini'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="end_date">
                Date de fin
              </label>
              {isEditing ? (
                <Input
                  id="end_date"
                  type="date"
                  value={formatDate(subscription.end_date)}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange('end_date', e.target.value)
                  }
                />
              ) : (
                <div className="bg-muted rounded-md p-2">
                  {subscription.end_date
                    ? new Date(subscription.end_date).toLocaleDateString(
                        'fr-FR'
                      )
                    : 'Non défini'}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="auto_renew">
              Renouvellement automatique
            </label>
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <input
                  checked={subscription.auto_renew || false}
                  className="h-4 w-4"
                  id="auto_renew"
                  type="checkbox"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange('auto_renew', e.target.checked)
                  }
                />
                <label className="text-sm" htmlFor="auto_renew">
                  {subscription.auto_renew ? 'Activé' : 'Désactivé'}
                </label>
              </div>
            ) : (
              <div className="bg-muted rounded-md p-2">
                {subscription.auto_renew ? 'Activé' : 'Désactivé'}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="notes">
              Notes
            </label>
            {isEditing ? (
              <TextArea
                id="notes"
                placeholder="Notes sur cet abonnement..."
                rows={3}
                value={subscription.notes || ''}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  handleChange('notes', e.target.value)
                }
              />
            ) : (
              <div className="bg-muted min-h-[80px] rounded-md p-2">
                {subscription.notes || 'Aucune note'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
