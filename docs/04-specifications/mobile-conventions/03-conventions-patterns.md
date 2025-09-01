# 🎯 Conventions de Code et Patterns - Make the CHANGE Mobile

## 📋 Vue d'ensemble

Ce document unifie toutes les conventions de code, patterns de développement et bonnes pratiques du projet Make the CHANGE Mobile. Il constitue LA référence unique pour tous les développeurs de l'équipe travaillant sur cette plateforme de biodiversité.

### 🔑 **Points Clés des Conventions**

✅ **TanStack Form** - Gestion de formulaires avec validation Zod  
✅ **Composant Screen Complet** - Layout avancé inspiré de Formidable  
✅ **Convention Arrow Function** - Directe quand possible, avec return si nécessaire  
✅ **Patterns Métier** - Adaptés biodiversité, investissements, points  

---

# 🏗️ PARTIE I - CONVENTIONS DE CODE

## 🔧 **1. Syntaxe ES6 & TypeScript**

### **Déclarations de variables**

- **`const` par défaut** : Usage systématique pour les valeurs immutables
- **`let` pour la mutabilité** : Uniquement quand nécessaire
- **Interdiction de `var`** : Jamais utilisé dans le codebase

```typescript
// ✅ Pattern recommandé Make the CHANGE
const theme = useTheme();
const { data: userInvestments } = useInvestments();
const { data: pointsBalance } = usePointsBalance();
let selectedProjectId = useRef<string | null>(null);

// ❌ Jamais utilisé
var someVariable = 'value';
```

### **Arrow Functions privilégiées - Convention Make the CHANGE**

- **Composants fonctionnels** : Toujours en arrow functions
- **Hooks simples** : Arrow function directe QUAND POSSIBLE (pas de variables/logique)
- **Hooks complexes** : Avec return quand variables ou logique nécessaires
- **Function déclarations** : Uniquement pour les fonctions exportées complexes

```typescript
// ✅ Composants - Pattern strict Make the CHANGE
const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  // ...
};

const InvestmentForm: FC<InvestmentFormProps> = ({ project, onSubmit }) => {
  // ...
};

// ✅ Hooks - Arrow function directe (pas de variables/logique)
export const useNearbyProjects = (location?: GeoLocation) => useQuery({
  queryKey: ['projects', 'nearby', location],
  queryFn: () => trpc.projects.getNearbyProjects.query({ location }),
  staleTime: 5 * 60 * 1000,
  enabled: !!location
});

export const usePointsBalance = () => useQuery({
  queryKey: ['points', 'balance'],
  queryFn: () => trpc.points.getBalance.query(),
  staleTime: 1 * 60 * 1000
});

// ✅ Hooks - Avec return (variables/logique nécessaires)
export const useInvestmentCalculator = (projectId: string) => {
  const [amount, setAmount] = useState(0);
  const { data: project } = useProject(projectId);
  const { data: userLevel } = useUserLevel();
  
  const calculation = useMemo(() => {
    if (!project || !userLevel) return null;
    return calculateInvestmentMetrics(project, amount, userLevel);
  }, [project, userLevel, amount]);
  
  return {
    amount,
    setAmount,
    calculation,
    isValid: amount >= project?.minimumInvestment
  };
};

// ✅ Fonctions utilitaires biodiversité
const calculatePointsBonus = (investment: Investment, userLevel: UserLevel) => {
  return investment.basePoints * getUserLevelMultiplier(userLevel);
};

const formatBiodiversityImpact = (impact: BiodiversityMetrics) => {
  return `${impact.co2Saved}kg CO₂ • ${impact.biodiversityScore}/100`;
};

// ✅ Fonctions exportées complexes
export function validateKYCLevel(
  amount: number,
  userLevel: UserLevel
): asserts userLevel is ValidKYCLevel {
  // Validation KYC complexe selon montant et niveau
}
```

### **Destructuring systématique**

- **Props destructuring** : Toujours immédiat
- **Import destructuring** : Maximum de spécificité
- **Object destructuring** : Avec renommage explicite

```typescript
// ✅ Props destructuring Make the CHANGE
export const ProjectCard: FC<ProjectCardProps> = ({ 
  project, 
  userLevel, 
  onInvest 
}) => {
  // ...
};

// ✅ Import destructuring spécialisé
import {
  useInvestments,
  useCreateInvestment,
  useCalculateROI
} from '@/src/api/investments';

import {
  usePointsBalance,
  usePointsHistory,
  useExpiringPoints
} from '@/src/api/points';

// ✅ Object destructuring avec renommage métier
const { data: investments, isLoading: isInvestmentsLoading } = useInvestments();
const { data: projects, isLoading: isProjectsLoading } = useNearbyProjects();
const { pointsBalance, availablePoints, expiringPoints } = usePointsBalance();
```

### **Template Literals**

- **Strings dynamiques** : Toujours avec template literals
- **Interpolation i18n** : Avec backticks pour Lingui
- **URLs dynamiques** : Template strings pour routing Expo Router

```typescript
// ✅ URLs dynamiques Expo Router
<Link href={`/(authenticated)/investment/${project.id}`}>

// ✅ Messages i18n contextualisés biodiversité
const investmentSuccess = t`You successfully invested ${amount}€ in ${projectName}`;
const pointsEarned = t`You earned ${points} points! ${bonusPoints} bonus points from your ${userLevel} level`;

// ✅ Formatage métier
const impactSummary = `${project.beehivesCount} ruches • ${project.honeyProduction}kg miel/an`;
const roiDisplay = `ROI: ${roi}% • Points: ${totalPoints}`;
```

---

## 🏗️ **2. Structure des écrans et pages**

### **Pattern Screen uniforme Make the CHANGE**

**TOUS les écrans suivent cette structure basée sur le composant Screen :**

```typescript
// Structure OBLIGATOIRE pour chaque écran Make the CHANGE
const ProjectsScreen: FC = () => (
  <Screen.Layout>
    <Screen.Header 
      title={t`Discover Projects`}
      right={<FilterButton />}
      showBackButton={false}
    />
    <View className="flex-1 px-4 bg-gray-50">
      {/* Contenu principal */}
      <ProjectsList />
    </View>
  </Screen.Layout>
);

export default ProjectsScreen;
```

### **Screen Component Make the CHANGE - Version Complète**

```typescript
// Types complets pour Screen Make the CHANGE
type LayoutProps = {
  children: React.ReactNode;
  className?: string;
  safeEdges?: Edge[];
  keyboardAvoiding?: boolean;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  testID?: string;
};

type HeaderProps = {
  title: string;
  right?: React.ReactNode;
  left?: React.ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
  statusBarStyle?: 'light' | 'dark';
  testID?: string;
};

type LoadingProps = {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  testID?: string;
};

type ErrorProps = {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  testID?: string;
};

// Structure complète du composant Screen pour Make the CHANGE
const Layout: FC<LayoutProps> = ({ 
  children, 
  className, 
  safeEdges,
  keyboardAvoiding = true,
  loading = false,
  error = null,
  onRetry,
  testID
}) => {
  const content = (
    <>
      {loading && <Screen.Loading />}
      {error && <Screen.Error message={error} onRetry={onRetry} />}
      {!loading && !error && children}
    </>
  );

  return (
    <SafeAreaView 
      className={cn('flex-1 bg-white', className)} 
      edges={safeEdges ?? ['top', 'left', 'right']}
      testID={testID}
    >
      {keyboardAvoiding ? (
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          className="flex-1"
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
};

const Header: FC<HeaderProps> = ({ 
  title, 
  right, 
  left, 
  showBackButton = true,
  onBackPress,
  backgroundColor = 'bg-primary',
  textColor = 'text-white',
  statusBarStyle = 'light',
  testID
}) => {
  const router = useRouter();
  
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <>
      <StatusBar style={statusBarStyle} />
      <View className={cn('h-16 flex-row items-center justify-between px-4', backgroundColor)} testID={testID}>
        <View className="flex-row items-center gap-3 flex-1">
          {showBackButton && (
            <TouchableOpacity onPress={handleBackPress} className="p-2 -ml-2">
              <ChevronLeftIcon className={cn('w-6 h-6', textColor)} />
            </TouchableOpacity>
          )}
          {left}
          <Text className={cn('font-semibold text-lg flex-1', textColor)} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          {right}
        </View>
      </View>
    </>
  );
};

const Loading: FC<LoadingProps> = ({ message, size = 'medium', testID }) => (
  <View className="flex-1 justify-center items-center bg-white" testID={testID}>
    <ActivityIndicator 
      size={size === 'small' ? 'small' : 'large'} 
      color="#059669" 
    />
    {message && (
      <Text className="mt-4 text-gray-600 text-center px-6">
        {message}
      </Text>
    )}
  </View>
);

const Error: FC<ErrorProps> = ({ message, onRetry, retryLabel = 'Retry', testID }) => (
  <View className="flex-1 justify-center items-center bg-white px-6" testID={testID}>
    <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
      <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
    </View>
    <Text className="text-gray-900 font-semibold text-lg text-center mb-2">
      {t`Something went wrong`}
    </Text>
    <Text className="text-gray-600 text-center mb-6">
      {message}
    </Text>
    {onRetry && (
      <TouchableOpacity 
        onPress={onRetry}
        className="bg-primary px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">
          {retryLabel}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

const ScrollView: FC<ScrollViewProps & { testID?: string }> = ({ children, testID, ...props }) => (
  <RNScrollView
    className="flex-1"
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled"
    testID={testID}
    {...props}
  >
    {children}
  </RNScrollView>
);

const Content: FC<{ children: React.ReactNode; className?: string; testID?: string }> = ({ 
  children, 
  className,
  testID 
}) => (
  <View className={cn('flex-1 px-4 bg-gray-50', className)} testID={testID}>
    {children}
  </View>
);

export const Screen = { 
  Layout, 
  Header, 
  Loading, 
  Error, 
  ScrollView, 
  Content 
};
```

### **Layouts spécialisés Make the CHANGE - Usage Avancé**

- **Screen.Layout** : Container principal avec gestion états (loading, error) et SafeArea
- **Screen.Header** : En-tête complet avec navigation, theming et StatusBar
- **Screen.Loading** : État de chargement centralisé avec ActivityIndicator
- **Screen.Error** : Gestion d'erreurs avec retry et messages contextuels
- **Screen.ScrollView** : ScrollView optimisé avec keyboard handling
- **Screen.Content** : Container de contenu avec padding et background cohérents

```typescript
// ✅ Exemples d'usage avancé Screen Make the CHANGE
const InvestmentScreen: FC = () => {
  const { data: investment, isLoading, error, refetch } = useInvestment(id);
  
  return (
    <Screen.Layout 
      loading={isLoading}
      error={error?.message}
      onRetry={refetch}
    >
      <Screen.Header 
        title={t`Investment Details`}
        right={<ShareButton />}
        backgroundColor="bg-gradient-to-r from-primary to-secondary"
      />
      <Screen.ScrollView>
        <Screen.Content>
          <InvestmentDetails investment={investment} />
          <InvestmentActions investment={investment} />
        </Screen.Content>
      </Screen.ScrollView>
    </Screen.Layout>
  );
};

// ✅ Screen avec états customisés
const ProjectsScreen: FC = () => (
  <Screen.Layout>
    <Screen.Header 
      title={t`Discover Projects`}
      right={<FilterButton />}
      showBackButton={false}
    />
    <Screen.Content className="px-0">
      <ProjectsList />
    </Screen.Content>
  </Screen.Layout>
);
```

---

## 🧩 **3. Conventions de déclaration des composants**

### **Types de composants Make the CHANGE**

#### **A. Pages/Écrans (Routes Expo Router)**

```typescript
// ✅ Convention écrans - TOUJOURS default export
const InvestmentScreen: FC = () => (
  <Screen.Layout>
    <Screen.Header title={t`Investment Details`} />
    <View className="flex-1 bg-gray-50">
      <InvestmentDetails />
      <InvestmentActions />
    </View>
  </Screen.Layout>
);

export default InvestmentScreen; // OBLIGATOIRE pour écrans Expo Router
```

#### **B. Composants Features (Logique métier)**

```typescript
// ✅ Convention features - TOUJOURS named export
export const ProjectCard: FC<ProjectCardProps> = ({ project, userLevel }) => {
  return (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm">
      <ProjectHeader project={project} />
      <BiodiversityImpact impact={project.impact} />
      <InvestmentOpportunity 
        project={project}
        userLevel={userLevel}
        onInvest={() => {/* navigation vers investissement */}}
      />
    </View>
  );
};

export const PointsBalance: FC<PointsBalanceProps> = ({ balance, level }) => {
  return (
    <View className="bg-gradient-to-r from-primary to-secondary p-4 rounded-lg">
      <Text className="text-white font-bold text-2xl">
        {formatPoints(balance)} pts
      </Text>
      <LevelBadge level={level} />
    </View>
  );
};

// ❌ JAMAIS de default export pour features
```

#### **C. Composants UI (Design System)**

```typescript
// ✅ Composants réutilisables Make the CHANGE
export const Button: FC<ButtonProps> = ({ 
  children, 
  onPress, 
  variant = 'primary',
  size = 'medium',
  disabled = false
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      disabled={disabled}
      className={cn(
        'rounded-lg justify-center items-center',
        // Variants Make the CHANGE
        variant === 'primary' && 'bg-primary',
        variant === 'secondary' && 'bg-secondary',
        variant === 'investment' && 'bg-green-600',
        variant === 'points' && 'bg-gradient-to-r from-yellow-400 to-orange-500',
        // Sizes
        size === 'small' && 'px-3 py-2',
        size === 'medium' && 'px-6 py-3',
        size === 'large' && 'px-8 py-4',
        // States
        disabled && 'opacity-50'
      )}
    >
      <Text className={cn(
        'font-semibold',
        variant === 'primary' && 'text-white',
        variant === 'secondary' && 'text-white',
        variant === 'investment' && 'text-white',
        variant === 'points' && 'text-white',
        size === 'small' && 'text-sm',
        size === 'medium' && 'text-base',
        size === 'large' && 'text-lg'
      )}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};
```

### **TypeScript strict Make the CHANGE**

- **Type séparé** : `import type { FC } from 'react'`
- **Props typées** : Interface ou type dédiés avec contexte métier
- **Génériques explicites** : Pour composants réutilisables

```typescript
// ✅ Type safety stricte Make the CHANGE
type ProjectCardProps = {
  project: {
    id: string;
    name: string;
    type: 'beehive' | 'olive_grove' | 'forest';
    location: GeoLocation;
    fundingGoal: number;
    currentFunding: number;
    minimumInvestment: number;
    expectedROI: number;
    biodiversityImpact: BiodiversityMetrics;
    partnerInfo: PartnerInfo;
  };
  userLevel: UserLevel;
  onInvest?: (projectId: string, amount: number) => void;
  showFullDetails?: boolean;
};

type InvestmentFormProps = {
  project: Project;
  userLevel: UserLevel;
  availablePoints: number;
  onSubmit: (investment: InvestmentRequest) => Promise<void>;
  isLoading?: boolean;
};

type PointsDisplayProps = {
  balance: number;
  availableForSpending: number;
  expiringPoints?: ExpiringPoints[];
  level: UserLevel;
  showExpiry?: boolean;
};
```

---

## 📁 **4. Règles de création de fichiers séparés**

### **Règle #1 : Responsabilité unique métier**

**Créer un fichier séparé quand :**

#### **A. Calculs et logique métier biodiversité**

```typescript
// ✅ Fichier séparé : src/utils/investment/roi-calculator.ts
export const calculateInvestmentROI = (
  investment: Investment,
  timeFrame: number,
  marketConditions: MarketConditions
): ROIProjection => {
  // Calculs complexes ROI spécifiques biodiversité
};

// ✅ Fichier séparé : src/utils/points/points-calculator.ts
export const calculatePointsForInvestment = (
  investment: Investment,
  userLevel: UserLevel
): PointsCalculation => {
  const basePoints = investment.amount;
  const levelMultiplier = getUserLevelMultiplier(userLevel);
  const bonusPoints = Math.floor(basePoints * levelMultiplier);
  
  return {
    basePoints,
    bonusPoints,
    totalPoints: basePoints + bonusPoints,
    calculatedAt: new Date()
  };
};

// ✅ Fichier séparé : src/utils/biodiversity/impact-calculator.ts
export const calculateBiodiversityImpact = (
  projectType: ProjectType,
  investmentAmount: number,
  timeFrame: number
): BiodiversityImpact => {
  // Calculs d'impact environnemental
};
```

#### **B. Validations spécialisées KYC et investissement**

```typescript
// ✅ Fichier séparé : src/utils/validation/kyc-validators.ts
export const validateInvestmentAmount = (
  amount: number,
  userLevel: UserLevel,
  kycStatus: KYCStatus
): ValidationResult => {
  const limits = getInvestmentLimits(userLevel, kycStatus);
  
  if (amount > limits.maximum) {
    return {
      isValid: false,
      error: 'KYC_UPGRADE_REQUIRED',
      suggestedAction: 'upgrade_kyc'
    };
  }
  
  return { isValid: true };
};

// ✅ Fichier séparé : src/utils/validation/investment-validators.ts
export const validateProjectInvestment = (
  project: Project,
  amount: number
): ValidationResult => {
  // Validation spécifique aux projets biodiversité
};
```

#### **C. Hooks métier complexes**

```typescript
// ✅ Fichier séparé : src/features/investments/hooks/use-investment-calculator.ts
export const useInvestmentCalculator = (projectId: string) => {
  const [amount, setAmount] = useState(0);
  const { data: project } = useProject(projectId);
  const { data: userLevel } = useUserLevel();
  
  const calculation = useMemo(() => {
    if (!project || !userLevel) return null;
    
    return {
      points: calculatePointsForInvestment({ amount, project }, userLevel),
      roi: calculateInvestmentROI(project, amount),
      impact: calculateBiodiversityImpact(project.type, amount)
    };
  }, [project, userLevel, amount]);
  
  return {
    amount,
    setAmount,
    calculation,
    isValid: amount >= project?.minimumInvestment
  };
};

// ✅ Fichier séparé : src/features/points/hooks/use-points-expiry.ts
export const usePointsExpiry = () => {
  const { data: expiringPoints } = useExpiringPoints();
  
  const urgentExpiry = useMemo(() => {
    const now = new Date();
    const in7Days = addDays(now, 7);
    
    return expiringPoints?.filter(points => 
      points.expiresAt <= in7Days
    ) ?? [];
  }, [expiringPoints]);
  
  // Notifications automatiques points expirants
  useEffect(() => {
    if (urgentExpiry.length > 0) {
      showExpiryNotification(urgentExpiry);
    }
  }, [urgentExpiry]);
  
  return {
    expiringPoints,
    urgentExpiry,
    totalExpiringAmount: urgentExpiry.reduce((sum, p) => sum + p.amount, 0)
  };
};
```

### **Règle #2 : Composants avec logique métier biodiversité**

**Créer un fichier séparé pour composants quand :**

- **+150 lignes de code**
- **Logique métier spécifique (calculs investissement, biodiversité)**
- **Réutilisé dans plusieurs contextes**
- **États internes complexes**

```typescript
// ✅ Fichier séparé : src/features/projects/components/project-investment-panel.tsx
export const ProjectInvestmentPanel: FC<ProjectInvestmentPanelProps> = ({ 
  project, 
  userLevel 
}) => {
  const [amount, setAmount] = useState(project.minimumInvestment);
  const [showKYCModal, setShowKYCModal] = useState(false);
  
  const { calculation, isValid } = useInvestmentCalculator(project.id);
  const createInvestment = useCreateInvestment();
  
  const handleInvest = async () => {
    // Validation KYC
    const kycValidation = validateInvestmentAmount(amount, userLevel);
    if (!kycValidation.isValid) {
      setShowKYCModal(true);
      return;
    }
    
    try {
      await createInvestment.mutateAsync({
        projectId: project.id,
        amount,
        pointsCalculation: calculation.points
      });
      
      // Navigation vers confirmation
      router.push(`/(authenticated)/investment/confirmation`);
    } catch (error) {
      // Gestion d'erreurs
    }
  };
  
  return (
    <View className="bg-white p-4 rounded-lg">
      {/* Interface d'investissement complexe */}
      <InvestmentAmountSelector 
        amount={amount}
        onAmountChange={setAmount}
        minimum={project.minimumInvestment}
        maximum={getMaxInvestmentForLevel(userLevel)}
      />
      
      <InvestmentPreview calculation={calculation} />
      
      <Button 
        variant="investment"
        onPress={handleInvest}
        disabled={!isValid || createInvestment.isPending}
      >
        {createInvestment.isPending ? t`Investing...` : t`Invest ${amount}€`}
      </Button>
      
      {showKYCModal && (
        <KYCUpgradeModal 
          currentLevel={userLevel}
          requiredLevel={kycValidation.requiredLevel}
          onClose={() => setShowKYCModal(false)}
        />
      )}
    </View>
  );
};
```

### **Règle #3 : Providers et contextes Make the CHANGE**

**Toujours fichier séparé pour :**

```typescript
// ✅ Fichier séparé : src/providers/investment-provider.tsx
export const InvestmentProvider: FC<PropsWithChildren> = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [investmentDraft, setInvestmentDraft] = useState<InvestmentDraft | null>(null);
  
  const contextValue = {
    selectedProject,
    setSelectedProject,
    investmentDraft,
    setInvestmentDraft,
    clearDraft: () => setInvestmentDraft(null)
  };
  
  return (
    <InvestmentContext.Provider value={contextValue}>
      {children}
    </InvestmentContext.Provider>
  );
};

export const useInvestmentContext = () => {
  const context = useContext(InvestmentContext);
  if (!context) {
    throw new Error('useInvestmentContext must be used within InvestmentProvider');
  }
  return context;
};
```

---

## 📦 **5. Patterns d'imports et exports**

### **Imports organization stricte Make the CHANGE**

**Ordre OBLIGATOIRE des imports :**

```typescript
// 1. React imports
import { type FC, useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

// 2. External libraries
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { t } from '@lingui/core/macro';
import { Link, useRouter } from 'expo-router';
import { cn } from '@/src/components/lib/cn';

// 3. Internal API imports (tRPC)
import { 
  useInvestments,
  useCreateInvestment,
  useCalculateROI 
} from '@/src/api/investments';
import { 
  useProjects,
  useNearbyProjects 
} from '@/src/api/projects';
import { 
  usePointsBalance,
  useExpiringPoints 
} from '@/src/api/points';

// 4. Internal components
import { Screen } from '@/src/components/ui/screen';
import { Button } from '@/src/components/ui/button';
import { ProjectCard } from '@/src/features/projects/components/project-card';

// 5. Utilities et helpers locaux
import { calculatePointsBonus } from '../utils/points-calculator';
import { formatBiodiversityImpact } from '../utils/impact-formatter';

// 6. Types séparés (TOUJOURS après)
import type { 
  Project, 
  Investment, 
  PointsCalculation,
  UserLevel 
} from '@/src/types';
```

### **Exports patterns Make the CHANGE**

#### **Named exports (Features et Utils)**

```typescript
// ✅ Features - TOUJOURS named export
export const ProjectCard: FC<ProjectCardProps> = () => {
  /* ... */
};

export const InvestmentForm: FC<InvestmentFormProps> = () => {
  /* ... */
};

export const useInvestmentCalculator = () => {
  /* ... */
};

// ✅ Utilitaires métier
export const calculateROI = (investment: Investment) => {};
export const formatBiodiversityImpact = (impact: BiodiversityMetrics) => {};
export const validateKYCLevel = (amount: number, level: UserLevel) => {};

// ✅ Types exportés après les composants
export type ProjectCardProps = {
  /* ... */
};
export type InvestmentCalculation = {
  /* ... */
};
```

#### **Default exports (Pages/Écrans uniquement)**

```typescript
// ✅ Pages Expo Router - TOUJOURS default export
const ProjectDetailsScreen: FC = () => {
  /* ... */
};
export default ProjectDetailsScreen;

const InvestmentScreen: FC = () => {
  /* ... */
};
export default InvestmentScreen;
```

---

## 📂 **6. Conventions de nommage Make the CHANGE**

### **Fichiers**

- **Pages/Écrans** : `kebab-case.tsx` (`project-details.tsx`, `investment-form.tsx`)
- **Composants** : `kebab-case.tsx` (`project-card.tsx`, `points-display.tsx`)
- **Hooks** : `kebab-case.ts` avec préfixe `use-` (`use-investments.ts`, `use-points-calculator.ts`)
- **Utilities** : `kebab-case.ts` descriptif métier (`roi-calculator.ts`, `biodiversity-formatter.ts`)
- **Types** : `kebab-case.ts` avec contexte (`investment-types.ts`, `biodiversity-types.ts`)

### **Dossiers**

- **Features** : `kebab-case` métier (`investments`, `projects`, `points`, `marketplace`)
- **API** : `single-word` (`investments`, `projects`, `points`, `users`)
- **Components** : Hiérarchie claire (`ui`, `biodiversity`, `investment`)

### **Variables et fonctions**

- **Composants** : `PascalCase` (`ProjectCard`, `InvestmentForm`, `PointsDisplay`)
- **Fonctions** : `camelCase` métier (`calculateROI`, `formatBiodiversityImpact`)
- **Variables** : `camelCase` (`userInvestments`, `pointsBalance`, `selectedProject`)
- **Constantes** : `UPPER_SNAKE_CASE` (`USER_LEVELS`, `INVESTMENT_TYPES`, `KYC_THRESHOLDS`)

### **Types TypeScript**

- **Props** : `PascalCase` avec suffixe `Props` (`ProjectCardProps`)
- **API Responses** : `PascalCase` avec suffixe (`InvestmentResponse`, `ProjectsResponse`)
- **Enums/Types** : `PascalCase` métier (`UserLevel`, `ProjectType`, `InvestmentStatus`)

```typescript
// ✅ Nommage TypeScript cohérent Make the CHANGE
type ProjectCardProps = {
  project: Project;
  userLevel: UserLevel;
};

interface InvestmentCalculationResponse {
  basePoints: number;
  bonusPoints: number;
  totalPoints: number;
  expectedROI: number;
  biodiversityImpact: BiodiversityMetrics;
}

enum UserLevel {
  EXPLORER = 'explorer',
  PROTECTOR = 'protector',
  AMBASSADOR = 'ambassador'
}

enum ProjectType {
  BEEHIVE = 'beehive',
  OLIVE_GROVE = 'olive_grove',
  FOREST_RESTORATION = 'forest_restoration'
}
```

---

# 🎨 PARTIE II - PATTERNS DE STYLING

## 🎨 **1. Patterns de styling avec NativeWind**

### **Classes Tailwind Make the CHANGE**

```typescript
// ✅ Pattern de styling cohérent Make the CHANGE
export const ProjectCard: FC<ProjectCardProps> = ({ project }) => (
  <View className="bg-white rounded-xl p-4 mb-4 shadow-md border border-gray-100">
    {/* Header avec status biodiversité */}
    <View className="flex-row justify-between items-center mb-3">
      <Text className="font-bold text-lg text-gray-900">
        {project.name}
      </Text>
      <BiodiversityBadge type={project.type} />
    </View>
    
    {/* Métriques d'impact */}
    <View className="bg-green-50 p-3 rounded-lg mb-3">
      <Text className="text-green-800 font-medium text-sm">
        Impact: {formatBiodiversityImpact(project.impact)}
      </Text>
    </View>
    
    {/* Informations financières */}
    <View className="flex-row justify-between items-center">
      <Text className="text-gray-600 text-sm">
        Min. {formatCurrency(project.minimumInvestment)}
      </Text>
      <Text className="text-primary font-semibold">
        ROI: {project.expectedROI}%
      </Text>
    </View>
  </View>
);
```

### **Design System Colors Make the CHANGE**

```typescript
// Configuration Tailwind personnalisée Make the CHANGE
export const colors = {
  // Couleurs brand principales
  primary: '#059669',        // Vert Make the CHANGE
  secondary: '#D97706',      // Doré/miel
  
  // Couleurs contextuelles biodiversité
  'biodiversity-green': '#10B981',
  'investment-blue': '#3B82F6', 
  'points-gold': '#F59E0B',
  'impact-emerald': '#059669',
  
  // États système
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Niveaux utilisateur
  'explorer-blue': '#60A5FA',
  'protector-green': '#34D399',
  'ambassador-gold': '#FBBF24'
};
```

### **Conditional styling avec cn() Make the CHANGE**

```typescript
// ✅ Pattern observé avec cn() utility contextualisé
import { cn } from '@/src/components/lib/cn';

const UserLevelBadge: FC<{ level: UserLevel }> = ({ level }) => (
  <View className={cn(
    'px-3 py-1 rounded-full border',
    // Styles par niveau utilisateur
    level === 'explorer' && 'bg-blue-100 border-blue-300',
    level === 'protector' && 'bg-green-100 border-green-300', 
    level === 'ambassador' && 'bg-yellow-100 border-yellow-300'
  )}>
    <Text className={cn(
      'text-xs font-medium',
      level === 'explorer' && 'text-blue-800',
      level === 'protector' && 'text-green-800',
      level === 'ambassador' && 'text-yellow-800'
    )}>
      {level.toUpperCase()}
    </Text>
  </View>
);

const ProjectStatusIndicator: FC<{ status: ProjectStatus }> = ({ status }) => (
  <View className={cn(
    'w-3 h-3 rounded-full',
    status === 'active' && 'bg-green-500',
    status === 'funding' && 'bg-blue-500',
    status === 'funded' && 'bg-yellow-500',
    status === 'completed' && 'bg-gray-500'
  )} />
);
```

---

# 🔄 PARTIE III - PATTERNS DE GESTION D'ÉTAT

## 🔄 **1. Patterns TanStack Query pour Make the CHANGE**

### **Structure des hooks API métier**

```typescript
// ✅ Hook API investissements Make the CHANGE
export const useInvestments = (filters?: InvestmentFilters) => {
  return useQuery({
    queryKey: ['investments', 'user', filters],
    queryFn: () => trpc.investments.getUserInvestments.query(filters),
    staleTime: 2 * 60 * 1000,  // 2 minutes pour données financières
    refetchOnWindowFocus: true,
    select: (data) => {
      // Transformation des données avec calculs de performance
      return data.map(investment => ({
        ...investment,
        currentROI: calculateCurrentROI(investment),
        pointsEarned: calculateTotalPoints(investment),
        biodiversityImpact: calculateCumulativeImpact(investment)
      }));
    }
  });
};

// ✅ Hook API projets avec géolocalisation - Arrow function directe
export const useNearbyProjects = (location?: GeoLocation) => useQuery({
    queryKey: ['projects', 'nearby', location],
    queryFn: () => trpc.projects.getNearbyProjects.query({ 
      location, 
      radius: 50 // 50km par défaut
    }),
    staleTime: 5 * 60 * 1000,   // 5 minutes pour projets
    enabled: !!location,
    select: (data) => {
      // Tri par distance et score biodiversité
      return data
        .sort((a, b) => a.distance - b.distance)
        .map(project => ({
          ...project,
          investmentOpportunityScore: calculateOpportunityScore(project)
        }));
    }
  });

// ✅ Hook API points avec gestion expiration
export const usePointsBalance = () => {
  return useQuery({
    queryKey: ['points', 'balance'],
    queryFn: () => trpc.points.getBalance.query(),
    staleTime: 1 * 60 * 1000,   // 1 minute pour points (données critiques)
    refetchInterval: 5 * 60 * 1000, // Refresh auto toutes les 5min
    select: (data) => {
      const now = new Date();
      return {
        ...data,
        expiringPoints: data.expiringPoints.filter(p => p.expiresAt > now),
        urgentExpiringPoints: data.expiringPoints.filter(p => 
          differenceInDays(p.expiresAt, now) <= 7
        )
      };
    }
  });
};
```

### **Mutations avec gestion d'erreurs Make the CHANGE**

```typescript
// ✅ Mutation création d'investissement avec logique métier
export const useCreateInvestment = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: async (request: CreateInvestmentRequest) => {
      // Validation pré-mutation
      const validation = await validateInvestmentRequest(request);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }
      
      return trpc.investments.create.mutate(request);
    },
    
    onSuccess: (investment, variables) => {
      // 1. Invalidation des queries liées
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      queryClient.invalidateQueries({ queryKey: ['points'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
      
      // 2. Mise à jour optimiste du portfolio
      queryClient.setQueryData(['investments', 'user'], (old: Investment[] | undefined) => {
        if (!old) return [investment];
        return [...old, investment];
      });
      
      // 3. Notification de succès avec contexte métier
      toast.success(
        t`Investment successful! You invested ${variables.amount}€ and earned ${investment.pointsEarned} points.`
      );
      
      // 4. Navigation vers confirmation
      router.push(`/(authenticated)/investment/confirmation?id=${investment.id}`);
      
      // 5. Analytics tracking
      analytics.track('investment_created', {
        projectType: variables.projectType,
        amount: variables.amount,
        userLevel: variables.userLevel,
        pointsEarned: investment.pointsEarned
      });
    },
    
    onError: (error, variables) => {
      // Gestion d'erreurs spécialisées Make the CHANGE
      if (error.message.includes('KYC_REQUIRED')) {
        toast.error(t`KYC verification required for this investment amount`);
        router.push('/(authenticated)/profile/kyc');
        return;
      }
      
      if (error.message.includes('INSUFFICIENT_FUNDS')) {
        toast.error(t`Insufficient funds. Please add payment method.`);
        return;
      }
      
      if (error.message.includes('PROJECT_FULL')) {
        // Invalider la query projet pour refresh du statut
        queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
        toast.error(t`This project has reached its funding goal`);
        return;
      }
      
      // Erreur générique
      toast.error(t`Investment failed. Please try again.`);
      console.error('Investment creation failed:', error);
    }
  });
};

// ✅ Mutation utilisation de points marketplace
export const usePointsPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: PointsPaymentRequest) => {
      return trpc.points.usePoints.mutate(request);
    },
    
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['points', 'balance'] });
      
      // Snapshot previous value
      const previousPoints = queryClient.getQueryData(['points', 'balance']);
      
      // Optimistically update balance
      queryClient.setQueryData(['points', 'balance'], (old: PointsBalance | undefined) => {
        if (!old) return old;
        return {
          ...old,
          availablePoints: old.availablePoints - variables.pointsAmount
        };
      });
      
      return { previousPoints };
    },
    
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['points', 'balance'], context?.previousPoints);
      toast.error(t`Payment failed. Your points have been restored.`);
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['points'] });
    }
  });
};
```

### **Query Options et cache strategies Make the CHANGE**

```typescript
// ✅ Stratégies de cache adaptées aux données métier
export const QueryStrategies = {
  // Données financières critiques - Cache court
  investments: {
    staleTime: 2 * 60 * 1000,    // 2 minutes
    cacheTime: 10 * 60 * 1000,   // 10 minutes
    refetchOnWindowFocus: true,
    refetchInterval: false        // Pas de polling automatique
  },
  
  // Points - Très critiques, refresh fréquent
  points: {
    staleTime: 1 * 60 * 1000,    // 1 minute
    cacheTime: 5 * 60 * 1000,    // 5 minutes cache
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 60 * 1000 // Refresh toutes les 5min
  },
  
  // Projets - Cache plus long, données moins volatiles
  projects: {
    staleTime: 10 * 60 * 1000,   // 10 minutes
    cacheTime: 30 * 60 * 1000,   // 30 minutes cache
    refetchOnWindowFocus: false,
    refetchInterval: false
  },
  
  // Marketplace - Cache moyen
  marketplace: {
    staleTime: 5 * 60 * 1000,    // 5 minutes
    cacheTime: 15 * 60 * 1000,   // 15 minutes cache
    refetchOnWindowFocus: false,
    refetchInterval: false
  },
  
  // Profil utilisateur - Cache long
  profile: {
    staleTime: 30 * 60 * 1000,   // 30 minutes
    cacheTime: 60 * 60 * 1000,   // 1 heure cache
    refetchOnWindowFocus: false,
    refetchInterval: false
  }
};
```

---

# 📝 PARTIE IV - GESTION DE FORMULAIRES AVEC TANSTACK FORM

## 📝 **1. TanStack Form - Gestion de formulaires Make the CHANGE**

### **Installation et configuration**

```bash
# Installation TanStack Form avec validation Zod
npm install @tanstack/react-form zod
```

### **Pattern de base TanStack Form**

```typescript
// ✅ Formulaire d'investissement avec TanStack Form + Zod
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';

// Schema de validation Zod Make the CHANGE
const investmentSchema = z.object({
  amount: z.number()
    .min(50, t`Minimum investment is €50`)
    .max(10000, t`Maximum investment is €10,000`),
  projectId: z.string().min(1, t`Please select a project`),
  acceptTerms: z.boolean().refine(val => val === true, t`You must accept the terms`),
  paymentMethod: z.enum(['card', 'bank_transfer', 'points'], {
    errorMap: () => ({ message: t`Please select a payment method` })
  })
});

type InvestmentFormData = z.infer<typeof investmentSchema>;

// ✅ Hook formulaire avec TanStack Form
export const InvestmentForm: FC<InvestmentFormProps> = ({ 
  project, 
  onSubmit, 
  initialAmount = project.minimumInvestment 
}) => {
  const createInvestment = useCreateInvestment();
  
  const form = useForm({
    defaultValues: {
      amount: initialAmount,
      projectId: project.id,
      acceptTerms: false,
      paymentMethod: 'card' as const
    },
    validatorAdapter: zodValidator,
    validators: {
      onChange: investmentSchema
    },
    onSubmit: async ({ value }) => {
      try {
        await createInvestment.mutateAsync(value);
        onSubmit?.(value);
      } catch (error) {
        // Gestion d'erreurs
        console.error('Investment failed:', error);
      }
    }
  });

  return (
    <View className="bg-white p-4 rounded-lg">
      <Text className="text-lg font-bold mb-4 text-gray-900">
        {t`Invest in ${project.name}`}
      </Text>
      
      {/* Champ montant */}
      <form.Field name="amount">
        {(field) => (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              {t`Investment Amount`}
            </Text>
            <TextInput
              className={cn(
                'border rounded-lg px-3 py-2 text-base',
                field.state.meta.errors.length > 0 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 bg-white'
              )}
              value={field.state.value?.toString() ?? ''}
              onChangeText={(text) => field.handleChange(Number(text) || 0)}
              onBlur={field.handleBlur}
              placeholder={t`Enter amount in €`}
              keyboardType="numeric"
            />
            {field.state.meta.errors.map((error) => (
              <Text key={error} className="text-red-600 text-sm mt-1">
                {error}
              </Text>
            ))}
          </View>
        )}
      </form.Field>

      {/* Méthode de paiement */}
      <form.Field name="paymentMethod">
        {(field) => (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              {t`Payment Method`}
            </Text>
            {['card', 'bank_transfer', 'points'].map((method) => (
              <TouchableOpacity
                key={method}
                onPress={() => field.handleChange(method as any)}
                className="flex-row items-center py-2"
              >
                <View className={cn(
                  'w-4 h-4 rounded-full border-2 mr-3',
                  field.state.value === method 
                    ? 'border-primary bg-primary' 
                    : 'border-gray-300'
                )} />
                <Text className="text-gray-900">
                  {method === 'card' && t`Credit Card`}
                  {method === 'bank_transfer' && t`Bank Transfer`}
                  {method === 'points' && t`Use Points`}
                </Text>
              </TouchableOpacity>
            ))}
            {field.state.meta.errors.map((error) => (
              <Text key={error} className="text-red-600 text-sm mt-1">
                {error}
              </Text>
            ))}
          </View>
        )}
      </form.Field>

      {/* Conditions */}
      <form.Field name="acceptTerms">
        {(field) => (
          <View className="mb-6">
            <TouchableOpacity
              onPress={() => field.handleChange(!field.state.value)}
              className="flex-row items-center"
            >
              <View className={cn(
                'w-5 h-5 border-2 rounded mr-3 items-center justify-center',
                field.state.value 
                  ? 'border-primary bg-primary' 
                  : 'border-gray-300'
              )}>
                {field.state.value && (
                  <CheckIcon className="w-3 h-3 text-white" />
                )}
              </View>
              <Text className="text-gray-700 flex-1">
                {t`I accept the terms and conditions`}
              </Text>
            </TouchableOpacity>
            {field.state.meta.errors.map((error) => (
              <Text key={error} className="text-red-600 text-sm mt-1">
                {error}
              </Text>
            ))}
          </View>
        )}
      </form.Field>

      {/* Submit */}
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            onPress={form.handleSubmit}
            disabled={!canSubmit || isSubmitting}
            variant="investment"
            className="w-full"
          >
            {isSubmitting 
              ? t`Processing...` 
              : t`Invest €${form.getFieldValue('amount')}`
            }
          </Button>
        )}
      </form.Subscribe>
    </View>
  );
};
```

### **Patterns avancés TanStack Form Make the CHANGE**

```typescript
// ✅ Formulaire avec validation conditionnelle
export const KYCUpgradeForm: FC<KYCUpgradeFormProps> = ({ currentLevel, onSubmit }) => {
  const form = useForm({
    defaultValues: {
      documentType: '',
      documentNumber: '',
      birthDate: '',
      address: '',
      investmentGoal: '',
      riskTolerance: 'medium' as const
    },
    validatorAdapter: zodValidator,
    validators: {
      onChange: z.object({
        documentType: z.enum(['passport', 'id_card', 'driving_license']),
        documentNumber: z.string().min(5, t`Document number is required`),
        birthDate: z.string().refine(date => {
          const age = new Date().getFullYear() - new Date(date).getFullYear();
          return age >= 18;
        }, t`You must be at least 18 years old`),
        address: z.string().min(10, t`Please provide your full address`),
        investmentGoal: z.string().min(1, t`Please specify your investment goal`),
        riskTolerance: z.enum(['low', 'medium', 'high'])
      })
    }
  });

  return (
    <Screen.ScrollView>
      <Screen.Content>
        <Text className="text-2xl font-bold mb-6 text-gray-900">
          {t`Upgrade to ${getNextLevel(currentLevel)}`}
        </Text>

        {/* Document Type */}
        <form.Field name="documentType">
          {(field) => (
            <FormField
              label={t`Document Type`}
              error={field.state.meta.errors[0]}
            >
              <Picker
                selectedValue={field.state.value}
                onValueChange={field.handleChange}
                className="border border-gray-300 rounded-lg"
              >
                <Picker.Item label={t`Select document type`} value="" />
                <Picker.Item label={t`Passport`} value="passport" />
                <Picker.Item label={t`ID Card`} value="id_card" />
                <Picker.Item label={t`Driving License`} value="driving_license" />
              </Picker>
            </FormField>
          )}
        </form.Field>

        {/* Validation dynamique selon le niveau */}
        {currentLevel === 'explorer' && (
          <form.Field name="investmentGoal">
            {(field) => (
              <FormField
                label={t`Investment Goal`}
                error={field.state.meta.errors[0]}
              >
                <TextInput
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  placeholder={t`Describe your investment goals`}
                  multiline
                  numberOfLines={3}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
              </FormField>
            )}
          </form.Field>
        )}

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              onPress={form.handleSubmit}
              disabled={!canSubmit || isSubmitting}
              variant="primary"
              className="mt-6"
            >
              {isSubmitting ? t`Submitting...` : t`Submit KYC Documents`}
            </Button>
          )}
        </form.Subscribe>
      </Screen.Content>
    </Screen.ScrollView>
  );
};

// ✅ Composant FormField réutilisable
const FormField: FC<{
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}> = ({ label, error, children, required }) => (
  <View className="mb-4">
    <Text className="text-sm font-medium text-gray-700 mb-2">
      {label}
      {required && <Text className="text-red-500"> *</Text>}
    </Text>
    {children}
    {error && (
      <Text className="text-red-600 text-sm mt-1">
        {error}
      </Text>
    )}
  </View>
);
```

### **Intégration avec tRPC et mutations**

```typescript
// ✅ Hook formulaire avec mutation tRPC
export const useInvestmentForm = (project: Project) => {
  const createInvestment = useCreateInvestment();
  const { data: userLevel } = useUserLevel();
  const { data: pointsBalance } = usePointsBalance();
  
  const form = useForm({
    defaultValues: {
      amount: project.minimumInvestment,
      projectId: project.id,
      paymentMethod: 'card' as const,
      usePoints: false,
      pointsAmount: 0
    },
    validatorAdapter: zodValidator,
    validators: {
      onChange: z.object({
        amount: z.number()
          .min(project.minimumInvestment)
          .max(getMaxInvestmentForLevel(userLevel)),
        projectId: z.string(),
        paymentMethod: z.enum(['card', 'bank_transfer', 'points']),
        usePoints: z.boolean(),
        pointsAmount: z.number().optional()
      }).refine((data) => {
        // Validation conditionnelle points
        if (data.usePoints && data.pointsAmount! > (pointsBalance?.available ?? 0)) {
          return false;
        }
        return true;
      }, {
        message: t`Insufficient points balance`,
        path: ['pointsAmount']
      })
    },
    onSubmit: async ({ value }) => {
      try {
        const investment = await createInvestment.mutateAsync(value);
        
        // Navigation après succès
        router.push(`/(authenticated)/investment/confirmation?id=${investment.id}`);
        
        // Analytics
        analytics.track('investment_created', {
          amount: value.amount,
          projectType: project.type,
          paymentMethod: value.paymentMethod
        });
      } catch (error) {
        // Gestion d'erreurs avec toast
        if (error.message.includes('KYC_REQUIRED')) {
          toast.error(t`KYC verification required`);
          router.push('/(authenticated)/profile/kyc');
        } else {
          toast.error(t`Investment failed. Please try again.`);
        }
      }
    }
  });

  return {
    form,
    isLoading: createInvestment.isPending,
    canInvest: form.state.canSubmit && !createInvestment.isPending
  };
};
```

---

# 🧩 PARTIE V - PATTERNS SPÉCIALISÉS MAKE THE CHANGE

## 💰 **1. Patterns d'investissement et calculs**

### **Calculateur d'investissement avancé**

```typescript
// ✅ Hook calculateur avec logique métier complète
export const useInvestmentCalculator = (projectId: string) => {
  const [amount, setAmount] = useState(0);
  const [timeframe, setTimeframe] = useState(12); // mois
  
  const { data: project } = useProject(projectId);
  const { data: userLevel } = useUserLevel();
  const { data: marketConditions } = useMarketConditions();
  
  const calculations = useMemo(() => {
    if (!project || !userLevel || amount === 0) return null;
    
    // Calcul des points avec bonus niveau
    const pointsCalculation = calculatePointsForInvestment(
      { amount, projectType: project.type },
      userLevel
    );
    
    // Projection ROI avec conditions marché
    const roiProjection = calculateROIProjection({
      projectType: project.type,
      amount,
      timeframe,
      marketConditions,
      historicalPerformance: project.historicalROI
    });
    
    // Impact biodiversité calculé
    const biodiversityImpact = calculateBiodiversityImpact(
      project.type,
      amount,
      timeframe
    );
    
    // Score risque
    const riskAssessment = calculateRiskScore({
      projectType: project.type,
      partnerRating: project.partner.rating,
      marketConditions,
      amount
    });
    
    return {
      points: pointsCalculation,
      roi: roiProjection,
      impact: biodiversityImpact,
      risk: riskAssessment,
      isViable: roiProjection.expectedReturn > 0 && riskAssessment.score < 0.7
    };
  }, [project, userLevel, amount, timeframe, marketConditions]);
  
  const validation = useMemo(() => {
    if (!project) return { isValid: false };
    
    const kyc = validateKYCForAmount(amount, userLevel);
    const projectCapacity = amount <= (project.fundingGoal - project.currentFunding);
    const minimumMet = amount >= project.minimumInvestment;
    
    return {
      isValid: kyc.isValid && projectCapacity && minimumMet,
      errors: {
        kyc: kyc.isValid ? null : kyc.error,
        capacity: projectCapacity ? null : 'PROJECT_CAPACITY_EXCEEDED',
        minimum: minimumMet ? null : 'MINIMUM_NOT_MET'
      }
    };
  }, [amount, project, userLevel]);
  
  return {
    amount,
    setAmount,
    timeframe,
    setTimeframe,
    calculations,
    validation,
    canInvest: validation.isValid && calculations?.isViable
  };
};
```

### **Gestion du portfolio utilisateur**

```typescript
// ✅ Hook portfolio avec métriques avancées
export const usePortfolioAnalytics = () => {
  const { data: investments } = useInvestments();
  const { data: marketData } = useMarketData();
  
  const analytics = useMemo(() => {
    if (!investments || !marketData) return null;
    
    // Calculs de performance globale
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalValue = investments.reduce((sum, inv) => sum + calculateCurrentValue(inv, marketData), 0);
    const totalROI = ((totalValue - totalInvested) / totalInvested) * 100;
    
    // Diversification par type de projet
    const diversification = investments.reduce((acc, inv) => {
      acc[inv.projectType] = (acc[inv.projectType] || 0) + inv.amount;
      return acc;
    }, {} as Record<ProjectType, number>);
    
    // Impact biodiversité cumulé
    const cumulativeImpact = investments.reduce((acc, inv) => ({
      co2Saved: acc.co2Saved + calculateCO2Impact(inv),
      biodiversityScore: acc.biodiversityScore + calculateBiodiversityScore(inv),
      ecosystemsSupported: acc.ecosystemsSupported + 1
    }), { co2Saved: 0, biodiversityScore: 0, ecosystemsSupported: 0 });
    
    // Projections futures
    const futureProjections = calculateFutureProjections(investments, marketData);
    
    return {
      overview: {
        totalInvested,
        currentValue: totalValue,
        totalROI,
        totalGainLoss: totalValue - totalInvested
      },
      diversification,
      impact: cumulativeImpact,
      projections: futureProjections,
      riskProfile: calculatePortfolioRisk(investments)
    };
  }, [investments, marketData]);
  
  return {
    analytics,
    isLoading: !investments || !marketData
  };
};
```

## 🏆 **2. Système de points et niveaux**

### **Gestion avancée des points**

```typescript
// ✅ Hook points avec logique métier complète
export const usePointsManagement = () => {
  const { data: balance } = usePointsBalance();
  const { data: history } = usePointsHistory();
  const { data: userLevel } = useUserLevel();
  
  const pointsState = useMemo(() => {
    if (!balance) return null;
    
    const now = new Date();
    
    // Points expirant par urgence
    const expiringIn7Days = balance.expiringPoints.filter(p => 
      differenceInDays(p.expiresAt, now) <= 7
    );
    const expiringIn30Days = balance.expiringPoints.filter(p => 
      differenceInDays(p.expiresAt, now) <= 30
    );
    
    // Calcul du potentiel de gain mensuel
    const monthlyEarningPotential = calculateMonthlyEarningPotential(userLevel);
    
    // Analyse de dépenses recommandée
    const spendingRecommendation = calculateOptimalSpending({
      availablePoints: balance.availablePoints,
      expiringPoints: expiringIn30Days,
      monthlyEarning: monthlyEarningPotential
    });
    
    return {
      current: balance,
      expiry: {
        urgent: expiringIn7Days,
        upcoming: expiringIn30Days,
        totalExpiringValue: expiringIn30Days.reduce((sum, p) => sum + p.amount, 0)
      },
      projections: {
        monthlyPotential: monthlyEarningPotential,
        nextLevelPoints: calculatePointsToNextLevel(balance.totalEarned, userLevel)
      },
      recommendations: spendingRecommendation
    };
  }, [balance, userLevel]);
  
  // Notifications automatiques
  useEffect(() => {
    if (pointsState?.expiry.urgent.length > 0) {
      scheduleExpiryNotifications(pointsState.expiry.urgent);
    }
  }, [pointsState?.expiry.urgent]);
  
  return {
    pointsState,
    levelProgress: calculateLevelProgress(balance?.totalEarned, userLevel),
    canUpgradeLevel: canUpgradeToNextLevel(balance?.totalEarned, userLevel)
  };
};

// ✅ Calculateur progression de niveau
export const calculateLevelProgress = (
  totalPoints: number = 0,
  currentLevel: UserLevel
): LevelProgress => {
  const thresholds = {
    explorer: { min: 0, max: 1000 },
    protector: { min: 1000, max: 5000 },
    ambassador: { min: 5000, max: Infinity }
  };
  
  const current = thresholds[currentLevel];
  const progress = Math.min((totalPoints - current.min) / (current.max - current.min), 1);
  
  return {
    currentLevel,
    totalPoints,
    progress: progress * 100,
    pointsInLevel: totalPoints - current.min,
    pointsToNext: current.max === Infinity ? 0 : current.max - totalPoints,
    canUpgrade: totalPoints >= current.max && current.max !== Infinity
  };
};
```

### **Système de notifications points**

```typescript
// ✅ Hook notifications points avec scheduling
export const usePointsNotifications = () => {
  const { data: expiringPoints } = useExpiringPoints();
  
  const scheduleNotifications = useCallback(async (points: ExpiringPoint[]) => {
    for (const point of points) {
      const daysToExpiry = differenceInDays(point.expiresAt, new Date());
      
      // Notification 7 jours avant
      if (daysToExpiry === 7) {
        await scheduleNotification({
          id: `points-expiry-7d-${point.id}`,
          title: t`Points Expiring Soon!`,
          body: t`${point.amount} points expire in 7 days. Use them now!`,
          trigger: { date: subDays(point.expiresAt, 7) },
          data: { type: 'points_expiry', pointId: point.id }
        });
      }
      
      // Notification 1 jour avant
      if (daysToExpiry === 1) {
        await scheduleNotification({
          id: `points-expiry-1d-${point.id}`,
          title: t`Points Expire Tomorrow!`,
          body: t`${point.amount} points expire tomorrow. Don't lose them!`,
          trigger: { date: subDays(point.expiresAt, 1) },
          data: { type: 'points_expiry_urgent', pointId: point.id }
        });
      }
    }
  }, []);
  
  useEffect(() => {
    if (expiringPoints) {
      scheduleNotifications(expiringPoints);
    }
  }, [expiringPoints, scheduleNotifications]);
};
```

## 🌱 **3. Patterns biodiversité et impact**

### **Calculateur d'impact environnemental**

```typescript
// ✅ Utilitaire calcul impact biodiversité
export const calculateBiodiversityImpact = (
  projectType: ProjectType,
  investmentAmount: number,
  timeframe: number = 12
): BiodiversityImpact => {
  const baseRates = {
    beehive: {
      co2PerEur: 0.5,          // kg CO2 sauvé par euro investi
      pollinationArea: 3,       // km² zone de pollinisation par euro
      speciesSupported: 0.1     // espèces supportées par euro
    },
    olive_grove: {
      co2PerEur: 0.8,
      soilRegenerationArea: 0.5,
      carbonSequestration: 1.2
    },
    forest_restoration: {
      co2PerEur: 1.5,
      treesPlanted: 0.2,
      habitatRestored: 0.3
    }
  };
  
  const rates = baseRates[projectType];
  const timeMultiplier = Math.sqrt(timeframe / 12); // Effet non-linéaire dans le temps
  
  switch (projectType) {
    case 'beehive':
      return {
        co2Saved: investmentAmount * rates.co2PerEur * timeMultiplier,
        pollinationAreaSupported: investmentAmount * rates.pollinationArea,
        speciesSupported: Math.floor(investmentAmount * rates.speciesSupported),
        ecosystemHealthScore: calculateEcosystemScore('pollination', investmentAmount)
      };
      
    case 'olive_grove':
      return {
        co2Saved: investmentAmount * rates.co2PerEur * timeMultiplier,
        soilRegenerationArea: investmentAmount * rates.soilRegenerationArea,
        carbonSequestered: investmentAmount * rates.carbonSequestration * timeMultiplier,
        ecosystemHealthScore: calculateEcosystemScore('agriculture', investmentAmount)
      };
      
    case 'forest_restoration':
      return {
        co2Saved: investmentAmount * rates.co2PerEur * timeMultiplier,
        treesPlanted: Math.floor(investmentAmount * rates.treesPlanted),
        habitatRestored: investmentAmount * rates.habitatRestored,
        ecosystemHealthScore: calculateEcosystemScore('forest', investmentAmount)
      };
      
    default:
      return defaultImpact();
  }
};

// ✅ Hook impact cumulé utilisateur
export const useCumulativeBiodiversityImpact = () => {
  const { data: investments } = useInvestments();
  
  const cumulativeImpact = useMemo(() => {
    if (!investments) return null;
    
    const totalImpact = investments.reduce((acc, investment) => {
      const impact = calculateBiodiversityImpact(
        investment.projectType,
        investment.amount,
        differenceInMonths(new Date(), investment.createdAt)
      );
      
      return {
        totalCO2Saved: acc.totalCO2Saved + impact.co2Saved,
        totalAreaSupported: acc.totalAreaSupported + (impact.pollinationAreaSupported || impact.soilRegenerationArea || impact.habitatRestored || 0),
        totalSpeciesSupported: acc.totalSpeciesSupported + (impact.speciesSupported || 0),
        averageEcosystemScore: (acc.averageEcosystemScore + impact.ecosystemHealthScore) / 2,
        projectsSupported: acc.projectsSupported + 1
      };
    }, {
      totalCO2Saved: 0,
      totalAreaSupported: 0,
      totalSpeciesSupported: 0,
      averageEcosystemScore: 0,
      projectsSupported: 0
    });
    
    return {
      ...totalImpact,
      impactRank: calculateImpactRank(totalImpact),
      nextMilestone: getNextImpactMilestone(totalImpact)
    };
  }, [investments]);
  
  return cumulativeImpact;
};
```

---

# ✅ PARTIE V - CHECKLIST DE CONFORMITÉ MAKE THE CHANGE

## ✅ **1. Checklist de conformité développement**

### **Avant de créer un nouveau fichier :**

- [ ] Le nom respecte les conventions kebab-case métier
- [ ] Les imports sont organisés dans l'ordre correct
- [ ] Les types sont importés séparément avec `type`
- [ ] Le composant utilise `FC` avec props typées spécifiques métier
- [ ] Les styles utilisent NativeWind avec classes Make the CHANGE
- [ ] Les textes utilisent les macros Lingui avec contexte biodiversité
- [ ] L'export suit la convention (named/default)
- [ ] La logique métier (calculs, validations) est séparée

### **Pour les écrans Make the CHANGE :**

- [ ] Utilise la structure `Screen.Layout` + `Screen.Header`
- [ ] Title traduit avec macro `t` contextualisé
- [ ] Export par défaut pour Expo Router
- [ ] Nom en PascalCase métier (`InvestmentScreen`, `ProjectDetailsScreen`)
- [ ] Gestion des états loading/error appropriée
- [ ] Navigation cohérente avec le flow utilisateur

### **Pour les composants métier :**

- [ ] Export nommé descriptif (`ProjectCard`, `InvestmentForm`)
- [ ] Props destructurées avec types métier
- [ ] Logique de calcul externalisée dans utils/hooks
- [ ] Gestion d'états appropriée (loading, error, success)
- [ ] Accessibilité (labels, touch targets, contraste)

### **Pour les hooks tRPC :**

- [ ] Query keys cohérents et hiérarchiques
- [ ] Gestion d'erreurs avec toast notifications contextuelles
- [ ] Types d'interface stricts (request/response)
- [ ] Invalidation cache appropriée
- [ ] Stratégies de cache adaptées au type de données
- [ ] Transformations de données dans `select` si nécessaire

### **Pour les utilitaires métier :**

- [ ] Pure functions sans side effects
- [ ] Tests unitaires pour logique critique (calculs ROI, points)
- [ ] Documentation JSDoc pour fonctions complexes
- [ ] Gestion d'erreurs avec types d'erreur spécifiques
- [ ] Types de retour explicites et stricts

### **Pour la logique biodiversité :**

- [ ] Calculs d'impact basés sur données scientifiques
- [ ] Validation des montants selon niveaux KYC
- [ ] Prise en compte des conditions de marché
- [ ] Gestion de la temporalité (projections dans le temps)
- [ ] Intégration avec données partenaires (HABEEBEE, ILANGA)

---

## 🎯 Points forts de l'architecture Make the CHANGE - Version 2024

✅ **Type Safety End-to-End** : tRPC + TypeScript strict + Zod validation  
✅ **TanStack Form** : Gestion de formulaires moderne avec validation Zod intégrée  
✅ **Screen Component Avancé** : Layout complet avec états (loading, error) et navigation  
✅ **Convention Arrow Function** : Directe quand possible, avec return si nécessaire  
✅ **Métier-Driven** : Patterns adaptés biodiversité, investissements, points  
✅ **Performance Optimisée** : TanStack Query + cache strategies + optimistic updates  
✅ **Scalabilité** : Architecture modulaire + monorepo + feature-first  
✅ **User Experience** : Feedback contextuel + animations + haptic feedback  
✅ **Maintenance** : Code patterns cohérents + documentation + tests  
✅ **Évolutivité** : Extensible pour nouveaux types projets + partenaires  
✅ **Qualité** : ESLint strict + Prettier + conventions rigoureuses

### 🚀 **Nouvelles Fonctionnalités 2025**

🔥 **TanStack Form Integration** 
🔥 **Screen Component Enrichi** : États loading/error, navigation avancée, testabilité  
🔥 **Convention Hooks Clarifiée** : Arrow function directe vs return explicite  
🔥 **Validation Zod Unifiée** : Schemas réutilisables pour formulaires et API  
🔥 **Error Handling Avancé** : Gestion centralisée avec retry et messages contextuels  

Cette approche **métier-driven** avec des **patterns cohérents** et les **dernières technologies** assure une base solide pour le développement de Make the CHANGE Mobile, en privilégiant la **maintenabilité** et l'**évolutivité** sans sacrifier les **performances** et l'**expérience utilisateur**.

---