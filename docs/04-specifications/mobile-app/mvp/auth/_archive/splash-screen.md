# Écran d'Accueil / Lancement (Splash Screen)

## 🎯 Objectif

Premier contact avec l'utilisateur, avant connexion ou inscription. Cet écran doit captiver immédiatement et communiquer la proposition de valeur unique de Make the CHANGE.

## 🎨 Design & Layout

### Structure Visuelle
```
┌─────────────────────────┐
│       [LOGO MTCH]       │
│                         │
│    Soutenez la          │
│    biodiversité.        │
│    Récoltez le meilleur.│
│                         │
│  Devenez membre,        │
│  soutenez des projets   │
│  et recevez des         │
│  produits authentiques. │
│                         │
│                         │
│  [Devenir Membre]       │
│                         │
│  [J'ai déjà un compte]  │
│                         │
└─────────────────────────┘
```

### Couleurs & Typographie
- **Background** : Gradient vert nature (primary-50 → primary-100)
- **Logo** : Couleur brand principale, taille 48px
- **H1** : Typography-h1, color-primary-900, weight-bold
- **Body** : Typography-body-lg, color-primary-700, weight-medium
- **Spacing** : Padding vertical 24px entre sections

## 📱 Composants UI

### Logo Component
```typescript
interface LogoProps {
  size: 'small' | 'medium' | 'large'
  variant: 'primary' | 'white' | 'dark'
}
```

### Primary Button
- **Text** : "Devenir Membre"
- **Style** : Button-primary-large
- **Width** : 80% screen width, centered
- **Height** : 56px
- **Border-radius** : 12px

### Secondary Button  
- **Text** : "J'ai déjà un compte"
- **Style** : Button-ghost-large
- **Width** : 80% screen width, centered
- **Height** : 48px

## 🔄 États & Interactions

### État Initial
- Affichage immédiat de tous les composants
- Animation d'entrée subtle (fade-in 300ms)
- Boutons interactifs dès l'affichage

### Interactions Utilisateur
1. **Tap "Devenir Membre"**
   - Feedback haptic léger
   - Animation de pression (scale 0.98)
   - Navigation vers `/auth/register`

2. **Tap "J'ai déjà un compte"**
   - Feedback haptic léger  
   - Animation de pression (scale 0.98)
   - Navigation vers `/auth/login`

### États de Transition
- **Loading** : Spinner overlay pendant navigation (200ms max)
- **Error** : Toast message si navigation échoue

## 📡 API & Données

### Données Statiques
- Textes de proposition de valeur
- Assets logo et images background
- Configuration de navigation

### Pas d'API Calls
Cet écran ne fait aucun appel API - performance maximale.

## ✅ Validations

### Pré-requis d'Affichage
- ✅ Assets logo chargés
- ✅ Fonts système disponibles  
- ✅ Navigation stack initialisée

### Accessibilité
- **VoiceOver** : Lecture séquentielle logo → titre → description → boutons
- **Semantic labels** : "Logo Make the Change", "Bouton devenir membre", etc.
- **Contrast ratio** : Minimum 4.5:1 pour tout le texte
- **Touch targets** : Minimum 44x44px pour tous les boutons

## 🚨 Gestion d'Erreurs

### Erreurs Possibles
1. **Assets manquants** : Fallback vers texte simple
2. **Navigation failure** : Toast + retry automatique
3. **Performance lente** : Skeleton loading

### Recovery Strategies
- Timeout navigation : 3s max, puis reload screen
- Asset loading failure : Continue avec composants texte
- Memory issues : Libération immédiate après navigation

## 🔗 Navigation

### Navigation Entrante
- **From** : App launch / Deep link
- **Animation** : Fade-in 300ms

### Navigation Sortante
- **To Register** : Slide-left transition 250ms
- **To Login** : Slide-left transition 250ms
- **Back** : Gestion système (pas de back sur splash)

### Deep Links
- `makethechange://splash` : Retour à l'écran d'accueil
- `makethechange://` : Default route vers splash

## 📝 Tests Utilisateur

### Scénarios de Test
1. **First impression** : L'utilisateur comprend-il immédiatement l'offre ?
2. **Call-to-action clarity** : Les boutons sont-ils évidents ?
3. **Loading time** : Affichage < 1s sur device moyen
4. **Accessibility** : Navigation VoiceOver fluide

### Métriques de Succès
- **Time to interact** : < 1.5s
- **Bounce rate** : < 15% (utilisateurs qui quittent immédiatement)
- **Conversion** : > 60% vers register ou login

## 💾 Stockage Local

### Pas de Stockage
Cet écran ne stocke aucune donnée localement.

### Analytics Events
```typescript
// Track splash screen view
analytics.track('splash_screen_viewed', {
  timestamp: Date.now(),
  app_version: VERSION,
  device_type: Platform.OS
})

// Track button interactions  
analytics.track('splash_cta_clicked', {
  button_type: 'create_account' | 'login',
  timestamp: Date.now()
})
```

## 🔧 Configuration Technique

### Dependencies
- `@expo/vector-icons` pour icônes
- `react-native-safe-area-context` pour safe areas
- `@react-navigation/native` pour navigation

### Performance Optimizations
- Pré-chargement des assets en arrière-plan
- Image optimization (WebP support)
- Lazy loading des composants suivants
