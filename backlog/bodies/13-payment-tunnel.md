# 💳 Payment Tunnel Stripe - Dual Billing Support

## 🎯 Contexte Mis à Jour

**CHANGEMENT MAJEUR** : Support du **dual billing system** (mensuel/annuel) avec gestion des upgrades, proration et économies automatiques.

## 🔧 Requirements Techniques

### Stripe Integration
- [ ] Configuration subscriptions mensuelles ET annuelles
- [ ] SEPA mandates pour abonnements mensuels
- [ ] Proration automatique pour upgrades mensuel→annuel
- [ ] Customer Portal avec self-service billing management

### Payment Flow
- [ ] Interface sélection billing frequency
- [ ] Calculateur économies temps réel (17% discount annuel)
- [ ] Confirmation upgrade avec proration détaillée
- [ ] Failed payment recovery différencié par billing type

## 📊 Nouvelles Grilles Tarifaires

### Ambassadeur Standard
- **Mensuel** : 18€/mois → 24 points
- **Annuel** : 180€/an → 252 points (**36€ économisés**)

### Ambassadeur Premium
- **Mensuel** : 32€/mois → 40 points  
- **Annuel** : 320€/an → 480 points (**64€ économisés**)

## ✅ Critères d'Acceptation

- ✅ Support complet dual billing (mensuel + annuel)
- ✅ Proration précise pour tous les changements
- ✅ Économies clairement affichées (36€/64€)
- ✅ Conformité SEPA + cancellation rights
