# Niveaux & Progression (V1)

> **💡 RÉFÉRENCE** : Voir [../../mobile-conventions/03-conventions-patterns.md](../../mobile-conventions/03-conventions-patterns.md) pour les patterns complets d'utilisation des composants Screen et les conventions de hooks.

## 🎯 Objectif

Créer un système de progression à long terme basé sur l'expérience (XP) pour maintenir l'engagement des utilisateurs au-delà des niveaux statutaires (Protecteur, Ambassadeur).

## 🎨 Design & Layout

### Widget de Niveau sur le Profil
```text
┌─────────────────────────┐
│ [Photo] Jean Dupont      │
│ 🏅 Niveau 12 - Gardien   │
│ ┌─────────────────────┐ │
│ │ XP: 12,500 / 15,000   │ │
│ │ █████████████░░░░░   │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

## 📋 Mécanique de Progression

- **Points d'Expérience (XP)** : Les utilisateurs gagnent de l'XP pour presque chaque action positive.
  - 1€ investi = +10 XP
  - 1 point dépensé = +1 XP
  - 1 avis laissé = +5 XP
  - 1 quiz réussi = +10 XP
- **Niveaux** : L'XP accumulée fait monter l'utilisateur de niveau (de 1 à 100).
- **Titres** : Chaque dizaine de niveaux débloque un nouveau titre (ex: Niv. 1 "Apprenti", Niv. 10 "Gardien", Niv. 50 "Maître Écologiste").

## 🎁 Récompenses de Niveau

- **Passage de niveau** : Donne un petit bonus de points (ex: +10 points).
- **Paliers importants (tous les 10 niveaux)** : Débloque des avantages cosmétiques (thèmes d'app, icônes exclusives) ou des bonus de points plus importants.

## 🔧 Implémentation

- Le calcul de l'XP doit être géré côté backend pour éviter la triche.
- Une table `user_levels` stockera le niveau actuel, l'XP total, et l'XP pour le prochain niveau.

## ✅ Critères de Validation
- La barre d'XP se met à jour après chaque action récompensée.
- L'utilisateur reçoit une animation de "Level Up" et une notification.
- Les titres et récompenses sont débloqués correctement.