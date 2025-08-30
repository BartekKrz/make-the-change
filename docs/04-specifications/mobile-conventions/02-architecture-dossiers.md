# 🏗️ Architecture des dossiers et organisation du code - Make the CHANGE Mobile

## 📋 Vue d'ensemble de l'architecture

Make the CHANGE Mobile suit une architecture modulaire basée sur les principes de **Feature-First Organization** et de **Domain-Driven Design** adaptés au métier de la biodiversité. L'organisation du code privilégie la maintenabilité, la réutilisabilité et la scalabilité pour supporter l'évolution des fonctionnalités d'investissement et e-commerce.

## 📁 Structure racine du projet

```
make-the-change-mobile/
├── assets/                    # Ressources statiques (images, fonts, audio)
├── docs/                      # Documentation technique
├── src/                       # Code source principal
├── node_modules/              # Dépendances NPM (dans monorepo)
├── app.config.ts             # Configuration Expo
├── babel.config.js           # Configuration Babel
├── eas.json                  # Configuration EAS Build
├── metro.config.js           # Configuration Metro bundler
├── tailwind.config.js        # Configuration NativeWind/Tailwind
├── package.json              # Métadonnées et dépendances
└── tsconfig.json             # Configuration TypeScript
```

## 🎨 Organisation des assets

### Structure du dossier `assets/`

```
assets/
├── audio/                     # Sons contextuels
│   ├── success-investment.mp3
│   ├── points-earned.mp3
│   └── notification-sound.mp3
├── fonts/                     # Polices personnalisées
│   ├── Inter*.ttf             # Famille Inter complète
│   └── [autres-fonts]/       # Fonts éco-responsables si nécessaire
├── icons/                     # Icônes SVG spécialisées
│   ├── biodiversity/         # Icônes projets biodiversité
│   │   ├── beehive.svg
│   │   ├── olive-tree.svg
│   │   └── ecosystem.svg
│   ├── investments/          # Icônes investissements
│   │   ├── portfolio.svg
│   │   ├── growth.svg
│   │   └── roi.svg
│   └── ui/                   # Icônes interface
│       ├── points.svg
│       ├── level-badge.svg
│       └── marketplace.svg
└── images/                    # Images et illustrations
    ├── onboarding/           # Images onboarding
    │   ├── welcome.png
    │   ├── explorer-level.png
    │   ├── protector-level.png
    │   └── ambassador-level.png
    ├── projects/             # Images par défaut projets
    │   ├── default-beehive.jpg
    │   ├── default-olive-grove.jpg
    │   └── biodiversity-hero.jpg
    ├── products/             # Images produits marketplace
    │   └── placeholder-product.jpg
    └── illustrations/        # Illustrations interface
        ├── empty-portfolio.svg
        ├── points-celebration.svg
        └── investment-success.svg
```

### Conventions de nommage des assets

- **Images** : kebab-case avec suffixes descriptifs métier
- **Audio** : kebab-case avec contexte (success, notification, alert)
- **Icônes** : nom fonctionnel + contexte métier
- **Fonts** : nom original + variantes

## 📱 Architecture du code source (`src/`)

### Structure principale

```
src/
├── api/                     # Couche d'accès aux données (tRPC)
├── app/                     # Routes et navigation (Expo Router)
├── components/              # Composants UI réutilisables
├── constants/               # Constantes globales
├── features/                # Fonctionnalités métier (Feature-First)
├── hooks/                   # Hooks personnalisés globaux
├── locales/                 # Fichiers de traduction i18n
├── providers/               # Providers React (Context, etc.)
├── types/                   # Types TypeScript globaux
└── utils/                   # Utilitaires génériques
```

## 🔌 Couche API (`src/api/`)

### Organisation par domaine métier

```
api/
├── client.ts                 # Client tRPC configuré
├── auth/                     # Authentification
│   ├── login.ts
│   ├── register.ts
│   └── profile.ts
├── investments/              # Gestion des investissements
│   ├── create-investment.ts
│   ├── get-user-investments.ts
│   ├── get-investment-details.ts
│   └── calculate-roi.ts
├── projects/                 # Projets biodiversité
│   ├── get-projects.ts
│   ├── get-project-details.ts
│   ├── get-nearby-projects.ts
│   └── get-project-updates.ts
├── points/                   # Système de points
│   ├── get-points-balance.ts
│   ├── get-points-history.ts
│   ├── get-expiring-points.ts
│   └── use-points.ts
├── marketplace/              # E-commerce
│   ├── get-products.ts
│   ├── get-product-details.ts
│   ├── create-order.ts
│   └── get-orders.ts
├── user/                     # Gestion utilisateur
│   ├── get-profile.ts
│   ├── update-profile.ts
│   ├── get-user-level.ts
│   └── kyc-validation.ts
├── partners/                 # Intégrations partenaires
│   ├── habeebee-integration.ts
│   ├── ilanga-integration.ts
│   └── partner-updates.ts
├── shared/                   # Types et interfaces communes
│   ├── api-types.ts
│   ├── investment-types.ts
│   ├── project-types.ts
│   └── error-types.ts
└── middleware/               # Middlewares tRPC
    ├── auth-middleware.ts
    └── error-handling.ts
```

### Conventions API

- **Nommage** : `action-resource.ts` (ex: `get-user-investments.ts`)
- **Structure** : Hook tRPC exporté + types
- **Types** : Interfaces partagées dans `shared/`
- **Client tRPC** : Configuration centralisée avec middleware auth

## 🗂️ Navigation et routes (`src/app/`)

### Architecture basée sur les fichiers (Expo Router v4)

```
app/
├── (authenticated)/         # Routes protégées utilisateurs connectés
│   ├── (tabs)/              # Navigation par onglets principale
│   │   ├── index.tsx        # Dashboard/Portfolio
│   │   ├── projects.tsx     # Découverte projets
│   │   ├── marketplace.tsx  # E-commerce marketplace
│   │   ├── portfolio.tsx    # Portfolio investissements
│   │   └── profile.tsx      # Profil utilisateur
│   ├── investment/          # Flux d'investissement
│   │   ├── [projectId]/     # Détail projet dynamique
│   │   │   ├── index.tsx    # Détail projet
│   │   │   └── invest.tsx   # Formulaire investissement
│   │   └── confirmation.tsx # Confirmation investissement
│   ├── marketplace/         # E-commerce détaillé
│   │   ├── [productId].tsx  # Détail produit
│   │   ├── cart.tsx         # Panier
│   │   └── checkout.tsx     # Processus achat
│   ├── points/              # Gestion points
│   │   ├── history.tsx      # Historique points
│   │   ├── expiring.tsx     # Points expirants
│   │   └── rewards.tsx      # Récompenses disponibles
│   └── profile/             # Gestion profil
│       ├── edit.tsx         # Édition profil
│       ├── kyc.tsx          # Processus KYC
│       └── settings.tsx     # Paramètres
├── (public)/                # Routes publiques
│   ├── auth/                # Authentification
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── onboarding/          # Onboarding nouveaux utilisateurs
│   │   ├── welcome.tsx
│   │   ├── levels.tsx       # Explication niveaux
│   │   ├── how-it-works.tsx
│   │   └── permissions.tsx  # Permissions app
│   └── legal/               # Pages légales
│       ├── terms.tsx
│       ├── privacy.tsx
│       └── kyc-policy.tsx
├── _layout.tsx              # Layout racine avec providers
└── index.tsx                # Route de redirection initiale
```

### Conventions routing

- **Groupes protégés** : `(authenticated)` vs `(public)`
- **Navigation tabs** : `(tabs)` pour interface principale
- **Routes dynamiques** : `[param].tsx` pour détails projets/produits
- **Layouts** : `_layout.tsx` pour mise en page hiérarchique

## 🎯 Architecture orientée fonctionnalités (`src/features/`)

### Organisation Feature-First métier biodiversité

```
features/
├── auth/                    # Authentification et onboarding
│   ├── components/
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── level-selector.tsx
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   └── use-onboarding.ts
│   └── utils/
│       └── validation.ts
├── investments/             # Système d'investissements
│   ├── components/
│   │   ├── investment-card.tsx
│   │   ├── portfolio-overview.tsx
│   │   ├── roi-chart.tsx
│   │   └── investment-form.tsx
│   ├── hooks/
│   │   ├── use-investments.ts
│   │   ├── use-investment-calculator.ts
│   │   └── use-portfolio-analytics.ts
│   └── utils/
│       ├── investment-calculations.ts
│       └── roi-formatters.ts
├── projects/                # Projets biodiversité
│   ├── components/
│   │   ├── project-card.tsx
│   │   ├── project-detail.tsx
│   │   ├── project-map.tsx
│   │   ├── project-updates.tsx
│   │   └── project-gallery.tsx
│   ├── hooks/
│   │   ├── use-projects.ts
│   │   ├── use-nearby-projects.ts
│   │   └── use-project-updates.ts
│   └── utils/
│       ├── distance-calculator.ts
│       └── project-filters.ts
├── points/                  # Système de points et niveaux
│   ├── components/
│   │   ├── points-balance.tsx
│   │   ├── points-history.tsx
│   │   ├── level-badge.tsx
│   │   ├── expiring-points-alert.tsx
│   │   └── points-calculator.tsx
│   ├── hooks/
│   │   ├── use-points.ts
│   │   ├── use-user-level.ts
│   │   └── use-points-expiry.ts
│   └── utils/
│       ├── points-calculations.ts
│       ├── level-progression.ts
│       └── expiry-notifications.ts
├── marketplace/             # E-commerce marketplace
│   ├── components/
│   │   ├── product-card.tsx
│   │   ├── product-detail.tsx
│   │   ├── shopping-cart.tsx
│   │   ├── checkout-form.tsx
│   │   ├── order-history.tsx
│   │   └── points-payment.tsx
│   ├── hooks/
│   │   ├── use-products.ts
│   │   ├── use-cart.ts
│   │   ├── use-orders.ts
│   │   └── use-points-payment.ts
│   └── utils/
│       ├── cart-calculations.ts
│       ├── shipping-calculator.ts
│       └── points-converter.ts
├── profile/                 # Gestion profil utilisateur
│   ├── components/
│   │   ├── profile-form.tsx
│   │   ├── kyc-form.tsx
│   │   ├── settings-panel.tsx
│   │   └── subscription-management.tsx
│   ├── hooks/
│   │   ├── use-profile.ts
│   │   ├── use-kyc-validation.ts
│   │   └── use-subscriptions.ts
│   └── utils/
│       ├── kyc-validators.ts
│       └── profile-formatters.ts
└── shared/                  # Composants partagés entre features
    ├── components/
    │   ├── loading-states.tsx
    │   ├── error-boundaries.tsx
    │   ├── empty-states.tsx
    │   └── success-animations.tsx
    ├── hooks/
    │   ├── use-notifications.ts
    │   ├── use-analytics.ts
    │   └── use-feedback.ts
    └── utils/
        ├── formatters.ts
        ├── validators.ts
        └── constants.ts
```

### Structure type d'une feature

```
feature-name/
├── components/              # Composants UI spécifiques
├── hooks/                   # Hooks métier
├── utils/                   # Utilitaires de la feature
├── types.ts                 # Types TypeScript locaux
└── index.ts                 # Point d'entrée avec exports
```

## 🎨 Système de design (`src/components/`)

### Organisation des composants

```
components/
├── ui/                      # Design system de base
│   ├── button/              # Système de boutons
│   │   ├── button.tsx
│   │   ├── icon-button.tsx
│   │   └── floating-button.tsx
│   ├── input/               # Composants de saisie
│   │   ├── text-input.tsx
│   │   ├── number-input.tsx
│   │   ├── search-input.tsx
│   │   └── select-input.tsx
│   ├── display/             # Composants d'affichage
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── progress-bar.tsx
│   │   └── stats-card.tsx
│   ├── feedback/            # Feedback utilisateur
│   │   ├── toast.tsx
│   │   ├── modal.tsx
│   │   ├── alert.tsx
│   │   └── loading-spinner.tsx
│   ├── navigation/          # Éléments de navigation
│   │   ├── tab-bar.tsx
│   │   ├── header.tsx
│   │   └── breadcrumbs.tsx
│   └── layout/              # Composants de mise en page
│       ├── screen.tsx
│       ├── container.tsx
│       ├── section.tsx
│       └── separator.tsx
├── theme/                   # Configuration thème
│   ├── colors.ts            # Palette couleurs Make the CHANGE
│   ├── typography.ts        # Système typographique
│   ├── spacing.ts           # Système d'espacement
│   └── tokens.ts            # Design tokens
└── lib/                     # Utilitaires composants
    ├── cn.ts                # ClassNames utility (Tailwind)
    └── theme-provider.tsx   # Provider de thème
```

### Composants spécialisés Make the CHANGE

```
components/
├── biodiversity/            # Composants spécialisés biodiversité
│   ├── beehive-status.tsx
│   ├── ecosystem-impact.tsx
│   ├── biodiversity-metrics.tsx
│   └── project-timeline.tsx
├── investment/              # Composants investissement
│   ├── roi-display.tsx
│   ├── investment-progress.tsx
│   ├── portfolio-summary.tsx
│   └── risk-indicator.tsx
├── points/                  # Composants système de points
│   ├── points-display.tsx
│   ├── level-indicator.tsx
│   ├── points-animation.tsx
│   └── rewards-carousel.tsx
└── marketplace/             # Composants e-commerce
    ├── product-grid.tsx
    ├── price-display.tsx
    ├── points-price.tsx
    └── authenticity-badge.tsx
```

## 🌍 Internationalisation (`src/locales/`)

### Structure i18n

```
locales/
├── en/                      # Anglais
│   ├── messages.po          # Fichier Gettext
│   └── messages.ts          # Messages compilés
├── fr/                      # Français (langue principale)
│   ├── messages.po
│   └── messages.ts
└── common/                  # Messages contextuels partagés
    ├── biodiversity.ts      # Terminologie biodiversité
    ├── investment.ts        # Terminologie investissement
    ├── points.ts            # Terminologie points/niveaux
    └── ecommerce.ts         # Terminologie e-commerce
```

## 🔧 Utilitaires (`src/utils/`)

### Organisation par domaine

```
utils/
├── biodiversity/            # Utilitaires biodiversité
│   ├── impact-calculator.ts
│   ├── ecosystem-formatter.ts
│   └── conservation-metrics.ts
├── investment/              # Utilitaires investissements
│   ├── roi-calculator.ts
│   ├── risk-assessment.ts
│   └── portfolio-analytics.ts
├── points/                  # Utilitaires points
│   ├── points-calculator.ts
│   ├── level-progression.ts
│   └── expiry-manager.ts
├── ecommerce/               # Utilitaires e-commerce
│   ├── price-formatter.ts
│   ├── shipping-calculator.ts
│   └── discount-calculator.ts
├── geo/                     # Utilitaires géolocalisation
│   ├── distance-calculator.ts
│   ├── region-detector.ts
│   └── coordinates-formatter.ts
├── validation/              # Validations
│   ├── kyc-validators.ts
│   ├── investment-validators.ts
│   └── form-validators.ts
├── formatting/              # Formatage données
│   ├── currency-formatter.ts
│   ├── date-formatter.ts
│   ├── number-formatter.ts
│   └── percentage-formatter.ts
└── storage/                 # Gestion stockage local
    ├── secure-storage.ts
    ├── cache-manager.ts
    └── offline-manager.ts
```

## 📏 Conventions de nommage

### Fichiers et dossiers

- **Composants** : PascalCase (`ProjectCard.tsx`, `InvestmentForm.tsx`)
- **Hooks** : camelCase avec préfixe `use` (`useInvestments.ts`, `usePoints.ts`)
- **Utilitaires** : kebab-case (`roi-calculator.ts`, `points-formatter.ts`)
- **Constantes** : SCREAMING_SNAKE_CASE dans `constants/`
- **Types** : PascalCase avec suffixe (`InvestmentType`, `ProjectResponse`)

### Conventions d'export

```typescript
// Export par défaut pour les composants principaux
export default ProjectCard;

// Export nommé pour les utilitaires et hooks
export const calculateROI = (investment: Investment) => {};
export const useInvestments = () => {};

// Export groupé pour les constantes
export const USER_LEVELS = {
  EXPLORER: 'explorer',
  PROTECTOR: 'protector', 
  AMBASSADOR: 'ambassador'
} as const;
```

## 🏛️ Principes architecturaux

### Séparation des responsabilités

1. **Présentation** : Composants React purs dans `components/ui/`
2. **Logique métier** : Hooks et fonctions dans `features/`
3. **Accès aux données** : Couche API tRPC séparée
4. **État global** : Providers React contextuels

### Dependency Injection

- **Services** : Injection via Context API
- **Configuration** : Variables d'environnement via Expo Config
- **Thème** : Provider de thème globaux
- **API Client** : Client tRPC configuré centralement

### Modularité

- **Features autonomes** : Chaque feature peut fonctionner indépendamment
- **API contracts** : Types stricts partagés via tRPC
- **Composants réutilisables** : Design system cohérent Make the CHANGE
- **Testabilité** : Architecture facilitant les tests unitaires

---

Cette architecture **modulaire** et **scalable** est spécialement conçue pour supporter l'évolution de Make the CHANGE, en permettant l'ajout facile de nouveaux types de projets, fonctionnalités d'investissement et intégrations partenaires.

---