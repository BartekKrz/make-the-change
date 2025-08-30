# 🎓 Engagement Actif "Learn & Earn" (V1/V2)

> **💡 RÉFÉRENCE** : Voir [../../mobile-conventions/03-conventions-patterns.md](../../mobile-conventions/03-conventions-patterns.md) pour les patterns complets d'utilisation des composants Screen et les conventions de hooks.

**📍 VERSION: V1/V2** | **🗓️ TIMELINE: Mois 7-8** | **⭐️ PRIORITÉ: P2 (Normal)**

## 🎯 Objectif

Récompenser l'engagement actif des utilisateurs avec la plateforme au-delà des transactions. L'objectif est de renforcer l'éducation, la fidélité et la création de contenu de qualité par la communauté.

## 📋 Mécanismes "Learn & Earn"

### 1. Quiz Éducatifs (V1)
- **Concept** : Après la lecture d'un article ou le visionnage d'une vidéo sur un producteur, un court quiz interactif est proposé.
- **Récompense** : **+5 points** pour un score de 100%.
- **UX** : Quiz de 3 questions simples, intégré de manière non intrusive à la fin du contenu.
- **Objectif** : Inciter à la consommation de contenu éducatif et valider la compréhension.

### 2. Avis Produits de Qualité (V1)
- **Concept** : Encourager les retours détaillés et utiles sur les produits reçus via les points.
- **Récompense** :
    - **+5 points** pour un avis standard.
    - **+15 points** pour un "Avis de Qualité" (plus de 50 mots + photo du produit).
- **UX** : Un système de notation simple et un champ de texte clair, avec un upload de photo facile.
- **Objectif** : Générer du contenu utilisateur (UGC) de confiance et aider les autres membres.

### 3. Check-in de Projet Mensuel (V2)
- **Concept** : Créer un rituel d'engagement où les Protecteurs et Ambassadeurs consultent les nouvelles de leurs projets.
- **Récompense** : **+2 points de loyauté** pour chaque "check-in" mensuel complété.
- **UX** : Une notification mensuelle douce et une section "Nouveautés de vos projets" sur le dashboard.
- **Objectif** : Maintenir le lien émotionnel avec les projets soutenus et augmenter la rétention.

## 🔧 Implémentation Technique

### API Endpoints
```typescript
// Valider un quiz
quizzes.submit: { input: { quizId: string, answers: any[] }, output: { success: boolean, pointsEarned: number } }

// Soumettre un avis
reviews.create: { input: { productId: string, rating: number, comment: string, photo?: file }, output: { review: Review, pointsEarned: number } }

// Valider un check-in
projects.checkIn: { input: { projectId: string }, output: { success: boolean, pointsEarned: number } }
```

## 📊 KPIs de Succès
- **Taux de complétion des quiz** : > 30% des utilisateurs exposés.
- **Taux de soumission d'avis** : > 25% des commandes génèrent un avis.
- **Taux d'avis de qualité** : > 40% des avis incluent une photo.
- **Taux de check-in mensuel** : > 50% des utilisateurs éligibles.
