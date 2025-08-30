import { z } from 'zod';

// Types de projets selon votre documentation
export const ProjectTypeEnum = z.enum([
  'REFORESTATION',
  'OCEAN_CLEANUP',
  'RENEWABLE_ENERGY',
  'BIODIVERSITY_CONSERVATION',
  'SUSTAINABLE_AGRICULTURE'
]);
export type ProjectType = z.infer<typeof ProjectTypeEnum>;

// Statuts de projet
export const ProjectStatusEnum = z.enum([
  'DRAFT',
  'ACTIVE',
  'FUNDED',
  'IN_PROGRESS',
  'COMPLETED',
  'SUSPENDED'
]);
export type ProjectStatus = z.infer<typeof ProjectStatusEnum>;

// Schema projet selon votre database schema
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string(),
  longDescription: z.string().optional(),
  type: ProjectTypeEnum,
  status: ProjectStatusEnum.default('DRAFT'),
  targetAmount: z.number().positive(),
  currentAmount: z.number().min(0).default(0),
  minInvestment: z.number().positive().default(10),
  maxInvestment: z.number().positive().optional(),
  expectedReturn: z.number().min(0).max(100), // Pourcentage
  duration: z.number().int().positive(), // En mois
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  location: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
  images: z.array(z.string().url()).default([]),
  documents: z.array(z.string().url()).default([]),
  partnerId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

// Schema pour création de projet
export const CreateProjectSchema = ProjectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  currentAmount: true,
});

export type CreateProject = z.infer<typeof CreateProjectSchema>;
