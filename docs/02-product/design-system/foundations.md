# Système de Design Complet - Make the CHANGE

**Design system unifié pour la plateforme "Community-Supported Biodiversity" avec cohérence cross-platform mobile-web et stratégie de contenu intégrée.**

Ce document remplace les maquettes traditionnelles et consolide l'identité de marque complète. Il sert de référence unique pour le développement et la génération de code par IA, assurant la cohérence fonctionnelle, visuelle et textuelle de toute la plateforme.

## 🌱 **IDENTITÉ DE MARQUE - "NATURE AMPLIFIÉE"**

### **Philosophie Design**
```yaml
PRINCIPES FONDAMENTAUX:
- Clarté avant tout: Design simple, intuitif et accessible
- Authenticité: Honnêteté et transparence de la mission
- Optimisme: Inspirer l'action positive et célébrer l'impact  
- Accessibilité: Standards WCAG 2.1 AA obligatoires

VISION:
"La technologie est un pont, pas une destination.
Nous utilisons l'innovation pour renforcer notre lien 
avec le monde naturel et démultiplier notre impact positif."
```

### **Logo & Identité Visuelle**
```yaml
CONCEPT LOGO:
- Structure (Hexagone): Représente la ruche, la biodiversité organisée
- Organique (Pousse): Évoque la croissance, la vie naturelle
- Fusion: Harmonie technologie-nature, impact mesurable

VARIATIONS:
- Logo principal: Hexagone + pousse + texte
- Logo mark: Hexagone + pousse seul
- Logo text: Texte seul (espaces réduits)
- Logo monochrome: Versions noir/blanc

PROTECTION & USAGE:
- Zone de protection: 2x hauteur du logo minimum
- Taille minimum: 24px digital, 15mm print
- Contraste: Logo sur fonds contrastés uniquement
```

## 🎨 **SYSTÈME DE COULEURS COMPLET**

L'objectif est d'utiliser l'identité visuelle de Make the CHANGE dès le MVP pour une expérience de marque cohérente et une différenciation concurrentielle immédiate.

### 1.1. Palette MVP Complète (Couleurs + Neutres)

Nous utilisons la palette complète de l'identité graphique dès le développement initial.

**COULEURS DE MARQUE :**
- **Primaire (Actions) :** `emerald-600` (#059669) - Adhérer, valider, nature
- **Secondaire (Récompenses) :** `amber-600` (#d97706) - Points, succès, miel
- **Accent (Premium) :** `violet-600` (#7c3aed) - Innovation, différenciation

**COULEURS NEUTRES :**
- **Fond Principal :** `slate-50` (#f8fafc)
- **Fond Secondaire :** `white` (#ffffff)
- **Texte Principal :** `slate-800` (#1e293b)
- **Texte Secondaire :** `slate-500` (#64748b)
- **Bordures :** `slate-200` (#e2e8f0)

### 1.2. **Implémentation CSS Variables (DÉCISIONS EXPERTES)**

```yaml
COULEURS PRIMAIRES:
- Primaire: #059669 (Emerald 600) - Confiance et nature
- Secondaire: #D97706 (Amber 600) - Chaleur et miel
- Accent: #7C3AED (Violet 600) - Innovation

COULEURS NEUTRES:
- Background: #F8FAFC (Slate 50)
- Surface: #FFFFFF (White)
- Text Primary: #1E293B (Slate 800)
- Text Secondary: #64748B (Slate 500)
- Borders: #E2E8F0 (Slate 200)

COULEURS SÉMANTIQUES:
- Succès: #10B981 (Emerald 500)
- Erreur: #EF4444 (Red 500)
- Warning: #F59E0B (Amber 500)
- Info: #3B82F6 (Blue 500)

IMPLEMENTATION CSS:
:root {
  --color-primary: #059669;
  --color-secondary: #D97706;
  --color-accent: #7C3AED;
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-warning: #F59E0B;
}
```

### 1.3. Exemples d'Implémentation MVP (Couleurs)

**Boutons avec identité de marque :**
```tsx
// Bouton principal - Actions d'investissement
<Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
  Soutenir ce projet (50€)
</Button>

// Bouton récompenses - Système de points
<Button className="bg-amber-600 hover:bg-amber-700 text-white">
  Utiliser 180 Points
</Button>

// Bouton premium - Fonctionnalités avancées
<Button className="bg-violet-600 hover:bg-violet-700 text-white">
  Accès Premium
</Button>
```

**Cartes avec codes couleur :**
```tsx
// Projet soutenu
<Card className="border-l-4 border-emerald-600 bg-white">
  <Text className="text-slate-800">Projet Ruches Madagascar</Text>
  <Text className="text-amber-600 font-semibold">Génère jusqu'à 780 points</Text>
</Card>

// Indicateurs de statut
<Badge className="bg-emerald-100 text-emerald-800">Actif</Badge>
<Badge className="bg-amber-100 text-amber-800">Récolte</Badge>
<Badge className="bg-violet-100 text-violet-800">Premium</Badge>
```

### 1.4. Typographie

Utilise les classes Tailwind pour une cohérence parfaite.

- **Titre H1 (Page Title) :** `text-3xl font-bold tracking-tight`
- **Titre H2 (Section Title) :** `text-2xl font-semibold tracking-tight`
- **Titre H3 (Card Title) :** `text-lg font-semibold`
- **Corps de texte (Body) :** `text-base font-normal`
- **Texte petit (Small/Muted) :** `text-sm text-slate-500`

### 1.4. **Responsive Breakpoints (FINALISÉS)**

```yaml
BREAKPOINTS MOBILE-FIRST:
- Mobile: 320px-640px (design priority)
- Tablet: 640px-1024px 
- Desktop: 1024px-1440px
- Large: 1440px+ (design maximal)

TAILWIND CONFIGURATION:
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // Tablet
      'md': '768px',   // Small desktop
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Large desktop
      '2xl': '1536px', // Extra large
    }
  }
}

APPROCHE: Mobile-first avec progressive enhancement
```

### 1.5. **Accessibilité WCAG 2.1 AA (DÉCISION EXPERTE)**

```yaml
CONFORMITÉ OBLIGATOIRE:
- Contrast ratio: 4.5:1 minimum pour texte normal
- Touch targets: 44px minimum sur mobile
- Keyboard navigation: Complète sur tous éléments
- Screen readers: Support NVDA, JAWS, VoiceOver
- Focus indicators: Visibles et contrastés

OUTILS VALIDATION:
- axe-core: Tests automatisés
- Lighthouse: Audit accessibilité
- Screen reader testing: Manuel trimestriel
- Color contrast: Automatic verification

IMPLEMENTATION:
- Semantic HTML obligatoire
- ARIA labels appropriés
- Alt text pour toutes images
- Focus management dans modals
```

### 1.6. Composants Clés (Logique et États)

**Bouton :**
- **États :** default, hover (légèrement plus sombre), disabled (opacité 50%)
- **Variantes :** primaire (fond plein), secondaire (avec bordure, fond transparent)
- **Accessibilité :** Focus visible, ARIA labels, keyboard navigation

**Input (Champ de texte) :**
- **États :** default, focus (bordure plus visible), error (bordure rouge), disabled
- **Accessibilité :** Label associé, error messages, validation claire
- Doit toujours avoir un label clair

**Carte (Card) :**
- Fond `white`, bordure `slate-200`, `rounded-lg`, ombre légère (`shadow-sm`)
- Structure interne : Espace pour une image, un titre (H3), une description, et des actions (boutons)
- **Accessibilité :** Structure heading appropriée, navigation keyboard

## 2. Stratégie de Contenu Détaillée

### 2.1. **"Tone of Voice" Finalisé (DÉCISION EXPERTE)**

```yaml
VOIX DE MARQUE AUTHENTIQUE:
- Experte mais accessible, jamais prêcheuse
- Solutions positives, impact concret, transparence
- "Grâce à votre soutien" plutôt que "Il faut que"

ÉVITER ABSOLUMENT:
- Culpabilisation environnementale
- Greenwashing ou jargon technique
- Langage trop financier ou froid ("ROI", "rendement")

UTILISER EXCLUSIVEMENT:
- "Investissement", "soutien", "contribution"
- "Devenir Protecteur", "Devenir Ambassadeur"
- "Membre", "communauté"
- "Valeur garantie", "récompenses exclusives", "produits premium"
- "Plateforme d'impact", "soutien à la biodiversité"

ADAPTATION PAR PERSONA:
- Claire (27): Dynamique, emojis, communauté, "rejoindre le mouvement"
- Marc (42): Précis, données, transparence, "optimiser votre impact"
- Fatima (35): Chaleureux, éducatif, famille, "un héritage pour vos enfants"
```

La communication doit être :

- **Engageante & Pédagogique :** On explique simplement des concepts complexes (biodiversité, agroforesterie). On utilise des analogies.
- **Transparente & Honnête :** On est clair sur l'impact, le modèle économique. Pas de jargon trop financier. On utilise "investissement", "soutien" et "récompenses".
- **Inspirante & Positive :** On met en avant le changement positif que le membre génère. On célèbre chaque étape.

### 2.2. Guide de Micro-Copy (Textes de l'Interface)

Ceci est crucial pour guider l'IA et pour écrire les textes.

**Boutons d'Action (CTAs) :** Toujours orientés vers le bénéfice ou l'action.
- **Préférer :** "Soutenir ce projet", "Découvrir les récompenses", "Voir mon impact"
- **Éviter :** "OK", "Valider", "Soumettre"

**Titres d'Écrans :** Clairs et directs.
- "Mes projets soutenus", "Catalogue des récompenses", "Choisissez un projet à soutenir"

**Messages de Succès :** Doivent être gratifiants.
- **Exemple :** "Félicitations ! Grâce à votre investissement, ce projet de ruches peut se développer. Vos 65 points ont été ajoutés à votre compte."

**Messages d'Erreur :** Doivent être clairs, déculpabilisants et proposer une solution.
- **Exemple :** "Oups, le paiement n'a pas pu aboutir. Veuillez vérifier les informations de votre carte ou essayer une autre méthode."

**Textes d'Aide (Tooltips/Placeholders) :** Doivent guider l'utilisateur.
- **Exemple pour un champ d'investissement :** "Montant de votre soutien en €, ex: 50"

### 2.3. Contenu Adapté par Persona

**Pour Claire (Jeune Engagée) :** Mettre l'accent sur l'impact, la gamification et la communauté. Utiliser un ton dynamique et des emojis.
- **Exemple :** "Bravo, tu as débloqué le badge 'Gardien de la Ruche' ! 🐝"

**Pour Marc (Investisseur) :** Utiliser un langage précis, des données chiffrées, des graphiques. Mettre en avant la transparence, la traçabilité et les rapports.
- **Exemple :** "Votre contribution a généré un impact équivalent à 1.2 tonnes de CO2 compensé."

**Pour Fatima (Mère Éducatrice) :** Utiliser un ton chaleureux et rassurant. Mettre en avant les bénéfices pour la famille, l'aspect éducatif et la qualité des produits.
- **Exemple :** "Impliquez vos enfants dans le suivi de votre ruche familiale !"

## 3. **UX Patterns & Onboarding (DÉCISIONS FINALISÉES)**

### 3.1. **Onboarding Flow (3 Étapes Maximum)**

```yaml
ÉTAPE 1: Authentification Simple
- Email + mot de passe + nom complet
- Social login optionnel (Google, Apple)
- Validation email immédiate

ÉTAPE 2: Profil Utilisateur
- Âge, localisation générale, motivations principales
- Sélection persona automatique selon réponses
- Préférences de notifications

ÉTAPE 3: Découverte Produit
- Tour guidé des fonctionnalités clés
- Premier projet recommandé selon profil
- Invitation découvrir catalogue récompenses

PROGRESSIVE PROFILING:
- Informations complémentaires au fil de l'usage
- Pas de surcharge cognitive initiale
- Personnalisation progressive expérience
```

### 3.2. **Internationalisation (i18n)**

```yaml
PHASE 1: Français Uniquement
- Marché principal France
- Tous strings externalisés (ready i18n)
- react-i18next setup dès le début

PHASE 2: Expansion Anglais (Mois 6-8)
- Belgique, Suisse, Canada préparation
- Traduction professionnelle contenus
- Adaptation culturelle nécessaire

PHASE 3+: Autres Langues
- Selon opportunités business
- Néerlandais (Belgique), Allemand (Suisse)
- Framework évolutif multi-langues

IMPLEMENTATION TECHNIQUE:
- All user-facing strings externalisés
- Namespace par feature (auth, dashboard, shop)
- Pluralization et formatage dates/nombres
- SEO multi-langue (hreflang)
```

### 3.3. **Dark Mode Strategy**

```yaml
DÉCISION: Phase 2 (Enhancement Visuel)
- Justification: Couleurs de marque prioritaires pour reconnaissance
- Préparation: Architecture complète dès Phase 1 avec couleurs
- Timeline: Mois 6-8 après validation MVP
- Implementation: Extension du système couleurs existant

PHASE 1 (MVP avec Couleurs):
- Système couleurs complet Make the CHANGE
- CSS custom properties architecture
- Component theming avec couleurs de marque
- Fondations dark mode préparées
```

---

## 🧩 **SYSTÈME DE COMPOSANTS UI**

### **Architecture Atomic Design**
```yaml
HIÉRARCHIE COMPOSANTS:
atoms/          # Éléments de base (Button, Input, Icon)
molecules/      # Combinaisons simples (SearchBar, PointsWidget)  
organisms/      # Sections complexes (ProjectCard, SubscriptionForm)
templates/      # Layouts de page (DashboardTemplate)
pages/          # Pages complètes avec logique métier

PRINCIPES:
- Cohérence: Mêmes patterns visuels mobile ↔ web
- Accessibilité: WCAG 2.1 AA minimum sur tous composants
- Performance: Optimisation et lazy loading intégré
- Responsive: Adaptation automatique écrans/orientations
- Themeable: Support mode sombre préparé
```

### **Composants Atoms Essentiels**

#### **Button Component**
```typescript
VARIANTS:
- Primary: bg-emerald-600, texte blanc, actions principales
- Secondary: border emerald-600, texte emerald-600, actions secondaires  
- Outline: border slate-300, texte slate-700, actions neutres
- Ghost: pas de background, hover subtil, actions discrètes

STATES:
- Default: Style normal selon variant
- Hover: Légère saturation ou background change
- Pressed: Scale(0.98) + shadow increase  
- Disabled: Opacity 0.5 + cursor not-allowed
- Loading: Spinner interne + disabled state

SIZES:
- Small: height 36px, padding 8px 16px, text 14px
- Medium: height 44px, padding 12px 24px, text 16px (default)
- Large: height 52px, padding 16px 32px, text 18px
```

#### **Input Component**  
```typescript
VARIANTS:
- Default: Border slate-300, focus emerald-600
- Error: Border red-500, error message en dessous
- Success: Border emerald-500, checkmark icon
- Disabled: Background slate-100, opacity 0.6

STATES:
- Default: Border subtile, placeholder visible
- Focus: Border 2px emerald-600, shadow légère
- Filled: Label animé vers le haut (material design)
- Error: Border rouge + message d'erreur
- Validation: Bordure verte + icône succès

REQUIREMENTS:
- Label toujours associé (accessibility)
- Placeholder descriptif mais court
- Error messages clairs et actionnables  
- Auto-completion et validation temps réel
```

### **Composants Business Molecules - DUAL BILLING COMPONENTS**

#### **PointsWidget**
```typescript
STRUCTURE:
- Container: Card variant avec accent couleur
- Balance: Grande typo (32px) + "points" label  
- Trend: Flèche + évolution récente (+/- points)
- Action: "Voir historique" link vers détail

STATES:
- Normal: Balance actuelle + trend 7 jours
- Loading: Skeleton sur balance et trend
- Error: Message "Impossible de charger" + retry
- Zero: Message encouragement première action

ACCESSIBILITY:
- Balance annoncée par screen reader
- Trend avec contexte temporel explicite
- Navigation keyboard complète
```

#### **NOUVEAU: BillingFrequencyToggle**
```typescript
STRUCTURE:
- Container: Rounded pill background (height 56px, padding 4px)
- Options: Two touch targets (monthly/annual)
- Active state: Highlighted background + slide animation
- Savings badge: "-17%" indicator sur annual option

VARIANTS:
- Default: Monthly selected (accessibility first)
- Annual: Shows savings prominently
- Disabled: During processing/loading

STATES:
- Default: Monthly active, neutral colors
- Annual Active: Emerald background + savings highlight
- Transition: Smooth slide animation (300ms ease)
- Loading: Skeleton toggle during price calculation

ACCESSIBILITY:
- Role="radiogroup" avec labels clairs
- Keyboard navigation (arrow keys)
- Screen reader announce savings amount
- Focus indicators visibles
```

#### **NOUVEAU: PricingCard**
```typescript
STRUCTURE:
- Header: Plan name (Standard/Premium) + tier badge
- Pricing display: Dynamic selon billing frequency
- Features list: Plan benefits avec checkmarks
- CTA: Prominent "Choisir ce plan" button
- Savings highlight: Pour annual plans

VARIANTS:
- Monthly: Show monthly price prominently
- Annual: Highlight savings (-17%) + annual equivalent
- Recommended: Border highlight + "Plus populaire" badge
- Current: "Plan actuel" state avec manage button

RESPONSIVE:
- Mobile: Full width cards, stack vertically
- Tablet: 2 columns side by side
- Desktop: 3 columns avec recommended center

MICRO-INTERACTIONS:
- Hover: Subtle elevation increase
- Price switch: Smooth number transitions
- Feature reveals: Progressive disclosure
```

#### **NOUVEAU: SubscriptionManagement**
```typescript
STRUCTURE:
- Current plan: Active subscription info card
- Next billing: Date + amount + frequency
- Upgrade prompt: Pour monthly → annual conversion
- Billing portal: Stripe customer portal access

COMPONENTS:
- SubscriptionInfoCard: Current plan summary
- NextBillingInfo: Date + amount display
- UpgradePrompt: Annual savings calculator
- BillingHistory: Expandable payment history

STATES:
- Active subscription: Current plan + next billing
- Expired: Reactivation flow
- Canceled: Retention attempt
- Payment failed: Retry payment flow

ACTIONS:
- Change plan: Modal avec billing frequency choice
- Update payment: Stripe portal redirect  
- Cancel subscription: Confirmation + retention
- Download invoices: Direct PDF access
```

#### **ProjectCard**
```typescript  
STRUCTURE:
- Image: Aspect ratio 16:9, lazy loading, placeholder
- Header: Titre H3 + badges statut/type
- Content: Description 2 lignes max + progress bar
- Footer: Statut du projet + CTA

VARIANTS:
- Available: CTA "Soutenir ce projet"
- InProgress: Progress bar + status update
- Completed: Badge "Projet financé"
- Unavailable: Grayed out + "Complet" badge

INTERACTIONS:
- Card press: Navigation vers detail
- CTA press: Modal/page d'investissement
- Image lazy load: Progressive enhancement
```

### **Guidelines Cross-Platform**

#### **Mobile (React Native + NativeWind)**
```yaml
SPÉCIFICITÉS:
- Touch targets: 48px minimum (iOS 44px + Android 48dp)
- Safe areas: Respect notch/home indicator iOS
- Platform fonts: SF Pro (iOS), Roboto (Android)
- Haptic feedback: Actions importantes
- Pull-to-refresh: Listes standard
```

#### **Web (React + Tailwind)**
```yaml
SPÉCIFICITÉS:
- Hover states: Tous éléments interactifs
- Focus indicators: Visibles (outline/shadow)
- Keyboard navigation: Tab order logique
- Responsive breakpoints: sm/md/lg/xl
- Loading states: Skeleton vs spinners
```

#### **Accessibilité Transversale (WCAG 2.1 AA)**
```yaml
OBLIGATIONS:
- Color contrast: 4.5:1 minimum texte normal
- Touch targets: 44px minimum espace/taille
- Screen readers: Labels/descriptions appropriés
- Keyboard navigation: Tous éléments atteignables
- Focus management: Ordre logique et visible
- Error messages: Clairs et associés aux champs
- Alternative text: Images informatives décrites
```

---

*Design system complet intégrant identité de marque, couleurs, typographie, composants et guidelines d'accessibilité. Référence unique pour développement cohérent cross-platform.*