'use server';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { createSupabaseServer } from '@/supabase/server';

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court'),
  redirect: z.string().optional(),
});

export async function signInAction(_: unknown, formData: FormData) {
  const parsed = schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    redirect: formData.get('redirect'),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return {
      success: false,
      errors: fieldErrors,
      message: 'Validation échouée',
    };
  }

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    const msg = error.message.includes('Email not confirmed')
      ? 'Email non confirmé. Vérifiez votre boîte mail.'
      : (error.message.includes('Invalid login credentials')
        ? 'Identifiants incorrects.'
        : "Erreur d'authentification.");
    return { success: false, message: msg };
  }

  const allow = (process.env.ADMIN_EMAIL_ALLOWLIST || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  const userEmail = (data.user?.email || '').toLowerCase();
  if (allow.length > 0 && !allow.includes(userEmail)) {
    await supabase.auth.signOut();
    return { success: false, message: 'Accès refusé' };
  }

  redirect(parsed.data.redirect || '/admin/dashboard');
}
