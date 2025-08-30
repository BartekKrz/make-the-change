# ⭐ Système d'Avis et Notes (V1)

## 🎯 Objectif

Construire la confiance et le contenu généré par les utilisateurs (UGC) en permettant de laisser des avis détaillés sur les produits et les projets.

## 📋 Features V1

- **Notation par Étoiles** : De 1 à 5 étoiles.
- **Commentaires Écrits** : Champ de texte pour un avis détaillé.
- **Upload de Photos** : Permettre aux utilisateurs de joindre des photos à leurs avis.
- **Avis Vérifié** : Badge pour les avis laissés par des utilisateurs ayant effectivement acheté/soutenu le produit/projet.
- **Système "Utile"** : Bouton "Cet avis vous a-t-il été utile ?" pour faire remonter les meilleurs avis.
- **Modération** : Interface admin pour modérer les avis (filtre à injures, validation des photos).

## 🖼️ Interface Utilisateur

- **Formulaire de soumission** : Accessible depuis la page d'une commande ou d'un projet soutenu.
- **Affichage sur la page produit/projet** : Section dédiée avec la note moyenne, la distribution des notes, et la liste des avis triable.

## 📡 API & Données

```typescript
// Soumettre un avis
POST /api/reviews
Body: { entityId: string, entityType: 'product' | 'project', rating: number, comment: string, images?: File[] }

// Obtenir les avis
GET /api/reviews?entityId=:id
```

---
*Statut : ✅ Spécification détaillée*