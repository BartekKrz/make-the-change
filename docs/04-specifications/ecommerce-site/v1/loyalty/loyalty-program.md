# 🎁 Programme de Fidélité (V1)

## 🎯 Objectif

Récompenser la fidélité des utilisateurs sur le long terme en offrant des avantages progressifs basés sur leur niveau d'engagement.

## 📋 Features V1

- **Tiers de Fidélité** : Basé sur le total de points gagnés à vie.
  - **Bronze** (0+ pts) : Accès standard.
  - **Argent** (2,000+ pts) : Bonus de points de +5% sur les nouveaux investissements.
  - **Or** (5,000+ pts) : Bonus de +10%, accès à des produits exclusifs.
- **Avantages par Tiers** : 
  - Multiplicateurs de points.
  - Accès anticipé aux nouveaux projets.
  - Produits exclusifs réservés aux tiers supérieurs.
- **Dashboard de Fidélité** : Page dans le compte utilisateur pour suivre son statut, ses avantages et sa progression vers le prochain tier.

## 🖼️ Interface Utilisateur

- **Indicateur de Tier** : Badge visible sur le profil utilisateur.
- **Barre de Progression** : Montre le chemin restant pour atteindre le prochain tier.

## 📡 API & Données

```typescript
// Obtenir le statut de fidélité
GET /api/user/loyalty-status
Output: { tier: 'bronze' | 'silver' | 'gold', progress: number, benefits: string[] }
```

---
*Statut : ✅ Spécification détaillée*