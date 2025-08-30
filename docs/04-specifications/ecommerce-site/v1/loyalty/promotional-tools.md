# 🏷️ Outils Promotionnels (V1)

## 🎯 Objectif

Permettre à l'équipe marketing de créer et gérer des campagnes promotionnelles pour stimuler les ventes et l'engagement.

## 📋 Features V1

- **Gestion de Codes Promo** (Admin) :
  - Créer des codes (ex: "NOEL20").
  - Définir le type de réduction : % de points bonus, points fixes offerts.
  - Définir les conditions : date de validité, usage unique/multiple, minimum d'investissement.
- **Application des Codes** (Utilisateur) :
  - Champ "Code promo" dans le tunnel d'investissement.
  - Validation et application de la réduction en temps réel.
- **Bannières Promotionnelles** (Admin) :
  - Gérer des bannières sur la homepage ou le catalogue pour annoncer des offres spéciales (ex: "Doublez vos points ce week-end !").

## 🖼️ Interface Utilisateur

- **Admin** : Interface de création/gestion de campagnes dans le dashboard admin.
- **Utilisateur** : Champ de saisie dans le checkout, bannières cliquables.

## 📡 API & Données

```typescript
// Valider un code promo
POST /api/promotions/validate
Body: { code: string, context: any }
Output: { valid: boolean, discount: DiscountDetails }
```

---
*Statut : ✅ Spécification détaillée*