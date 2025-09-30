import { z } from 'zod';

export const projectFormSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Le nom du projet est requis')
      .max(100, 'Le nom ne peut pas dépasser 100 caractères')
      .trim(),

    slug: z
      .string()
      .min(1, 'Le slug est requis')
      .max(80, 'Le slug ne peut pas dépasser 80 caractères')
      .regex(
        /^[\da-z-]+$/,
        'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets'
      )
      .refine(
        slug => !slug.startsWith('-') && !slug.endsWith('-'),
        'Le slug ne peut pas commencer ou finir par un tiret'
      ),

    type: z.enum(['beehive', 'olive_tree', 'vineyard'], {
      errorMap: () => ({ message: 'Type de projet invalide' }),
    }),

    target_budget: z
      .number()
      .min(100, "Le budget cible doit être d'au moins 100€")
      .max(100_000, 'Le budget cible ne peut pas dépasser 100 000€'),

    producer_id: z
      .string()
      .min(1, "L'identifiant du producteur est requis")
      .max(50, "L'identifiant ne peut pas dépasser 50 caractères"),

    description: z
      .string()
      .max(500, 'La description courte ne peut pas dépasser 500 caractères')
      .optional()
      .transform(val => val?.trim()),

    long_description: z
      .string()
      .max(
        5000,
        'La description détaillée ne peut pas dépasser 5000 caractères'
      )
      .optional()
      .transform(val => val?.trim()),

    status: z
      .enum(['active', 'funded', 'closed', 'suspended'], {
        errorMap: () => ({ message: 'Statut de projet invalide' }),
      })
      .default('active'),

    featured: z.boolean().default(false),

    images: z
      .array(z.string().url("URL d'image invalide"))
      .max(15, 'Maximum 15 images par projet')
      .default([]),
  })
  .refine(
    data => {
      if (data.target_budget > 5000 && !data.long_description) {
        return false;
      }
      return true;
    },
    {
      message:
        'Une description détaillée est requise pour les projets avec un budget supérieur à 5000€',
      path: ['long_description'],
    }
  );

export const projectSlugAsyncSchema = z.object({
  slug: z.string().refine(async slug => {
    if (!slug) return true;
    return !['admin', 'api', 'reserved'].includes(slug);
  }, 'Ce slug est déjà utilisé ou réservé'),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;

export const defaultProjectValues: ProjectFormData = {
  name: '',
  slug: '',
  type: 'beehive',
  target_budget: 1000,
  producer_id: '',
  description: '',
  long_description: '',
  status: 'active',
  featured: false,
  images: [],
};

export const projectTypeLabels = {
  beehive: 'Ruche',
  olive_tree: 'Olivier',
  vineyard: 'Vigne',
} as const;

export const projectStatusLabels = {
  active: 'Actif',
  funded: 'Financé',
  closed: 'Fermé',
  suspended: 'Suspendu',
} as const;

export const projectTypeRules = {
  beehive: {
    minBudget: 500,
    maxBudget: 10_000,
    suggestedProducers: ['habeebee'],
  },
  olive_tree: {
    minBudget: 800,
    maxBudget: 15_000,
    suggestedProducers: ['ilanga'],
  },
  vineyard: {
    minBudget: 1000,
    maxBudget: 25_000,
    suggestedProducers: ['promiel', 'multi'],
  },
} as const;

export const projectFormSchemaWithTypeValidation =
  projectFormSchema.superRefine((data, ctx) => {
    const rules = projectTypeRules[data.type];

    if (data.target_budget < rules.minBudget) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: rules.minBudget,
        type: 'number',
        inclusive: true,
        path: ['target_budget'],
        message: `Le budget minimum pour ce type de projet est de ${rules.minBudget}€`,
      });
    }

    if (data.target_budget > rules.maxBudget) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: rules.maxBudget,
        type: 'number',
        inclusive: true,
        path: ['target_budget'],
        message: `Le budget maximum pour ce type de projet est de ${rules.maxBudget}€`,
      });
    }
  });
