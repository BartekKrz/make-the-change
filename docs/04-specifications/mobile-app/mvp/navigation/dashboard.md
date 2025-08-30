# Dashboard (Accueil) - Optimisé 2025

## 🎯 Objectif

Vue d'ensemble personnalisée et **adaptative selon le niveau utilisateur** (Explorateur/Protecteur/Ambassadeur), offrant un aperçu contextualisé du statut et encourageant la progression naturelle dans le modèle hybride. Cette version intègre les patterns de navigation modernes de 2025 pour une expérience plus fluide et intelligente.

## 🎨 Design & Layout

> **💡 RÉFÉRENCE** : Voir [../mobile-conventions/03-conventions-patterns.md](../mobile-conventions/03-conventions-patterns.md) pour les patterns complets d'utilisation du composant Screen.

### Structure Adaptative par Niveau (Concept 2025)

Le dashboard n'est plus une page statique mais un hub dynamique qui change radicalement en fonction du niveau de l'utilisateur et de son contexte.

#### **EXPLORATEUR (Gratuit) - Focus Découverte & Conversion**
```text
┌─────────────────────────┐
│ 🔓 Bonjour Prénom!   ⚙️ │
│ Mode découverte gratuite │
│                         │
│ ┌─────────────────────┐ │
│ │ 🌱 Commencez votre  │ │
│ │    aventure         │ │
│ │ Explorez gratuitement │ │
│ │ [Découvrir projets] │ │
│ └─────────────────────┘ │
│                         │
│ Projets Populaires      │
│ ┌────┐ ┌────┐ ┌────┐   │
│ │🐝  │ │🌳  │ │🍀  │   │
│ │Marc│ │Oli │ │Bio │   │
│ └────┘ └────┘ └────┘   │
│                         │
│ ┌─────────────────────┐ │
│ │ 🚀 Prêt à investir? │ │
│ │ 50€ → 65 points     │ │
│ │ [Voir comment ça    │ │
│ │  marche]            │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

#### **PROTECTEUR (Investisseur) - Focus Suivi & Utilisation des Points**
```text
┌─────────────────────────┐
│ 🐝 Bonjour Prénom!   ⚙️ │
│ Niveau: Protecteur       │
│                         │
│ ┌─────────────────────┐ │
│ │   Vos Points  ⏰65j │ │
│ │      1,250          │ │
│ │   [Utiliser points] │ │
│ └─────────────────────┘ │
│                         │
│ Vos Projets Soutenus    │
│ ┌────┐ ┌────┐ ┌────┐   │
│ │🐝✅│ │🌳📊│ │🍯📸│   │
│ │Marc│ │Oli │ │Miel│   │
│ └────┘ └────┘ └────┘   │
│ [Voir mes updates]      │
│                         │
│ ┌─────────────────────┐ │
│ │ 🎁 Nouveaux produits│ │
│ │ Miel d'acacia - 25pts│ │
│ │ [Voir catalogue]    │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

#### **AMBASSADEUR (Premium) - Focus Portfolio & Optimisation**
```text
┌─────────────────────────┐
│ 👑 Bonjour Prénom!   ⚙️ │
│ Ambassadeur Premium      │
│ 💳 Annuel: 320€/an     │
│ Prochaine facture: Jan 26│
│                         │
│ ┌─────────────────────┐ │
│ │ Portfolio Performance│ │
│ │   +12% ce mois 📈   │ │
│ │ 525 pts │ 8 projets │ │
│ │ [Voir analytics]    │ │
│ └─────────────────────┘ │
│                         │
│ NOUVEAU: Si Monthly     │
│ ┌─────────────────────┐ │
│ │ 💰 Upgrade vers annuel│ │
│ │ Économisez 64€/an    │ │
│ │ [Voir les avantages] │ │
│ └─────────────────────┘ │
│                         │
│ Allocation Flexible     │
│ ┌────┐ ┌────┐ ┌────┐   │
│ │🐝60%││🌳30%││🍀10%│   │
│ │150p│ │75p │ │25p │   │
│ └────┘ └────┘ └────┘   │
│ [Optimiser allocation]  │
│                         │
│ ┌─────────────────────┐ │
│ │ ⭐ Accès Exclusif    │ │
│ │ Nouveau producteur  │ │
│ │ [Voir opportunité]  │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

## 📱 Composants UI (Intégrant les concepts 2025)

### Header Adaptatif (Concept 2025)
```typescript
interface SmartDashboardNavigation {
  adaptiveHeader: {
    collapsed: {
      height: 60;
      content: ['user_avatar', 'points_counter', 'notification_bell'];
      background: 'blurred_glass_effect';
    };
    expanded: {
      height: 120;
      content: ['greeting', 'level_progress', 'quick_stats'];
      background: 'gradient_based_on_user_level';
    };
    scrollBehavior: 'smooth_transition_based_on_scroll_velocity';
  };
}
```

### Widgets de Contenu Intelligents (Concept 2025)
```typescript
interface SmartDashboardNavigation {
  contentSections: {
    layout: 'intelligent_card_ordering_based_on_usage';
    prioritization: [
      'urgent_actions_first', // Ex: points expirant
      'personalized_recommendations',
      'recent_activity',
      'discovery_opportunities'
    ];
    cardInteractions: {
      tap: 'navigate_to_detail';
      longPress: 'quick_action_menu';
      swipeLeft: 'mark_as_done_or_dismiss';
      swipeRight: 'add_to_favorites_or_share';
    };
  };
}
```

### Bouton d'Action Flottant Contextuel (Concept 2025)
```typescript
interface SmartDashboardNavigation {
  contextualFAB: {
    explorateur: {
      icon: 'compass_plus';
      action: 'discover_new_project';
      color: 'discovery_green';
    };
    protecteur: {
      icon: 'investment_plus';
      action: 'quick_invest_in_favorite';
      color: 'growth_blue';
    };
    ambassadeur: {
      icon: 'portfolio_plus';
      action: 'expand_portfolio';
      color: 'premium_gold';
    };
  };
}
```

## 🔄 États & Interactions (Enrichis 2025)

### États de Chargement
- **Skeleton Loading** : Utilisation de shimmer effects qui respectent la structure de la carte pour chaque niveau d'utilisateur.
- **Pull-to-Refresh** : Haptic feedback et animation de type "élastique" pour une sensation moderne.

### Interactions Gestuelles (Concept 2025)
```typescript
interface GestureNavigationSystem {
  edgeSwipes: {
    rightEdge: {
      action: 'quick_access_to_favorites_or_points';
      contextual: 'adapt_based_on_current_screen';
    };
  };
  contentSwipes: {
    dashboardCards: 'swipe_to_dismiss_or_act';
  };
}
```

## 💻 Implémentation avec Composants Screen

### Exemple d'implémentation avec les nouvelles conventions

```typescript
// Hook dashboard avec convention arrow function directe
export const useDashboard = (userLevel: UserLevel) => useQuery({
  queryKey: ['dashboard', userLevel],
  queryFn: () => fetchDashboardData(userLevel),
  staleTime: 2 * 60 * 1000, // 2 minutes pour dashboard
});

// Composant Dashboard utilisant Screen
const DashboardScreen: FC = () => {
  const { userLevel } = useAuth();
  const { data: dashboardData, isLoading, error } = useDashboard(userLevel);
  
  if (isLoading) return <Screen.Loading />;
  if (error) return <Screen.Error onRetry={() => refetch()} />;
  
  return (
    <Screen.Layout>
      <Screen.Header 
        title={getDashboardTitle(userLevel)}
        showBackButton={false}
        rightIcon="settings"
        onRightPress={() => navigation.navigate('Settings')}
      />
      
      <Screen.ScrollView>
        <Screen.Content>
          {userLevel === 'explorateur' && <ExplorateurDashboard data={dashboardData} />}
          {userLevel === 'protecteur' && <ProtecteurDashboard data={dashboardData} />}
          {userLevel === 'ambassadeur' && <AmbassadeurDashboard data={dashboardData} />}
        </Screen.Content>
      </Screen.ScrollView>
    </Screen.Layout>
  );
};

// Composant spécialisé pour Explorateur
const ExplorateurDashboard: FC<{ data: DashboardData }> = ({ data }) => (
  <>
    <WelcomeCard userLevel="explorateur" />
    <PopularProjectsSection projects={data.popularProjects} />
    <ConversionCard onInvestPress={() => navigation.navigate('ProjectList')} />
  </>
);
```

## 📡 API & Données

L'endpoint de l'API pour le dashboard doit devenir plus intelligent et contextuel.

```typescript
GET /api/dashboard
Authorization: Bearer {accessToken}

// La réponse de l'API est maintenant structurée par widgets dynamiques
interface DashboardResponseV2 {
  user: { ... };
  level: 'explorateur' | 'protecteur' | 'ambassadeur';
  widgets: (
    | PointsWidgetData
    | MyProjectsWidgetData
    | DiscoveryWidgetData
    | UpgradeWidgetData
    | PortfolioWidgetData
  )[];
  // L'ordre des widgets est déterminé par le backend en fonction de la pertinence
}
```

## ✅ Critères de Validation

- Le dashboard doit s'afficher différemment pour un Explorateur, un Protecteur et un Ambassadeur.
- L'en-tête doit se réduire de manière fluide lors du scroll.
- Le bouton d'action flottant (FAB) doit changer d'icône et d'action selon le niveau de l'utilisateur.
- Les cartes du dashboard doivent être réactives aux gestes (tap, long press, swipe).
- Les données affichées (widgets) doivent être priorisées par le backend en fonction du contexte de l'utilisateur (ex: afficher l'alerte d'expiration des points en premier).
