# 🚀 Mobile App MVP - Spécifications

**📍 VERSION: MVP** | **🗓️ TIMELINE: Mois 1-4** | **⭐️ PRIORITÉ: Critique**

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
**Mois 1 - Semaines 1-4**

> **📍 MODERN UX**: Les spécifications onboarding ont été modernisées
> 👉 **[`../optimal-onboarding-flow-2025.md`](../optimal-onboarding-flow-2025.md)** - Flow complet optimisé

- [`register.md`](./auth/register.md) ✅ **Détaillé** - Création de compte
- [`login.md`](./auth/login.md) ✅ **Détaillé** - Connexion sécurisée
- [`_archive/`](./auth/_archive/) - Anciens specs splash/onboarding (archivés)

### 🧭 Navigation Essentielle (`/navigation/`)
**Mois 3 - Semaines 9-12**

> **📍 MODERN UX**: Navigation patterns modernisés
> 👉 **[`../core-flows-navigation-patterns-2025.md`](../core-flows-navigation-patterns-2025.md)** - Patterns avancés

- [`dashboard.md`](./navigation/dashboard.md) ✅ **Détaillé** - Vue d'ensemble personnalisée adaptative
- [`rewards.md`](./navigation/rewards.md) ✅ **Nouveau MVP** - Catalogue produits et échange points
- [`_modern-dashboard-reference.md`](./navigation/_modern-dashboard-reference.md) - Lien vers specs modernes

### 🌊 Flux Critiques (`/flows/`)
**Mois 2 - Semaines 5-8**
- [`project-detail.md`](./flows/project-detail.md) 🚧 **À développer** - Détail projet + CTA investissement
- [`payment-tunnel.md`](./flows/payment-tunnel.md) 🚧 **À développer** - Processus paiement Stripe

### 🧩 Composants Essentiels (`/components/`)
**Mois 1-4 - Transversal**

> **📍 MODERN UX**: Composants avec micro-interactions modernes
> 👉 **[`../modern-ux-analysis-2025.md`](../modern-ux-analysis-2025.md)** - Micro-interactions détaillées

- [`loading-states.md`](./components/loading-states.md) 🚧 **À développer** - États de chargement standardisés
- [`error-handling.md`](./components/error-handling.md) 🚧 **À développer** - Gestion d'erreurs uniforme
- [`navigation-bar.md`](./components/navigation-bar.md) ✅ **Détaillé** - Barre de navigation principale
- [`_modern-nav-reference.md`](./components/_modern-nav-reference.md) - Référence navigation moderne

## 🎯 Objectifs de Performance MVP

### 📱 **Métriques Techniques**
- **Cold start** : <2s
- **Time to interactive** : <3s  
- **Conversion investissement** : >25%
- **Crash rate** : <1%

### 👤 **Métriques Utilisateur**
- **Onboarding completion** : >80%
- **First investment rate** : >25%
- **Session length** : >5min
- **User retention 7J** : >60%

## 🚀 Plan d'Implémentation

### **Semaine 1-4 : Authentification Foundation**
1. Setup Expo + Navigation
2. Écrans auth complets
3. Intégration Supabase Auth
4. Tests utilisateur auth flow

### **Semaine 5-8 : Investment Core**
1. Admin crée projets (parallèle)
2. Mobile découverte projets
3. Flux investissement + Stripe
4. Génération points automatique

### **Semaine 9-12 : Dashboard & Polish**
1. Dashboard utilisateur riche
2. Historique investissements
3. Composants réutilisables
4. Performance optimization

### **Semaine 13-16 : Préparation Launch**
1. Tests E2E complets
2. Performance audit
3. Security review
4. Store submission prep

## 🔗 Liens Rapides

### **Spécifications Prêtes**
- **[UX Analysis 2025](../modern-ux-analysis-2025.md)** - Vision stratégique complète ⭐️
- **[Onboarding Flow 2025](../optimal-onboarding-flow-2025.md)** - Flow conversion-optimisé ⭐️
- **[Navigation Patterns 2025](../core-flows-navigation-patterns-2025.md)** - Navigation moderne ⭐️
- [Register](./auth/register.md) - Création de compte détaillée
- [Login](./auth/login.md) - Connexion sécurisée
- [Dashboard](./navigation/dashboard.md) - Vue d'ensemble adaptative
- [Navigation Bar](./components/navigation-bar.md) - Navigation de base

### **Spécifications à Compléter**
- [Project Detail](./flows/project-detail.md) - **PRIORITÉ HAUTE** Semaine 5
- [Payment Tunnel](./flows/payment-tunnel.md) - **PRIORITÉ HAUTE** Semaine 6
- [Loading States](./components/loading-states.md) - **PRIORITÉ MOYENNE** Semaine 3

### **Références Externes**
- [../../../07-project-management/sprint-planning.md](../../../07-project-management/sprint-planning.md) - Planning détaillé 4 mois
- [../../../03-technical/architecture-overview.md](../../../03-technical/architecture-overview.md) - Stack technique
- [../../../01-strategy/business-model-adaptive.md](../../../01-strategy/business-model-adaptive.md) - Logique métier

---

**⚠️ IMPORTANT :** Aucune feature ne doit être ajoutée au MVP sans validation explicite. Toute nouvelle demande doit aller en V1 minimum.