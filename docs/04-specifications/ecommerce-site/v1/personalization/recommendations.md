# 📈 Recommandations Personnalisées (V1)

## 🎯 Objectif

Augmenter l'engagement et la conversion en proposant aux utilisateurs des produits et projets pertinents basés sur leur comportement et leurs préférences.

## 📋 Features V1

- **Moteur de Recommandation Hybride** : Combine le filtrage basé sur le contenu (caractéristiques des produits/projets) et le filtrage collaboratif (comportement des utilisateurs similaires).
- **Widgets de Recommandation** :
  - **"Parce que vous avez aimé X"** : Sur les pages produits/projets.
  - **"Les clients qui ont vu ceci ont aussi vu"** : Alternative populaire.
  - **"Tendances dans votre région"** : Basé sur la géolocalisation.
  - **"Pour compléter votre panier"** : Suggestions dans le panier.
- **Personnalisation de la Homepage** : Section "Pour Vous" sur la page d'accueil pour les utilisateurs connectés.

## 🖼️ Interface Utilisateur

- **Carrousels de produits** : Intégrés de manière fluide sur les différentes pages.
- **Labels explicites** : Indiquer pourquoi un produit est recommandé ("Tendance", "Basé sur vos visites").

## 📡 API & Données

```typescript
// Endpoint pour obtenir les recommandations
GET /api/recommendations
Query: {
  userId: string,
  context: 'homepage' | 'product_detail' | 'cart',
  contextId?: string // ex: productId
}
Output: { recommendations: Product[] }
```

---
*Statut : ✅ Spécification détaillée*