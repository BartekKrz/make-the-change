export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      business_metrics: {
        Row: {
          annual_churn_rate: number | null
          annual_subscribers: number | null
          arr: number | null
          average_ltv: number | null
          average_time_to_convert: number | null
          calculation_method: string | null
          churned_subscribers: number | null
          conversion_count: number | null
          conversion_rate: number | null
          created_at: string | null
          customer_acquisition_cost: number | null
          data_quality_score: number | null
          id: string
          ltv_cac_ratio: number | null
          metadata: Json | null
          metric_date: string
          metric_period: string
          monthly_churn_rate: number | null
          monthly_subscribers: number | null
          mrr: number | null
          net_revenue: number | null
          new_subscribers: number | null
          points_utilization_rate: number | null
          retention_rate: number | null
          total_points_allocated: number | null
          total_points_used: number | null
          total_subscribers: number | null
          updated_at: string | null
        }
        Insert: {
          annual_churn_rate?: number | null
          annual_subscribers?: number | null
          arr?: number | null
          average_ltv?: number | null
          average_time_to_convert?: number | null
          calculation_method?: string | null
          churned_subscribers?: number | null
          conversion_count?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          customer_acquisition_cost?: number | null
          data_quality_score?: number | null
          id?: string
          ltv_cac_ratio?: number | null
          metadata?: Json | null
          metric_date: string
          metric_period: string
          monthly_churn_rate?: number | null
          monthly_subscribers?: number | null
          mrr?: number | null
          net_revenue?: number | null
          new_subscribers?: number | null
          points_utilization_rate?: number | null
          retention_rate?: number | null
          total_points_allocated?: number | null
          total_points_used?: number | null
          total_subscribers?: number | null
          updated_at?: string | null
        }
        Update: {
          annual_churn_rate?: number | null
          annual_subscribers?: number | null
          arr?: number | null
          average_ltv?: number | null
          average_time_to_convert?: number | null
          calculation_method?: string | null
          churned_subscribers?: number | null
          conversion_count?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          customer_acquisition_cost?: number | null
          data_quality_score?: number | null
          id?: string
          ltv_cac_ratio?: number | null
          metadata?: Json | null
          metric_date?: string
          metric_period?: string
          monthly_churn_rate?: number | null
          monthly_subscribers?: number | null
          mrr?: number | null
          net_revenue?: number | null
          new_subscribers?: number | null
          points_utilization_rate?: number | null
          retention_rate?: number | null
          total_points_allocated?: number | null
          total_points_used?: number | null
          total_subscribers?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          metadata: Json | null
          name: string
          parent_id: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          parent_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          parent_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      conversion_events: {
        Row: {
          ab_test_variant: string | null
          annual_savings: number | null
          campaign_id: string | null
          conversion_incentives: Json | null
          created_at: string | null
          event_date: string | null
          event_type: Database["public"]["Enums"]["conversion_event_type"]
          id: string
          immediate_charge: number | null
          metadata: Json | null
          new_plan: Json
          next_billing_adjustment: number | null
          old_plan: Json
          points_bonus: number | null
          price_change: number | null
          proration_amount: number | null
          referral_source: string | null
          subscription_id: string | null
          trigger_event: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          ab_test_variant?: string | null
          annual_savings?: number | null
          campaign_id?: string | null
          conversion_incentives?: Json | null
          created_at?: string | null
          event_date?: string | null
          event_type: Database["public"]["Enums"]["conversion_event_type"]
          id?: string
          immediate_charge?: number | null
          metadata?: Json | null
          new_plan: Json
          next_billing_adjustment?: number | null
          old_plan: Json
          points_bonus?: number | null
          price_change?: number | null
          proration_amount?: number | null
          referral_source?: string | null
          subscription_id?: string | null
          trigger_event?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          ab_test_variant?: string | null
          annual_savings?: number | null
          campaign_id?: string | null
          conversion_incentives?: Json | null
          created_at?: string | null
          event_date?: string | null
          event_type?: Database["public"]["Enums"]["conversion_event_type"]
          id?: string
          immediate_charge?: number | null
          metadata?: Json | null
          new_plan?: Json
          next_billing_adjustment?: number | null
          old_plan?: Json
          points_bonus?: number | null
          price_change?: number | null
          proration_amount?: number | null
          referral_source?: string | null
          subscription_id?: string | null
          trigger_event?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversion_events_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversion_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      image_blur_hashes: {
        Row: {
          blur_hash: string
          entity_id: string
          entity_type: string
          file_size: number | null
          generated_at: string | null
          height: number | null
          id: number
          image_url: string
          updated_at: string | null
          width: number | null
        }
        Insert: {
          blur_hash: string
          entity_id: string
          entity_type: string
          file_size?: number | null
          generated_at?: string | null
          height?: number | null
          id?: number
          image_url: string
          updated_at?: string | null
          width?: number | null
        }
        Update: {
          blur_hash?: string
          entity_id?: string
          entity_type?: string
          file_size?: number | null
          generated_at?: string | null
          height?: number | null
          id?: number
          image_url?: string
          updated_at?: string | null
          width?: number | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          batch_number: string | null
          cost_price_cents: number
          created_at: string | null
          expiry_date: string | null
          id: string
          last_restock_date: string | null
          last_stockout_date: string | null
          location_in_warehouse: string | null
          product_id: string | null
          quantity_available: number
          quantity_reserved: number | null
          reorder_quantity: number
          reorder_threshold: number
          rotation_days: number | null
          sku: string
          supplier_reference: string | null
          updated_at: string | null
        }
        Insert: {
          batch_number?: string | null
          cost_price_cents: number
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          last_restock_date?: string | null
          last_stockout_date?: string | null
          location_in_warehouse?: string | null
          product_id?: string | null
          quantity_available?: number
          quantity_reserved?: number | null
          reorder_quantity?: number
          reorder_threshold?: number
          rotation_days?: number | null
          sku: string
          supplier_reference?: string | null
          updated_at?: string | null
        }
        Update: {
          batch_number?: string | null
          cost_price_cents?: number
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          last_restock_date?: string | null
          last_stockout_date?: string | null
          location_in_warehouse?: string | null
          product_id?: string | null
          quantity_available?: number
          quantity_reserved?: number | null
          reorder_quantity?: number
          reorder_threshold?: number
          rotation_days?: number | null
          sku?: string
          supplier_reference?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_missing_blur"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_returns: {
        Row: {
          created_at: string | null
          distribution_date: string | null
          id: string
          investment_id: string | null
          notes: string | null
          points_returned: number
          return_period: string
          return_rate_actual: number | null
        }
        Insert: {
          created_at?: string | null
          distribution_date?: string | null
          id?: string
          investment_id?: string | null
          notes?: string | null
          points_returned: number
          return_period: string
          return_rate_actual?: number | null
        }
        Update: {
          created_at?: string | null
          distribution_date?: string | null
          id?: string
          investment_id?: string | null
          notes?: string | null
          points_returned?: number
          return_period?: string
          return_rate_actual?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "investment_returns_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "investments"
            referencedColumns: ["id"]
          },
        ]
      }
      investments: {
        Row: {
          amount_eur_equivalent: number
          amount_points: number
          created_at: string | null
          expected_return_rate: number | null
          id: string
          investment_terms: Json | null
          last_return_date: string | null
          maturity_date: string | null
          notes: string | null
          project_id: string | null
          returns_received_points: number | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount_eur_equivalent: number
          amount_points: number
          created_at?: string | null
          expected_return_rate?: number | null
          id?: string
          investment_terms?: Json | null
          last_return_date?: string | null
          maturity_date?: string | null
          notes?: string | null
          project_id?: string | null
          returns_received_points?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount_eur_equivalent?: number
          amount_points?: number
          created_at?: string | null
          expected_return_rate?: number | null
          id?: string
          investment_terms?: Json | null
          last_return_date?: string | null
          maturity_date?: string | null
          notes?: string | null
          project_id?: string | null
          returns_received_points?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_allocations: {
        Row: {
          allocated_at: string | null
          allocated_investments: number | null
          allocated_products: number | null
          allocation_month: string
          allocation_preferences: Json | null
          billing_period: string | null
          expiry_date: string | null
          id: string
          metadata: Json | null
          points_allocated: number
          points_expired: number | null
          rollover_from_previous: number | null
          rollover_to_next: number | null
          subscription_id: string | null
          unused_points: number | null
          user_id: string | null
        }
        Insert: {
          allocated_at?: string | null
          allocated_investments?: number | null
          allocated_products?: number | null
          allocation_month: string
          allocation_preferences?: Json | null
          billing_period?: string | null
          expiry_date?: string | null
          id?: string
          metadata?: Json | null
          points_allocated: number
          points_expired?: number | null
          rollover_from_previous?: number | null
          rollover_to_next?: number | null
          subscription_id?: string | null
          unused_points?: number | null
          user_id?: string | null
        }
        Update: {
          allocated_at?: string | null
          allocated_investments?: number | null
          allocated_products?: number | null
          allocation_month?: string
          allocation_preferences?: Json | null
          billing_period?: string | null
          expiry_date?: string | null
          id?: string
          metadata?: Json | null
          points_allocated?: number
          points_expired?: number | null
          rollover_from_previous?: number | null
          rollover_to_next?: number | null
          subscription_id?: string | null
          unused_points?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "monthly_allocations_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monthly_allocations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          product_id: string | null
          product_snapshot: Json | null
          quantity: number
          total_price_points: number
          unit_price_points: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          product_snapshot?: Json | null
          quantity: number
          total_price_points: number
          unit_price_points: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          product_snapshot?: Json | null
          quantity?: number
          total_price_points?: number
          unit_price_points?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_missing_blur"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          admin_notes: string | null
          billing_address: Json | null
          carrier: string | null
          created_at: string | null
          delivered_at: string | null
          id: string
          notes: string | null
          payment_method: string | null
          points_earned: number | null
          points_used: number
          shipped_at: string | null
          shipping_address: Json
          shipping_cost_points: number | null
          status: string | null
          stripe_payment_intent_id: string | null
          subtotal_points: number
          tax_points: number | null
          total_points: number
          tracking_number: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          billing_address?: Json | null
          carrier?: string | null
          created_at?: string | null
          delivered_at?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          points_earned?: number | null
          points_used: number
          shipped_at?: string | null
          shipping_address: Json
          shipping_cost_points?: number | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          subtotal_points: number
          tax_points?: number | null
          total_points: number
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          billing_address?: Json | null
          carrier?: string | null
          created_at?: string | null
          delivered_at?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          points_earned?: number | null
          points_used?: number
          shipped_at?: string | null
          shipping_address?: Json
          shipping_cost_points?: number | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          subtotal_points?: number
          tax_points?: number | null
          total_points?: number
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      points_expiry_schedule: {
        Row: {
          created_at: string | null
          earned_date: string
          expired_at: string | null
          expiry_date: string
          id: string
          is_expired: boolean | null
          is_notified_1_day: boolean | null
          is_notified_30_days: boolean | null
          is_notified_7_days: boolean | null
          metadata: Json | null
          points_amount: number
          points_transaction_id: string | null
          source_details: Json | null
          source_type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          earned_date: string
          expired_at?: string | null
          expiry_date: string
          id?: string
          is_expired?: boolean | null
          is_notified_1_day?: boolean | null
          is_notified_30_days?: boolean | null
          is_notified_7_days?: boolean | null
          metadata?: Json | null
          points_amount: number
          points_transaction_id?: string | null
          source_details?: Json | null
          source_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          earned_date?: string
          expired_at?: string | null
          expiry_date?: string
          id?: string
          is_expired?: boolean | null
          is_notified_1_day?: boolean | null
          is_notified_30_days?: boolean | null
          is_notified_7_days?: boolean | null
          metadata?: Json | null
          points_amount?: number
          points_transaction_id?: string | null
          source_details?: Json | null
          source_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "points_expiry_schedule_points_transaction_id_fkey"
            columns: ["points_transaction_id"]
            isOneToOne: false
            referencedRelation: "points_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_expiry_schedule_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      points_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          metadata: Json | null
          processed_at: string | null
          reference_id: string | null
          reference_type: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "points_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      producer_metrics: {
        Row: {
          created_at: string | null
          id: string
          measurement_date: string
          metric_type: string
          notes: string | null
          period: string
          producer_id: string | null
          unit: string
          value: number
          verification_doc_url: string | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          measurement_date: string
          metric_type: string
          notes?: string | null
          period: string
          producer_id?: string | null
          unit: string
          value: number
          verification_doc_url?: string | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          measurement_date?: string
          metric_type?: string
          notes?: string | null
          period?: string
          producer_id?: string | null
          unit?: string
          value?: number
          verification_doc_url?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "producer_metrics_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producers"
            referencedColumns: ["id"]
          },
        ]
      }
      producers: {
        Row: {
          address: Json
          blur_hashes: string[] | null
          capacity_info: Json | null
          certifications: string[] | null
          commission_rate: number | null
          contact_info: Json | null
          cover_image: string | null
          created_at: string | null
          description: string | null
          documents: string[] | null
          gallery_images: string[] | null
          id: string
          images: string[] | null
          location: unknown | null
          logo_url: string | null
          metadata: Json | null
          name: string
          notes: string | null
          partnership_start: string | null
          partnership_type: string | null
          payment_terms: number | null
          slug: string
          social_media: Json | null
          specialties: string[] | null
          status: string | null
          story: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          address: Json
          blur_hashes?: string[] | null
          capacity_info?: Json | null
          certifications?: string[] | null
          commission_rate?: number | null
          contact_info?: Json | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          documents?: string[] | null
          gallery_images?: string[] | null
          id?: string
          images?: string[] | null
          location?: unknown | null
          logo_url?: string | null
          metadata?: Json | null
          name: string
          notes?: string | null
          partnership_start?: string | null
          partnership_type?: string | null
          payment_terms?: number | null
          slug: string
          social_media?: Json | null
          specialties?: string[] | null
          status?: string | null
          story?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          address?: Json
          blur_hashes?: string[] | null
          capacity_info?: Json | null
          certifications?: string[] | null
          commission_rate?: number | null
          contact_info?: Json | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          documents?: string[] | null
          gallery_images?: string[] | null
          id?: string
          images?: string[] | null
          location?: unknown | null
          logo_url?: string | null
          metadata?: Json | null
          name?: string
          notes?: string | null
          partnership_start?: string | null
          partnership_type?: string | null
          payment_terms?: number | null
          slug?: string
          social_media?: Json | null
          specialties?: string[] | null
          status?: string | null
          story?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          allergens: string[] | null
          blur_hashes: string[] | null
          category_id: string
          certifications: string[] | null
          created_at: string | null
          description: string | null
          dimensions: Json | null
          discontinue_date: string | null
          featured: boolean | null
          fulfillment_method: string
          id: string
          images: string[] | null
          is_active: boolean | null
          is_hero_product: boolean | null
          launch_date: string | null
          metadata: Json | null
          min_tier: string | null
          name: string
          nutrition_facts: Json | null
          origin_country: string | null
          partner_source: string | null
          price_eur_equivalent: number | null
          price_points: number
          producer_id: string | null
          seasonal_availability: Json | null
          secondary_category_id: string | null
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          stock_management: boolean | null
          stock_quantity: number | null
          tags: string[] | null
          updated_at: string | null
          variants: Json | null
          weight_grams: number | null
        }
        Insert: {
          allergens?: string[] | null
          blur_hashes?: string[] | null
          category_id: string
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          dimensions?: Json | null
          discontinue_date?: string | null
          featured?: boolean | null
          fulfillment_method?: string
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_hero_product?: boolean | null
          launch_date?: string | null
          metadata?: Json | null
          min_tier?: string | null
          name: string
          nutrition_facts?: Json | null
          origin_country?: string | null
          partner_source?: string | null
          price_eur_equivalent?: number | null
          price_points: number
          producer_id?: string | null
          seasonal_availability?: Json | null
          secondary_category_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          stock_management?: boolean | null
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string | null
          variants?: Json | null
          weight_grams?: number | null
        }
        Update: {
          allergens?: string[] | null
          blur_hashes?: string[] | null
          category_id?: string
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          dimensions?: Json | null
          discontinue_date?: string | null
          featured?: boolean | null
          fulfillment_method?: string
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_hero_product?: boolean | null
          launch_date?: string | null
          metadata?: Json | null
          min_tier?: string | null
          name?: string
          nutrition_facts?: Json | null
          origin_country?: string | null
          partner_source?: string | null
          price_eur_equivalent?: number | null
          price_points?: number
          producer_id?: string | null
          seasonal_availability?: Json | null
          secondary_category_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          stock_management?: boolean | null
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string | null
          variants?: Json | null
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_secondary_category_id_fkey"
            columns: ["secondary_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      products_backup: {
        Row: {
          allergens: string[] | null
          category_id: string | null
          certifications: string[] | null
          created_at: string | null
          description: string | null
          dimensions: Json | null
          discontinue_date: string | null
          featured: boolean | null
          fulfillment_method: string | null
          id: string | null
          images: string[] | null
          is_active: boolean | null
          is_hero_product: boolean | null
          launch_date: string | null
          metadata: Json | null
          min_tier: string | null
          name: string | null
          nutrition_facts: Json | null
          origin_country: string | null
          price_eur_equivalent: number | null
          price_points: number | null
          producer_id: string | null
          seasonal_availability: Json | null
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          slug: string | null
          stock_management: boolean | null
          stock_quantity: number | null
          tags: string[] | null
          updated_at: string | null
          variants: Json | null
          weight_grams: number | null
        }
        Insert: {
          allergens?: string[] | null
          category_id?: string | null
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          dimensions?: Json | null
          discontinue_date?: string | null
          featured?: boolean | null
          fulfillment_method?: string | null
          id?: string | null
          images?: string[] | null
          is_active?: boolean | null
          is_hero_product?: boolean | null
          launch_date?: string | null
          metadata?: Json | null
          min_tier?: string | null
          name?: string | null
          nutrition_facts?: Json | null
          origin_country?: string | null
          price_eur_equivalent?: number | null
          price_points?: number | null
          producer_id?: string | null
          seasonal_availability?: Json | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string | null
          stock_management?: boolean | null
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string | null
          variants?: Json | null
          weight_grams?: number | null
        }
        Update: {
          allergens?: string[] | null
          category_id?: string | null
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          dimensions?: Json | null
          discontinue_date?: string | null
          featured?: boolean | null
          fulfillment_method?: string | null
          id?: string | null
          images?: string[] | null
          is_active?: boolean | null
          is_hero_product?: boolean | null
          launch_date?: string | null
          metadata?: Json | null
          min_tier?: string | null
          name?: string | null
          nutrition_facts?: Json | null
          origin_country?: string | null
          price_eur_equivalent?: number | null
          price_points?: number | null
          producer_id?: string | null
          seasonal_availability?: Json | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string | null
          stock_management?: boolean | null
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string | null
          variants?: Json | null
          weight_grams?: number | null
        }
        Relationships: []
      }
      project_updates: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          images: string[] | null
          metrics: Json | null
          project_id: string | null
          published_at: string | null
          title: string
          type: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          images?: string[] | null
          metrics?: Json | null
          project_id?: string | null
          published_at?: string | null
          title: string
          type: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          images?: string[] | null
          metrics?: Json | null
          project_id?: string | null
          published_at?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          address: Json
          blur_hashes: string[] | null
          certification_labels: string[] | null
          created_at: string | null
          current_funding: number | null
          description: string | null
          featured: boolean | null
          funding_progress: number | null
          gallery_images: string[] | null
          hero_image: string | null
          id: string
          images: string[] | null
          impact_metrics: Json | null
          launch_date: string | null
          location: unknown
          long_description: string | null
          maturity_date: string | null
          metadata: Json | null
          name: string
          producer_id: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string | null
          target_budget: number
          type: string
          updated_at: string | null
        }
        Insert: {
          address: Json
          blur_hashes?: string[] | null
          certification_labels?: string[] | null
          created_at?: string | null
          current_funding?: number | null
          description?: string | null
          featured?: boolean | null
          funding_progress?: number | null
          gallery_images?: string[] | null
          hero_image?: string | null
          id?: string
          images?: string[] | null
          impact_metrics?: Json | null
          launch_date?: string | null
          location: unknown
          long_description?: string | null
          maturity_date?: string | null
          metadata?: Json | null
          name: string
          producer_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string | null
          target_budget: number
          type: string
          updated_at?: string | null
        }
        Update: {
          address?: Json
          blur_hashes?: string[] | null
          certification_labels?: string[] | null
          created_at?: string | null
          current_funding?: number | null
          description?: string | null
          featured?: boolean | null
          funding_progress?: number | null
          gallery_images?: string[] | null
          hero_image?: string | null
          id?: string
          images?: string[] | null
          impact_metrics?: Json | null
          launch_date?: string | null
          location?: unknown
          long_description?: string | null
          maturity_date?: string | null
          metadata?: Json | null
          name?: string
          producer_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string | null
          target_budget?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producers"
            referencedColumns: ["id"]
          },
        ]
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          cost_per_unit_cents: number | null
          created_at: string | null
          id: string
          inventory_id: string | null
          performed_by: string | null
          quantity: number
          reason: string | null
          reference_id: string | null
          reference_type: string | null
          type: string
        }
        Insert: {
          cost_per_unit_cents?: number | null
          created_at?: string | null
          id?: string
          inventory_id?: string | null
          performed_by?: string | null
          quantity: number
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
          type: string
        }
        Update: {
          cost_per_unit_cents?: number | null
          created_at?: string | null
          id?: string
          inventory_id?: string | null
          performed_by?: string | null
          quantity?: number
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_billing_history: {
        Row: {
          amount: number
          billing_frequency: Database["public"]["Enums"]["billing_frequency"]
          billing_period_end: string
          billing_period_start: string
          created_at: string | null
          currency: string | null
          discount_amount: number | null
          id: string
          paid_at: string | null
          payment_status: string | null
          plan_type: Database["public"]["Enums"]["subscription_plan_type"]
          points_allocated: number | null
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          subscription_id: string | null
          tax_amount: number | null
          total_amount: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          billing_frequency: Database["public"]["Enums"]["billing_frequency"]
          billing_period_end: string
          billing_period_start: string
          created_at?: string | null
          currency?: string | null
          discount_amount?: number | null
          id?: string
          paid_at?: string | null
          payment_status?: string | null
          plan_type: Database["public"]["Enums"]["subscription_plan_type"]
          points_allocated?: number | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          subscription_id?: string | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          billing_frequency?: Database["public"]["Enums"]["billing_frequency"]
          billing_period_end?: string
          billing_period_start?: string
          created_at?: string | null
          currency?: string | null
          discount_amount?: number | null
          id?: string
          paid_at?: string | null
          payment_status?: string | null
          plan_type?: Database["public"]["Enums"]["subscription_plan_type"]
          points_allocated?: number | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          subscription_id?: string | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_billing_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_billing_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_cohorts: {
        Row: {
          active_subscribers: number | null
          annual_subscribers: number | null
          average_revenue_per_user: number | null
          calculation_date: string | null
          cohort_month: string
          cohort_size: number
          conversion_rate: number | null
          id: string
          metadata: Json | null
          monthly_subscribers: number | null
          period_date: string
          period_number: number
          retention_rate: number | null
          total_revenue: number | null
        }
        Insert: {
          active_subscribers?: number | null
          annual_subscribers?: number | null
          average_revenue_per_user?: number | null
          calculation_date?: string | null
          cohort_month: string
          cohort_size: number
          conversion_rate?: number | null
          id?: string
          metadata?: Json | null
          monthly_subscribers?: number | null
          period_date: string
          period_number: number
          retention_rate?: number | null
          total_revenue?: number | null
        }
        Update: {
          active_subscribers?: number | null
          annual_subscribers?: number | null
          average_revenue_per_user?: number | null
          calculation_date?: string | null
          cohort_month?: string
          cohort_size?: number
          conversion_rate?: number | null
          id?: string
          metadata?: Json | null
          monthly_subscribers?: number | null
          period_date?: string
          period_number?: number
          retention_rate?: number | null
          total_revenue?: number | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          annual_points: number | null
          annual_price: number | null
          billing_frequency:
            | Database["public"]["Enums"]["billing_frequency"]
            | null
          bonus_percentage: number | null
          cancel_at_period_end: boolean | null
          cancellation_reason: string | null
          cancelled_at: string | null
          conversion_date: string | null
          conversion_incentive: Json | null
          converted_from:
            | Database["public"]["Enums"]["billing_frequency"]
            | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          ended_at: string | null
          id: string
          metadata: Json | null
          monthly_points: number | null
          monthly_points_allocation: number
          monthly_price: number | null
          monthly_price_eur: number
          next_billing_date: string | null
          plan_type: string
          status: string | null
          stripe_customer_id: string
          stripe_subscription_id: string | null
          trial_end: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          annual_points?: number | null
          annual_price?: number | null
          billing_frequency?:
            | Database["public"]["Enums"]["billing_frequency"]
            | null
          bonus_percentage?: number | null
          cancel_at_period_end?: boolean | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          conversion_date?: string | null
          conversion_incentive?: Json | null
          converted_from?:
            | Database["public"]["Enums"]["billing_frequency"]
            | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          monthly_points?: number | null
          monthly_points_allocation: number
          monthly_price?: number | null
          monthly_price_eur: number
          next_billing_date?: string | null
          plan_type: string
          status?: string | null
          stripe_customer_id: string
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          annual_points?: number | null
          annual_price?: number | null
          billing_frequency?:
            | Database["public"]["Enums"]["billing_frequency"]
            | null
          bonus_percentage?: number | null
          cancel_at_period_end?: boolean | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          conversion_date?: string | null
          conversion_incentive?: Json | null
          converted_from?:
            | Database["public"]["Enums"]["billing_frequency"]
            | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          monthly_points?: number | null
          monthly_points_allocation?: number
          monthly_price?: number | null
          monthly_price_eur?: number
          next_billing_date?: string | null
          plan_type?: string
          status?: string | null
          stripe_customer_id?: string
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          address: Json | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          first_name: string | null
          last_name: string | null
          notification_preferences: Json | null
          phone: string | null
          social_links: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: Json | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          last_name?: string | null
          notification_preferences?: Json | null
          phone?: string | null
          social_links?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: Json | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          last_name?: string | null
          notification_preferences?: Json | null
          phone?: string | null
          social_links?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string | null
          device_info: Json | null
          expires_at: string
          id: string
          ip_address: unknown | null
          session_token: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          session_token: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          session_token?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          email_verified_at: string | null
          id: string
          kyc_level: number | null
          kyc_status: string | null
          last_login_at: string | null
          points_balance: number | null
          preferences: Json | null
          profile: Json | null
          updated_at: string | null
          user_level: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          email_verified_at?: string | null
          id?: string
          kyc_level?: number | null
          kyc_status?: string | null
          last_login_at?: string | null
          points_balance?: number | null
          preferences?: Json | null
          profile?: Json | null
          updated_at?: string | null
          user_level?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          email_verified_at?: string | null
          id?: string
          kyc_level?: number | null
          kyc_status?: string | null
          last_login_at?: string | null
          points_balance?: number | null
          preferences?: Json | null
          profile?: Json | null
          updated_at?: string | null
          user_level?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      admin_dashboard_metrics: {
        Row: {
          annual_subscriptions: number | null
          average_monthly_revenue: number | null
          conversion_rate_30_days: number | null
          current_mrr: number | null
          last_updated: string | null
          monthly_subscriptions: number | null
          projected_arr: number | null
          total_active_subscriptions: number | null
        }
        Relationships: []
      }
      blur_system_stats: {
        Row: {
          avg_file_size_bytes: number | null
          avg_height: number | null
          avg_width: number | null
          entity_type: string | null
          first_generated: string | null
          generated_last_24h: number | null
          generated_last_7d: number | null
          last_generated: string | null
          max_file_size_bytes: number | null
          min_file_size_bytes: number | null
          total_blur_hashes: number | null
          unique_entities: number | null
        }
        Relationships: []
      }
      dual_billing_dashboard: {
        Row: {
          metric: string | null
          status: string | null
          unit: string | null
          value: number | null
        }
        Relationships: []
      }
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown | null
          f_table_catalog: unknown | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown | null
          f_table_catalog: string | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      index_usage_analysis: {
        Row: {
          cleanup_priority: number | null
          fetches: number | null
          index_name: unknown | null
          reads: number | null
          schemaname: unknown | null
          size: string | null
          table_name: unknown | null
          usage_status: string | null
        }
        Relationships: []
      }
      points_expiring_soon: {
        Row: {
          created_at: string | null
          days_until_expiry: number | null
          earned_date: string | null
          expired_at: string | null
          expiry_date: string | null
          id: string | null
          is_expired: boolean | null
          is_notified_1_day: boolean | null
          is_notified_30_days: boolean | null
          is_notified_7_days: boolean | null
          metadata: Json | null
          points_amount: number | null
          points_transaction_id: string | null
          source_details: Json | null
          source_type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          days_until_expiry?: never
          earned_date?: string | null
          expired_at?: string | null
          expiry_date?: string | null
          id?: string | null
          is_expired?: boolean | null
          is_notified_1_day?: boolean | null
          is_notified_30_days?: boolean | null
          is_notified_7_days?: boolean | null
          metadata?: Json | null
          points_amount?: number | null
          points_transaction_id?: string | null
          source_details?: Json | null
          source_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          days_until_expiry?: never
          earned_date?: string | null
          expired_at?: string | null
          expiry_date?: string | null
          id?: string | null
          is_expired?: boolean | null
          is_notified_1_day?: boolean | null
          is_notified_30_days?: boolean | null
          is_notified_7_days?: boolean | null
          metadata?: Json | null
          points_amount?: number | null
          points_transaction_id?: string | null
          source_details?: Json | null
          source_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "points_expiry_schedule_points_transaction_id_fkey"
            columns: ["points_transaction_id"]
            isOneToOne: false
            referencedRelation: "points_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_expiry_schedule_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      points_expiry_with_days: {
        Row: {
          created_at: string | null
          days_until_expiry: number | null
          earned_date: string | null
          expired_at: string | null
          expiry_date: string | null
          id: string | null
          is_expired: boolean | null
          is_notified_1_day: boolean | null
          is_notified_30_days: boolean | null
          is_notified_7_days: boolean | null
          metadata: Json | null
          points_amount: number | null
          points_transaction_id: string | null
          source_details: Json | null
          source_type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          days_until_expiry?: never
          earned_date?: string | null
          expired_at?: string | null
          expiry_date?: string | null
          id?: string | null
          is_expired?: boolean | null
          is_notified_1_day?: boolean | null
          is_notified_30_days?: boolean | null
          is_notified_7_days?: boolean | null
          metadata?: Json | null
          points_amount?: number | null
          points_transaction_id?: string | null
          source_details?: Json | null
          source_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          days_until_expiry?: never
          earned_date?: string | null
          expired_at?: string | null
          expiry_date?: string | null
          id?: string | null
          is_expired?: boolean | null
          is_notified_1_day?: boolean | null
          is_notified_30_days?: boolean | null
          is_notified_7_days?: boolean | null
          metadata?: Json | null
          points_amount?: number | null
          points_transaction_id?: string | null
          source_details?: Json | null
          source_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "points_expiry_schedule_points_transaction_id_fkey"
            columns: ["points_transaction_id"]
            isOneToOne: false
            referencedRelation: "points_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_expiry_schedule_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products_missing_blur: {
        Row: {
          existing_blur_count: number | null
          id: string | null
          is_active: boolean | null
          missing_blur_images: string[] | null
          missing_blur_percent: number | null
          name: string | null
          slug: string | null
          total_images: number | null
        }
        Relationships: []
      }
      table_size_analysis: {
        Row: {
          deletes: number | null
          index_size: string | null
          inserts: number | null
          schemaname: unknown | null
          size_status: string | null
          table_name: unknown | null
          table_size: string | null
          total_size: string | null
          updates: number | null
        }
        Relationships: []
      }
      user_subscription_summary: {
        Row: {
          allocation_preferences: Json | null
          billing_frequency:
            | Database["public"]["Enums"]["billing_frequency"]
            | null
          current_points_balance: number | null
          current_price: number | null
          monthly_points_allocation: number | null
          next_billing_date: string | null
          next_points_expiry: string | null
          plan_type: string | null
          potential_annual_savings: number | null
          status: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_scripts_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_bestsrid: {
        Args: { "": unknown }
        Returns: number
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_pointoutside: {
        Args: { "": unknown }
        Returns: unknown
      }
      _st_sortablehash: {
        Args: { geom: unknown }
        Returns: number
      }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      addauth: {
        Args: { "": string }
        Returns: boolean
      }
      addgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
          | {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
          | {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
        Returns: string
      }
      assign_category_by_keywords: {
        Args: { product_description?: string; product_name: string }
        Returns: string
      }
      box: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box3d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3dtobox: {
        Args: { "": unknown }
        Returns: unknown
      }
      bytea: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      calculate_conversion_rate: {
        Args:
          | Record<PropertyKey, never>
          | { end_date?: string; start_date?: string }
        Returns: number
      }
      calculate_mrr: {
        Args: Record<PropertyKey, never> | { target_date?: string }
        Returns: number
      }
      cleanup_orphaned_blur_hashes: {
        Args: { p_entity_type?: string }
        Returns: number
      }
      disablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      dropgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
          | { column_name: string; schema_name: string; table_name: string }
          | { column_name: string; table_name: string }
        Returns: string
      }
      dropgeometrytable: {
        Args:
          | { catalog_name: string; schema_name: string; table_name: string }
          | { schema_name: string; table_name: string }
          | { table_name: string }
        Returns: string
      }
      enablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      expire_old_points: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      generate_blurhash_for_image: {
        Args: { image_url: string }
        Returns: string
      }
      geography: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      geography_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geography_gist_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_gist_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_send: {
        Args: { "": unknown }
        Returns: string
      }
      geography_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geography_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry: {
        Args:
          | { "": string }
          | { "": string }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
        Returns: unknown
      }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_sortsupport_2d: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_hash: {
        Args: { "": unknown }
        Returns: number
      }
      geometry_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_send: {
        Args: { "": unknown }
        Returns: string
      }
      geometry_sortsupport: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_spgist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_3d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geometry_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometrytype: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      get_category_path: {
        Args: { cat_id: string }
        Returns: string
      }
      get_category_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          category_name: string
          category_slug: string
          is_parent: boolean
          product_count: number
        }[]
      }
      get_days_until_expiry: {
        Args: { expiry_date: string }
        Returns: number
      }
      get_entity_blur_hashes: {
        Args: { p_entity_id: string; p_entity_type: string }
        Returns: {
          blur_hash: string
          file_size: number
          generated_at: string
          height: number
          image_url: string
          width: number
        }[]
      }
      get_image_blur_hash: {
        Args: { p_image_url: string }
        Returns: string
      }
      get_proj4_from_srid: {
        Args: { "": number }
        Returns: string
      }
      gettransactionid: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      gidx_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gidx_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      json: {
        Args: { "": unknown }
        Returns: Json
      }
      jsonb: {
        Args: { "": unknown }
        Returns: Json
      }
      longtransactionsenabled: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      maintenance_blur_system: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      migrate_producers_structure: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      migrate_products_blurhash: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      migrate_projects_structure: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      path: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_asflatgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_geometry_clusterintersecting_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_clusterwithin_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_collect_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_makeline_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_polygonize_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      point: {
        Args: { "": unknown }
        Returns: unknown
      }
      polygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      populate_geometry_columns: {
        Args:
          | { tbl_oid: unknown; use_typmod?: boolean }
          | { use_typmod?: boolean }
        Returns: number
      }
      postgis_addbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_dropbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_extensions_upgrade: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_full_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_geos_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_geos_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_getbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_hasbbox: {
        Args: { "": unknown }
        Returns: boolean
      }
      postgis_index_supportfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_lib_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_revision: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libjson_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_liblwgeom_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libprotobuf_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libxml_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_proj_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_installed: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_released: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_svn_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_typmod_dims: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_srid: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_type: {
        Args: { "": number }
        Returns: string
      }
      postgis_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_wagyu_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      spheroid_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      spheroid_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlength: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dperimeter: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle: {
        Args:
          | { line1: unknown; line2: unknown }
          | { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
        Returns: number
      }
      st_area: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_area2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_asbinary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_asewkt: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asgeojson: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; options?: number }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
          | {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
        Returns: string
      }
      st_asgml: {
        Args:
          | { "": string }
          | {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
          | {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
          | {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_ashexewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_askml: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
          | { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
        Returns: string
      }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: {
        Args: { format?: string; geom: unknown }
        Returns: string
      }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; rel?: number }
          | { geom: unknown; maxdecimaldigits?: number; rel?: number }
        Returns: string
      }
      st_astext: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_astwkb: {
        Args:
          | {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
          | {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
        Returns: string
      }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_boundary: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer: {
        Args:
          | { geom: unknown; options?: string; radius: number }
          | { geom: unknown; quadsegs: number; radius: number }
        Returns: unknown
      }
      st_buildarea: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_centroid: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      st_cleangeometry: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_clusterintersecting: {
        Args: { "": unknown[] }
        Returns: unknown[]
      }
      st_collect: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collectionextract: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_collectionhomogenize: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_convexhull: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_coorddim: {
        Args: { geometry: unknown }
        Returns: number
      }
      st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_dimension: {
        Args: { "": unknown }
        Returns: number
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance: {
        Args:
          | { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_distancesphere: {
        Args:
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; radius: number }
        Returns: number
      }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dump: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumppoints: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumprings: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumpsegments: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_endpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_envelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_expand: {
        Args:
          | { box: unknown; dx: number; dy: number }
          | { box: unknown; dx: number; dy: number; dz?: number }
          | { dm?: number; dx: number; dy: number; dz?: number; geom: unknown }
        Returns: unknown
      }
      st_exteriorring: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_flipcoordinates: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force3d: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_forcecollection: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcecurve: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygonccw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygoncw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcerhr: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcesfs: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_generatepoints: {
        Args:
          | { area: unknown; npoints: number }
          | { area: unknown; npoints: number; seed: number }
        Returns: unknown
      }
      st_geogfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geogfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geographyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geohash: {
        Args:
          | { geog: unknown; maxchars?: number }
          | { geom: unknown; maxchars?: number }
        Returns: string
      }
      st_geomcollfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomcollfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometrytype: {
        Args: { "": unknown }
        Returns: string
      }
      st_geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromgeojson: {
        Args: { "": Json } | { "": Json } | { "": string }
        Returns: unknown
      }
      st_geomfromgml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromkml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfrommarc21: {
        Args: { marc21xml: string }
        Returns: unknown
      }
      st_geomfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromtwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_gmltosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_hasarc: {
        Args: { geometry: unknown }
        Returns: boolean
      }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_isclosed: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_iscollection: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isempty: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygonccw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygoncw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isring: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_issimple: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvalid: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
      }
      st_isvalidreason: {
        Args: { "": unknown }
        Returns: string
      }
      st_isvalidtrajectory: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_length: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_length2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_letters: {
        Args: { font?: Json; letters: string }
        Returns: unknown
      }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefrommultipoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_linefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linemerge: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linestringfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linetocurve: {
        Args: { geometry: unknown }
        Returns: unknown
      }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_m: {
        Args: { "": unknown }
        Returns: number
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makepolygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { "": unknown } | { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_maximuminscribedcircle: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_memsize: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_minimumboundingradius: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_minimumclearance: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumclearanceline: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_mlinefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mlinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multi: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_multilinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multilinestringfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_ndims: {
        Args: { "": unknown }
        Returns: number
      }
      st_node: {
        Args: { g: unknown }
        Returns: unknown
      }
      st_normalize: {
        Args: { geom: unknown }
        Returns: unknown
      }
      st_npoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_nrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numgeometries: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorring: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpatches: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_orientedenvelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { "": unknown } | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_perimeter2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_pointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointonsurface: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_points: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonize: {
        Args: { "": unknown[] }
        Returns: unknown
      }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: string
      }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_reverse: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid: {
        Args: { geog: unknown; srid: number } | { geom: unknown; srid: number }
        Returns: unknown
      }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shiftlongitude: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid: {
        Args: { geog: unknown } | { geom: unknown }
        Returns: number
      }
      st_startpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_summary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_transform: {
        Args:
          | { from_proj: string; geom: unknown; to_proj: string }
          | { from_proj: string; geom: unknown; to_srid: number }
          | { geom: unknown; to_proj: string }
        Returns: unknown
      }
      st_triangulatepolygon: {
        Args: { g1: unknown }
        Returns: unknown
      }
      st_union: {
        Args:
          | { "": unknown[] }
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; gridsize: number }
        Returns: unknown
      }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_wkbtosql: {
        Args: { wkb: string }
        Returns: unknown
      }
      st_wkttosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      st_x: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmin: {
        Args: { "": unknown }
        Returns: number
      }
      st_y: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymax: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymin: {
        Args: { "": unknown }
        Returns: number
      }
      st_z: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmflag: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmin: {
        Args: { "": unknown }
        Returns: number
      }
      text: {
        Args: { "": unknown }
        Returns: string
      }
      unlockrows: {
        Args: { "": string }
        Returns: number
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
      upsert_image_blur_hash: {
        Args: {
          p_blur_hash: string
          p_entity_id: string
          p_entity_type: string
          p_file_size?: number
          p_height?: number
          p_image_url: string
          p_width?: number
        }
        Returns: boolean
      }
    }
    Enums: {
      billing_frequency: "monthly" | "annual"
      conversion_event_type:
        | "monthly_to_annual"
        | "annual_to_monthly"
        | "plan_upgrade"
        | "plan_downgrade"
        | "reactivation"
        | "cancellation"
      subscription_plan_type:
        | "explorer_free"
        | "protector_basic"
        | "ambassador_standard"
        | "ambassador_premium"
      subscription_status_type:
        | "active"
        | "inactive"
        | "cancelled"
        | "past_due"
        | "unpaid"
        | "trialing"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown | null
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      billing_frequency: ["monthly", "annual"],
      conversion_event_type: [
        "monthly_to_annual",
        "annual_to_monthly",
        "plan_upgrade",
        "plan_downgrade",
        "reactivation",
        "cancellation",
      ],
      subscription_plan_type: [
        "explorer_free",
        "protector_basic",
        "ambassador_standard",
        "ambassador_premium",
      ],
      subscription_status_type: [
        "active",
        "inactive",
        "cancelled",
        "past_due",
        "unpaid",
        "trialing",
      ],
    },
  },
} as const
