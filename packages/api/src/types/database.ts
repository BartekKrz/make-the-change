/**
 * Database Types for tRPC API - Generated from Supabase
 */
import type { Database } from './supabase'

// Types de base depuis Supabase
export type SupabaseProduct = Database['public']['Tables']['products']['Row']
export type SupabaseProducer = Database['public']['Tables']['producers']['Row']
export type SupabaseCategory = Database['public']['Tables']['categories']['Row']
export type SupabaseOrder = Database['public']['Tables']['orders']['Row']
export type SupabaseOrderItem = Database['public']['Tables']['order_items']['Row']
export type SupabaseUser = Database['public']['Tables']['users']['Row']
export type SupabaseProject = Database['public']['Tables']['projects']['Row']

// Types avec relations pour l'API
export interface ProductWithRelations extends SupabaseProduct {
  producer?: SupabaseProducer | null;
  category?: SupabaseCategory | null;
  secondary_category?: SupabaseCategory | null;
}

export interface ProductListResponse {
  items: ProductWithRelations[];
  nextCursor: string | null;
  total: number;
}

export interface OrderWithItems extends SupabaseOrder {
  order_items: SupabaseOrderItem[];
}

// Re-export des types Supabase pour compatibilité
export type Product = SupabaseProduct;
export type Producer = SupabaseProducer;
export type Category = SupabaseCategory;
export type Order = SupabaseOrder;
export type OrderItem = SupabaseOrderItem;
export type User = SupabaseUser;
export type Project = SupabaseProject;
