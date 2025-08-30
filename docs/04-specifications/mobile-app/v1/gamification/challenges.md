# Défis Hebdomadaires & Mensuels (V1)

> **💡 RÉFÉRENCE** : Voir [../../mobile-conventions/03-conventions-patterns.md](../../mobile-conventions/03-conventions-patterns.md) pour les patterns complets d'utilisation des composants Screen et les conventions de hooks.

## 🎯 Objectif

Proposer des objectifs à court et moyen terme pour dynamiser l'activité des utilisateurs et les inciter à explorer différentes facettes de la plateforme.

## 🎨 Design & Layout

### Section "Défis" sur le Dashboard
```text
┌─────────────────────────┐
│ 🎯 Vos Défis de la Semaine│
│                         │
│ ┌─────────────────────┐ │
│ │ 🌳 Défi Foresterie    │ │
│ │ Soutenir 2 projets    │ │
│ │ d'arbres.             │ │
│ │ [Progrès: 1/2]        │ │
│ │ Récompense: +50 pts   │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

## 📋 Types de Défis

- **Défis de Découverte** : "Soutenir un projet dans une nouvelle catégorie".
- **Défis d'Engagement** : "Laisser 3 avis de qualité cette semaine".
- **Défis Communautaires** : "Contribuer à l'objectif collectif de planter 1000 arbres ce mois-ci".
- **Défis de Dépense** : "Utiliser 500 points en une seule commande".

## 🎁 Récompenses

- Les récompenses varient en fonction de la difficulté du défi : de **+20 points** pour un défi simple à **+200 points** ou un **badge exclusif** pour un défi mensuel complexe.

## 🔧 Implémentation

- Un système de cron jobs côté backend pour générer de nouveaux défis chaque semaine/mois.
- Une table `challenges` pour stocker les définitions des défis.
- Une table `user_challenges` pour suivre la progression de chaque utilisateur.

## ✅ Critères de Validation
- L'utilisateur est notifié des nouveaux défis disponibles.
- La progression est mise à jour en temps réel.
- Les récompenses sont attribuées automatiquement à la complétion du défi.