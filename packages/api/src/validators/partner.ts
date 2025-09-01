/**
 * Partner Form Validators - Zod Schemas
 * Validateurs pour les formulaires des partenaires (création/modification)
 */

import { z } from 'zod';

/**
 * Schema de validation pour la création/modification de partenaires
 */
export const partnerFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom du partenaire est requis')
    .max(150, 'Le nom ne peut pas dépasser 150 caractères')
    .trim(),

  slug: z
    .string()
    .min(1, 'Le slug est requis')
    .max(100, 'Le slug ne peut pas dépasser 100 caractères')
    .regex(
      /^[a-z0-9-]+$/,
      'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets'
    ),

  contact_email: z
    .string()
    .email('Format d\'email invalide')
    .min(1, 'L\'email de contact est requis'),

  website: z.string().url('URL de site web invalide').optional().or(z.literal('')),

  description: z
    .string()
    .max(2000, 'La description ne peut pas dépasser 2000 caractères')
    .optional(),

  status: z.enum(['active', 'pending', 'archived'], {
    errorMap: () => ({ message: 'Statut de partenaire invalide' })
  }).default('pending'),

  // Ajout de champs potentiels pour l'adresse
  address_street: z.string().optional(),
  address_city: z.string().optional(),
  address_postal_code: z.string().optional(),
  address_country: z.string().optional(),
});

/**
 * Type TypeScript inféré du schema
 */
export type PartnerFormData = z.infer<typeof partnerFormSchema>;

/**
 * Valeurs par défaut pour un nouveau partenaire
 */
export const defaultPartnerValues: PartnerFormData = {
  name: '',
  slug: '',
  contact_email: '',
  website: '',
  description: '',
  status: 'pending',
  address_street: '',
  address_city: '',
  address_postal_code: '',
  address_country: 'France',
};

/**
 * Configuration des labels pour les statuts
 */
export const partnerStatusLabels = {
  active: 'Actif',
  pending: 'En attente',
  archived: 'Archivé',
} as const;
