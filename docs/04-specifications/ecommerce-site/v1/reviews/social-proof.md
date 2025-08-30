# 👍 Preuve Sociale (Social Proof) (V1)

## 🎯 Objectif

Augmenter la confiance et inciter à l'action en montrant l'activité et les choix des autres membres de la communauté.

## 📋 Features V1

- **Notifications d'Activité Récente** : 
  - "Sophie à Paris vient de soutenir ce projet."
  - "5 personnes ont acheté ce produit aujourd'hui."
- **Compteurs d'Engagement** : 
  - Afficher le nombre de personnes ayant soutenu un projet.
  - Afficher le nombre de vues ou d'ajouts au panier pour un produit.
- **Badges de Popularité** : 
  - "Tendance"
  - "Populaire dans votre région"
  - "Meilleure vente"
- **Témoignages et Avis Mis en Avant** : Section dédiée sur la homepage et les pages produits.

## 🖼️ Interface Utilisateur

- **Pop-ups discrets (Toasts)** : Pour les notifications d'activité en temps réel.
- **Badges sur les Cartes Produits/Projets**.
- **Widgets de statistiques** intégrés dans les pages.

## 📡 API & Données

```typescript
// Endpoint pour l'activité récente
GET /api/social-proof/activity
Query: { context: 'product' | 'project', contextId: string }
```

---
*Statut : ✅ Spécification détaillée*