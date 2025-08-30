# 🛒 Admin Dashboard - Gestion Produits MVP

**📍 PRIORITÉ: ⭐️⭐️⭐️ CRITIQUE** | **🗓️ SEMAINES 13-14** | **🎯 E-COMMERCE HYBRIDE**

## 🎯 Objectifs

Interface administrative pour gérer le catalogue e-commerce hybride (micro-stock + dropshipping) avec pricing en points. Support des commissions partenaires et gestion inventaire temps réel.

## 📋 Vue d'Ensemble - Catalogue Hybride

### Modèle E-commerce Hybride
```yaml
Stratégie Catalogue:
  micro_stock:
    description: "2-3 SKUs héros en stock MTC"
    examples: ["Miel Signature MTC", "Coffret Découverte Premium"]
    margin: "40-60%"
    fulfillment: "Direct MTC (24-48h)"
    
  partner_dropship:
    description: "150+ produits partenaires"
    partners: ["HABEEBEE", "ILANGA NATURE", "PROMIEL"]
    commission: "15-25%"
    fulfillment: "Partner direct (3-7 jours)"
    
  hybrid_orders:
    description: "Commandes mixtes stock+dropshipping"
    handling: "Expéditions séparées avec tracking unifié"
    customer_info: "Communication transparente SLA"
```

### Pricing & Points System
```yaml
Points Pricing:
  rule: "1 point = 1€ valeur produit"
  sources: 
    - Investissements projets (65/112/225 points + bonus)
    - Abonnements Ambassadeur (252/480 points/an)
  expiry: "18 mois après génération"
  alerts: "60/30/7 jours avant expiration"
```

## 🖼️ Interface Utilisateur

### 1. Liste des Produits
```typescript
interface ProductsListView {
  filters: {
    category: ProductCategory[]
    fulfillment: 'all' | 'stock' | 'dropship'
    partner: string[]
    status: 'all' | 'active' | 'draft' | 'out_of_stock' | 'discontinued'
    pointsRange: [number, number]
  }
  
  columns: {
    thumbnail: string           // Image produit
    name: string               // Nom du produit
    category: ProductCategory  // Catégorie avec badge
    pointsPrice: number        // Prix en points
    eurEquivalent: number      // Équivalent € (= pointsPrice)
    partner: string | null     // Partenaire (si dropship)
    fulfillment: 'stock' | 'dropship' // Type fulfillment
    inventory: {
      currentStock?: number    // Stock actuel (si stock)
      status: InventoryStatus  // Statut stock/disponibilité
    }
    performance: {
      sales30d: number         // Ventes 30 derniers jours
      conversionRate: number   // Taux conversion produit
    }
    status: ProductStatus      // Statut avec badge
    actions: ActionButtons     // Éditer, Dupliquer, Archiver
  }
  
  bulk_actions: {
    update_status: (ids: string[], status: ProductStatus) => void
    adjust_points_price: (ids: string[], adjustment: PriceAdjustment) => void
    export_catalog: (ids: string[], format: 'csv' | 'json') => void
    sync_partner_data: (partner_ids: string[]) => void
  }
}
```

### 2. Création/Édition de Produit
```typescript
interface ProductEditor {
  // Section 1: Informations de Base
  basic_info: {
    name: string              // Nom produit (requis)
    slug: string              // URL slug (auto-généré)
    short_description: string // Description courte (requis, 160 chars)
    long_description: string  // Description détaillée (markdown supporté)
    category_id: string       // Catégorie (requis)
    tags: string[]            // Tags pour filtrage
    status: ProductStatus     // draft, active, out_of_stock, discontinued
  }
  
  // Section 2: Pricing & Points
  pricing: {
    pointsPrice: number        // Prix en points (requis)
    eurEquivalent: number      // Auto-calculé (= pointsPrice)
    costBasis?: number         // Coût interne (si stock MTC)
    marginPercentage?: number  // Marge calculée (si stock MTC)
    partnerCommission?: number // Commission partenaire (si dropship)
  }
  
  // Section 3: Fulfillment & Inventaire
  fulfillment: {
    type: 'stock' | 'dropship' // Type fulfillment (requis)
    partnerId?: string        // Partenaire (si dropship)
    
    // Si stock MTC
    stock_config?: {
      currentStock: number
      lowStockThreshold: number
      maxStockCapacity: number
      reorderPoint: number
      supplierInfo: string
      warehouseLocation: string
    }
    
    // Si dropshipping
    dropship_config?: {
      partnerSku: string        // SKU partenaire
      partnerPriceEur: number   // Prix partenaire
      commissionRate: number    // Taux commission
      estimatedDelivery: string // Délai livraison
      stockSyncEnabled: boolean // Sync stock temps réel
    }
  }
  
  // Section 4: Médias & Contenu
  media: {
    hero_image: string        // Image principale (requis)
    gallery: string[]         // Galerie (2-8 images)
    video_url?: string        // Vidéo produit
    documents?: string[]      // Fiches techniques/certifications
  }
  
  // Section 5: Spécifications Produit
  specifications: {
    dimensions?: {
      weight?: number         // Poids en grammes
      size?: string           // Dimensions (L×l×H)
      volume?: number         // Volume en ml/cl
    }
    
    characteristics: {
      origin_country?: string // Pays origine
      organic_certified?: boolean // Bio certifié
      certifications?: string[] // Labels/certifications
      ingredients?: string[]   // Ingrédients (si applicable)
      allergens?: string[]     // Allergènes
    }
    
    usage: {
      target_audience?: string // Public cible
      usage_instructions?: string // Instructions usage
      storage_conditions?: string // Conditions stockage
      expiry_info?: string     // Info péremption
    }
  }
  
  // Section 6: SEO & Marketing
  marketing: {
    featured: boolean         // Produit mis en avant
    bestseller: boolean       // Badge bestseller
    new_product: boolean      // Badge nouveau
    exclusive: boolean        // Exclusif Ambassadeurs
    
    seo: {
      meta_title?: string
      meta_description?: string
      keywords?: string[]
    }
    
    cross_sell: string[]      // Produits recommandés
    related_projects?: string[] // Projets liés
  }
  
  // Section 7: Configuration Avancée
  advanced: {
    min_order_quantity: number // Quantité minimum commande
    max_order_quantity?: number // Quantité maximum commande
    seasonal: boolean         // Produit saisonnier
    season_months?: number[]  // Mois disponibilité (1-12)
    
    restrictions: {
      geographic_restrictions?: string[] // Zones livraison restreinte
      age_restriction?: number // Restriction âge minimum
      special_handling?: string // Manutention spéciale
    }
  }
}
```

## 🔧 Fonctionnalités Critiques

### 1. Gestion Inventaire Hybride
```typescript
interface InventoryManager {
  stock_products: {
    current_tracking: {
      quantity_available: number
      quantity_reserved: number    // Commandes en attente
      quantity_allocated: number   // Expéditions en cours
    }
    
    thresholds: {
      low_stock_alert: number     // Seuil alerte stock bas
      auto_reorder_point: number  // Réassort automatique
      safety_stock: number        // Stock sécurité
    }
    
    movements: {
      track_all_movements: boolean // Traçabilité complète
      adjustment_reasons: string[] // Motifs ajustements
      audit_trail: boolean         // Historique modifications
    }
  }
  
  dropship_products: {
    partner_sync: {
      real_time_stock: boolean    // Sync stock temps réel
      sync_frequency: string      // Fréquence sync (15min/1h/4h)
      fallback_behavior: 'hide' | 'show_unavailable' | 'backorder'
    }
    
    availability_check: {
      pre_order_validation: boolean // Vérif disponibilité avant commande
      timeout_seconds: number       // Timeout API partenaire
      retry_attempts: number        // Tentatives en cas d'échec
    }
  }
  
  unified_display: {
    show_stock_levels: boolean    // Afficher niveaux stock mobile
    estimated_delivery: boolean   // Délais livraison par type
    mixed_cart_handling: string   // Gestion paniers mixtes
  }
}
```

### 2. Pricing & Commission Engine
```typescript
interface PricingEngine {
  points_calculation: {
    base_rule: "1 point = 1€ value"
    
    price_validation: {
      min_points: number          // Prix minimum (ex: 5 points)
      max_points: number          // Prix maximum (ex: 500 points)
      increment_step: number      // Incrément prix (ex: 1 point)
    }
    
    dynamic_adjustments: {
      seasonal_modifiers?: number[] // Ajustements saisonniers
      volume_discounts?: VolumeDiscount[] // Remises volume
      exclusive_pricing?: boolean   // Prix spéciaux Ambassadeurs
    }
  }
  
  commission_management: {
    partner_rates: Map<string, number> // Taux par partenaire
    
    calculation_rules: {
      commission_base: 'points_price' | 'partner_wholesale' // Base calcul
      payment_terms: string           // Conditions paiement
      minimum_commission: number      // Commission minimum
    }
    
    tracking: {
      commission_earned: number       // Commission générée
      payment_status: PaymentStatus   // Statut paiement partenaire
      reconciliation_period: string   // Période réconciliation
    }
  }
}
```

### 3. Workflows Partenaires
```typescript
interface PartnerWorkflows {
  onboarding: {
    product_import: {
      csv_template: string          // Template import produits
      field_mapping: FieldMapping[] // Correspondance champs
      validation_rules: ValidationRule[] // Règles validation
      bulk_operations: boolean      // Import en masse
    }
    
    api_integration: {
      webhook_endpoints: string[]   // URLs webhooks partenaire
      authentication_method: string // Méthode auth API
      rate_limiting: RateLimit      // Limites appels API
    }
  }
  
  ongoing_operations: {
    product_updates: {
      auto_sync: boolean           // Sync auto modifications
      approval_required: boolean   // Approbation changements
      conflict_resolution: string  // Gestion conflits
    }
    
    order_fulfillment: {
      order_forwarding: boolean    // Transfer commandes auto
      status_sync: boolean         // Sync statuts livraison  
      return_handling: string      // Gestion retours
    }
    
    reporting: {
      sales_reports: boolean       // Rapports ventes partenaire
      commission_statements: boolean // Relevés commissions
      performance_analytics: boolean // Analytics performance
    }
  }
}
```

## 📊 Analytics E-commerce

### Métriques Produits
```typescript
interface ProductMetrics {
  sales_performance: {
    total_revenue_points: number    // CA total en points
    orders_count: number           // Nombre commandes
    units_sold: number            // Unités vendues
    conversion_rate: number       // Taux conversion produit
    cart_abandonment_rate: number // Taux abandon panier
  }
  
  inventory_metrics: {
    stock_turnover: number        // Rotation stock
    stockout_frequency: number    // Fréquence ruptures
    carrying_cost: number         // Coût possession stock
    obsolescence_rate: number     // Taux obsolescence
  }
  
  customer_insights: {
    repeat_purchase_rate: number  // Taux rachat
    avg_order_value_points: number // Panier moyen points
    customer_segments: CustomerSegment[] // Segments acheteurs
    satisfaction_score: number    // Score satisfaction
  }
  
  partner_performance: {
    fulfillment_time: number      // Délai traitement partenaire
    quality_score: number         // Score qualité
    return_rate: number          // Taux retour
    commission_efficiency: number // Efficacité commission
  }
}
```

### Reporting Avancé
```typescript
interface AdvancedReporting {
  business_intelligence: {
    product_profitability: ProfitabilityReport[]
    category_performance: CategoryReport[]
    seasonal_trends: SeasonalAnalysis[]
    partner_comparison: PartnerComparison[]
  }
  
  operational_reports: {
    inventory_valuation: InventoryReport
    commission_reconciliation: CommissionReport
    fulfillment_performance: FulfillmentReport
    customer_lifetime_value: CLVReport
  }
  
  export_capabilities: {
    formats: ['csv', 'excel', 'pdf', 'json']
    scheduled_reports: boolean
    automated_distribution: boolean
    api_access: boolean
  }
}
```

## 🔗 Intégration Mobile & E-commerce

### APIs Générées
```typescript
interface ProductsAPI {
  // Public (mobile & web)
  getPublicCatalog: (filters?: CatalogFilters) => PublicProduct[]
  getProductDetails: (slug: string) => ProductDetails
  searchProducts: (query: string, filters?: SearchFilters) => SearchResults
  getRecommendations: (product_id?: string, user_id?: string) => PublicProduct[]
  
  // Panier & Commandes
  validateCart: (items: CartItem[]) => CartValidation
  calculateShipping: (items: CartItem[], address: Address) => ShippingOptions
  createOrder: (cart: Cart, payment_info: PaymentInfo) => Order
  
  // Admin uniquement
  createProduct: (data: ProductEditor) => Product
  updateProduct: (id: string, data: Partial<ProductEditor>) => Product
  bulkUpdatePricing: (updates: PricingUpdate[]) => BulkResult
  syncPartnerInventory: (partner_ids: string[]) => SyncResult
  
  // Analytics & Reporting
  getProductMetrics: (id: string, timeRange: DateRange) => ProductMetrics
  generateReport: (type: ReportType, params: ReportParams) => Report
}

interface PublicProduct {
  id: string
  slug: string
  name: string
  short_description: string
  hero_image: string
  gallery: string[]
  
  pricing: {
    points_price: number
    eur_equivalent: number
    volume_discounts?: VolumeDiscount[]
  }
  
  availability: {
    in_stock: boolean
    estimated_delivery: string
    max_quantity: number
  }
  
  details: {
    category: Category
    specifications: ProductSpecs
    partner?: PartnerInfo
  }
  
  marketing: {
    featured: boolean
    bestseller: boolean
    new_product: boolean
    badges: Badge[]
  }
}
```

## ✅ Critères de Validation MVP

### Tests d'Acceptation
```yaml
Fonctionnalités Core:
  ✓ Créer un produit stock complet en <5min
  ✓ Importer 50 produits partenaire via CSV <15min
  ✓ Ajuster prix par catégorie en masse <2min
  ✓ Sync inventaire partenaire temps réel <30s
  ✓ Générer rapport performance mensuel <1min
  
Performance:
  ✓ Afficher catalogue 500+ produits <3s
  ✓ Recherche produit avec filtres <1s
  ✓ Validation panier mixte <2s
  ✓ Export CSV 1000+ produits <30s
  
E-commerce:
  ✓ Commande produit → visible mobile immédiatement
  ✓ Stock bas → alerte admin automatique
  ✓ Commande mixte → tracking unifié généré
  ✓ Commission partenaire → calculée automatiquement
```

## 🎨 Design System

### Statuts & Badges
```css
.product-status {
  active: #22c55e (vert)
  draft: #94a3b8 (gris)
  out_of_stock: #f59e0b (ambre)
  discontinued: #ef4444 (rouge)
}

.fulfillment-types {
  stock: #3b82f6 (bleu) + 📦
  dropshipping: #8b5cf6 (violet) + 🚚
}

.product-badges {
  featured: #f59e0b (ambre) + ⭐
  bestseller: #22c55e (vert) + 🔥
  new: #3b82f6 (bleu) + ✨
  exclusive: #8b5cf6 (violet) + 👑
}

.inventory-levels {
  high: #22c55e (vert) + 📈
  medium: #f59e0b (ambre) + 📊
  low: #ef4444 (rouge) + ⚠️
  out: #6b7280 (gris) + ❌
}
```

---

**🎯 RÉSULTAT ATTENDU**: Interface admin complète pour gérer le catalogue e-commerce hybride avec pricing en points, gestion d'inventaire temps réel, intégrations partenaires automatisées, et analytics poussées.
