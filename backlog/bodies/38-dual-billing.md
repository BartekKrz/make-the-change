# 💳 Dual Billing Management - Système Mensuel/Annuel

## 🎯 Contexte Mis à Jour

**CHANGEMENT MAJEUR** : Le modèle économique a évolué vers un **système hybride dual billing** avec options mensuelles ET annuelles pour maximiser l'accessibilité et la rétention.

## 📊 Nouvelles Spécifications (business-model-definitive.md)

### Ambassadeur Standard
- **Mensuel** : 18€/mois → 24 points (bonus 33%)
- **Annuel** : 180€/an → 252 points (bonus 40%) + **17% discount**

### Ambassadeur Premium  
- **Mensuel** : 32€/mois → 40 points (bonus 25%)
- **Annuel** : 320€/an → 480 points (bonus 50%) + **17% discount**

## 🔧 Requirements Techniques

### Frontend Mobile & Web
- [ ] Interface de sélection billing frequency (mensuel/annuel)
- [ ] Calculateur d'économies en temps réel (17% discount annuel)
- [ ] Flow d'upgrade mensuel → annuel avec proration
- [ ] Gestion des renouvellements automatiques différenciés

### Backend API
- [ ] Endpoints subscription management dual billing
- [ ] Logique de proration pour upgrades/downgrades
- [ ] Calcul automatique points selon billing frequency
- [ ] Webhooks Stripe pour les deux modèles

### Stripe Integration
- [ ] Configuration SEPA mandates pour mensuel
- [ ] Setup annual subscriptions avec discount
- [ ] Customer Portal avec gestion self-service
- [ ] Failed payment recovery différencié

## 🎯 Critères d'Acceptation

- ✅ Utilisateur peut choisir mensuel ou annuel à l'inscription
- ✅ Économies annuelles clairement affichées (36€/64€)
- ✅ Upgrade mensuel→annuel possible avec proration
- ✅ Points générés selon la nouvelle grille (24/40 mensuel, 252/480 annuel)
- ✅ Conformité légale dual billing (SEPA + cancellation rights)

## 📈 Impact Business

**Objectif** : 60% annual / 40% monthly mix pour optimiser LTV et cash-flow.

**Métriques** :
- Monthly→Annual conversion rate : >20% après 6 mois
- Retention : Monthly <12% churn, Annual <8% churn
- MRR blended improvement : +15% vs annual-only model
