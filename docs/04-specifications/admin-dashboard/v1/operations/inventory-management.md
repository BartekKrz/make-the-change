# 📦 Gestion d'Inventaire et Micro-Stocks (V1)

## 🎯 Objectif

Permettre une gestion hybride de l'inventaire, en différenciant les produits en dropshipping (partenaires) et les produits en micro-stock gérés par Make the CHANGE pour optimiser les marges et les délais de livraison sur les produits phares.

## 📋 Features V1

- **Vue d'Inventaire Unifiée** : 
  - Tableau de bord listant tous les produits avec une colonne "Type de Fulfillment" (Dropshipping / Stock MTC).
- **Gestion des Niveaux de Stock (pour produits MTC)** :
  - Mise à jour manuelle des quantités.
  - Alertes de stock bas (seuil configurable).
  - Historique des mouvements de stock (entrées, sorties, ajustements).
- **Informations Fournisseur** : Associer des fournisseurs et des coûts d'achat aux produits en stock MTC pour calculer la marge réelle.
- **Différenciation du Workflow de Commande** :
  - Les commandes contenant des produits "Stock MTC" génèrent un bon de préparation pour l'équipe interne.
  - Les commandes "Dropshipping" continuent d'être routées vers les partenaires.

## 🖼️ Interface Utilisateur (Admin Dashboard)

- **Fiche Produit Enrichie** : Une nouvelle section "Gestion du Stock" permet de définir le type de fulfillment. Si "Stock MTC", des champs pour la quantité, le seuil d'alerte, et le fournisseur apparaissent.
- **Page de Gestion d'Inventaire** : Une nouvelle page dédiée au suivi des stocks, aux alertes et à l'historique des mouvements.

## 📡 API & Données

```typescript
// Mettre à jour le stock d'un produit MTC
admin.inventory.updateStock: {
  input: { productId: string, quantityChange: number, reason: string },
  output: { success: boolean, newQuantity: number }
}

// Obtenir l'historique de stock pour un produit
admin.inventory.getHistory: {
  input: { productId: string },
  output: { history: StockMovement[] }
}
```

---
*Statut : ✅ Spécification détaillée*