import { z } from 'zod';

// Enum pour les niveaux utilisateur selon votre doc
export const UserLevelEnum = z.enum(['EXPLORATEUR', 'PROTECTEUR', 'AMBASSADEUR']);
export type UserLevel = z.infer<typeof UserLevelEnum>;

// Enum pour les statuts utilisateur
export const UserStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_KYC']);
export type UserStatus = z.infer<typeof UserStatusEnum>;

// Schema utilisateur de base
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  dateOfBirth: z.date().optional(),
  level: UserLevelEnum.default('EXPLORATEUR'),
  status: UserStatusEnum.default('ACTIVE'),
  totalPoints: z.number().int().min(0).default(0),
  availablePoints: z.number().int().min(0).default(0),
  kycVerified: z.boolean().default(false),
  kycLevel: z.enum(['NONE', 'BASIC', 'ADVANCED']).default('NONE'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Schema pour création d'utilisateur
export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalPoints: true,
  availablePoints: true,
});

export type CreateUser = z.infer<typeof CreateUserSchema>;
