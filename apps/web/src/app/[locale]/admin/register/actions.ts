'use server';

import { z } from 'zod';

import { createSupabaseServer } from '@/supabase/server';

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court'),
});

export async function registerAction(_: unknown, formData: FormData) {
  const parsed = schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return {
      success: false,
      errors: fieldErrors,
      message: 'Validation échouée',
    };
  }

  // Vérifier que l'email est dans la liste autorisée
  const allowlist = (process.env.ADMIN_EMAIL_ALLOWLIST || '')
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(Boolean);

  if (
    allowlist.length > 0 &&
    !allowlist.includes(parsed.data.email.toLowerCase())
  ) {
    return {
      success: false,
      message: "Email non autorisé pour l'administration",
    };
  }

  try {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (!data.user) {
      return {
        success: false,
        message: 'Erreur lors de la création du compte',
      };
    }

    return {
      success: true,
      message: `✅ Compte créé avec succès! User ID: ${data.user.id}`,
      userId: data.user.id,
    };
  } catch (error) {
    console.error('Register error:', error);
    return {
      success: false,
      message:
        'Erreur de connexion à Supabase. Vérifiez votre connexion internet.',
    };
  }
}
