#  Portail Partenaire V1

## 🎯 Objectif

Fournir un accès en lecture seule aux partenaires pour qu'ils puissent suivre la performance de leurs produits et leurs commissions, renforçant ainsi la transparence et la collaboration.

## 👤 Utilisateurs Cibles

- **Partenaires Producteurs** : HABEEBEE, ILANGA NATURE, etc.
- **Rôle d'accès** : `PARTNER`

## 🎨 Design & Layout

### Structure Principale
```text
┌─────────────────────────────────────────────────────────────┐
│ [Logo Partenaire] | Portail Partenaire         [Profil] [Déconnexion] │
├─────────────────────────────────────────────────────────────┤
│ 📊 Dashboard                                                │
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐       │
│ │ Ventes (30j)  │ │ Produits Actifs │ │ Commissions   │       │
│ │ €18,450       │ │ 42            │ │ €4,612        │       │
│ └───────────────┘ └───────────────┘ └───────────────┘       │
├─────────────────────────────────────────────────────────────┤
│ 📦 Mes Produits                                             │
│ ┌───────────┬──────────┬──────────┬──────────┬───────────┐ │
│ │ Produit   │ Statut   │ Stock    │ Ventes   │ Actions   │ │
│ ├───────────┼──────────┼──────────┼──────────┼───────────┤ │
│ │ Miel Lav. │ Actif    │ 42       │ 156      │ [Voir]    │ │
│ └───────────┴──────────┴──────────┴──────────┴───────────┘ │
├─────────────────────────────────────────────────────────────┤
│ 💰 Mes Commissions                                          │
│ [Tableau des commissions par période]                       │
└─────────────────────────────────────────────────────────────┘
```

## 📱 Fonctionnalités MVP

### Dashboard
- **KPIs** : Ventes totales (en €), nombre de commandes, produits les plus vendus.
- **Graphique** : Évolution des ventes sur les 30 derniers jours.

### Gestion des Produits
- **Vue Liste** : Liste de tous leurs produits avec statut (actif, inactif, stock faible).
- **Vue Détail (Lecture Seule)** : Accès aux détails de la fiche produit telle que vue par les clients.
- **Gestion du Stock** : **ACTION PRINCIPALE** - Permettre au partenaire de mettre à jour son propre stock.

### Commissions
- **Vue Mensuelle** : Récapitulatif des commissions générées par mois.
- **Détail des Ventes** : Liste des ventes associées à la commission.
- **Statut Paiement** : Indication si la commission a été payée.

## 🚫 Fonctionnalités Exclues (Post-MVP)

- Création ou modification des fiches produits.
- Communication directe avec les clients.
- Accès aux données des autres partenaires.

## 📡 API & Données

### Routes tRPC (Rôle `PARTNER` requis)
```typescript
partner.dashboard.getStats: {
  output: { kpis: PartnerKPIs; sales_chart: SalesData[] };
}

partner.products.list: {
  output: { products: PartnerProduct[] };
}

partner.products.updateStock: {
  input: { productId: string; newStock: number };
  output: { success: boolean };
}

partner.commissions.getSummary: {
  input: { period: 'monthly' | 'quarterly' };
  output: { commissions: Commission[] };
}
```

---
**Note** : Cette spécification est une ébauche pour la V1/V2, mais sa création permet de définir le rôle `PARTNER` et d'anticiper l'architecture nécessaire.
