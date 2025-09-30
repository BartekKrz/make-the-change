import { z } from 'zod';

// ============================================================================
// COMMON UTILITIES
// ============================================================================

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// ============================================================================
// FORMATTERS
// ============================================================================

export const formatPrice = (amount: number, currency = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatPoints = (points: number): string => {
  if (points >= 1000000) {
    return `${(points / 1000000).toFixed(1)}M pts`;
  }
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}k pts`;
  }
  return `${points} pts`;
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat('fr-FR', { ...defaultOptions, ...options }).format(date);
};

export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Aujourd\'hui';
  if (diffInDays === 1) return 'Hier';
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
  if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`;
  if (diffInDays < 365) return `Il y a ${Math.floor(diffInDays / 30)} mois`;

  return `Il y a ${Math.floor(diffInDays / 365)} ans`;
};

export const formatFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

export const formatAddress = (address: {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}): string => {
  return `${address.street}, ${address.postalCode} ${address.city}, ${address.country}`;
};

// ============================================================================
// VALIDATORS
// ============================================================================

export const isValidEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};

export const isValidFrenchPhone = (phone: string): boolean => {
  const frenchPhoneRegex = /^(?:(?:\+33|0)[1-9])(?:[0-9]{8})$/;
  return frenchPhoneRegex.test(phone.replace(/\s/g, ''));
};

export const isValidIBAN = (iban: string): boolean => {
  const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/;
  return ibanRegex.test(iban.replace(/\s/g, ''));
};

export const isValidAge = (dateOfBirth: Date, minAge = 18): boolean => {
  const today = new Date();
  const age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    return age - 1 >= minAge;
  }

  return age >= minAge;
};

export const isValidInvestmentAmount = (
  amount: number,
  minInvestment: number,
  maxInvestment?: number
): boolean => {
  if (amount < minInvestment) return false;
  if (maxInvestment && amount > maxInvestment) return false;
  return true;
};

export const hasEnoughPoints = (availablePoints: number, requiredPoints: number): boolean => {
  return availablePoints >= requiredPoints;
};

export const canUserPerformAction = (
  userLevel: 'EXPLORATEUR' | 'PROTECTEUR' | 'AMBASSADEUR',
  requiredLevel: 'EXPLORATEUR' | 'PROTECTEUR' | 'AMBASSADEUR'
): boolean => {
  const levels = {
    'EXPLORATEUR': 1,
    'PROTECTEUR': 2,
    'AMBASSADEUR': 3,
  };

  return levels[userLevel] >= levels[requiredLevel];
};

export const isValidFrenchPostalCode = (postalCode: string): boolean => {
  const frenchPostalCodeRegex = /^[0-9]{5}$/;
  return frenchPostalCodeRegex.test(postalCode);
};

// ============================================================================
// POINTS CALCULATOR
// ============================================================================

export type Investment = {
  type: 'beehive' | 'olive_tree' | 'family_plot'
  amount_eur: number
  partner: 'habeebee' | 'ilanga' | 'promiel' | 'multi'
  bonus_percentage: number
}

export type Subscription = {
  type: 'ambassador_standard' | 'ambassador_premium'
  billing_frequency: 'monthly' | 'annual'
  amount_eur: number
  bonus_percentage: number
}

export type PointsCalculation = {
  base_points: number
  bonus_points: number
  total_points: number
  euro_value_equivalent: number
  investment_type?: string
  calculated_at: Date
}

export function calculateInvestmentPoints(investment: Investment): PointsCalculation {
  if (investment.amount_eur <= 0) throw new Error('Invalid investment amount')
  if (investment.bonus_percentage < 0) throw new Error('Invalid bonus percentage')
  const base_points = Math.ceil(investment.amount_eur)
  const bonus_points = Math.floor(base_points * (investment.bonus_percentage / 100))
  const total_points = base_points + bonus_points
  return {
    base_points,
    bonus_points,
    total_points,
    euro_value_equivalent: total_points,
    investment_type: investment.type,
    calculated_at: new Date(),
  }
}

export function calculateSubscriptionPoints(subscription: Subscription): PointsCalculation {
  const validTypes = ['ambassador_standard', 'ambassador_premium']
  if (!validTypes.includes(subscription.type)) throw new Error('Invalid subscription type')
  const validFrequencies = ['monthly', 'annual']
  if (!validFrequencies.includes(subscription.billing_frequency)) throw new Error('Invalid billing frequency')
  if (subscription.amount_eur <= 0) throw new Error('Invalid subscription amount')
  if (subscription.bonus_percentage < 0) throw new Error('Invalid bonus percentage')
  const base_points = subscription.amount_eur
  const bonus_points = Math.round(base_points * (subscription.bonus_percentage / 100))
  const total_points = base_points + bonus_points
  return {
    base_points,
    bonus_points,
    total_points,
    euro_value_equivalent: total_points,
    calculated_at: new Date(),
  }
}

export function validateInvestmentRules(investment: Investment): boolean {
  const rules = {
    beehive: { min_amount: 50, max_amount: 200, expected_bonus: 30, valid_partners: ['habeebee'] },
    olive_tree: { min_amount: 80, max_amount: 300, expected_bonus: 40, valid_partners: ['ilanga'] },
    family_plot: { min_amount: 150, max_amount: 500, expected_bonus: 50, valid_partners: ['multi', 'habeebee', 'ilanga'] },
  } as const
  const rule = (rules as any)[investment.type]
  if (!rule) return false
  if (investment.amount_eur < rule.min_amount || investment.amount_eur > rule.max_amount) return false
  if (!rule.valid_partners.includes(investment.partner)) return false
  return true
}

export function calculatePointsEuroValue(points: number): number {
  return points * 1.0
}