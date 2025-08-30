# 📊 Analytics Avancées (V1)

## 🎯 Objectif

Fournir des outils d'analyse plus poussés pour les administrateurs et les utilisateurs experts (persona Marc) afin de suivre la performance en détail, d'identifier des tendances et de prendre des décisions basées sur les données.

## 👤 Utilisateurs Cibles

- **Administrateurs & Analystes** : Pour le pilotage stratégique.
- **Équipe Marketing** : Pour mesurer l'efficacité des campagnes.
- **Équipe Produit** : Pour comprendre l'engagement utilisateur.

## 📋 Features V1

### 1. Dashboard Personnalisable
- **Widgets déplaçables et configurables** : L'utilisateur peut choisir les KPIs à afficher et organiser son dashboard.
- **Filtres globaux** : Filtrer tout le dashboard par période, par pays, ou par niveau utilisateur.

### 2. Rapports d'Export
- **Exports PDF/CSV** : Pour les investissements, transactions de points, et listes d'utilisateurs.
- **Rapports programmés** : Envoyer automatiquement des rapports hebdomadaires/mensuels par email.

### 3. Analyse de Cohortes
- **Suivi de la rétention** : Analyser la rétention des utilisateurs par cohorte d'inscription (jour, semaine, mois).
- **Analyse LTV/CAC** : Suivre la Lifetime Value (LTV) et le Coût d'Acquisition Client (CAC) par cohorte et par canal d'acquisition.

### 4. Benchmark de Performance
- **Comparaison de projets** : Comparer la performance de financement, l'engagement et l'impact de plusieurs projets côte à côte.
- **Benchmark partenaires** : Analyser la performance des produits par partenaire.

## 🖼️ Interface Utilisateur

- **Graphiques interactifs** : Zoom, survol pour détails, filtres dynamiques.
- **Tables de données avancées** : Tri, recherche, et filtres sur chaque colonne.
- **Visualisation de funnels** : Représentation visuelle du tunnel de conversion (Explorateur → Protecteur → Ambassadeur).

## 📡 API & Données

```typescript
// Endpoint pour les données de cohorte
admin.analytics.getCohortData: {
  input: { cohortType: 'signup' | 'first_investment', period: 'daily' | 'weekly' | 'monthly' },
  output: { cohorts: CohortData[] }
}

// Endpoint pour les rapports
admin.analytics.generateReport: {
  input: { reportType: 'users' | 'investments', format: 'csv' | 'pdf', filters: any },
  output: { downloadUrl: string }
}
```

## 🔗 Références

- [KPIs & Métriques](../../../01-strategy/kpis-metrics.md)

---
*Statut : ✅ Spécification détaillée*