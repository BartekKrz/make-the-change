# 🎨 Design System - Make the CHANGE

Design system unifié pour la plateforme d'investissement biodiversité avec esthétique "Nature Amplifiée".

## 📋 Vue d'Ensemble

Système de design cohérent couvrant l'application mobile (Expo), le dashboard admin et le site e-commerce avec une approche biophilique moderne.

## 🗂️ Composants du Design System

| Document | Description | Status | Dernière MAJ |
|----------|-------------|--------|--------------|
| [brand-guidelines.md](./brand-guidelines.md) | **Charte graphique complète** - Logo, couleurs, typo | ✅ Final | 25 août 2025 |
| [foundations.md](./foundations.md) | Couleurs, typographie, spacing, grilles | ✅ Final | 2025-01-XX |
| [components.md](./components.md) | Composants UI réutilisables | 📋 À créer | - |
| [patterns.md](./patterns.md) | Patterns UX et interactions | 📋 À créer | - |
| [accessibility.md](./accessibility.md) | Guidelines WCAG et bonnes pratiques | 📋 À créer | - |

## 🌿 Philosophie Design

### Valeurs Core
- **🌱 Nature Amplifiée** : Esthétique biophilique moderne
- **🔍 Transparence** : Impact visible et données traçables
- **⚡ Performance** : UX fluide sur tous devices
- **🤝 Inclusivité** : Accessible aux 5 personas cibles

### Approche Mobile-First
- **80% mobile users** attendus
- Design responsive optimisé
- Touch-friendly interactions
- Performance <2s cold start

## 🎨 Identité Visuelle

### Palette Couleurs Principale
```css
/* Couleurs Nature - Make the CHANGE Brand - Voir brand-guidelines.md */
--emerald-primary: #059669;  /* Émeraude - Primary actions */
--blue-night: #0F172A;       /* Bleu nuit - Textes principaux */
--amber-accent: #F59E0B;     /* Ambré - Accents et CTA */
--terracotta: #D97706;       /* Terracotta - Secondary */
--olive: #6B8E23;           /* Olive - Nature */
--sage: #94A68D;            /* Sauge - Neutres */
--off-white: #F8FAFC;       /* Blanc cassé - Backgrounds */
--violet-accent: #7C3AED;   /* Violet - Interactive */
```

### Typographie
```css
/* Titres - Playfair Display (Brand) */
font-family: 'Playfair Display', serif;
font-weights: 400, 600, 700

/* Navigation/Sous-titres - Poppins */
font-family: 'Poppins', sans-serif;
font-weights: 400, 500, 600, 700

/* Corps de texte - Inter */  
font-family: 'Inter', sans-serif;
font-weights: 300, 400, 500, 600

/* Accents manuscrits - Caveat (limité) */
font-family: 'Caveat', cursive;
font-weights: 400, 500
```

### Spacing System
```css
/* Scale basée sur 4px */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

## 📱 Composants Principaux

### Atoms (Éléments de base)
- **Buttons** : Primary, Secondary, Ghost, Icon
- **Inputs** : Text, Email, Password, Number, Select
- **Typography** : H1-H6, Body, Caption, Code
- **Icons** : Lucide React + custom icons

### Molecules (Compositions)
- **Form Fields** : Input + Label + Error + Hint
- **Cards** : Project, Product, Investment, User
- **Navigation** : Tabs, Breadcrumbs, Pagination
- **Feedback** : Alerts, Toasts, Modals

### Organisms (Sections complexes)
- **Headers** : App header, page headers
- **Lists** : Projects, products, investments
- **Forms** : Login, register, investment, checkout
- **Charts** : Analytics, performance tracking

## 🔧 Implémentation Technique

### Mobile (React Native + NativeWind)
```tsx
// Utilisation Tailwind classes avec NativeWind
<Pressable className="bg-emerald-500 px-6 py-3 rounded-lg active:bg-emerald-700">
  <Text className="text-white font-semibold">Investir</Text>
</Pressable>
```

### Web (Next.js 15.5 App Router sur Vercel + Tailwind + shadcn/ui)
```tsx
// Composants shadcn/ui customisés
import { Button } from '@/components/ui/button'

<Button variant="primary" size="lg">
  Créer un projet
</Button>
```

## 🎯 Adaptations par Persona

### Claire (27) - Mobile-first
- **Gamification** : Badges, progress bars, animations
- **Quick actions** : Swipe gestures, floating buttons
- **Visual feedback** : Micro-interactions, haptic feedback

### Marc (42) - Analytics-focused  
- **Data density** : Tables, charts, dashboards
- **Efficiency** : Keyboard shortcuts, batch actions
- **Professional** : Clean, minimal, business-like

### Fatima (35) - Safety-first
- **Clear hierarchy** : Strong visual structure
- **Trust signals** : Security badges, certifications
- **Educational** : Tooltips, help content, guides

## 📊 Design Tokens

### Breakpoints Responsive
```css
/* Mobile first approach */
sm: '640px',   /* Tablets portrait */
md: '768px',   /* Tablets landscape */
lg: '1024px',  /* Desktop small */
xl: '1280px',  /* Desktop large */
2xl: '1536px'  /* Desktop XL */
```

### Animation Système
```css
/* Durations */
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;

/* Easings */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

## 🔗 Liens Connexes

- [🎨 02-Product](../) - Vision produit et roadmap
- [📱 04-Specifications](../../04-specifications/) - Spécifications d'implémentation
- [💼 01-Strategy](../../01-strategy/user-personas.md) - Personas détaillés
- [🔧 03-Technical](../../03-technical/tech-stack.md) - Stack technique

## ✅ Checklist Design System

### Phase 1 (MVP avec Couleurs)
- [x] **Foundations** : Identité graphique complète (couleurs, typo, spacing)
- [ ] **Components** : 15 composants avec couleurs de marque intégrées
- [ ] **Patterns** : 5 patterns UX critiques avec branding
- [ ] **Tokens** : Design tokens couleurs Make the CHANGE

### Phase 2 (Enhancement Visuel)
- [ ] **Advanced Components** : 25+ composants avec états avancés
- [ ] **Animation Library** : Micro-interactions sophistiquées
- [ ] **Dark Mode** : Extension du système couleurs existant
- [ ] **Accessibility** : WCAG 2.1 AAA (AA déjà intégré Phase 1)

---
*Maintenu par : Design Team | Dernière révision : 2025-01-XX*
