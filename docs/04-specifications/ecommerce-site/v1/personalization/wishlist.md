# ❤️ Wishlist (V1)

## 🎯 Objectif

Permettre aux utilisateurs de sauvegarder les produits qui les intéressent pour un achat ultérieur, augmentant ainsi la rétention et les opportunités de conversion.

## 📋 Features V1

- **Ajout/Retrait Facile** : Bouton "coeur" sur les cartes produits et les pages de détail.
- **Page Wishlist dédiée** : Accessible depuis le compte utilisateur, listant tous les produits sauvegardés.
- **Statut du Stock** : Affichage clair de la disponibilité des produits dans la wishlist.
- **Notifications (V2)** : Alertes optionnelles si un produit de la wishlist est bientôt en rupture de stock ou en promotion.
- **Ajout au Panier Direct** : Bouton pour ajouter un article au panier directement depuis la wishlist.

## 🖼️ Interface Utilisateur

- **Icône Coeur** : Change d'état (vide/plein) pour indiquer si un produit est dans la wishlist.
- **Page Wishlist** : Grille de produits similaire au catalogue, avec des actions spécifiques (Ajouter au panier, Supprimer).

## 📡 API & Données

```typescript
// Obtenir la wishlist
GET /api/user/wishlist

// Ajouter/Retirer un produit
POST /api/user/wishlist
Body: { productId: string, action: 'add' | 'remove' }
```

---
*Statut : ✅ Spécification détaillée*