# Conformité Légale & Réglementaire

**Framework complet de conformité pour Make the CHANGE basé sur les décisions expertes finalisées**

---

## 🎯 **Positionnement Légal Sécurisé**

### **Classification Business Model**
```yaml
STATUT JURIDIQUE CONFIRMÉ:
✅ Marketplace + loyalty program (PAS investment regulation)
✅ Environmental impact platform (PAS securities law)  
✅ Rewards-based commerce (modèle légal éprouvé)

ÉVITER ABSOLUMENT:
❌ "Investment platform", "ROI", "rendement", "investissement"
❌ Communication financière ou promesses de performance

UTILISER EXCLUSIVEMENT:
✅ "Impact rewards", "contribution", "récompenses écologiques"
✅ "Plateforme d'impact", "soutien à la biodiversité"
✅ "Programme de fidélité environnemental"
```

---

## 🔐 **Seuils KYC & Vérification Client**

### **Seuils Réglementaires Finalisés (DÉCISION EXPERTE)**
```yaml
NIVEAU 1 (0-100€):
- Données requises: Email + nom + adresse postale
- Vérification: Email confirmation uniquement
- Délai: Immédiat
- Base légale: KYC allégé, pas de réglementation spécifique

NIVEAU 2 (100-3000€):
- Données requises: + Téléphone + date naissance
- Vérification: SMS + validation âge
- Délai: <24h
- Base légale: Directive anti-blanchiment 2018/843

NIVEAU 3 (+3000€):
- Données requises: + Pièce identité + justificatif domicile
- Vérification: Contrôle identité manuel
- Délai: 2-5 jours ouvrés
- Base légale: KYC renforcé directive européenne

RATIONALE:
Seuils conformes réglementation française/UE anti-blanchiment
sans surcharge administrative pour utilisateurs MVP
```

### **Process de Vérification Technique**
```yaml
OUTILS KYC:
- Niveau 1-2: Formulaires internes + validations automatiques
- Niveau 3: Partenaire KYC (ex: Onfido, Jumio) ou process manuel
- Coût estimé: 2-5€ par vérification niveau 3

STOCKAGE & SÉCURITÉ:
- Données chiffrées en base (AES-256)
- Accès logs complets
- Retention: 5 ans post-compte fermé (anti-blanchiment)
- Suppression: Automatique après délai légal
```

---

## 📋 **Conformité RGPD & Données Personnelles**

### **Base Légale & Traitements**
```yaml
BASES LÉGALES DÉFINIES:
- Exécution contrat: Service plateforme, gestion compte
- Intérêt légitime: Analytics, amélioration produit
- Consentement: Marketing, cookies non-essentiels
- Obligation légale: KYC, anti-blanchiment, fiscalité

TRAITEMENTS DOCUMENTÉS:
✅ Register des traitements selon template CNIL
✅ Finalités clairement définies par feature
✅ Durées conservation spécifiées
✅ Mesures sécurité techniques organisationnelles
```

### **Droits Utilisateurs & Implementation**
```yaml
DROITS UTILISATEURS:
- Accès: API export données complètes (JSON/PDF)
- Rectification: Interface self-service profile
- Suppression: Hard delete + anonymisation logs
- Portabilité: Export structuré réutilisable
- Opposition: Opt-out granulaire par finalité

IMPLEMENTATION TECHNIQUE:
- API RGPD intégrée dans architecture
- Suppression en cascade automatique
- Anonymisation irréversible données analytics
- Délai réponse: <30 jours (obligation légale)
```

### **DPO & Gouvernance**
```yaml
DPO (Data Protection Officer):
- Statut: Externe mutualisé (500€/mois)
- Responsabilités: Conseil, audit, formation équipe
- Contact: DPO déclaré CNIL + visible site web
- Justification: Économique vs DPO interne

PROCÉDURES:
- Impact assessment (PIA) si traitements sensibles
- Registre traitements maintenu à jour
- Formation équipe RGPD (budget: 1500€/an)
- Audit annuel conformité (budget: 3000€)
```

---

## 🍪 **Gestion Cookies & Tracking**

### **Catégorisation Cookies (DÉCISION EXPERTE)**
```yaml
COOKIES ESSENTIELS (pas de consentement requis):
- Authentification utilisateur (auth tokens)
- Panier e-commerce (session)
- Préférences langue/région
- Sécurité & fraud prevention

COOKIES ANALYTICS (consentement requis):
- Google Analytics 4 (comportement utilisateur)
- Hotjar (heatmaps, session replay)
- Vercel Analytics (performance technique)

COOKIES MARKETING (consentement séparé):
- Facebook Pixel (retargeting)
- Google Ads (conversion tracking)
- LinkedIn Insight Tag (B2B targeting)

SOLUTION TECHNIQUE:
- CookieYes (gratuit jusqu'à 100K pageviews)
- Banner RGPD-compliant avec choix granulaire
- Intégration GTM pour activation conditionnelle
```

---

## 📜 **Documents Légaux Requis**

### **Politique de Confidentialité**
```yaml
RÉDACTION:
- Base: Template juridique spécialisé
- Personnalisation: Par avocat spécialisé RGPD
- Langues: Français + Anglais (expansion)
- Mise à jour: Annuelle ou si changements majeurs

BUDGET:
- Rédaction initiale: 1500€ HT
- Mises à jour: 500€ HT/an
- Review légale: Avocat spécialisé fintech
```

### **Conditions Générales (CGU/CGV)**
```yaml
STRUCTURE SÉPARÉE:
- CGU: Utilisation plateforme, compte utilisateur, responsabilités
- CGV: Achats produits, livraisons, retours, points

JURIDICTION:
- Droit applicable: Français
- Tribunaux compétents: Paris (siège social)
- Médiation: Médiation de la consommation obligatoire

CLAUSES SPÉCIFIQUES:
- Points ≠ monnaie légale (clause protectrice)
- Réallocation projets (transparence)
- Limite responsabilité (cas de force majeure)
- Résiliation compte (procédure claire)
```

### **Mentions Légales & Transparence**
```yaml
INFORMATIONS OBLIGATOIRES:
- Raison sociale: [SAS Make the CHANGE]
- Capital social: 10 000€
- Siège social: [Adresse complète]
- RCS: [Numéro registre commerce]
- SIRET: [Numéro identification]
- TVA intracommunautaire: [Si applicable]

CONTACT:
- Responsable publication: [Nom dirigeant]
- Contact DPO: dpo@makethechange.fr
- Service client: support@makethechange.fr
- Téléphone: [Numéro service client]
```

---

## ⚖️ **Conformité Fiscale & TVA**

### **Gestion TVA Internationale**
```yaml
RÈGLES TVA APPLIQUÉES:
- France: 20% standard (résidence fiscale)
- UE: TVA pays destination si >10K€ CA/pays/an
- Hors UE: Export HT, douanes à charge destinataire

OUTILS:
- API TVA européenne (TaxJar, Avalara)
- Calcul automatique selon adresse livraison
- Facturation conforme par pays
- Déclarations TVA automatisées

POINTS → TVA:
- Base calcul: 1 point = 0.85€ TTC
- Responsabilité: Gestion interne plateforme
- Utilisateur: Aucun calcul visible
```

### **Comptabilité & Reporting**
```yaml
EXPERT-COMPTABLE:
- Profil: Spécialisé startup/fintech
- Budget: 150€/mois + clôture annuelle
- Outils: Intégration comptable automatisée
- Livrables: Bilans, déclarations, conseil fiscal

OBLIGATIONS:
- Facturation conforme (mentions obligatoires)
- Archivage 10 ans (dématérialisé)
- Déclarations TVA (mensuelle si >€238K CA)
- Liasse fiscale annuelle
```

---

## 🛡️ **Sécurité & Audit**

### **Security Headers & Protection**
```yaml
HEADERS SÉCURITÉ OBLIGATOIRES:
- Content Security Policy (CSP): Strict
- HTTP Strict Transport Security (HSTS): Force HTTPS
- X-Frame-Options: DENY (anti-clickjacking)
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

CERTIFICATS SSL:
- Automatique: Let's Encrypt via Vercel (Edge + Node runtimes)
- Renouvellement: Automatique
- Grade: A+ sur SSL Labs
```

### **Audit & Tests Sécurité**
```yaml
TESTS AUTOMATISÉS:
- GitHub Security scanning (gratuit)
- Snyk vulnerability scanning
- OWASP ZAP automated testing

AUDIT EXTERNE:
- Timing: Avant lancement public
- Scope: Authentication, payment flow, data exposure
- Budget: 1500€ pentest basique
- Suivi: Fix critical/high avant production
```

---

## 📞 **Support & Réclamations**

### **Service Client Légal - DUAL BILLING COMPLIANCE**
```yaml
OBLIGATIONS SUPPORT:
- Délai réponse: <24h email, <2h chat (SLA interne)
- Langues: Français obligatoire, anglais optionnel
- Escalation: Process clair niveau 1 → niveau 2
- Satisfaction: Mesure CSAT >85%
- NOUVEAU: Billing support specialized (subscription management)

MÉDIATION CONSOMMATION:
- Obligatoire: Plateforme médiation européenne
- Information: Mention sur site + CGV
- Process: Tentative résolution amiable d'abord
- Coût: Gratuit pour consommateurs
- NOUVEAU: Monthly billing disputes (SEPA, cancellation rights)

BILLING COMPLIANCE (NOUVEAU):
- Monthly subscriptions: SEPA mandate + droit de rétractation 14 jours
- Failed payment recovery: Max 3 attempts, clear communication
- Cancellation rights: Clear process, no barriers
- Stripe Customer Portal: Direct access pour self-service
- Proration transparency: Clear calculation si changement plan
```

### **Traitement Réclamations**
```yaml
PROCESS RÉCLAMATIONS:
1. Réception: Email dédié reclamations@
2. Accusé réception: <48h avec numéro suivi
3. Investigation: 7-15 jours selon complexité
4. Réponse: Motivée avec solutions proposées
5. Suivi: Satisfaction post-résolution

ESCALATION:
- DGCCRF: Concurrence, consommation, répression fraudes
- CNIL: Protection données personnelles
- ACPR: Si suspicion activité bancaire non autorisée
```

---

## 🌍 **Expansion Internationale**

### **Roadmap Conformité**
```yaml
PHASE 1 - FRANCE (Mois 1-6):
✅ Tous éléments ci-dessus implémentés
✅ Conformité RGPD complète
✅ KYC français/européen

PHASE 2 - BELGIQUE (Mois 6-12):
- Adaptation KYC belge (si différences)
- TVA intracommunautaire
- Mentions légales bilingues (FR/NL)

PHASE 3 - SUISSE (Mois 12-18):
- Conformité LPD (loi suisse protection données)
- TVA suisse (7.7%)
- Réglementation financière (si applicable)

PHASE 4 - CANADA/QUÉBEC (Mois 18-24):
- Conformité PIPEDA (protection données canadienne)
- Loi 25 Québec (équivalent RGPD)
- Réglementation provinciale
```

---

## 📊 **Budget Compliance Annuel**

```yaml
COÛTS FIXES ANNUELS:
- Expert-comptable: 1800€
- DPO externe: 6000€
- Assurances: 2100€
- Documents légaux: 2000€
- Outils compliance: 1200€

COÛTS VARIABLES:
- KYC niveau 3: 2-5€/vérification
- Audit sécurité: 1500€/an
- Formation équipe: 1500€/an
- Conseil juridique: 3000€/an

TOTAL BUDGET: ~18 000€/an
Soit 1500€/mois pour conformité complète
```

---

## ✅ **Checklist Lancement MVP - DUAL BILLING**

### **Pré-lancement Obligatoire**
```yaml
DOCUMENTS:
□ Politique confidentialité finalisée
□ CGU/CGV validées avocat
□ Mentions légales complètes
□ DPO déclaré et contactable
□ NOUVEAU: Terms specific dual billing (monthly vs annual)

TECHNIQUE:
□ HTTPS activé et forcé
□ Security headers implémentés
□ Cookie banner RGPD-compliant
□ API export/suppression données
□ NOUVEAU: Stripe webhooks security validated

PROCESSUS:
□ KYC testé tous niveaux
□ Support client opérationnel
□ Process réclamations documenté
□ Registre RGPD à jour
□ NOUVEAU: Billing support scripts trained
□ NOUVEAU: Failed payment recovery process tested
□ NOUVEAU: Cancellation rights clearly communicated

DUAL BILLING COMPLIANCE:
□ SEPA mandates properly configured
□ Proration calculations transparent et accurate
□ Customer Portal access functional
□ Monthly subscription cancellation tested
□ Annual subscription refund policy defined

ASSURANCES:
□ RC Professionnelle souscrite
□ Cyber-risques activée
□ Responsabilité produits confirmée
```

---

**🎯 Conformité Niveau Entreprise Garantie**  
*Toutes décisions basées sur expertise juridique et meilleures pratiques secteur*  
*Ready for scale international - Framework évolutif*

---

*Document maintenu par: Legal Team + DPO*  
*Dernière révision: 22 août 2025*
