/**
 * Tests TDD CRITIQUES - Points Calculator
 * Niveau ROUGE selon stratégie TDD (Coverage: 95%+)
 * 
 * Tests des calculs de points selon le modèle business définitif :
 * - Ruche HABEEBEE: 50€ → 65 points (30% bonus)
 * - Olivier ILANGA: 80€ → 112 points (40% bonus) 
 * - Parcelle Familiale: 150€ → 225 points (50% bonus)
 */

import { describe, it, expect } from 'vitest'
import { 
  calculateInvestmentPoints,
  calculateSubscriptionPoints,
  type Investment,
  type Subscription,
  type PointsCalculation 
} from '@/lib/business/points-calculator'

describe('Points Calculator - Investment Logic (TDD CRITIQUE)', () => {
  describe('Beehive Investment - HABEEBEE', () => {
    it('should calculate correct points for 50€ beehive investment', () => {
      const investment: Investment = {
        type: 'beehive',
        amount_eur: 50,
        partner: 'habeebee',
        bonus_percentage: 30
      }
      
      const result = calculateInvestmentPoints(investment)
      
      expect(result.base_points).toBe(50)
      expect(result.bonus_points).toBe(15) // 30% de 50
      expect(result.total_points).toBe(65)
      expect(result.investment_type).toBe('beehive')
    })

    it('should handle edge case with 0 euro investment', () => {
      const investment: Investment = {
        type: 'beehive',
        amount_eur: 0,
        partner: 'habeebee',
        bonus_percentage: 30
      }
      
      expect(() => calculateInvestmentPoints(investment)).toThrow('Invalid investment amount')
    })

    it('should handle negative investment amount', () => {
      const investment: Investment = {
        type: 'beehive',
        amount_eur: -50,
        partner: 'habeebee',
        bonus_percentage: 30
      }
      
      expect(() => calculateInvestmentPoints(investment)).toThrow('Invalid investment amount')
    })
  })

  describe('Olive Tree Investment - ILANGA', () => {
    it('should calculate correct points for 80€ olive tree investment', () => {
      const investment: Investment = {
        type: 'olive_tree',
        amount_eur: 80,
        partner: 'ilanga',
        bonus_percentage: 40
      }
      
      const result = calculateInvestmentPoints(investment)
      
      expect(result.base_points).toBe(80)
      expect(result.bonus_points).toBe(32) // 40% de 80
      expect(result.total_points).toBe(112)
      expect(result.investment_type).toBe('olive_tree')
    })
  })

  describe('Family Plot Investment - Multi-Partner', () => {
    it('should calculate correct points for 150€ family plot investment', () => {
      const investment: Investment = {
        type: 'family_plot',
        amount_eur: 150,
        partner: 'multi',
        bonus_percentage: 50
      }
      
      const result = calculateInvestmentPoints(investment)
      
      expect(result.base_points).toBe(150)
      expect(result.bonus_points).toBe(75) // 50% de 150
      expect(result.total_points).toBe(225)
      expect(result.investment_type).toBe('family_plot')
    })
  })

  describe('Bonus Percentage Validation', () => {
    it('should handle invalid bonus percentage', () => {
      const investment: Investment = {
        type: 'beehive',
        amount_eur: 50,
        partner: 'habeebee',
        bonus_percentage: -10 // Invalide
      }
      
      expect(() => calculateInvestmentPoints(investment)).toThrow('Invalid bonus percentage')
    })

    it('should handle extremely high bonus percentage', () => {
      const investment: Investment = {
        type: 'beehive',
        amount_eur: 50,
        partner: 'habeebee',
        bonus_percentage: 200 // Très élevé mais valide
      }
      
      const result = calculateInvestmentPoints(investment)
      expect(result.total_points).toBe(150) // 50 + 100
    })
  })
})

describe('Points Calculator - Subscription Logic (TDD CRITIQUE)', () => {
  describe('Ambassador Standard Subscriptions', () => {
    it('should calculate monthly ambassador standard points (18€/mois → 24 points)', () => {
      const subscription: Subscription = {
        type: 'ambassador_standard',
        billing_frequency: 'monthly',
        amount_eur: 18,
        bonus_percentage: 33
      }
      
      const result = calculateSubscriptionPoints(subscription)
      
      expect(result.base_points).toBe(18)
      expect(result.bonus_points).toBe(6) // 33% de 18 = 5.94 → 6 (arrondi)
      expect(result.total_points).toBe(24)
    })

    it('should calculate annual ambassador standard points (180€/an → 252 points)', () => {
      const subscription: Subscription = {
        type: 'ambassador_standard',
        billing_frequency: 'annual',
        amount_eur: 180,
        bonus_percentage: 40
      }
      
      const result = calculateSubscriptionPoints(subscription)
      
      expect(result.base_points).toBe(180)
      expect(result.bonus_points).toBe(72) // 40% de 180
      expect(result.total_points).toBe(252)
    })
  })

  describe('Ambassador Premium Subscriptions', () => {
    it('should calculate monthly ambassador premium points (32€/mois → 40 points)', () => {
      const subscription: Subscription = {
        type: 'ambassador_premium',
        billing_frequency: 'monthly',
        amount_eur: 32,
        bonus_percentage: 25
      }
      
      const result = calculateSubscriptionPoints(subscription)
      
      expect(result.base_points).toBe(32)
      expect(result.bonus_points).toBe(8) // 25% de 32
      expect(result.total_points).toBe(40)
    })

    it('should calculate annual ambassador premium points (320€/an → 480 points)', () => {
      const subscription: Subscription = {
        type: 'ambassador_premium',
        billing_frequency: 'annual',
        amount_eur: 320,
        bonus_percentage: 50
      }
      
      const result = calculateSubscriptionPoints(subscription)
      
      expect(result.base_points).toBe(320)
      expect(result.bonus_points).toBe(160) // 50% de 320
      expect(result.total_points).toBe(480)
    })
  })

  describe('Subscription Validation', () => {
    it('should reject invalid subscription type', () => {
      const subscription: Subscription = {
        type: 'invalid_type' as any,
        billing_frequency: 'monthly',
        amount_eur: 18,
        bonus_percentage: 33
      }
      
      expect(() => calculateSubscriptionPoints(subscription)).toThrow('Invalid subscription type')
    })

    it('should reject invalid billing frequency', () => {
      const subscription: Subscription = {
        type: 'ambassador_standard',
        billing_frequency: 'weekly' as any,
        amount_eur: 18,
        bonus_percentage: 33
      }
      
      expect(() => calculateSubscriptionPoints(subscription)).toThrow('Invalid billing frequency')
    })
  })
})

describe('Points Calculator - Business Rules Validation', () => {
  it('should ensure 1 point = 1€ value principle', () => {
    // Test que chaque point vaut exactement 1€ en valeur produit
    const investment: Investment = {
      type: 'beehive',
      amount_eur: 50,
      partner: 'habeebee',
      bonus_percentage: 30
    }
    
    const result = calculateInvestmentPoints(investment)
    
    // 65 points = 65€ de valeur produit garantie
    expect(result.total_points).toBe(65)
    expect(result.euro_value_equivalent).toBe(65)
  })

  it('should handle decimal amounts correctly', () => {
    const investment: Investment = {
      type: 'beehive',
      amount_eur: 49.99,
      partner: 'habeebee',
      bonus_percentage: 30
    }
    
    const result = calculateInvestmentPoints(investment)
    
    // Base points doivent être arrondis intelligemment
    expect(result.base_points).toBe(50) // Arrondi à l'euro supérieur
    expect(result.bonus_points).toBe(15) // 30% de 50
    expect(result.total_points).toBe(65)
  })
})
