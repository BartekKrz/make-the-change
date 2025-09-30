export type Subscription = {
  id: string;
  user_id: string;
  subscription_tier: 'ambassadeur_standard' | 'ambassadeur_premium';
  billing_frequency: 'monthly' | 'annual';
  amount_eur: number;
  points_total: number;
  bonus_percentage: number;
  project_allocation: any;
  stripe_subscription_id: string | null;
  payment_status: 'pending' | 'active' | 'past_due' | 'canceled';
  next_billing_date: string | null;
  start_date: string;
  end_date: string | null;
  points_expiry_date: string;
  status: 'active' | 'expired' | 'cancelled' | 'paused';
  auto_renew: boolean;
  created_at: string;
  updated_at: string;

  // Relations
  users?: {
    id: string;
    email: string;
    user_profiles?: {
      first_name: string | null;
      last_name: string | null;
      avatar_url: string | null;
      phone?: string | null;
    };
  };
};

export type SubscriptionFilters = {
  page?: number;
  limit?: number;
  search?: string;
  status?: Subscription['status'];
  subscriptionTier?: Subscription['subscription_tier'];
  billingFrequency?: Subscription['billing_frequency'];
};

export type SubscriptionFormData = {
  subscription_tier: Subscription['subscription_tier'];
  billing_frequency: Subscription['billing_frequency'];
  status: Subscription['status'];
  amount_eur: number;
};
