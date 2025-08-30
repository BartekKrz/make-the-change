# 💰 Investment Tiers Manager - Grille Tarifaire Définitive

## 🎯 Contexte Mis à Jour

**CHANGEMENT MAJEUR** : La grille tarifaire a été **finalisée et rendue obligatoire** selon `pricing-master-sheet.md`. Tous les prix sont désormais **définitifs** et ne peuvent être modifiés sans validation business.

## 📊 Grille Tarifaire Obligatoire

### 🛡️ Investissements Protecteur (Niveau 2)

#### 🐝 Ruche HABEEBEE
- **Prix** : €50 → **65 points** (bonus 30%)
- **Partenaire** : HABEEBEE Belgique
- **Commission** : 20% confirmée

#### 🫒 Olivier ILANGA  
- **Prix** : €80 → **112 points** (bonus 40%)
- **Partenaire** : ILANGA NATURE Madagascar
- **Commission** : 25% négociée

#### 🌿 Parcelle Familiale
- **Prix** : €150 → **225 points** (bonus 50%)
- **Multi-partenaires** selon localisation
- **Commission** : Variable selon partenaire

### 👑 Abonnements Ambassadeur (Dual Billing)

#### Standard
- **Mensuel** : 18€ → 24 points (33% bonus)
- **Annuel** : 180€ → 252 points (40% bonus) + 17% discount

#### Premium
- **Mensuel** : 32€ → 40 points (25% bonus)  
- **Annuel** : 320€ → 480 points (50% bonus) + 17% discount

## 🔧 Requirements Admin Dashboard

### Interface de Gestion
- [ ] CRUD Investment Tiers avec prix **non-modifiables**
- [ ] Calculateur automatique points/bonus selon grille
- [ ] Interface commission management par partenaire
- [ ] Validation business obligatoire pour tout changement prix

### Business Logic
- [ ] Implémentation grille tarifaire en dur (pas de configuration)
- [ ] Calcul automatique des commissions partenaires
- [ ] Système d'alertes pour tentatives de modification prix
- [ ] Audit trail pour toute modification tarifaire

### Reporting
- [ ] Dashboard revenus par tier et billing frequency
- [ ] Métriques de conversion mensuel→annuel
- [ ] Analyse marge par investissement et partenaire

## ⚠️ Contraintes Critiques

- **AUCUNE modification prix** sans validation business
- **Grille obligatoire** selon pricing-master-sheet.md
- **Commission figée** par partenaire selon accords
- **Bonus automatiques** selon formules définies

## 📈 Impact Business

**Objectif** : Système de pricing transparent et prévisible pour optimiser conversion et marges.

**KPIs** :
- Respect 100% grille tarifaire obligatoire
- Commission tracking précis par partenaire
- Conversion rate amélioration avec dual billing
