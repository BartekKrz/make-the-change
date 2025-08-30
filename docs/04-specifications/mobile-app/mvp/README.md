# 🚀 Mobile App MVP - Spécifications

**📍 VERSION: MVP** | **🗓️ TIMELINE: 5 Mois (20 Semaines)** | **⭐️ PRIORITÉ: Critique**

> **🎨 NEW**: Cette documentation a été enrichie avec l'analyse UX/UI moderne 2025. 
> 
> 👉 **[`../modern-ux-analysis-2025.md`](../modern-ux-analysis-2025.md)** - Vision stratégique complète
> 👉 **[`../optimal-onboarding-flow-2025.md`](../optimal-onboarding-flow-2025.md)** - Onboarding flow moderne
> 👉 **[`../core-flows-navigation-patterns-2025.md`](../core-flows-navigation-patterns-2025.md)** - Navigation patterns

## 🎯 Scope MVP (Phase 1)

Cette version couvre les fonctionnalités **absolument essentielles** pour le lancement de la plateforme Make the CHANGE, **optimisées avec les meilleures pratiques UX/UI 2025**. Toutes les spécifications de ce dossier sont **critiques** et doivent être implémentées avant le lancement beta.

### ✅ **Fonctionnalités Incluses**
- **Authentification complète** : Splash, inscription, connexion sécurisée
- **Dashboard utilisateur** : Vue d'ensemble des investissements et points
- **Découverte projets** : Navigation basique, détail projet
- **Flux d'investissement** : Sélection montant, paiement Stripe, confirmation
- **Catalogue et échange de récompenses (points)** : **NOUVEAU** - Essentiel pour la boucle métier.
- **Composants essentiels** : Loading states, error handling, navigation

### ❌ **Fonctionnalités Exclues (→ V1)**
- E-commerce **avancé** (avis, filtres complexes, wishlist)
- Social features (partage, reviews)
- Gamification avancée
- Notifications push
- Personnalisation

## 📁 Structure des Spécifications

### 🔐 Authentication (`/auth/`)
**Semaines 1-4 (Mois 1)**

> **📍 MODERN UX**: Les spécifications onboarding ont été modernisées
> 👉 **[`../optimal-onboarding-flow-2025.md`](../optimal-onboarding-flow-2025.md)** - Flow complet optimisé

- [`register.md`](./auth/register.md) ✅ **Détaillé** - Création de compte
- [`login.md`](./auth/login.md) ✅ **Détaillé** - Connexion sécurisée
- [`_archive/`](./auth/_archive/) - Anciens specs splash/onboarding (archivés)

### 🧭 Navigation Essentielle (`/navigation/`)
**Semaines 9-12 (Mois 3)**

> **📍 MODERN UX**: Navigation patterns modernisés
> 👉 **[`../core-flows-navigation-patterns-2025.md`](../core-flows-navigation-patterns-2025.md)** - Patterns avancés

- [`dashboard.md`](./navigation/dashboard.md) ✅ **Détaillé** - Vue d'ensemble personnalisée adaptative
- [`rewards.md`](./navigation/rewards.md) ✅ **Nouveau MVP** - Catalogue produits et échange points
- [`_modern-dashboard-reference.md`](./navigation/_modern-dashboard-reference.md) - Lien vers specs modernes

### 🌊 Flux Critiques (`/flows/`)
**Semaines 11-14 (Mois 3-4)**
- [`project-detail.md`](./flows/project-detail.md) ✅ **Complet** - Détail projet + CTA investissement
- [`payment-tunnel.md`](./flows/payment-tunnel.md) ✅ **Complet** - Processus paiement Stripe

### 🧩 Composants Essentiels (`/components/`)
**Semaines 1-20 - Transversal**

> **📍 MODERN UX**: Composants avec micro-interactions modernes
> 👉 **[`../modern-ux-analysis-2025.md`](../modern-ux-analysis-2025.md)** - Micro-interactions détaillées

- [`loading-states.md`](./components/loading-states.md) ✅ **Complet** - États de chargement standardisés
- [`error-handling.md`](./components/error-handling.md) ✅ **Complet** - Gestion d'erreurs uniforme
- [`navigation-bar.md`](./components/navigation-bar.md) ✅ **Détaillé** - Barre de navigation principale
- [`_modern-nav-reference.md`](./components/_modern-nav-reference.md) - Référence navigation moderne

## 🎯 Objectifs de Performance MVP

### 📱 **Métriques Techniques**
- **Cold start** : <2s
- **Time to interactive** : <3s  
- **Conversion investissement** : >25%
- **Crash rate** : <1%

### 👤 **Métriques Utilisateur - DUAL BILLING KPIs**
- **Onboarding completion** : >80%
- **First investment rate** : >25%
- **NOUVEAU: Billing frequency choice** : 70% monthly, 30% annual initial
- **NOUVEAU: Monthly→Annual conversion** : >15% après 3 mois
- **Session length** : >5min
- **User retention 7J** : >60%
- **NOUVEAU: Subscription management engagement** : >40% monthly access

## 🚀 Plan d'Implémentation (20 Semaines)

### **Semaines 1-4 : Authentification Foundation + DUAL BILLING**
1. Setup Expo + Navigation (TanStack Query, NativeWind)
2. Écrans auth complets (login, register, onboarding)
3. **NOUVEAU: Billing frequency choice integration** dans onboarding
4. Intégration Supabase Auth + user levels + Stripe setup
5. Tests utilisateur auth flow + dual billing choice validation

### **Semaines 9-12 : Mobile App Core + SUBSCRIPTION MANAGEMENT**
1. Navigation principale + dashboard adaptatif par niveau
2. **NOUVEAU: Subscription info display** + current plan + next billing
3. Découverte projets + géolocalisation
4. Système investissements + génération points 
5. **NOUVEAU: Dual Stripe integration** (Subscriptions + Payment Intents)
6. **NOUVEAU: Monthly→Annual upgrade prompts** + incentives

### **Semaines 13-14 : E-commerce Mobile + BILLING MANAGEMENT** 
1. Catalogue produits + filtres par points
2. Panier + checkout avec points
3. **NOUVEAU: Subscription management screen** (change plan, billing portal)
4. Historique commandes + tracking
5. **NOUVEAU: Billing history integration**
6. Système notifications expiration points

### **Semaines 17-20 : Tests & Optimisation**
1. Tests E2E complets + debugging
2. Performance audit + optimisations
3. Security review + audit sécurité
4. Store submission + préparation launch

## 🔗 Liens Rapides

### **Spécifications Prêtes**
- **[Mobile Conventions 2025](../mobile-conventions/)** - Conventions de code unifiées ⭐️⭐️⭐️
- **[UX Analysis 2025](../2025-analysis/modern-ux-analysis-2025.md)** - Vision stratégique complète ⭐️
- **[Onboarding Flow 2025](../2025-analysis/optimal-onboarding-flow-2025.md)** - Flow conversion-optimisé ⭐️
- **[Navigation Patterns 2025](../2025-analysis/core-flows-navigation-patterns-2025.md)** - Navigation moderne ⭐️
- [Register](./auth/register.md) - Création de compte détaillée
- [Login](./auth/login.md) - Connexion sécurisée  
- [Dashboard](./navigation/dashboard.md) - Vue d'ensemble adaptative
- [Navigation Bar](./components/navigation-bar.md) - Navigation de base
- [Implementation Patterns](./implementation-patterns.md) - Patterns techniques avec TanStack Form ⭐️

### **Spécifications à Compléter**
- [Project Detail](./flows/project-detail.md) - **PRIORITÉ HAUTE** Semaine 5
- [Payment Tunnel](./flows/payment-tunnel.md) - **PRIORITÉ HAUTE** Semaine 6
- [Loading States](./components/loading-states.md) - **PRIORITÉ MOYENNE** Semaine 3

### **Références Externes**
- [../mobile-conventions/](../mobile-conventions/) - **NOUVEAU** Conventions de code unifiées
- [../../../07-project-management/sprint-planning.md](../../../07-project-management/sprint-planning.md) - Planning détaillé 4 mois
- [../../../03-technical/architecture-overview.md](../../../03-technical/architecture-overview.md) - Stack technique
- [../../../01-strategy/business-model-definitive.md](../../../01-strategy/business-model-definitive.md) - Logique métier

---

**⚠️ IMPORTANT :** Aucune feature ne doit être ajoutée au MVP sans validation explicite. Toute nouvelle demande doit aller en V1 minimum.