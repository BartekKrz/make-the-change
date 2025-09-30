import { z } from 'zod';

// ============================================================================
// COMMON TYPES
// ============================================================================

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type PaginationParams = {
  page: number;
  limit: number;
}

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export type DateRange = {
  from: Date;
  to: Date;
}

export type SortParams = {
  field: string;
  direction: 'asc' | 'desc';
}

// ============================================================================
// USER TYPES
// ============================================================================

export const UserLevelEnum = z.enum(['EXPLORATEUR', 'PROTECTEUR', 'AMBASSADEUR']);
export type UserLevel = z.infer<typeof UserLevelEnum>;

export const UserStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_KYC']);
export type UserStatus = z.infer<typeof UserStatusEnum>;

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

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalPoints: true,
  availablePoints: true,
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

// ============================================================================
// PROJECT TYPES
// ============================================================================

export const ProjectTypeEnum = z.enum([
  'REFORESTATION',
  'OCEAN_CLEANUP',
  'RENEWABLE_ENERGY',
  'BIODIVERSITY_CONSERVATION',
  'SUSTAINABLE_AGRICULTURE'
]);
export type ProjectType = z.infer<typeof ProjectTypeEnum>;

export const ProjectStatusEnum = z.enum([
  'DRAFT',
  'ACTIVE',
  'FUNDED',
  'IN_PROGRESS',
  'COMPLETED',
  'SUSPENDED'
]);
export type ProjectStatus = z.infer<typeof ProjectStatusEnum>;

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
  expectedReturn: z.number().min(0).max(100),
  duration: z.number().int().positive(),
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

export const CreateProjectSchema = ProjectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  currentAmount: true,
});

export type CreateProject = z.infer<typeof CreateProjectSchema>;

// ============================================================================
// ORDER TYPES
// ============================================================================

export const OrderStatusEnum = z.enum([
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED'
]);
export type OrderStatus = z.infer<typeof OrderStatusEnum>;

export const PaymentMethodEnum = z.enum([
  'STRIPE_CARD',
  'STRIPE_SEPA',
  'POINTS',
  'MIXED'
]);
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>;

export const OrderItemSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  totalPrice: z.number().positive(),
  pointsUsed: z.number().int().min(0).default(0),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;

export const OrderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  status: OrderStatusEnum.default('PENDING'),
  items: z.array(OrderItemSchema),

  // Montants
  subtotal: z.number().positive(),
  shippingCost: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  totalAmount: z.number().positive(),

  // Points
  totalPointsUsed: z.number().int().min(0).default(0),
  pointsEarned: z.number().int().min(0).default(0),

  // Paiement
  paymentMethod: PaymentMethodEnum,
  stripePaymentIntentId: z.string().optional(),

  // Adresses
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  billingAddress: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }).optional(),

  // Métadonnées
  createdAt: z.date(),
  updatedAt: z.date(),
  shippedAt: z.date().optional(),
  deliveredAt: z.date().optional(),
});

export type Order = z.infer<typeof OrderSchema>;

export const CreateOrderSchema = OrderSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  shippedAt: true,
  deliveredAt: true,
});

export type CreateOrder = z.infer<typeof CreateOrderSchema>;