# Standards de Code - Make the CHANGE

**Version**: 1.0  
**Dernière mise à jour**: 5 septembre 2025  
**Statut**: Standards obligatoires pour tous les développeurs

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

## 📂 **2. Conventions de nommage Make the CHANGE**

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

type InvestmentCalculationResponse = {
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

## 📁 Conventions de Nommage Générales

### Dossiers et Fichiers
- **Dossiers** : `kebab-case` uniquement
  ```
  ✅ image-gallery/
  ✅ image-uploader/
  ✅ blur-hash-image/
  
  ❌ ImageGallery/
  ❌ imageGallery/
  ❌ BlurHashImage/
  ```

- **Fichiers TypeScript/React** : `kebab-case.tsx`
  ```
  ✅ image-gallery-modal.tsx
  ✅ round-action-button.tsx
  ✅ blur-hash-image.tsx
  
  ❌ ImageGalleryModal.tsx
  ❌ RoundActionButton.tsx
  ❌ BlurHashImage.tsx
  ```

- **Fichiers utilitaires** : `kebab-case.ts`
  ```
  ✅ use-image-handler.ts
  ✅ image-utils.ts
  
  ❌ useImageHandler.ts
  ❌ imageUtils.ts
  ```

### Exports
- **Composants** : `PascalCase` (nom du composant)
- **Fonctions/hooks** : `camelCase`

## ⚛️ Standards React TypeScript

### Imports
**✅ Format correct :**
```typescript
import { type FC, type ChangeEvent, forwardRef, useState } from 'react';
import { type NextRouter } from 'next/router';
```

**❌ Format incorrect :**
```typescript
import { forwardRef, useState } from 'react';
import { NextRouter } from 'next/router';
// ou
import React from 'react';
// utiliser React.ChangeEvent, React.FC, etc.
```

### Déclaration de Types
**✅ Utiliser `type` :**
```typescript
type ComponentProps = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  multiple?: boolean;
  disabled?: boolean;
}
```

**❌ Éviter `interface` :**
```typescript
interface ComponentProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  multiple?: boolean;
  disabled?: boolean;
}
```

### Composants React
**✅ Format standard obligatoire :**
```typescript
import { type FC } from 'react';

type ComponentProps = {
  prop1: string;
  prop2?: number;
  className?: string;
}

export const ComponentName: FC<ComponentProps> = ({ 
  prop1,
  prop2 = 42,
  className = ''
}) => (
  <div className={className}>
    {prop1}
  </div>
);
```

**❌ Format incorrect :**
```typescript
export const ComponentName = ({ 
  prop1,
  prop2 = 42,
  className = ''
}: ComponentProps) => (
  <div className={className}>
    {prop1}
  </div>
);
```

### Hooks Personnalisés
```typescript
import { type useState } from 'react';

type UseCustomHookReturn = {
  value: string;
  setValue: (value: string) => void;
}

export const useCustomHook = (): UseCustomHookReturn => {
  const [value, setValue] = useState<string>('');
  
  return {
    value,
    setValue
  };
};
```

## 📦 **3. Structure des Exports**

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

## 📦 **4. Ordre des Imports**

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

## 📦 Structure des Exports (index.ts)

**✅ Format standard :**
```typescript
// Composants principaux
export { ImageUploader } from './components/image-uploader';
export { MultiImageUploader } from './components/multi-image-uploader';
export { ImageDisplay } from './components/image-display';

// Hooks
export { useImageHandler } from './hooks/use-image-handler';

// Types (si nécessaire)
export type { ImageUploaderProps } from './components/image-uploader';
```

## 🎯 Types React Courants

### Imports Standards
```typescript
import { 
  type FC,
  type ReactNode,
  type ChangeEvent, 
  type MouseEvent,
  type KeyboardEvent,
  type FormEvent,
  type RefObject,
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';
```

### Événements
```typescript
// Inputs
onChange: (e: ChangeEvent<HTMLInputElement>) => void;
onSubmit: (e: FormEvent<HTMLFormElement>) => void;

// Boutons
onClick: (e: MouseEvent<HTMLButtonElement>) => void;
onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
```

### Props Communes
```typescript
type BaseComponentProps = {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}
```

## 🚫 Anti-Patterns à Éviter

### Nommage
```typescript
❌ ImageGallery/           // PascalCase pour dossier
❌ useImagehandler.ts      // camelCase manqué
❌ image_gallery.tsx       // snake_case
❌ imageGallery.tsx        // camelCase pour fichier
```

### TypeScript
```typescript
❌ React.FC<Props>         // Namespace React
❌ React.ChangeEvent       // Types via namespace
❌ interface Props {}      // Interface au lieu de type
❌ import React from 'react' // Import namespace entier
```

### Composants
```typescript
❌ const Component = (props: Props) => // Pas de typage FC
❌ export default Component            // Export default
❌ function Component(props) {}        // Function declaration
```

## 📋 Checklist de Validation

Avant chaque commit, vérifier :

- [ ] Tous les dossiers sont en `kebab-case`
- [ ] Tous les fichiers `.tsx/.ts` sont en `kebab-case`
- [ ] Imports TypeScript utilisent `type` pour les types
- [ ] Pas de namespace `React.` dans le code
- [ ] Composants déclarés avec `: FC<Props>`
- [ ] Types déclarés avec `type =` et non `interface`
- [ ] Exports nommés (pas de `export default`)
- [ ] Index.ts mis à jour avec bons chemins

## 🔧 Migration d'un Composant Existant

### Étape 1 : Renommer les fichiers
```bash
mv ImageUploader.tsx image-uploader.tsx
```

### Étape 2 : Corriger les imports
```typescript
// Avant
import { forwardRef } from 'react';

// Après
import { type FC, forwardRef } from 'react';
```

### Étape 3 : Corriger les types
```typescript
// Avant
interface Props {
  onClick: (e: React.MouseEvent) => void;
}

// Après
type Props = {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}
```

### Étape 4 : Corriger la déclaration
```typescript
// Avant
export const Component = (props: Props) => (
  // JSX
);

// Après
export const Component: FC<Props> = (props) => (
  // JSX
);
```

### Étape 5 : Mettre à jour index.ts
```typescript
// Avant
export { Component } from './Component';

// Après
export { Component } from './component';
```

## ⚡ Avantages de ces Standards

- **Tree-shaking optimisé** avec imports `type` explicites
- **Build performance** - types supprimés à la compilation
- **Cohérence** dans toute la codebase
- **Maintenabilité** - standards prévisibles
- **Lisibilité** - nommage uniforme
- **Collaboration** - règles claires pour toute l'équipe

---

**Ces standards sont obligatoires pour tous les développeurs du projet Make the CHANGE.**