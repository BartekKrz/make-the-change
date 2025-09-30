'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { createSupabaseServer } from '@/supabase/server';

const subscriptionSchema = z.object({
  user_id: z.string().uuid('Un utilisateur valide est requis.'),
  subscription_tier: z.enum(['ambassadeur_standard', 'ambassadeur_premium'], {
    errorMap: () => ({ message: "Le niveau d'abonnement est invalide." }),
  }),
  billing_frequency: z.enum(['monthly', 'annual'], {
    errorMap: () => ({ message: 'La fréquence de facturation est invalide.' }),
  }),
  amount_eur: z.coerce
    .number()
    .positive('Le montant doit être un nombre positif.'),
  points_total: z.coerce
    .number()
    .positive('Le total de points doit être un nombre positif.'),
  bonus_percentage: z.coerce
    .number()
    .min(0)
    .max(100, 'Le pourcentage bonus doit être entre 0 et 100.'),
  start_date: z.string().min(1, 'La date de début est requise.'),
  status: z
    .enum(['active', 'expired', 'cancelled', 'paused'])
    .default('active'),
});

export type SubscriptionFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]> | null;
  id?: string;
};

export async function createSubscription(
  prevState: SubscriptionFormState,
  formData: FormData
): Promise<SubscriptionFormState> {
  const validatedFields = subscriptionSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Erreurs de validation. Veuillez vérifier les champs.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServer();

  // Calculer la date d'expiration des points (18 mois après la date de début)
  const startDate = new Date(validatedFields.data.start_date);
  const pointsExpiryDate = new Date(startDate);
  pointsExpiryDate.setMonth(pointsExpiryDate.getMonth() + 18);

  // Calculer la prochaine date de facturation
  const nextBillingDate = new Date(startDate);
  if (validatedFields.data.billing_frequency === 'monthly') {
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  } else {
    nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      ...validatedFields.data,
      points_expiry_date: pointsExpiryDate.toISOString(),
      next_billing_date: nextBillingDate.toISOString(),
      project_allocation: {
        allocations: [],
        lastModified: null,
        totalAllocated: 0,
        maxProjects: 10,
      },
      payment_status: 'pending',
      auto_renew: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Erreur création abonnement:', error);
    return {
      success: false,
      message: `Erreur lors de la création: ${error.message}`,
    };
  }

  revalidatePath('/admin/subscriptions');

  return {
    success: true,
    message: 'Abonnement créé avec succès!',
    id: data.id,
  };
}

export async function updateSubscription(
  id: string,
  patch: Partial<z.infer<typeof subscriptionSchema>>
): Promise<SubscriptionFormState> {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from('subscriptions')
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erreur mise à jour abonnement:', error);
    return {
      success: false,
      message: `Erreur lors de la mise à jour: ${error.message}`,
    };
  }

  revalidatePath('/admin/subscriptions');
  revalidatePath(`/admin/subscriptions/${id}`);

  return {
    success: true,
    message: 'Abonnement mis à jour avec succès!',
    id: data.id,
  };
}
