# 🛠️ Stack Technique - Make the CHANGE Mobile

## 📋 Vue d'ensemble technique

Make the CHANGE Mobile est développée avec une stack technique moderne privilégiant la performance, l'évolutivité et l'expérience utilisateur. L'application utilise Expo SDK 53 avec NativeWind pour un développement cross-platform efficace, adaptée à une plateforme de biodiversité avec investissements et e-commerce.

## 🏗️ Architecture technique principale

### Framework principal

- **React Native** (0.75+) - Framework de développement mobile cross-platform
- **Expo** (SDK 53) - Plateforme de développement et toolchain
- **Expo Router** (v4) - Système de navigation basé sur les fichiers

### Langage et types

- **TypeScript** (5.7+) - Langage principal avec typage statique strict
- **JavaScript ES2022** - Target de compilation moderne
- **Zod** (3.25+) - Validation et parsing de données avec inférence de types

## 🎨 Interface utilisateur et styling

### Framework de styling

- **NativeWind** (v4) - Tailwind CSS pour React Native
- **Tailwind CSS** (v4) - Système de design utility-first
- **Design System Make the CHANGE** - Composants UI cohérents spécialisés biodiversité

### Système de thème

- **Thème Make the CHANGE** - Couleurs primaires vertes avec accents doré/miel
- **Typography** - Système de polices (Inter, fonts éco-responsables)
- **Spacing system** - Classes Tailwind avec système d'espacement cohérent

### Animations et interactions

- **React Native Reanimated** (v3.17+) - Animations natives performantes
- **React Native Gesture Handler** (2.24+) - Gestion avancée des gestes
- **Expo Linear Gradient** - Gradients natifs
- **Expo Haptics** - Retour haptique pour interactions importantes

## 📊 Gestion d'état et données

### State management

- **TanStack Query** (v5) - Gestion du cache et synchronisation des données serveur
- **AsyncStorage** (2.1+) - Persistance locale des données
- **React Context** - État global application (authentification, thème)

### API et réseau

- **tRPC** (v11) - Client type-safe pour API backend
- **Axios** (fallback) - Client HTTP pour intégrations tierces
- **Architecture end-to-end type-safe** - tRPC + TypeScript

## 🌍 Internationalisation et localisation

### i18n

- **Lingui** (5.3+) - Framework d'internationalisation moderne
- **Support multilingue** - Français, Anglais (extensible)
- **Messages contextualisés** - Par domaine métier (investissements, projets, e-commerce)

## 🗺️ Géolocalisation et cartes

### Services de localisation

- **Expo Location** - Géolocalisation native
- **react-native-maps** - Cartes interactives pour projets
- **Géolocalisation projets** - Localisation des ruches/oliviers investis

## 💳 Paiements et services financiers

### Intégrations paiement

- **Stripe React Native** - Traitement des paiements sécurisés
- **Stripe Payment Sheet** - Interface de paiement native
- **Support multi-devises** - EUR principal, extensible

## 🔔 Notifications et engagement

### Push notifications

- **Expo Notifications** - Notifications push cross-platform
- **Notifications contextuelles** - Updates projets, points expiring, nouveaux produits

## 📱 Services natifs

### Fonctionnalités natives

- **Expo Image** - Composant image optimisé
- **Expo Image Picker** - Sélection photo/caméra pour projets
- **Expo Haptics** - Retour haptique
- **Expo Sharing** - Partage projets/réussites
- **Expo AV** - Audio/vidéo pour contenu éducatif

### Permissions et sécurité

- **Expo Auth Session** - Authentification OAuth si nécessaire
- **Expo Crypto** - Cryptographie pour données sensibles
- **Deep linking** - Navigation vers projets spécifiques

## 🔥 Backend et services cloud

### API Backend

- **tRPC v11** - API type-safe principale
- **Vercel Edge Functions** - Runtime serverless
- **Supabase** - Database + Auth + Storage

### Monitoring et erreurs

- **Sentry** (6.14+) - Monitoring des erreurs et performance
- **Error Boundary** - Gestion des erreurs React
- **Vercel Analytics** - Analytics et performance

## 🧪 Outils de développement

### Build et déploiement

- **EAS Build** - Service de build Expo Application Services
- **EAS Submit** - Déploiement automatisé sur les stores
- **Metro** (configuration personnalisée) - Bundler React Native

### Linting et formatage

- **ESLint** (v9+) - Linter JavaScript/TypeScript avec configuration stricte
- **TypeScript ESLint** - Règles ESLint spécifiques TypeScript
- **Prettier** (3.5+) - Formatage de code automatique

### Configuration Babel

- **Babel Preset Expo** - Preset Babel optimisé pour Expo
- **Lingui Macro** - Transformation des macros i18n
- **Reanimated Plugin** - Support des animations Reanimated

## 📦 Utilitaires et helpers

### Date et temps

- **Luxon** (3.6+) - Manipulation des dates moderne (remplace Moment.js)
- **Date-fns** - Utilitaires dates légers pour formatage

### Validation de données

- **Zod** - Schémas de validation TypeScript-first
- **Form validation** - Intégration avec formulaires

### Navigation

- **Expo Router** (v4) - Navigation basée fichiers avec type safety
- **React Navigation** (intégré) - Navigation native

### Utilitaires métier biodiversité

- **Calculations** - Calculs points, ROI investissements
- **Formatage** - Prix, dates, pourcentages
- **Validations** - KYC, montants investissement

## ⚙️ Configuration environnement

### Variables d'environnement

- **env-cmd** - Gestion des environnements (.env.development, .env.production)
- **Expo Constants** - Accès aux constantes de configuration

### Gestion des versions

- **pnpm** - Gestionnaire de paquets (monorepo)
- **Node.js** v22 LTS - Version stable recommandée

## 🔧 Architecture des builds

### Profils de build EAS

1. **development** - Build de développement avec dev client
2. **preview** - Build de test interne (TestFlight/Internal Testing)
3. **production** - Build de production pour les stores

### Configurations platform-spécifiques

- **iOS** : Bundle ID com.makethechange.app, support iPad
- **Android** : Package name com.makethechange.app, permissions appropriées

## 🎯 Spécificités métier biodiversité

### Gestion des investissements

- **Types projets** - Ruches, oliviers, autres projets biodiversité
- **Calculs automatiques** - Points bonus selon niveau utilisateur
- **Tracking ROI** - Évolution des investissements dans le temps

### Système de points

- **Earn points** - Via investissements + bonus selon niveau
- **Spend points** - Marketplace produits authentiques
- **Points expiry** - Gestion expiration avec notifications

### Interface adaptée

- **Niveaux utilisateur** - Explorateur, Protecteur, Ambassadeur
- **Dashboard personnalisé** - Vue d'ensemble investissements + points
- **Marketplace intégrée** - E-commerce avec paiement points

## 📈 Performance et optimisations

### Optimisations React Native

- **Hermes** - Moteur JavaScript optimisé (via Expo)
- **Metro optimization** - Configuration bundler optimisée
- **Image Optimization** - Expo Image avec cache et compression
- **Code splitting** - Chargement différé des modules non-critiques

### Monitoring

- **Bundle Analyzer** - Analyse de la taille du bundle
- **Performance Monitoring** - Via Sentry + Vercel Analytics
- **Network monitoring** - Surveillance des APIs tRPC

### Architecture réseau

- **Offline support** - Cache TanStack Query avec persistence
- **Retry mechanisms** - Mécanismes de retry automatiques
- **Cache strategies** - Stratégies adaptées par type de données

---

## 🔍 Points forts de l'architecture

✅ **Stack moderne** : Expo SDK 53 + NativeWind + TypeScript strict  
✅ **Type Safety** : tRPC end-to-end + Zod validation  
✅ **Performance** : TanStack Query + Reanimated + optimisations  
✅ **Scalabilité** : Architecture modulaire + monorepo  
✅ **Monitoring** : Sentry + error boundaries + analytics  
✅ **I18n** : Support multilingue avec Lingui  
✅ **Developer Experience** : ESLint strict + Prettier + documentation  
✅ **Biodiversity-first** : Optimisations spécifiques au métier

Cette stack privilégie la **modernité**, la **type safety** et la **performance** tout en restant **maintenable** et **évolutive** pour supporter la croissance de la plateforme Make the CHANGE.

---