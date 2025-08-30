# ⚖️ Document Maître - Spécifications Légales
**📍 PRIORITÉ: ⭐️⭐️ CRITIQUE** | **🎯 CONFORMITÉ RGPD & LEGAL** | **SOURCE DE VÉRITÉ**

## 🎯 Objectif
Ce document est la **source de vérité unique** pour toutes les règles, structures de données et obligations légales de la plateforme Make the CHANGE. Il sert de référence centrale pour les équipes de développement.

L'implémentation visuelle et l'expérience utilisateur (UX/UI) de ces règles sont détaillées dans des documents spécifiques à chaque plateforme :
- **📱 Spécifications App Mobile :** [`./mobile-app/mvp/legal-screens.md`](./mobile-app/mvp/legal-screens.md)
- **🌐 Spécifications Site E-commerce :** [`./ecommerce-site/mvp/public/legal.md`](./ecommerce-site/mvp/public/legal.md)

---

## 📋 Vue d'Ensemble - Obligations Légales

### Contexte Réglementaire
```yaml
Obligations_RGPD:
  - Consentement éclairé utilisateur
  - Transparence sur traitement données
  - Droit accès, rectification, suppression
  - Portabilité des données
  - Information sur durées conservation

Obligations_CGU_CGV:
  - Conditions générales utilisation
  - Conditions générales vente
  - Politique de confidentialité
  - Mentions légales complètes
  - Politique cookies

Obligations_Points_System:
  - Transparence sur valeur points (1€=1point)
  - Alertes expiration (60/30/7 jours)
  - Conditions d'utilisation points
  - Politique d'annulation/remboursement
```

---

## 🖼️ Structure du Contenu Légal Requis

### 1. Politique de Confidentialité (RGPD)
```typescript
interface PrivacyPolicyContent {
  // Structure légale obligatoire
  legalSections: {
    identityController: {
      title: "Responsable du traitement"
      content: {
        companyName: "Make the CHANGE SAS"
        legalAddress: string
        contactEmail: "privacy@makethechange.fr"
        dpoContact?: string
      }
    }
    
    dataCollected: {
      title: "Données personnelles collectées"
      categories: DataCategory[]
      collectionMethods: CollectionMethod[]
      legalBasis: LegalBasis[]
    }
    
    processingPurposes: {
      title: "Finalités du traitement"
      purposes: ProcessingPurpose[]
      retentionPeriods: RetentionPeriod[]
    }
    
    userRights: {
      title: "Vos droits sur vos données"
      rights: UserRight[]
      exerciseProcedure: string
      contactInformation: ContactInfo
    }
    
    dataSharing: {
      title: "Partage des données"
      recipients: DataRecipient[]
      internationalTransfers?: InternationalTransfer[]
      safeguards: string[]
    }
    
    securityMeasures: {
      title: "Sécurité des données"
      technicalMeasures: string[]
      organizationalMeasures: string[]
    }
    
    cookiesPolicy: {
      title: "Politique des cookies"
      cookieCategories: CookieCategory[]
      consentManagement: ConsentManagement
    }
  }
}

interface DataCategory {
  name: string
  description: string
  examples: string[]
  mandatory: boolean
  retentionPeriod: string
}

interface ProcessingPurpose {
  purpose: string
  legalBasis: 'consent' | 'contract' | 'legal_obligation' | 'legitimate_interest'
  dataTypes: string[]
  retention: string
  automatedDecision?: boolean
}

interface UserRight {
  right: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection'
  description: string
  howToExercise: string
  responseTimeframe: string
  limitations?: string[]
}
```

### 2. Conditions Générales d'Utilisation (CGU)
```typescript
interface TermsOfServiceContent {
  // Structure légale obligatoire
  legalSections: {
    serviceDescription: {
      title: "Description du service"
      platformPurpose: string
      threeLevelsModel: ThreeLevelsDescription
      pointsSystem: PointsSystemDescription
    }
    
    userObligations: {
      title: "Obligations de l'utilisateur"
      registrationRequirements: string[]
      prohibitedActivities: string[]
      accountSecurity: string[]
    }
    
    platformObligations: {
      title: "Obligations de Make the CHANGE"
      serviceAvailability: string
      supportCommitments: string[]
      liabilityLimitations: string[]
    }
    
    financialTerms: {
      title: "Conditions financières"
      pricingPolicy: PricingPolicy
      paymentTerms: PaymentTerms
      refundPolicy: RefundPolicy
    }
    
    pointsSystemRules: {
      title: "Système de points"
      earningRules: PointsEarningRules
      expiryPolicy: PointsExpiryPolicy
      usageRestrictions: PointsUsageRules
    }
    
    intellectualProperty: {
      title: "Propriété intellectuelle"
      platformIp: string
      userContent: string
      usageRights: string
    }
    
    termination: {
      title: "Résiliation"
      userTermination: string
      platformTermination: string
      consequences: TerminationConsequences
    }
    
    dispute_resolution: {
      title: "Résolution des litiges"
      applicable_law: "Droit français"
      jurisdiction: "Tribunaux français"
      mediation?: MediationProcedure
    }
  }
}

interface ThreeLevelsDescription {
  explorateur: {
    description: string
    benefits: string[]
    limitations: string[]
  }
  protecteur: {
    description: string
    investment_amounts: number[]
    benefits: string[]
    obligations: string[]
  }
  ambassadeur: {
    description: string
    subscription_amounts: number[]
    benefits: string[]
    commitments: string[]
  }
}

interface PointsSystemDescription {
  value_principle: "1 point = 1€ de valeur produit"
  generation_rules: PointsGenerationRule[]
  expiry_rules: PointsExpiryRule[]
  usage_rules: PointsUsageRule[]
  transfer_rules: PointsTransferRule[]
}
```

### 3. Conditions Générales de Vente (CGV)
```typescript
interface SalesTermsContent {
  // Structure légale e-commerce
  legal_sections: {
    seller_identity: {
      title: "Identification du vendeur"
      company_details: CompanyDetails
      vat_number: string
      commercial_register: string
    }
    
    products_services: {
      title: "Produits et services"
      product_categories: ProductCategory[]
      availability_policy: AvailabilityPolicy
      quality_guarantees: QualityGuarantee[]
    }
    
    ordering_process: {
      title: "Processus de commande"
      order_validation: OrderValidation
      payment_methods: PaymentMethod[]
      order_confirmation: OrderConfirmation
    }
    
    pricing_payment: {
      title: "Prix et paiement"
      points_pricing: PointsPricingRules
      payment_security: PaymentSecurity
      billing_policy: BillingPolicy
    }
    
    delivery_policy: {
      title: "Livraison"
      delivery_zones: DeliveryZone[]
      delivery_timeframes: DeliveryTimeframe[]
      shipping_costs: ShippingCost[]
      force_majeure: ForceMajeureClause
    }
    
    return_policy: {
      title: "Droit de rétractation et retours"
      withdrawal_period: "14 jours calendaires"
      return_conditions: ReturnCondition[]
      refund_process: RefundProcess
      exceptions: ReturnException[]
    }
    
    warranties: {
      title: "Garanties"
      legal_warranty: LegalWarranty
      commercial_warranty?: CommercialWarranty
      warranty_exclusions: WarrantyExclusion[]
    }
    
    liability: {
      title: "Responsabilité"
      platform_liability: PlatformLiability
      user_liability: UserLiability
      limitation_clauses: LimitationClause[]
    }
  }
}

interface PointsPricingRules {
  base_principle: "Tarification en points uniquement"
  euro_equivalence: "Affichage équivalent € informatif"
  points_only_payment: boolean
  insufficient_points_handling: InsufficientPointsPolicy
  partial_payment_rules?: PartialPaymentRules
}
```

### 4. Gestion des Cookies & Consentements
```typescript
interface CookieConsentContent {
  // Contenu pour la bannière et le centre de préférences
  cookie_banner: {
    title: "Nous utilisons des cookies"
    description: string
    essential_cookies_info: string
  }
  
  cookie_preferences: {
    categories: CookieCategory[]
    
    essential: {
      name: "Cookies essentiels"
      description: string
      always_active: true
      cookies_list: EssentialCookie[]
    }
    
    analytics: {
      name: "Cookies d'analyse"
      description: string
      toggleable: true
      cookies_list: AnalyticsCookie[]
      opt_in_required: true
    }
    
    marketing: {
      name: "Cookies marketing"
      description: string
      toggleable: true
      cookies_list: MarketingCookie[]
      opt_in_required: true
    }
    
    preferences: {
      name: "Cookies de préférences"
      description: string
      toggleable: true
      cookies_list: PreferencesCookie[]
    }
  }
  
  consent_management_rules: {
    consent_storage_duration: "13 mois"
    consent_renewal_prompt: boolean
  }
}
```

### 5. Alertes Expiration Points (Règles Métier)
```typescript
interface PointsExpiryAlertsSystem {
  // Obligations d'information
  legal_requirements: {
    advance_notice_periods: [60, 30, 7] // jours avant expiration
    information_channels: ['push', 'email', 'in_app']
    clear_expiry_display: boolean
    usage_suggestions_required: boolean
  }
  
  // Contenu et logique des alertes
  sixty_days_alert: {
    title: "Vos points expirent bientôt"
    message_template: "Vous avez {points_amount} points qui expirent le {expiry_date}. Découvrez notre catalogue pour les utiliser."
  }
  
  thirty_days_alert: {
    title: "Attention: expiration dans 30 jours"
    message_template: "{points_amount} points expirent bientôt. Utilisez-les avant le {expiry_date} !"
    urgency_level: 'medium'
  }
  
  seven_days_alert: {
    title: "URGENT: Points expirent dans 7 jours"
    message_template: "Attention ! {points_amount} points expirent le {expiry_date}. Agissez maintenant."
    urgency_level: 'high'
  }
}
```

### 6. Export de Données RGPD (Règles Métier)
```typescript
interface DataExportRules {
  // Types de données exportables
  exportable_data: {
    account_data: {
      profile_information: boolean
      authentication_logs: boolean
      preferences_settings: boolean
    }
    transaction_data: {
      investment_history: boolean
      points_transactions: boolean
      purchase_history: boolean
      payment_methods: boolean
    }
    behavioral_data: {
      app_usage_analytics: boolean
      project_interactions: boolean
      communication_preferences: boolean
    }
    communication_data: {
      support_tickets: boolean
      email_history: boolean
      notification_history: boolean
    }
  }
  
  // Limitations et exclusions
  export_limitations: {
    excluded_data: ExcludedData[]
    retention_period_expired: boolean
    third_party_data_restrictions: ThirdPartyRestriction[]
    technical_limitations: TechnicalLimitation[]
  }
}
```

### 7. Suppression de Données RGPD (Règles Métier)
```typescript
interface DataDeletionRules {
  // Données supprimables
  deletable_data: {
    personal_data: {
      profile_information: boolean
      contact_details: boolean
      preferences: boolean
    }
    behavioral_data: {
      usage_analytics: boolean
      interaction_history: boolean
      communication_logs: boolean
    }
    transactional_data: {
      pointsBalance: DeletionImpact
      active_investments: DeletionImpact
      order_history: PartialDeletion
    }
  }

  // Limitations légales à la suppression
  deletion_limitations: {
    legal_retention_requirements: LegalRetention[]
    active_contracts: ActiveContract[]
    outstanding_obligations: OutstandingObligation[]
    business_records: BusinessRecord[]
  }
}
```

---

## 🔧 Fonctionnalités Techniques Centrales

### 1. Système de Versioning Légal
```typescript
interface LegalDocumentVersioning {
  version_management: {
    current_version: DocumentVersion
    version_history: DocumentVersion[]
    change_notifications: ChangeNotification[]
  }
  
  user_notification_system: {
    material_changes_alert: boolean
    acceptance_required: boolean
    grace_period: number
    continued_use_consent: boolean
  }
  
  compliance_tracking: {
    user_acceptance_log: AcceptanceLog[]
    version_migration_tracking: MigrationTracking[]
    audit_trail: AuditTrail[]
  }
}
```

### 2. Système d'Alertes Légales
```typescript
interface LegalAlertsSystem {
  alert_types: {
    points_expiry: PointsExpiryAlert
    terms_changes: TermsChangeAlert
    privacy_policy_updates: PrivacyUpdateAlert
    regulatory_compliance: ComplianceAlert
  }
  
  delivery_channels: ['push', 'email', 'in_app', 'sms']
  
  user_preferences_respect: boolean
}
```

### 3. Audit Trail et Compliance
```typescript
interface ComplianceAuditSystem {
  audit_logging: {
    user_consent_tracking: ConsentAuditLog[]
    data_processing_logs: ProcessingAuditLog[]
    legal_document_access: AccessAuditLog[]
  }
  
  compliance_reporting: {
    gdpr_compliance_report: GDPRComplianceReport
    user_rights_exercise_report: UserRightsReport
    data_breach_procedures: DataBreachProcedure[]
  }
  
  legal_archival: {
    document_retention: DocumentRetention
    user_data_lifecycle: DataLifecycle
    compliance_evidence: ComplianceEvidence[]
  }
}
```

---

## ✅ Critères de Validation Légale

### Tests de Conformité
```yaml
RGPD Compliance:
  ✓ Politique confidentialité complète et accessible
  ✓ Consentement éclairé pour tous traitements
  ✓ Export données utilisateur fonctionnel <7 jours
  ✓ Suppression données sur demande <30 jours
  ✓ Notifications changements légaux automatiques

Points System Compliance:
  ✓ Alertes expiration 60/30/7 jours fonctionnelles
  ✓ Transparence valeur points (1€=1point) partout
  ✓ Conditions usage points claires et accessibles
  ✓ Historique transactions complet disponible
  ✓ Politique remboursement/annulation définie

E-commerce Compliance:
  ✓ CGV complètes avec mentions obligatoires
  ✓ Droit de rétractation 14 jours implémenté
  ✓ Informations livraison claires et exactes
  ✓ Prix TTC affichés avec équivalence €
  ✓ Garanties légales et commerciales définies

Technical Compliance:
  ✓ Cookies banner conforme CNIL
  ✓ Gestion consentements granulaire
  ✓ Versioning documents légaux automatique
  ✓ Audit trail complet activités utilisateur
  ✓ Sécurité données personnelles renforcée
```

---

## 🔗 Intégration Système

### APIs de Conformité
```typescript
interface LegalComplianceAPIs {
  // Gestion consentements
  recordConsent: (user_id: string, consent_data: ConsentData) => Promise<void>
  checkConsentStatus: (user_id: string, consent_type: string) => Promise<ConsentStatus>
  withdrawConsent: (user_id: string, consent_type: string) => Promise<void>
  
  // Export/suppression données
  initiateDataExport: (user_id: string, export_config: ExportConfig) => Promise<ExportRequest>
  initiateDataDeletion: (user_id: string, deletion_config: DeletionConfig) => Promise<DeletionRequest>
  getExportStatus: (export_id: string) => Promise<ExportStatus>
  
  // Alertes légales
  schedulePointsExpiryAlert: (user_id: string, expiry_date: Date) => Promise<void>
  sendLegalNotification: (user_id: string, notification: LegalNotification) => Promise<void>
  updateLegalDocumentVersion: (document_type: string, new_version: DocumentVersion) => Promise<void>
  
  // Audit et compliance
  logUserActivity: (user_id: string, activity: UserActivity) => Promise<void>
  generateComplianceReport: (report_type: string, timeframe: DateRange) => Promise<ComplianceReport>
  validateGDPRCompliance: (user_id?: string) => Promise<ComplianceValidation>
}
```
