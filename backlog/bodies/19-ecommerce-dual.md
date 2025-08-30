# 🛒 E-commerce System Hybride - Dual Billing

## 🎯 Contexte Mis à Jour

**CHANGEMENT MAJEUR** : Implémentation du **système e-commerce hybride** avec support dual billing, grille tarifaire définitive et gestion commission automatique.

## 🔧 Requirements Admin Dashboard

### Dual Billing Management
- [ ] Interface gestion abonnements mensuels/annuels
- [ ] Dashboard conversion mensuel→annuel
- [ ] Proration management pour upgrades/downgrades
- [ ] Reporting MRR/ARR différencié

### Pricing Management
- [ ] Grille tarifaire définitive (non-modifiable)
- [ ] Calcul automatique commissions partenaires
- [ ] Système d'alertes modification prix
- [ ] Audit trail complet modifications

### Order Management
- [ ] Gestion commandes points vs cash
- [ ] Tracking commission par partenaire
- [ ] Fulfillment workflow hybride (dropshipping + micro-stock)

## 📊 Business Logic

### Commission Structure
- **HABEEBEE** : 20% confirmée
- **ILANGA NATURE** : 25% négociée
- **Futurs partenaires** : 20-25% selon accords

### Points System
- **1 point = 1€** valeur produit garantie
- **Expiration** : 18 mois avec alertes automatiques
- **Bonus** : Selon grille investissement/abonnement

## 🎯 Critères d'Acceptation

- ✅ Support complet dual billing (mensuel/annuel)
- ✅ Grille tarifaire définitive implémentée
- ✅ Commission tracking automatique par partenaire  
- ✅ Dashboard business metrics (MRR/ARR/conversion)
- ✅ Système d'audit pour modifications critiques

## 📈 Impact Business

**Objectif** : Backend e-commerce robuste supportant le modèle hybride avec dual billing optimisé.

**Métriques** :
- Conversion mensuel→annuel : >20%
- Commission accuracy : 100%
- Order processing : <24h fulfillment
