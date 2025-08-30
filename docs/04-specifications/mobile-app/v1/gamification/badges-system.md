# Système de Badges (V1)

> **💡 RÉFÉRENCE** : Voir [../../mobile-conventions/03-conventions-patterns.md](../../mobile-conventions/03-conventions-patterns.md) pour les patterns complets d'utilisation des composants Screen et les conventions de hooks.

## 🎯 Objectif

Récompenser et visualiser les accomplissements des utilisateurs à travers un système de badges, renforçant la motivation et la fidélité.

## 🎨 Design & Layout

### Écran "Mes Badges"
```text
┌─────────────────────────┐
│ [←] Mes Badges (12/50)   │
│                         │
│ ┌────┐ ┌────┐ ┌────┐   │
│ │ 🏆 │ │ 🥉 │ │ 🏅 │   │
│ │ Lv.3 │ 1er  │ Prot.│   │
│ └────┘ └────┘ └────┘   │
│                         │
│ Badges Récents          │
│ ┌─────────────────────┐ │
│ │ 🏅 Protecteur Abeilles│
│ │ Obtenu il y a 3 jours │
│ └─────────────────────┘ │
└─────────────────────────┘
```

## 📱 Composants UI

- **BadgeGrid** : Grille affichant tous les badges (colorés si obtenus, grisés sinon).
- **BadgeCard** : Carte détaillée pour un badge, avec sa description et sa date d'obtention.
- **ProgressBar** : Pour les badges basés sur la progression.

## 📋 Liste des Badges (Exemples V1)

- **Premier Pas** : Premier investissement réalisé.
- **Protecteur des Abeilles** : Soutenu 3 projets de ruches.
- **Ami des Forêts** : Soutenu 3 projets d'arbres/forêts.
- **Collectionneur** : Acheté 10 produits différents avec des points.
- **Ambassadeur** : Devenu Ambassadeur.
- **Parrain d'Exception** : 5 filleuls convertis.

## 📡 API & Données

```typescript
// Obtenir les badges d'un utilisateur
GET /api/user/badges

// Obtenir la définition de tous les badges
GET /api/gamification/badges
```

## ✅ Critères de Validation
- Les badges sont débloqués automatiquement lorsque les critères sont remplis.
- L'utilisateur reçoit une notification pour chaque nouveau badge.
- L'écran "Mes Badges" reflète correctement la progression.