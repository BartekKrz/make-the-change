export type Investment = {
  type: 'beehive' | 'olive_tree' | 'family_plot';
  amount_eur: number;
  partner: 'habeebee' | 'ilanga' | 'promiel' | 'multi';
  bonus_percentage: number;
};

export type Subscription = {
  type: 'ambassador_standard' | 'ambassador_premium';
  billing_frequency: 'monthly' | 'annual';
  amount_eur: number;
  bonus_percentage: number;
};

export type PointsCalculation = {
  base_points: number;
  bonus_points: number;
  total_points: number;
  euro_value_equivalent: number;
  investment_type?: string;
  calculated_at: Date;
};

export function calculateInvestmentPoints(
  investment: Investment
): PointsCalculation {
  if (investment.amount_eur <= 0) {
    throw new Error('Invalid investment amount');
  }

  if (investment.bonus_percentage < 0) {
    throw new Error('Invalid bonus percentage');
  }

  const base_points = Math.ceil(investment.amount_eur);

  const bonus_points = Math.floor(
    base_points * (investment.bonus_percentage / 100)
  );

  const total_points = base_points + bonus_points;

  return {
    base_points,
    bonus_points,
    total_points,
    euro_value_equivalent: total_points,
    investment_type: investment.type,
    calculated_at: new Date(),
  };
}

export function calculateSubscriptionPoints(
  subscription: Subscription
): PointsCalculation {
  const validTypes = ['ambassador_standard', 'ambassador_premium'];
  if (!validTypes.includes(subscription.type)) {
    throw new Error('Invalid subscription type');
  }

  const validFrequencies = ['monthly', 'annual'];
  if (!validFrequencies.includes(subscription.billing_frequency)) {
    throw new Error('Invalid billing frequency');
  }

  if (subscription.amount_eur <= 0) {
    throw new Error('Invalid subscription amount');
  }

  if (subscription.bonus_percentage < 0) {
    throw new Error('Invalid bonus percentage');
  }

  const base_points = subscription.amount_eur;

  const bonus_points = Math.round(
    base_points * (subscription.bonus_percentage / 100)
  );

  const total_points = base_points + bonus_points;

  return {
    base_points,
    bonus_points,
    total_points,
    euro_value_equivalent: total_points,
    calculated_at: new Date(),
  };
}

export function validateInvestmentRules(investment: Investment): boolean {
  const rules = {
    beehive: {
      min_amount: 50,
      max_amount: 200,
      expected_bonus: 30,
      valid_partners: ['habeebee'],
    },
    olive_tree: {
      min_amount: 80,
      max_amount: 300,
      expected_bonus: 40,
      valid_partners: ['ilanga'],
    },
    family_plot: {
      min_amount: 150,
      max_amount: 500,
      expected_bonus: 50,
      valid_partners: ['multi', 'habeebee', 'ilanga'],
    },
  };

  const rule = rules[investment.type];
  if (!rule) return false;

  if (
    investment.amount_eur < rule.min_amount ||
    investment.amount_eur > rule.max_amount
  ) {
    return false;
  }

  if (!rule.valid_partners.includes(investment.partner)) {
    return false;
  }

  return true;
}

export function calculatePointsEuroValue(points: number): number {
  return points * 1;
}
