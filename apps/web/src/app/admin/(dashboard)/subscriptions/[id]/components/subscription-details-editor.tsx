'use client';

import { FC, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/admin/(dashboard)/components/ui/card';
import { Input } from '@/app/admin/(dashboard)/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/admin/(dashboard)/components/ui/select';
import { TextArea } from '@/app/admin/(dashboard)/components/ui/textarea';

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
  onChange
}) => {
  const handleChange = (key: keyof SubscriptionData, value: any) => {
    onChange?.({ [key]: value });
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <label htmlFor='subscription_tier' className='text-sm font-medium'>Type d&apos;abonnement</label>
              {isEditing ? (
                <Select
                  value={subscription.subscription_tier}
                  onValueChange={(value) => handleChange('subscription_tier', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Sélectionner un type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='ambassadeur_standard'>Ambassadeur Standard</SelectItem>
                    <SelectItem value='ambassadeur_premium'>Ambassadeur Premium</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className='p-2 bg-muted rounded-md'>
                  {subscription.subscription_tier === 'ambassadeur_standard' && 'Ambassadeur Standard'}
                  {subscription.subscription_tier === 'ambassadeur_premium' && 'Ambassadeur Premium'}
                  {!subscription.subscription_tier && 'Non défini'}
                </div>
              )}
            </div>

            <div className='space-y-2'>
              <label htmlFor='status' className='text-sm font-medium'>Statut</label>
              {isEditing ? (
                <Select
                  value={subscription.status}
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Sélectionner un statut' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='active'>Actif</SelectItem>
                    <SelectItem value='cancelled'>Annulé</SelectItem>
                    <SelectItem value='suspended'>Suspendu</SelectItem>
                    <SelectItem value='past_due'>En retard</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className='p-2 bg-muted rounded-md'>
                  {subscription.status === 'active' && 'Actif'}
                  {subscription.status === 'cancelled' && 'Annulé'}
                  {subscription.status === 'suspended' && 'Suspendu'}
                  {subscription.status === 'past_due' && 'En retard'}
                  {!subscription.status && 'Non défini'}
                </div>
              )}
            </div>

            <div className='space-y-2'>
              <label htmlFor='billing_frequency' className='text-sm font-medium'>Fréquence de facturation</label>
              {isEditing ? (
                <Select
                  value={subscription.billing_frequency}
                  onValueChange={(value) => handleChange('billing_frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Sélectionner une fréquence' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='monthly'>Mensuel</SelectItem>
                    <SelectItem value='quarterly'>Trimestriel</SelectItem>
                    <SelectItem value='yearly'>Annuel</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className='p-2 bg-muted rounded-md'>
                  {subscription.billing_frequency === 'monthly' && 'Mensuel'}
                  {subscription.billing_frequency === 'quarterly' && 'Trimestriel'}
                  {subscription.billing_frequency === 'yearly' && 'Annuel'}
                  {!subscription.billing_frequency && 'Non défini'}
                </div>
              )}
            </div>

            <div className='space-y-2'>
              <label htmlFor='amount_eur' className='text-sm font-medium'>Montant (€)</label>
              {isEditing ? (
                <Input
                  id='amount_eur'
                  type='number'
                  value={subscription.amount_eur || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('amount_eur', parseFloat(e.target.value) || 0)}
                  placeholder='0.00'
                />
              ) : (
                <div className='p-2 bg-muted rounded-md'>
                  {subscription.amount_eur ? `${subscription.amount_eur} €` : 'Non défini'}
                </div>
              )}
            </div>

            <div className='space-y-2'>
              <label htmlFor='start_date' className='text-sm font-medium'>Date de début</label>
              {isEditing ? (
                <Input
                  id='start_date'
                  type='date'
                  value={formatDate(subscription.start_date)}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('start_date', e.target.value)}
                />
              ) : (
                <div className='p-2 bg-muted rounded-md'>
                  {subscription.start_date ? new Date(subscription.start_date).toLocaleDateString('fr-FR') : 'Non défini'}
                </div>
              )}
            </div>

            <div className='space-y-2'>
              <label htmlFor='end_date' className='text-sm font-medium'>Date de fin</label>
              {isEditing ? (
                <Input
                  id='end_date'
                  type='date'
                  value={formatDate(subscription.end_date)}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('end_date', e.target.value)}
                />
              ) : (
                <div className='p-2 bg-muted rounded-md'>
                  {subscription.end_date ? new Date(subscription.end_date).toLocaleDateString('fr-FR') : 'Non défini'}
                </div>
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <label htmlFor='auto_renew' className='text-sm font-medium'>
              Renouvellement automatique
            </label>
            {isEditing ? (
              <div className='flex items-center space-x-2'>
                <input
                  id='auto_renew'
                  type='checkbox'
                  checked={subscription.auto_renew || false}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('auto_renew', e.target.checked)}
                  className='h-4 w-4'
                />
                <label htmlFor='auto_renew' className='text-sm'>
                  {subscription.auto_renew ? 'Activé' : 'Désactivé'}
                </label>
              </div>
            ) : (
              <div className='p-2 bg-muted rounded-md'>
                {subscription.auto_renew ? 'Activé' : 'Désactivé'}
              </div>
            )}
          </div>

          <div className='space-y-2'>
            <label htmlFor='notes' className='text-sm font-medium'>Notes</label>
            {isEditing ? (
              <TextArea
                id='notes'
                value={subscription.notes || ''}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange('notes', e.target.value)}
                placeholder='Notes sur cet abonnement...'
                rows={3}
              />
            ) : (
              <div className='p-2 bg-muted rounded-md min-h-[80px]'>
                {subscription.notes || 'Aucune note'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
