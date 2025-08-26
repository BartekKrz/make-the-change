# Connexion (Login)

## 🎯 Objectif

Permettre un accès rapide et sécurisé au compte existant. Optimiser la vitesse de connexion tout en maintenant un niveau de sécurité élevé.

## 🎨 Design & Layout

### Structure Visuelle

```text
┌─────────────────────────┐
│    [← Back]             │
│                         │
│    Ravi de vous         │
│    revoir               │
│                         │
│ ┌─────────────────────┐ │
│ │ Adresse email       │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Mot de passe    [👁] │ │
│ └─────────────────────┘ │
│                         │
│    Mot de passe         │
│    oublié ?             │
│                         │
│   [Se connecter]        │
│                         │
│ Pas encore de compte ?  │
│ S'inscrire              │
└─────────────────────────┘
```

### Couleurs & Styles

- **Background** : White/neutral-50
- **Header** : H1, color-primary-900, 24px, weight-bold
- **Input fields** : Border-radius 8px, focus-ring primary
- **Forgot password** : Link style, color-primary-600
- **CTA Button** : Button-primary-large, 100% width
- **Register link** : Typography-body, color-primary-600

## 📱 Composants UI

### Email Input

```typescript
interface EmailInputProps {
  value: string
  onChangeText: (text: string) => void
  error?: string
  autoComplete: "email"
  autoFocus: boolean
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
  error?: string
  autoComplete: "current-password"
}
```

### Biometric Authentication

```typescript
interface BiometricProps {
  available: boolean
  type: 'fingerprint' | 'face' | 'iris'
  onAuthenticate: () => Promise<void>
  fallbackToPassword: () => void
}
```

## 🔄 États & Interactions

### État Initial

- Champ email vide (ou pré-rempli si sauvegardé)
- Champ mot de passe vide
- Bouton "Se connecter" désactivé
- Focus automatique sur email

### Auto-complétion

```typescript
interface AutoCompleteData {
  savedEmails: string[]      // Derniers emails utilisés
  keychain: boolean          // Intégration système
  biometric: boolean         // Touch/Face ID disponible
  rememberMe: boolean        // Option sauvegarde session
}
```

### États du Bouton Principal

1. **Disabled** (initial)
   - Conditions : email vide OU password vide

2. **Enabled**
   - Conditions : email ET password remplis

3. **Loading**
   - Spinner + text "Connexion..."
   - Disable tous les champs durant l'API call

4. **Error State**
   - Shake animation + couleur rouge
   - Focus automatique sur champ en erreur

### Authentification Biométrique

```typescript
const biometricFlow = {
  checkAvailability: () => LocalAuthentication.hasHardwareAsync(),
  prompt: {
    title: "Connexion sécurisée",
    subtitle: "Utilisez votre empreinte pour vous connecter",
    fallbackLabel: "Utiliser le mot de passe"
  },
  onSuccess: () => navigateToDashboard(),
  onError: () => showPasswordForm()
}
```

## 📡 API & Données

### Login Endpoint

```typescript
POST /api/auth/login
Content-Type: application/json

interface LoginRequest {
  email: string
  password: string
  rememberDevice?: boolean
  deviceInfo?: {
    platform: 'ios' | 'android'
    deviceId: string
    pushToken?: string
  }
}

interface LoginResponse {
  success: boolean
  user?: {
    id: string
    email: string
    profile: UserProfile
    preferences: UserPreferences
  }
  tokens?: {
    accessToken: string
    refreshToken: string
    expiresIn: number
  }
  error?: {
    code: 'INVALID_CREDENTIALS' | 'ACCOUNT_LOCKED' | 'EMAIL_NOT_VERIFIED'
    message: string
    remainingAttempts?: number
  }
}
```

### Biometric Authentication

```typescript
interface BiometricAuthRequest {
  userId: string
  deviceId: string
  biometricHash: string
}

interface BiometricAuthResponse {
  success: boolean
  tokens?: AuthTokens
  requiresPasswordUpdate?: boolean
}
```

## ✅ Validations

### Frontend Validation

```typescript
interface LoginValidation {
  email: {
    required: boolean
    format: RegExp
    maxLength: number
  }
  password: {
    required: boolean
    minLength: number
    maxLength: number
  }
}
```

### Security Measures

#### Rate Limiting

```typescript
const securityConfig = {
  maxAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  progressiveDelay: [0, 1000, 2000, 5000, 10000], // ms
  captchaThreshold: 3
}
```

#### Device Trust

```typescript
interface DeviceTrust {
  isKnownDevice: boolean
  deviceFingerprint: string
  lastLoginLocation?: GeoLocation
  requiresAdditionalVerification: boolean
}
```

## 🚨 Gestion d'Erreurs

### Erreurs Authentification

#### Invalid Credentials (401)

```typescript
const invalidCredentialsError = {
  code: 'INVALID_CREDENTIALS',
  message: "Email ou mot de passe incorrect",
  action: {
    highlightFields: ['email', 'password'],
    showForgotPassword: true,
    remainingAttempts: number
  }
}
```

#### Account Locked (423)

```typescript
const accountLockedError = {
  code: 'ACCOUNT_LOCKED',
  message: "Compte temporairement bloqué",
  action: {
    showUnlockOptions: true,
    unlockTime: Date,
    contactSupport: true
  }
}
```

#### Email Not Verified (403)

```typescript
const emailNotVerifiedError = {
  code: 'EMAIL_NOT_VERIFIED',
  message: "Veuillez vérifier votre email",
  action: {
    resendVerification: true,
    changeEmail: true
  }
}
```

### Recovery Strategies

```typescript
const errorRecovery = {
  network: {
    retryCount: 3,
    showOfflineMode: true,
    cacheCredentials: false // Sécurité
  },
  credentials: {
    showForgotPassword: true,
    suggestBiometric: true,
    offerPasswordReset: true
  },
  account: {
    showSupportContact: true,
    provideUnlockInstructions: true
  }
}
```

## 🔗 Navigation

### Navigation Entrante

- **From Splash** : Slide transition from right
- **From Register** : Cross-fade transition
- **From Forgot Password** : Slide from left
- **Deep link** : `makethechange://login`

### Navigation Sortante

#### Success Flow

```typescript
// Connexion réussie
if (isFirstLogin) {
  navigation.navigate('Onboarding')
} else {
  navigation.reset({
    index: 0,
    routes: [{ name: 'Dashboard' }]
  })
}
```

#### Alternative Flows

- **To Register** : Replace current screen
- **To Forgot Password** : Modal presentation
- **To Support** : External link/modal

### Deep Links & Universal Links

```typescript
const deepLinks = {
  'makethechange://login': 'LoginScreen',
  'makethechange://login?email=user@domain.com': 'LoginScreen',
  'makethechange://forgot-password': 'ForgotPasswordModal',
  'makethechange://verify-email': 'EmailVerificationScreen'
}
```

## 📝 Tests Utilisateur

### Scénarios de Test

#### Performance Tests

1. **Time to login** : < 3 secondes
2. **Biometric speed** : < 1 seconde
3. **Auto-fill efficiency** : Réduction 80% de saisie

#### Security Tests

1. **Brute force protection** : Limitation tentatives
2. **Credential validation** : Pas de leak d'informations
3. **Session management** : Timeout approprié

#### Accessibility Tests

- **VoiceOver** : Navigation email → password → login
- **Dynamic Type** : Support tailles de police
- **High Contrast** : Lisibilité optimale
- **Switch Control** : Navigation au switch

### A/B Tests

#### Test : Biometric First vs Password First

- **Variant A** : Biometric prompt immédiat
- **Variant B** : Champs password + option biometric
- **Métrique** : Vitesse de connexion

#### Test : Remember Me Options

- **Variant A** : Checkbox "Se souvenir"
- **Variant B** : Toggle "Rester connecté"
- **Métrique** : Taux d'adoption feature

### Métriques de Succès

```typescript
interface LoginMetrics {
  successRate: number        // Target: >95%
  averageTime: number        // Target: <30s
  biometricAdoption: number  // Target: >60%
  errorRate: number          // Target: <5%
  supportTickets: number     // Target: <2% users
}
```

## 💾 Stockage Local

### Secure Storage

```typescript
interface SecureLoginData {
  lastLoginEmail?: string    // Encrypted
  deviceId: string          // UUID
  biometricEnabled: boolean
  rememberDevice: boolean
  sessionToken?: string     // Encrypted
}
```

### Keychain Integration

```typescript
// iOS Keychain / Android Keystore
interface KeychainLoginData {
  email: string
  password?: string         // Only if explicitly saved
  biometricHash?: string    // For biometric auth
  autoFillEnabled: boolean
}
```

### Session Management

```typescript
interface SessionData {
  accessToken: string       // Memory only
  refreshToken: string      // Secure storage
  expiresAt: number
  lastActivity: number
  deviceTrusted: boolean
}
```

### Analytics Events

```typescript
const loginEvents = {
  'login_started': {
    method: 'password' | 'biometric' | 'autofill',
    timestamp: number
  },
  'login_completed': {
    success: boolean,
    method: string,
    duration: number,
    biometricFallback?: boolean
  },
  'forgot_password_clicked': {
    timestamp: number,
    email?: string
  },
  'biometric_enabled': {
    type: 'fingerprint' | 'face',
    timestamp: number
  }
}
```

## 🔧 Configuration Technique

### Dependencies

```typescript
const dependencies = {
  '@react-native-async-storage/async-storage': 'Session storage',
  'expo-local-authentication': 'Biometric auth',
  'expo-secure-store': 'Credential storage',
  'react-hook-form': 'Form validation',
  '@hookform/resolvers/zod': 'Schema validation'
}
```

### Performance Optimizations

- **Credential prefill** : Auto-complétion instantanée
- **Biometric cache** : Reduce auth prompt frequency
- **Network optimization** : Request batching
- **Memory management** : Clear sensitive data on background
