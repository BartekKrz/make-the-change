
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/supabase/server';

const projectSchema = z.object({
  name: z.string().min(3, "Le nom du projet est requis et doit faire au moins 3 caractères."),
  slug: z.string().min(3, "Le slug est requis."),
  type: z.enum(['beehive', 'olive_tree', 'vineyard'], {
    errorMap: () => ({ message: "Le type de projet est invalide." })
  }),
  target_budget: z.coerce.number().positive("Le budget cible doit être un nombre positif."),
  producer_id: z.string().uuid("Un producteur valide est requis."),
  description: z.string().optional(),
  long_description: z.string().optional(),
  status: z.enum(['active', 'funded', 'closed', 'suspended']).default('active'),
  featured: z.coerce.boolean().default(false),
});

export type ProjectFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]> | null;
  id?: string;
}

export async function createProject(prevState: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  const validatedFields = projectSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Erreurs de validation. Veuillez vérifier les champs.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServer();

  const hardcodedLocation = 'POINT(0 0)';
  const hardcodedAddress = { street: "", city: "", region: "", country: "" };

  const { data, error } = await supabase
    .from('projects')
    .insert({
      ...validatedFields.data,
      location: hardcodedLocation,
      address: hardcodedAddress,
    })
    .select()
    .single();

  if (error) {
    return { success: false, message: `Erreur de base de données: ${error.message}`, errors: null };
  }

  revalidatePath('/admin/projects');
  redirect(`/admin/projects/${data.id}`);
}

export async function updateProject(id: string, prevState: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  const validatedFields = projectSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Erreurs de validation. Veuillez vérifier les champs.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServer();

  const hardcodedLocation = 'POINT(0 0)';
  const hardcodedAddress = { street: "", city: "", region: "", country: "" };

  const { error } = await supabase
    .from('projects')
    .update({
      ...validatedFields.data,
      location: hardcodedLocation,
      address: hardcodedAddress,
    })
    .eq('id', id);

  if (error) {
    return { success: false, message: `Erreur de base de données: ${error.message}`, errors: null };
  }

  revalidatePath('/admin/projects');
  revalidatePath(`/admin/projects/${id}`);

  return {
    success: true,
    message: "Projet mis à jour avec succès.",
    id: id,
  }
}

export async function deleteProject(id: string) {
  const supabase = await createSupabaseServer();
  const { error } = await supabase.from('projects').delete().eq('id', id);

  if (error) {
    console.error("Error deleting project:", error);
  }

  revalidatePath('/admin/projects');
  redirect('/admin/projects');
}
