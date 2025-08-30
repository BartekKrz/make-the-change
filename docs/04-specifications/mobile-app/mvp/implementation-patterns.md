# 📱 Mobile Implementation Patterns - Technical Specifications
**Make the CHANGE - Cross-Platform Mobile Development Guide**

**📍 DOCUMENT TYPE**: Spécifications Techniques Mobiles | **🗓️ DATE**: 27 Août 2025 | **⭐️ PRIORITÉ**: Critique

## 🎯 Vue d'Ensemble

Ce document fournit les spécifications techniques détaillées pour l'implémentation cross-platform de l'application Make the CHANGE. Focus sur iOS/Android avec React Native + Expo SDK 53, intégration des meilleures pratiques UX/UI 2025.

---

## 📱 Spécifications Techniques iOS

### Core Technologies iOS

#### Framework Integration
```swift
// UIKit + SwiftUI Hybrid Approach
import UIKit
import SwiftUI
import CoreHaptics
import AuthenticationServices
import MapKit
import PassKit

// Expo React Native Bridge
import ExpoModulesCore
```

#### Device Capabilities
- **Touch Targets**: Minimum 44pt (iOS HIG standard)
- **Safe Areas**: Dynamic Island + Home Indicator awareness
- **Haptic Feedback**: CoreHaptics integration pour feedback tactile
- **Biometric Auth**: Face ID + Touch ID via LocalAuthentication
- **Apple Pay**: PKPaymentAuthorizationViewController integration

#### UI Components Standards

**Navigation**
```typescript
// UITabBarController Configuration
const tabBarConfig = {
  height: 83, // Safe area + tab bar
  itemSize: { width: 44, height: 44 },
  safeAreaTop: 44, // Status bar + navigation bar
  safeAreaBottom: 34, // Home indicator
};
```

**Typography**
```swift
// SF Pro Display/Text Implementation
.font(.system(.title, design: .default, weight: .semibold))
.font(.system(.body, design: .default, weight: .regular))
.font(.system(.caption, design: .default, weight: .medium))
```

**Animations**
```swift
// iOS Spring Animations
UIView.animate(withDuration: 0.6, 
               delay: 0, 
               usingSpringWithDamping: 0.8, 
               initialSpringVelocity: 0.2)
```

---

## 🤖 Spécifications Techniques Android

### Core Technologies Android

#### Framework Integration
```kotlin
// Material Design 3 + Compose Integration
import androidx.compose.material3.*
import androidx.biometric.BiometricManager
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.gms.wallet.PaymentsClient
import com.google.android.gms.maps.GoogleMap
```

#### Device Capabilities
- **Touch Targets**: Minimum 48dp (Material Design standard)
- **Navigation Bar**: Gestural + 3-button navigation support
- **Haptic Feedback**: Vibrator + HapticFeedbackManager
- **Biometric Auth**: Fingerprint + Face unlock via BiometricPrompt
- **Google Pay**: Google Pay API integration

#### UI Components Standards

**Navigation**
```xml
<!-- BottomNavigationView Configuration -->
<com.google.android.material.bottomnavigation.BottomNavigationView
    android:layout_height="64dp"
    app:itemIconSize="24dp"
    app:itemTextAppearanceActive="@style/TextAppearance.Material3.LabelMedium"
    app:itemTextAppearanceInactive="@style/TextAppearance.Material3.LabelSmall"/>
```

**Typography**
```kotlin
// Material Design 3 Typography
Text(
    text = title,
    style = MaterialTheme.typography.headlineMedium,
    fontFamily = FontFamily.SansSerif
)
```

**Material Motion**
```kotlin
// Material Motion Animations
val slideAnimation = slideInVertically(
    initialOffsetY = { it / 2 },
    animationSpec = tween(300, easing = FastOutSlowInEasing)
)
```

---

## 🔧 Cross-Platform Implementation

### React Native + Expo SDK 53 Integration

#### Project Structure
```
src/
├── components/           # Shared UI components
│   ├── atoms/           # Basic elements (Button, Input)
│   ├── molecules/       # Composite elements (SearchBar, Card)
│   └── organisms/       # Complex components (ProjectList, Dashboard)
├── screens/             # Screen components
├── navigation/          # Navigation configuration
├── services/           # API services + business logic
├── hooks/              # Custom React hooks
├── utils/              # Platform utilities
└── styles/             # Design system styles
```

#### Platform-Specific Adaptations
```typescript
// Platform-specific component rendering
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PlatformButton: React.FC = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Pressable 
      style={[
        styles.button,
        Platform.OS === 'ios' && styles.iosButton,
        Platform.OS === 'android' && styles.androidButton,
        { marginBottom: insets.bottom }
      ]}
    />
  );
};
```

---

## ♿ Spécifications Accessibilité WCAG 2.2

### Standards Obligatoires

#### Touch Targets & Navigation
```typescript
// Minimum touch target sizes
const TOUCH_TARGET_SIZES = {
  ios: 44, // Points
  android: 48, // DP
  web: 44, // Pixels
};

// VoiceOver/TalkBack Integration
<Pressable
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Soutenir ce projet de ruches"
  accessibilityHint="Ouvre le formulaire d'investissement"
  accessibilityState={{ selected: isSelected }}
>
```

#### Color Contrast & Visual
```scss
// WCAG 2.2 AA Compliance
$contrast-ratios: (
  'normal-text': 4.5,
  'large-text': 3,
  'non-text': 3,
  'focus-indicator': 3
);

// Dark Mode Support
@media (prefers-color-scheme: dark) {
  .card { 
    background: #1a2e1a;
    color: #e8f5e8;
  }
}
```

#### Screen Reader Support
```typescript
// Dynamic Type Support (iOS)
const dynamicFontSize = {
  title: { fontSize: 28, lineHeight: 34 },
  body: { fontSize: 17, lineHeight: 22 },
  caption: { fontSize: 12, lineHeight: 16 },
};

// TalkBack Announcements (Android)
AccessibilityInfo.announceForAccessibility(
  "Votre investissement de 50€ a été confirmé"
);
```

---

## 🔄 Performance Optimization Patterns

### Loading States & Skeleton Screens

```typescript
// Skeleton Implementation
const ProjectCardSkeleton: React.FC = () => (
  <View style={styles.skeleton}>
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item width="100%" height={200} borderRadius={12} />
      <SkeletonPlaceholder.Item width="80%" height={20} marginTop={12} />
      <SkeletonPlaceholder.Item width="60%" height={16} marginTop={8} />
    </SkeletonPlaceholder>
  </View>
);

// Progressive Loading
const ProjectList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  
  return loading ? <ProjectCardSkeleton /> : <ProjectCard data={projects} />;
};
```

### Image Optimization & Lazy Loading

```typescript
// Optimized Image Loading
import FastImage from 'react-native-fast-image';

const OptimizedImage: React.FC<ImageProps> = ({ source, style }) => (
  <FastImage
    style={style}
    source={{
      uri: source.uri,
      priority: FastImage.priority.normal,
      cache: FastImage.cacheControl.immutable,
    }}
    resizeMode={FastImage.resizeMode.cover}
  />
);
```

### Network Request Optimization

```typescript
// TanStack Query Configuration
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// Efficient API Calls - Convention arrow function directe
export const useProjects = () => useQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects,
  select: (data) => data.filter(project => project.status === 'active'),
});
```

---

## 📝 Form Management with TanStack Form

### TanStack Form Implementation

```typescript
// Installation TanStack Form avec validation Zod
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';

// Schema de validation Zod Make the CHANGE
const loginSchema = z.object({
  email: z.string().email('Format d\'email invalide').min(1, 'Email requis'),
  password: z.string().min(8, 'Minimum 8 caractères').max(128, 'Maximum 128 caractères'),
});

// Hook de connexion avec TanStack Form - Convention arrow function directe
export const useLoginForm = () => useForm({
  defaultValues: {
    email: '',
    password: '',
  },
  onSubmit: async ({ value }) => {
    try {
      await loginUser(value);
    } catch (error) {
      throw new Error('Échec de la connexion');
    }
  },
  validatorAdapter: zodValidator,
  validators: {
    onChange: loginSchema,
  },
});

// Utilisation dans un composant Screen
const LoginScreen: FC = () => {
  const form = useLoginForm();
  
  return (
    <Screen.Layout>
      <Screen.Header title="Connexion" showBackButton />
      <Screen.Content>
        <form.Field
          name="email"
          children={(field) => (
            <TextInput
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              placeholder="Email"
              keyboardType="email-address"
              autoComplete="email"
              error={field.state.meta.errors?.[0]}
            />
          )}
        />
        
        <form.Field
          name="password"
          children={(field) => (
            <TextInput
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              placeholder="Mot de passe"
              secureTextEntry
              autoComplete="current-password"
              error={field.state.meta.errors?.[0]}
            />
          )}
        />
        
        <Button
          title="Se connecter"
          onPress={form.handleSubmit}
          disabled={!form.state.canSubmit}
          loading={form.state.isSubmitting}
        />
      </Screen.Content>
    </Screen.Layout>
  );
};
```

### Advanced Form Patterns

```typescript
// Formulaire complexe avec validation conditionnelle
const investmentSchema = z.object({
  amount: z.number().min(50, 'Minimum 50€').max(10000, 'Maximum 10000€'),
  projectId: z.string().min(1, 'Projet requis'),
  acceptTerms: z.boolean().refine(val => val === true, 'Acceptation requise'),
});

export const useInvestmentForm = (projectId: string) => {
  // Variables nécessaires - utiliser return explicite selon convention
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  
  return useForm({
    defaultValues: {
      amount: 50,
      projectId,
      acceptTerms: false,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        const result = await createInvestment(value);
        // Navigation vers écran de succès
        navigation.navigate('InvestmentSuccess', { investmentId: result.id });
      } catch (error) {
        throw new Error('Échec de l\'investissement');
      } finally {
        setLoading(false);
      }
    },
    validatorAdapter: zodValidator,
    validators: {
      onChange: investmentSchema,
    },
  });
};
```

---

## 💳 Payment Integration Patterns

### Apple Pay Implementation

```typescript
// Apple Pay Setup
import { ApplePayButton, useApplePay } from '@stripe/stripe-react-native';

const ApplePayCheckout: React.FC = ({ amount, onSuccess }) => {
  const { presentApplePay, confirmApplePayPayment } = useApplePay();
  
  const handleApplePay = async () => {
    try {
      const { paymentMethod } = await presentApplePay({
        cartItems: [{ label: 'Soutien projet biodiversité', amount: amount }],
        country: 'FR',
        currency: 'EUR',
        requiredShippingAddressFields: ['name', 'postalAddress'],
      });
      
      await confirmApplePayPayment(paymentMethod.id);
      onSuccess();
    } catch (error) {
      console.error('Apple Pay error:', error);
    }
  };
  
  return (
    <ApplePayButton
      onPress={handleApplePay}
      type="plain"
      buttonStyle="black"
      borderRadius={8}
    />
  );
};
```

### Google Pay Implementation

```typescript
// Google Pay Setup
import { GooglePayButton, useGooglePay } from '@stripe/stripe-react-native';

const GooglePayCheckout: React.FC = ({ amount, onSuccess }) => {
  const { initGooglePay, presentGooglePay } = useGooglePay();
  
  const handleGooglePay = async () => {
    try {
      await initGooglePay({ 
        merchantName: 'Make the CHANGE',
        countryCode: 'FR',
        billingAddressConfig: { isRequired: true },
      });
      
      const { paymentMethod } = await presentGooglePay({
        amount: amount,
        currencyCode: 'EUR',
      });
      
      onSuccess();
    } catch (error) {
      console.error('Google Pay error:', error);
    }
  };
  
  return (
    <GooglePayButton
      style={styles.payButton}
      onPress={handleGooglePay}
      type="pay"
    />
  );
};
```

---

## 🌍 Internationalization (i18n) Patterns

### Multi-Language Support

```typescript
// i18next Configuration
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: require('./locales/fr.json') },
    en: { translation: require('./locales/en.json') },
    de: { translation: require('./locales/de.json') },
    nl: { translation: require('./locales/nl.json') },
  },
  lng: 'fr',
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
});

// Usage in Components
import { useTranslation } from 'react-i18next';

const ProjectCard: React.FC = ({ project }) => {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t('project.supportButton', { amount: project.minAmount })}</Text>
      <Text>{t('project.impactDescription', { impact: project.impact })}</Text>
    </View>
  );
};
```

### Localization Files Structure

```json
// fr.json
{
  "onboarding": {
    "welcome": "Bienvenue sur Make the CHANGE",
    "subtitle": "Investissez dans la biodiversité",
    "getStarted": "Commencer"
  },
  "project": {
    "supportButton": "Soutenir à partir de {{amount}}€",
    "impactDescription": "Impact: {{impact}} tonnes CO2 compensées"
  },
  "payment": {
    "processing": "Traitement du paiement...",
    "success": "Paiement confirmé !",
    "error": "Erreur de paiement"
  }
}
```

---

## 📊 Analytics & Performance Monitoring

### Event Tracking Implementation

```typescript
// Analytics Service
import analytics from '@react-native-firebase/analytics';

export class AnalyticsService {
  static trackScreen(screenName: string) {
    analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenName,
    });
  }
  
  static trackEvent(eventName: string, parameters: Record<string, any>) {
    analytics().logEvent(eventName, {
      ...parameters,
      timestamp: new Date().toISOString(),
    });
  }
  
  static trackInvestment(projectId: string, amount: number) {
    this.trackEvent('investment_completed', {
      project_id: projectId,
      amount: amount,
      currency: 'EUR',
    });
  }
}

// Usage in Components
const ProjectDetail: React.FC = ({ projectId }) => {
  useEffect(() => {
    AnalyticsService.trackScreen('ProjectDetail');
  }, []);
  
  const handleInvest = (amount: number) => {
    AnalyticsService.trackInvestment(projectId, amount);
  };
};
```

### Performance Monitoring

```typescript
// Performance Metrics
import perf from '@react-native-firebase/perf';

const ProjectListScreen: React.FC = () => {
  useEffect(() => {
    const trace = perf().newTrace('project_list_load');
    trace.start();
    
    fetchProjects().finally(() => {
      trace.stop();
    });
    
    return () => trace.stop();
  }, []);
};
```

---

## 🔒 Security Implementation Patterns

### Secure Data Storage

```typescript
// Keychain/Keystore Integration
import * as SecureStore from 'expo-secure-store';

export class SecureStorageService {
  static async storeSecurely(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value, {
      requireAuthentication: true,
      authenticationPrompt: 'Authentifiez-vous pour accéder à vos données',
    });
  }
  
  static async getSecurely(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key, {
      requireAuthentication: true,
    });
  }
  
  // Token Management
  static async storeAuthToken(token: string): Promise<void> {
    await this.storeSecurely('auth_token', token);
  }
  
  static async getAuthToken(): Promise<string | null> {
    return await this.getSecurely('auth_token');
  }
}
```

### Biometric Authentication

```typescript
// Biometric Auth Implementation
import * as LocalAuthentication from 'expo-local-authentication';

export class BiometricAuthService {
  static async isAvailable(): Promise<boolean> {
    return await LocalAuthentication.hasHardwareAsync();
  }
  
  static async authenticate(reason: string): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        fallbackLabel: 'Utiliser le code',
        disableDeviceFallback: false,
      });
      
      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }
}
```

---

## 🎯 KPIs & Success Metrics

### Performance Targets

```typescript
// Performance Benchmarks
const PERFORMANCE_TARGETS = {
  // Loading Times
  coldStart: 2000, // ms
  screenTransition: 500, // ms
  apiResponse: 1000, // ms
  
  // Memory Usage
  baselineMemory: 100, // MB
  peakMemory: 200, // MB
  
  // Network Usage
  screenLoad: 1, // MB
  imageSize: 0.5, // MB average
  
  // Battery Impact
  sessionDrain: 5, // % per 30min session
};

// Conversion Metrics
const CONVERSION_TARGETS = {
  onboardingCompletion: 0.85,
  firstInvestment: 0.25,
  cartToCheckout: 0.60,
  checkoutSuccess: 0.80,
};
```

### Monitoring Implementation

```typescript
// Real-time Performance Monitoring
export class PerformanceMonitor {
  static measureScreenLoad(screenName: string, startTime: number) {
    const loadTime = Date.now() - startTime;
    
    AnalyticsService.trackEvent('screen_load_time', {
      screen: screenName,
      load_time: loadTime,
      is_slow: loadTime > PERFORMANCE_TARGETS.screenTransition,
    });
  }
  
  static measureApiCall(endpoint: string, duration: number, success: boolean) {
    AnalyticsService.trackEvent('api_call_performance', {
      endpoint,
      duration,
      success,
      is_slow: duration > PERFORMANCE_TARGETS.apiResponse,
    });
  }
}
```

---

Cette spécification technique complète fournit tous les éléments nécessaires pour implémenter l'application mobile Make the CHANGE selon les meilleures pratiques 2025, avec focus sur la performance, l'accessibilité et l'expérience utilisateur optimale.

---

*Document basé sur les spécifications techniques du document ui.md original - Adapté pour l'implémentation Make the CHANGE*

*Dernière mise à jour : 27 août 2025*