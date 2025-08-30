# Avis & Notes (V1)

## 🎯 Objectif

Permettre aux utilisateurs de laisser des avis sur les produits reçus et les projets soutenus, créant ainsi de la confiance et du contenu généré par les utilisateurs (UGC).

## 🎨 Design & Layout

### Écran de Soumission d'Avis
```text
┌─────────────────────────┐
│ [←] Laisser un avis      │
│                         │
│ ┌─────────────────────┐ │
│ │ [🍯] Miel d'Acacia  │ │
│ │ Commande #12345       │ │
│ └─────────────────────┘ │
│                         │
│ Note globale            │
│ ⭐⭐⭐⭐⭐ (4/5)        │
│                         │
│ Titre de l'avis         │
│ [Excellent produit !]   │
│                         │
│ Votre commentaire       │
│ [Ce miel est délicieux] │
│                         │
│ 📸 Ajouter une photo    │
│                         │
│ [SOUMETTRE L'AVIS]      │
└─────────────────────────┘
```

## 📱 Composants UI

- **StarRatingInput** : Composant interactif pour sélectionner une note de 1 à 5.
- **TextInput** : Pour le titre et le commentaire.
- **ImagePicker** : Pour uploader des photos du produit.
- **SubmissionButton** : Bouton avec état de chargement.

## 📡 API & Données

```typescript
// Soumettre un avis
POST /api/reviews
{
  productId?: string,
  projectId?: string,
  rating: number,
  title?: string,
  comment: string,
  images?: File[]
}

// Obtenir les avis pour un produit/projet
GET /api/reviews?productId=:id
```

## ✅ Critères de Validation
- L'utilisateur peut noter un produit de 1 à 5 étoiles.
- Le commentaire est optionnel si une note est donnée.
- L'ajout de photo est optionnel mais encouragé (bonus de points via `learn-and-earn`).
- Les avis sont soumis à une modération simple (filtre à injures) avant publication.