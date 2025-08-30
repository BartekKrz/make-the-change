import { z } from 'zod';

// Statuts de commande selon votre documentation
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

// Types de paiement
export const PaymentMethodEnum = z.enum([
  'STRIPE_CARD',
  'STRIPE_SEPA',
  'POINTS',
  'MIXED' // Points + Stripe
]);
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>;

// Item de commande
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

// Schema commande principal
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

// Schema pour création de commande
export const CreateOrderSchema = OrderSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  shippedAt: true,
  deliveredAt: true,
});

export type CreateOrder = z.infer<typeof CreateOrderSchema>;
