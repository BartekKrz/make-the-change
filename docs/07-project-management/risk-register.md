# Registre des Risques - Make the CHANGE

## Vue d'ensemble

Ce registre identifie, évalue et documente les stratégies de mitigation pour les risques critiques du projet Make the CHANGE. Basé sur l'analyse externe indépendante et les stress-tests financiers.

---

## 🚨 TOP 5 RISQUES CRITIQUES

### 1. **RISQUE DE LIQUIDITÉ - Points Redemption**

**Description :** Taux de redemption points supérieur aux prévisions causant tensions trésorerie

**Impact :** 🔴 CRITIQUE  
**Probabilité :** 🟡 MOYEN (25%)

#### Scénarios de Stress
| Redemption Rate | Impact Trésorerie | Provision Requis | Conséquences |
|-----------------|-------------------|------------------|--------------|
| **95%** (Pessimiste) | -3 800€ | 17 100€ | Stress aigu |
| **90%** (Alerte) | -1 900€ | 15 300€ | Tension |
| **80%** (Cible) | Équilibré | 13 500€ | Nominal |

#### Signaux d'Alerte Précoce
- Taux mensuel > 85% pendant 2 mois consécutifs
- Age moyen points < 8 mois (utilisation accélérée)
- Ratio couverture < 110%

#### Plan de Contingence
**Phase 1 - Alerte (Redemption 85-90%) :**
1. Surveillance quotidienne du passif
2. Négociation délais paiement partenaires (+7 jours)
3. Incitations différées (bonus si attente 30j)

**Phase 2 - Urgence (Redemption >90%) :**
1. Suspension nouvelles inscriptions 48h
2. Activation ligne crédit secours (15k€)
3. Communication transparente communauté
4. Priorisation micro-stock vs dropshipping

**Phase 3 - Crise (Ratio couverture <105%) :**
1. Plan sauvegarde activé
2. Renégociation immédiate bonus futurs
3. Audit externe recommandé

---

### 2. **RISQUE DE CONVERSION - Acquisition**

**Description :** Taux conversion Explorateur→Protecteur inférieur à 30% cible

**Impact :** 🟠 ÉLEVÉ  
**Probabilité :** 🟡 MOYEN (35%)

#### Seuils d'Alerte
- Conversion < 20% après 3 mois : Action immédiate
- Conversion < 15% après 6 mois : Pivot modèle
- CAC > 35€ : Révision acquisition strategy

#### Facteurs de Risque
- UX app insuffisamment convaincante
- Proposition valeur mal comprise
- Concurrence plus agressive
- Contexte économique dégradé

#### Stratégies de Mitigation
**Préventif :**
- A/B testing continuel parcours conversion
- Feedback loops utilisateurs (NPS mensuel)
- Benchmark concurrentiel trimestriel
- Formation équipe sales techniques objections

**Correctif :**
- Bonus bienvenue progressifs (10→20→30 pts)
- Triggers urgence personnalisés
- Testimonials clients success stories
- Remarketing ciblé segments chauds

---

### 3. **RISQUE DE CHURN - Rétention Ambassadeurs**

**Description :** Taux churn abonnés >15% annuel fragilisant récurrence

**Impact :** 🟠 ÉLEVÉ  
**Probabilité :** 🟡 MOYEN (30%)

#### Métriques de Surveillance
- Churn mensuel >1.5% : Alerte
- NPS <50 : Investigation
- Usage points <60% après 6 mois : Intervention

#### Signaux Comportementaux
- Connexions app en baisse >50%
- Dernière commande >120 jours
- Support tickets récurrents
- Non-renouvellement automatique

#### Programme Anti-Churn
**Proactif :**
- Score santé client (algorithme prédictif)
- Engagement automatisé (emails triggers)
- Valeur ajoutée continue (nouveaux produits)
- Programme VIP (top 10% utilisateurs)

**Réactif :**
- Interviews de sortie systématiques
- Offres win-back personnalisées
- Extension gratuite 30 jours
- Downgrade vers Protecteur (vs churn total)

---

### 4. **RISQUE PARTENAIRES - Défaillance Supply**

**Description :** Indisponibilité partenaire principal (HABEEBEE) ou qualité dégradée

**Impact :** 🟠 ÉLEVÉ  
**Probabilité :** 🟢 FAIBLE (15%)

#### Scénarios de Défaillance
**Défaillance HABEEBEE (40% du catalog) :**
- Impact immédiat : Ruptures stock 2-3 semaines
- Solutions : Activation partenaires backup (PROMIEL)
- Communication : Transparence + compensation (bonus points)

**Qualité produits dégradée :**
- Seuil alerte : >5% réclamations qualité/mois
- Action : Audit terrain + plan amélioration
- Compensation : Geste commercial automatique

#### Diversification Supply Chain
**Objectifs 12 mois :**
- Minimum 5 partenaires actifs
- Aucun partenaire >30% du volume
- 2 sources par catégorie produit
- Stocks secours 2 semaines (produits héros)

**Contracts & SLA :**
- Clauses qualité avec pénalités
- Délais livraison garantis (J+3 standard)
- Force majeure / backup suppliers
- Révision tarifaire encadrée

---

### 5. **RISQUE RÉGLEMENTAIRE - Évolution Cadre Légal**

**Description :** Durcissement réglementation programmes fidélité ou qualification investissement

**Impact :** 🟡 MOYEN  
**Probabilité :** 🟢 FAIBLE (20%)

#### Évolutions Potentielles
**Réglementation programmes fidélité :**
- Obligations info renforcées
- Délais expiration minimums
- Transparence algorithmes recommandation

**Qualification financière :**
- Requalification en produit d'épargne
- Obligations ACPR/AMF
- KYC renforcé obligatoire

#### Conformité Préventive
**Veille juridique :**
- Monitoring mensuel évolutions AMF/ACPR
- Réseau avocats spécialisés fintech
- Participation groupes de travail secteur

**Adaptabilité modèle :**
- Wording prudent ("récompenses" vs "rendement")
- Architecture technique modulaire
- Provisions conformité budgetées

---

## 📊 RISQUES SECONDAIRES

### 6. **Risque Technique - Sécurité & Performance**

**Impact :** 🟡 MOYEN | **Probabilité :** 🟢 FAIBLE (10%)

**Mitigations :**
- Monitoring 24/7 (Datadog/Sentry)
- Tests charge automatisés
- Plan de continuité (RTO <4h)
- Assurance cyber obligatoire

### 7. **Risque Concurrentiel - Nouveaux Entrants**

**Impact :** 🟡 MOYEN | **Probabilité :** 🟡 MOYEN (40%)

**Mitigations :**
- Brevets/IP sur innovations clés
- Partenariats exclusifs moyen terme
- Time-to-market accéléré
- Network effects (communauté)

### 8. **Risque Macroéconomique - Récession**

**Impact :** 🟠 ÉLEVÉ | **Probabilité :** 🟡 MOYEN (25%)

**Mitigations :**
- Modèle résilient (substitution vs nouveaux achats)
- Prix adaptatifs (offres étudiants/chomeurs)
- Diversification B2B corporate
- Réserves cash 6 mois minimum

---

## 🎯 MATRICE RISQUES & ACTIONS

### Risques Immédiats (0-3 mois)
1. **Setup dashboard liquidité** - Responsable : CFO
2. **Tests A/B conversion** - Responsable : Growth
3. **Diversification partenaires** - Responsable : Partnerships

### Risques Court Terme (3-12 mois)
1. **Modèle prédictif churn** - Responsable : Data
2. **Expansion catalog** - Responsable : Procurement
3. **Veille concurrentielle** - Responsable : Strategy

### Risques Long Terme (12+ mois)
1. **Internationalisation** - Responsable : Expansion
2. **Innovation produit** - Responsable : R&D
3. **Acquisitions stratégiques** - Responsable : M&A

---

## 📈 KPIs de Suivi des Risques

| Risque | KPI Principal | Fréquence | Seuil Alerte | Action |
|--------|---------------|-----------|--------------|--------|
| **Liquidité** | Ratio couverture | Hebdomadaire | <110% | Plan contingence |
| **Conversion** | Taux Explorer→Protecteur | Mensuel | <20% | A/B tests urgents |
| **Churn** | Taux churn mensuel | Mensuel | >1.5% | Programme rétention |
| **Partenaires** | Taux réclamations | Mensuel | >5% | Audit qualité |
| **Réglementaire** | Évolutions cadre | Trimestriel | Changement | Adaptation modèle |

---

## 📋 Plan de Revue et Mise à Jour

**Fréquence :** Trimestrielle + événementiel  
**Responsable :** Risk Manager (CFO interim Phase 1)  
**Participants :** Équipe direction, advisors

**Revue inclut :**
- Réévaluation probabilités/impacts
- Nouveaux risques identifiés
- Efficacité mitigations déployées
- Ajustements plans de contingence
- Communication équipe/board

**Prochaines revues :**
- Q1 2025 : Post-lancement MVP
- Q2 2025 : Post-scale initial
- Q3 2025 : Pré-Series A
- Q4 2025 : Bilan année 1

---

*Dernière mise à jour : Décembre 2024*  
*Basé sur analyse externe indépendante + expertise interne*  
*Classification : Confidentiel - Usage interne uniquement*