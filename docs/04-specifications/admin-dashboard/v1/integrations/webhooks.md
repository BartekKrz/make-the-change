# ↩️ Gestion des Webhooks (V1)

## 🎯 Objectif

Configurer et monitorer les webhooks entrants (ex: Stripe pour les paiements) et sortants (ex: notifier un partenaire d'une nouvelle commande).

## 📋 Features V1

- **Liste des Webhooks** : Voir tous les webhooks configurés (entrants et sortants).
- **Visualiseur de Payloads** : Inspecter le contenu des derniers événements reçus ou envoyés.
- **Moniteur de Statut** : Suivre les succès et les échecs de livraison pour chaque endpoint.
- **Mécanisme de Rejeu (Retry)** : Rejouer manuellement un événement qui a échoué.
- **Création de Webhooks Sortants** : Interface pour ajouter de nouveaux webhooks à notifier lors d'événements système.

## 🖼️ Interface Utilisateur

- **Tableau de Bord des Webhooks** : KPIs sur le volume et le taux de succès.
- **Logs Détaillés** : Table avec recherche et filtrage par statut, endpoint, ou type d'événement.

## 📡 API & Données

```typescript
// Endpoint pour les webhooks
admin.webhooks.logs.list
admin.webhooks.logs.retry
admin.webhooks.configs.create
```

---
*Statut : ✅ Spécification détaillée*