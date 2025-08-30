# Sprint Planning Bootstrap - Make the CHANGE

## 🎯 Vue d'Ensemble Phase 1 Bootstrap

**Objectif :** Développer MVP viable avec 0€ capital initial, atteindre 60-100 abonnés payants, valider product-market fit.

**Durée :** 5 mois (20 semaines) - Équipe 2 fondateurs temps plein
**Budget total :** 4,500€ autofinancé par premiers revenus

## 💰 Budget Réaliste 5 Mois (4,500€)

| Catégorie | Montant | Détail |
|-----------|---------|--------|
| **Infrastructure** | 700€ | Domain, Apple/Google Dev, Stripe fees, monitoring |
| **Partenaires** | 1,800€ | Échantillons, setup, photos, packaging, commissions |
| **Marketing Bootstrap** | 1,200€ | **DÉTAIL:** On-pack €650 + Terrain €300 + Micro-influence €200 + B2B €50 |
| **Légal** | 400€ | CGU/CGV, comptabilité, assurance, banque |
| **Buffer** | 400€ | Urgences techniques et opportunités |

## 📅 Roadmap 5 Mois (20 Semaines)

### **Mois 1-2 : Infrastructure & Admin Foundation (Semaines 1-8)**

**Semaines 1-4 : TDD Foundation & Setup**
- **Semaine 1-2** : Setup infrastructure tests (Vitest, MSW, Playwright) + documentation TDD workflow
- **Semaine 3-4** : TDD business logic foundation (User, Project, Investment models) + validation schemas Zod
- **Parallèle** : Database setup, auth basique, admin interface foundation
- **🎯 Target Coverage** : Business logic 95%+, API routes 90%+, global 85%+

**Semaines 5-8 : Admin Dashboard (TDD Critique)**
- **Semaine 5-6** : TDD Projects CRUD (validation, status transitions, funding calculations) - Coverage 95%+
- **Semaine 7-8** : TDD Users management (KYC, points, permissions) + E2E critical paths - Coverage 90%+
- **Parallèle** : Négociation HABEEBEE + 2 producteurs backup, photos produits
- **🧪 Référence** : Voir [../06-development/tdd-strategy.md](../06-development/tdd-strategy.md) pour détails TDD

**NOUVEAU - Marketing Bootstrap (Parallèle Semaines 1-8) :**
- **Semaines 1-2** : Landing pages partenaires (makethechange.com/habeebee, /ilanga) + UTM tracking
- **Semaines 3-4** : Design flyers A6 colis insertion + négociation emails co-brandés partenaires  
- **Semaines 5-6** : Setup CRM segmentation (monthly/annual, origine acquisition)
- **Semaines 7-8** : Premier email HABEEBEE (objectif: 3 conversions) + lancement insertion colis

### **Mois 3 : Application Mobile MVP (Semaines 9-12) - DUAL BILLING**

**Semaines 9-10 : Mobile Core (TDD Business Logic)**
- **TDD Obligatoire** : Hooks points balance, investment calculations, user levels
- **Tests Après** : Navigation, discovery UI, auth screens
- **TDD Conditionnel** : Complex forms, interactive components

**Semaines 11-12 : Payments & Points (TDD Critique)**
- **TDD Obligatoire** : Stripe integration, points expiry, billing frequency logic
- **TDD Conditionnel** : Checkout flows, subscription management UI
- **Parallèle** : Catalogue web, admin payment management

**NOUVEAU: Dual Billing Development Tasks :**
- Stripe Products setup (monthly: 18€/32€, annual: 180€/320€)
- BillingFrequencyToggle component mobile + web
- Subscription management flows + Stripe Customer Portal
- Database schema: billing_frequency, subscription_billing_history tables

### **Mois 4 : E-commerce & Intégrations (Semaines 13-16)**

**Semaines 13-14 : E-commerce (TDD Critique)**
- **TDD Obligatoire** : Points checkout calculations, inventory management, order fulfillment
- **TDD Conditionnel** : Product filtering, cart management
- **Tests Après** : Product display UI, shopping cart interface

**Semaines 15-16 : Partner Integrations (TDD Obligatoire)**
- **TDD Obligatoire** : HABEEBEE API integration, webhook handlers, commission calculations
- **E2E Testing** : Complete user journeys with real API calls
- **Parallèle** : Beta testing avec 20-30 utilisateurs early adopters

**NOUVEAU - Marketing Scale (Parallèle Semaines 9-16) :**
- **Semaines 9-10** : Premiers marchés bio (Bruxelles, Lille) + setup micro-influence (3 créateurs locaux)
- **Semaines 11-12** : Newsletter ILANGA + approche première PME B2B (CSR focus)  
- **Semaines 13-14** : Deuxième email HABEEBEE + expansion on-pack ILANGA + clubs apiculture
- **Semaines 15-16** : Optimisation conversion mensuel→annuel cohorte + A/B test landing pages

### **Mois 5 : Tests, Optimisation & Launch (Semaines 17-20)**

**Semaines 17-18 : Quality Assurance (Coverage Focus)**
- **Coverage Verification** : Critical paths 95%+, overall 85%+ (voir [../06-development/tdd-strategy.md](../06-development/tdd-strategy.md))
- **E2E Complete Suite** : All critical user journeys automated (investment flow, subscription flow, points redemption)
- **Performance & Security** : Optimization, penetration testing
- **🧪 Tests E2E Critiques** : 
  - Parcours investissement complet (project-detail → payment → confirmation)
  - Tunnel abonnement Ambassadeur (monthly/annual choice)
  - Utilisation points (rewards → checkout → fulfillment)

**Semaines 19-20 : Production Launch**
- **Deployment Pipeline** : CI/CD with test gates, monitoring
- **Go-to-market** : Store submission, marketing launch
- **Post-Launch Monitoring** : Error tracking, performance metrics

**NOUVEAU - Marketing Consolidation (Semaines 17-20) :**
- **Semaines 17-18** : Analyse ROI par canal + optimisation parcours conversion + deuxième PME B2B
- **Semaines 19-20** : Préparation Phase 2 scale (paid ads budget) + documentation best practices acquisition

### **Mois 6-8 : Amélioration & Engagement (V1)**
- **Classement d'Impact** : Développement de l'API, de la vue matérialisée et de l'écran mobile pour le classement.
- **Gamification** : Introduction des premiers badges et du système de progression.
- **Social Features** : Implémentation du partage d'impact.


## 🎯 Métriques de Succès

### **Objectifs 5 Mois - DUAL BILLING TARGETS**
- **60-100 abonnés** payants avec dual billing (mensuel/annuel)
- **€4,000-8,000** revenus total (MRR equivalent: €800-1,600)
- **3-5 partenaires** producteurs actifs
- **20% taux conversion** visiteur → acheteur
- **4.5+ étoiles** satisfaction client
- **NOUVEAU: 25% annual uptake rate** (target conversion monthly → annual)

### **KPIs Hebdomadaires - DUAL BILLING + ACQUISITION**
- **Nouveaux utilisateurs** : 15-25/semaine
- **Commandes** : 5-10/semaine 
- **Revenue** : €200-400/semaine
- **Support tickets** : <3/semaine
- **NOUVEAU: Billing frequency distribution** : Track monthly vs annual sign-ups
- **NOUVEAU: Monthly→Annual conversion** : Weekly upgrade tracking

**ACQUISITION KPIs:**
- **Acquisitions par canal** : Co-marketing 0.5/semaine, On-pack 0.4/semaine, Terrain 1/semaine, B2B 0.7/semaine
- **CAC par canal** : Co-marketing €0, On-pack €108, Terrain €19, B2B €5, Micro-influence €29
- **Attribution tracking** : UTM performance, codes promo usage
- **Conversion rates** : Landing pages par partenaire, monthly vs annual split par canal

## ⚠️ Risques & Mitigations

| Risque | Impact | Probabilité | Mitigation |
|--------|---------|-------------|------------|
| Partenaire principal indisponible | Élevé | Moyen | 2 producteurs backup négociés |
| Adoption lente utilisateurs | Élevé | Élevé | Beta testing intensif, pivots rapides |
| Problèmes techniques majeurs | Moyen | Faible | Stack simple, monitoring proactif |
| Budget dépassé | Moyen | Moyen | Buffer 400€, suivi mensuel strict |

## 🚀 Prochaines Étapes Immédiates

1. **Setup infrastructure** (Semaines 1-4)
2. **Admin dashboard** (Semaines 5-8)  
3. **Mobile app MVP** (Semaines 9-12)
4. **E-commerce & intégrations** (Semaines 13-16)
5. **Tests & launch** (Semaines 17-20)

## 📋 Roadmap Opérationnelle 4 Mois Post-Lancement

*Cette section détaille les actions prioritaires pour les 4 premiers mois critiques après le lancement MVP, basée sur l'analyse de faisabilité externe.*

### **Mois 1 : Lancement Contrôlé & Optimisation Conversion**

**Objectif :** Ouverture beta contrôlée, premiers retours clients, optimisation conversion initiale

#### Semaine 1 (J+7)
- **🚀 Beta Launch** : Ouverture à 100 Explorateurs inscrits (invitations privées)
- **📊 Dashboard Points** : Mise en place monitoring temps réel passif points
- **🎁 Offre Bienvenue** : Déploiement bonus 10 points nouveaux inscrits
- **👥 Programme Parrainage** : Configuration système codes référent

*Ressources : Dev 1j (dashboard), Marketing 1j (config parrainage)*

#### Semaine 2-3
- **📈 A/B Test Conversion** : Test variations bonus/urgence (15% vs 30% bonus)
- **🤝 Sync Partenaires** : Vérification intégrations API HABEEBEE conditions réelles
- **📱 Triggers Conversion** : Notifications push personnalisées Explorateurs inactifs

#### Semaine 4
- **📊 Analyse Performance** : Premier review conversion Explorateur→Protecteur
- **🛒 Optimisation Produits** : Merchandising boost sur produits forte marge
- **💬 Feedback Initial** : Collecte retours premiers beta-testeurs

### **Mois 2 : Scale Marketing & Anti-Churn**

**Objectif :** Accélérer acquisition tout en surveillant satisfaction et rétention

#### Semaine 5 (J+30)
- **🌐 Lancement Public** : Ouverture complète + campagne réseaux sociaux
- **📤 Email Marketing** : Premier mailing impact communauté HABEEBEE
- **📋 Feedback Churn** : Mise en place surveys sortants utilisateurs inactifs

#### Semaine 6-7
- **🎯 Optimisation Conversion** : Si <20%, déployer notifications urgence personnalisées
- **📈 Tracking Attribution** : Analyse performance par canal acquisition
- **🔄 Programme Fidélité** : Test mécaniques retention (bonus renouvellement)

#### Semaine 8
- **📊 Revue Churn** : Comité stratégique si churn Ambassadeurs >8% mensuel
- **🛠 Plan Amélioration** : Préparation nouvelles fonctionnalités valeur ajoutée

### **Mois 3 : Extension Offre & Communication Impact**

**Objectif :** Améliorer valeur perçue, élargir catalogue, communiquer résultats

#### Semaine 9 (J+60)
- **📢 Communication Impact** : Publication infographie "X arbres plantés, Y ruches soutenues"
- **📊 Audit Redemption** : Analyse taux utilisation vs prévisions (cible 80%)

#### Semaine 10-11
- **🆕 Nouveau Partenaire** : Intégration catégorie/producteur supplémentaire
- **🤝 Négociation Volumes** : Accords minimums avec partenaires existants
- **🎯 Personnalisation** : Recommandations produits par profil utilisateur

#### Semaine 12
- **🔍 Analyse Redemption** : Revue scénarios provision vs réel
- **💰 Optimisation Marge** : Ajustement bonus futurs si nécessaire

### **Mois 4 : Consolidation & Expansion B2B**

**Objectif :** Consolider base clients, réduire risques, amorcer B2B

#### Semaine 13 (J+90)
- **🎤 Interviews Clients** : 2-3 sessions vidéo avec utilisateurs représentatifs
- **📋 Roadmap V2** : Intégration insights clients dans planification

#### Semaine 14-15
- **🛡 Plan Anti-Churn** : Mécaniques rétention automatisées (bonus fidélité)
- **🏢 Approche B2B** : Kit présentation CSR, contact 5 PME pilotes

#### Semaine 16
- **📈 Revue OKR** : Évaluation complète métriques Phase 1
- **🚀 Préparation Phase 2** : Plan Growth avec ajustements basés apprentissages

### **🎯 Objectifs Quantifiés par Mois**

| Mois | Nouveaux Protecteurs | Nouveaux Ambassadeurs | MRR Cible | Points Redemption |
|------|---------------------|----------------------|-----------|------------------|
| **M1** | 50-80 | 10-15 | 1 200€ | 60% |
| **M2** | 80-120 | 15-25 | 2 000€ | 70% |
| **M3** | 100-150 | 20-35 | 3 000€ | 75% |
| **M4** | 120-180 | 25-45 | 4 000€ | 80% |

### **🚨 Déclencheurs d'Actions Correctives**

**Si Conversion <20% :**
- Audit UX parcours complet
- Test bonus plus attractifs (40-50%)
- Campagne remarketing ciblée

**Si Churn >15% mensuel :**
- Interviews urgentes clients perdus
- Amélioration valeur programme
- Mécaniques fidélisation renforcées

**Si Redemption >90% :**
- Ajustement immédiat bonus
- Négociation délais partenaires
- Plan contingence liquidité

---

*Roadmap validée par analyse externe indépendante - Focus exécution rigoureuse 4 premiers mois critiques. Évolution vers Phase 2 Growth basée sur métriques de succès.*
