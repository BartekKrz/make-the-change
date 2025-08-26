# Inscription (Register)

## 🎯 Objectif

Permettre une création de compte simple et rapide, avec une expérience utilisateur fluide et sécurisée. Convertir les visiteurs en utilisateurs actifs avec un minimum de friction.

## 🎨 Design & Layout

### Structure Visuelle

```text
┌─────────────────────────┐
│    [← Back] [X Close]   │
│                         │
│    Rejoignez le         │
│    mouvement            │
│                         │
│ ┌─────────────────────┐ │
│ │ Adresse email       │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Mot de passe    [👁] │ │
│ └─────────────────────┘ │
│ ━━━━━━━━━━ Faible       │
│                         │
│ ☐ J'accepte les CGU     │
│   et Politique          │
│                         │
│   [S'inscrire]          │
│                         │
│ Déjà membre ?           │
│ Se connecter            │
└─────────────────────────┘
```

### Couleurs & Styles

- **Background** : White/neutral-50
- **Header** : H1, color-primary-900, 24px, weight-bold
- **Input fields** : Border-radius 8px, border-color-neutral-300
- **Password strength** : Dynamic color (red→yellow→green)
- **CTA Button** : Button-primary-large, 100% width
- **Legal text** : Typography-caption, color-neutral-600

## 📱 Composants UI

### Header Navigation

```typescript
interface HeaderProps {
  onBack: () => void
  onClose: () => void
  showProgress?: boolean
}
```

### Email Input

```typescript
interface EmailInputProps {
  value: string
  onChangeText: (text: string) => void
  error?: string
  placeholder: "Adresse email"
  autoComplete: "email"
  keyboardType: "email-address"
}
```

### Password Input

```typescript
interface PasswordInputProps {
  value: string
  onChangeText: (text: string) => void
  showPassword: boolean
  onTogglePassword: () => void
  strengthIndicator: boolean
  error?: string
}
```

### Password Strength Indicator

```typescript
interface PasswordStrengthProps {
  password: string
  rules: {
    minLength: boolean    // 8+ caractères
    hasUppercase: boolean // A-Z
    hasLowercase: boolean // a-z  
    hasNumber: boolean    // 0-9
    hasSpecial: boolean   // !@#$%
  }
}
```

### Legal Checkbox

```typescript
interface LegalCheckboxProps {
  checked: boolean
  onToggle: () => void
  termsUrl: string
  privacyUrl: string
}
```

## 🔄 États & Interactions

### État Initial

- Tous les champs vides
- Bouton "S'inscrire" désactivé
- Checkbox non cochée
- Focus automatique sur champ email

### Validation en Temps Réel

#### Email Validation

```typescript
const emailValidation = {
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  required: true,
  maxLength: 254,
  blockedDomains: ['tempmail.org', '10minutemail.com']
}
```

#### Password Validation

```typescript
const passwordRules = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
  forbiddenPatterns: ['123456', 'password', 'azerty']
}
```

### États du Bouton Principal

1. **Disabled** (initial)
   - Couleur grisée, non-interactif
   - Conditions : email invalide OU password faible OU checkbox non cochée

2. **Enabled** 
   - Couleur primary, interactif
   - Conditions : email valide ET password fort ET CGU acceptées

3. **Loading**
   - Spinner + text "Création en cours..."
   - Disable tous les champs durant l'API call

4. **Error State**
   - Couleur rouge, shake animation
   - Message d'erreur spécifique en dessous

### Interactions Avancées

#### Auto-complétion

- **Email** : Suggestions domaines populaires (@gmail.com, @outlook.com)
- **Password** : Générateur de mot de passe suggéré
- **Keychain** : Intégration iOS/Android password manager

#### Feedback Haptique

- **Error** : Impact feedback medium
- **Success** : Notification feedback success
- **Password strength** : Light impact sur changement de niveau

## 📡 API & Données

### Registration Endpoint

```typescript
POST /api/auth/register
Content-Type: application/json

interface RegisterRequest {
  email: string
  password: string
  acceptedTerms: boolean
  acceptedPrivacy: boolean
  source?: 'mobile' | 'web'
  deviceInfo?: {
    platform: 'ios' | 'android'
    version: string
    deviceId: string
  }
}

interface RegisterResponse {
  success: boolean
  user?: {
    id: string
    email: string
    profile: UserProfile
  }
  tokens?: {
    accessToken: string
    refreshToken: string
  }
  error?: {
    code: string
    message: string
    field?: string
  }
}
```

### Email Validation API

```typescript
POST /api/auth/validate-email
{
  email: string
}

Response: {
  valid: boolean
  available: boolean
  suggestions?: string[]
}
```

## ✅ Validations

### Validation Frontend

```typescript
interface ValidationRules {
  email: {
    required: boolean
    format: RegExp
    maxLength: number
    realTime: boolean
  }
  password: {
    minLength: number
    maxLength: number
    complexity: 'medium' | 'high'
    realTime: boolean
  }
  legal: {
    termsRequired: boolean
    privacyRequired: boolean
  }
}
```

### Validation Backend

- **Rate limiting** : 5 tentatives / 10 minutes par IP
- **Email blacklist** : Domaines temporaires bloqués
- **Password policy** : Enforcement côté serveur
- **CAPTCHA** : Si pattern suspect détecté

### Validation UX

- **Erreurs en temps réel** mais pas aggressive
- **Success feedback** immédiat sur champ valide
- **Helper text** proactif (ex: "8 caractères minimum")

## 🚨 Gestion d'Erreurs

### Erreurs Possibles

#### Erreurs Client

1. **Network timeout** : "Vérifiez votre connexion"
2. **Invalid email format** : "Format d'email invalide"
3. **Weak password** : "Mot de passe trop faible"
4. **Terms not accepted** : "Veuillez accepter les conditions"

#### Erreurs Serveur

1. **Email already exists** (409)
   - Message : "Cette adresse est déjà utilisée"
   - Action : Lien vers écran de connexion

2. **Invalid email domain** (422)
   - Message : "Adresse email non autorisée"
   - Action : Suggestions d'emails valides

3. **Password breached** (422)
   - Message : "Ce mot de passe a été compromis"
   - Action : Générateur de mot de passe

4. **Server error** (500)
   - Message : "Erreur temporaire, réessayez"
   - Action : Retry automatique x3

### Recovery Strategies

```typescript
const errorRecovery = {
  network: {
    retryCount: 3,
    retryDelay: [1000, 2000, 4000], // Exponential backoff
    fallback: 'offline_mode'
  },
  validation: {
    showInline: true,
    preventSubmit: true,
    highlightField: true
  },
  server: {
    showToast: true,
    logError: true,
    reportAnalytics: true
  }
}
```

## 🔗 Navigation

### Navigation Entrante

- **From Splash** : Slide transition from right
- **From Login** : Cross-fade transition
- **Deep link** : `makethechange://register`

### Navigation Sortante

#### Success Flow

```typescript
// Après inscription réussie
navigation.reset({
  index: 0,
  routes: [{ name: 'Dashboard' }]
})
```

#### Alternative Flows

- **Back to Splash** : Slide right
- **To Login** : Replace current screen
- **To Terms** : Modal presentation
- **To Privacy** : Modal presentation

### Deep Links Support

```typescript
const deepLinks = {
  'makethechange://register': 'RegisterScreen',
  'makethechange://register?email=user@domain.com': 'RegisterScreen',
  'makethechange://terms': 'TermsModal',
  'makethechange://privacy': 'PrivacyModal'
}
```

## 📝 Tests Utilisateur

### Scénarios de Test

#### Test A/B : Page Layout

- **Variant A** : Logo en haut
- **Variant B** : Pas de logo, plus d'espace pour contenu
- **Métrique** : Taux de conversion inscription

#### Usability Tests

1. **Time to complete** : < 2 minutes
2. **Error recovery** : Utilisateur comprend et corrige erreurs
3. **Password creation** : Utilisateur crée mot de passe fort facilement

#### Accessibility Tests

- **VoiceOver** : Navigation logique et labels clairs
- **Dynamic Type** : Support des tailles de police personnalisées
- **High Contrast** : Lisibilité en mode contraste élevé
- **Motor accessibility** : Touch targets minimum 44px

### Métriques de Succès

```typescript
interface RegistrationMetrics {
  conversionRate: number    // Target: >35%
  completionTime: number    // Target: <120s
  errorRate: number         // Target: <15%
  abandonmentPoint: string  // Most common exit point
  passwordStrength: number  // Average strength score
}
```

## 💾 Stockage Local

### Temporary Storage

```typescript
interface TempRegistrationData {
  email?: string          // Persist during session
  acceptedTerms?: boolean // Clear on app close
  formProgress?: number   // For analytics
}
```

### Keychain Integration

```typescript
// iOS Keychain / Android Keystore
interface KeychainData {
  email: string
  password?: string // Only if user opts-in
  autoFillEnabled: boolean
}
```

### Analytics Events

```typescript
const registrationEvents = {
  'registration_started': {
    source: 'splash' | 'login_link',
    timestamp: number
  },
  'field_focused': {
    field: 'email' | 'password',
    timestamp: number
  },
  'validation_error': {
    field: string,
    errorType: string,
    timestamp: number
  },
  'registration_completed': {
    success: boolean,
    duration: number,
    errorsEncountered: number,
    timestamp: number
  }
}
```
