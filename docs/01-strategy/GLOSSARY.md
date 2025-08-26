# 📖 Glossaire - Make the CHANGE

Ce document définit les termes et concepts clés utilisés dans le projet pour assurer un langage commun et une compréhension partagée.

---

### **Modèle Hybride Biodiversité**
Modèle économique révolutionnaire à 3 niveaux d'engagement progressifs : exploration gratuite, investissements dans des projets spécifiques, et abonnements premium avec allocation flexible.

### **Points**
Unité de compte virtuelle de la plateforme. Les points sont gagnés via investissements ou abonnements et peuvent être utilisés pour acquérir des produits à prix négociés. 
- **Génération :** Investissements et abonnements avec bonus 30-50%
- **Valeur d'échange :** 1 point = 1€ de valeur produit à prix négocié
- **Expiration :** 18 mois après leur génération

### **Niveaux d'Engagement Hybrides**
Système progressif à 3 niveaux selon l'engagement utilisateur.

**Niveau 1 - Explorateur (Gratuit)**
- Exploration complète application et projets
- Consultation catalogue à prix retail normaux
- Aucun investissement requis

**Niveau 2 - Protecteur (Investissements)**  
- 1 ruche HABEEBEE : 50€ → 65 points (bonus 30%)
- 1 olivier ILANGA : 80€ → 105 points (bonus 31%)
- Parcelle familiale : 150€ → 210 points (bonus 40%)
- Suivi personnalisé de ses projets spécifiques

**Niveau 3 - Ambassadeur (Abonnements)**
- Standard : 200€/an → 280 points (bonus 40%)
- Premium : 350€/an → 525 points (bonus 50%)
- Allocation flexible sur tous projets

### **Partenaires**
Producteurs ou organisations qui fournissent à la fois les projets à financer et les produits disponibles dans la boutique de récompenses. Ils sont au cœur de l'écosystème.
- **HABEEBEE :** Partenaire belge spécialisé dans les produits de la ruche.
- **ILANGA NATURE :** Partenaire malgache spécialisé dans les projets d'agroforesterie (oliviers) et les produits naturels.
- **PROMIEL :** Partenaire luxembourgeois spécialisé dans les miels premium.

### **Impact**
Bénéfices environnementaux et sociaux générés par les abonnements des membres. L'impact est mesuré via des KPIs concrets (ex: tonnes de CO₂ compensées, nombre d'arbres plantés, etc.).

---

## 🔧 **Termes Techniques Spécifiques**

### **tRPC v11**
Framework API type-safe utilisé pour assurer la cohérence des types entre client et serveur avec auto-complétion complète et validation runtime.

### **Admin-First Approach**
Stratégie de développement où les outils d'administration sont créés avant les interfaces utilisateur pour permettre la création de contenu dès le début du développement.

### **KYC Seuils**
Vérification d'identité progressive selon les montants : €0-100 (email), €100-3000 (téléphone + âge), +€3000 (documents officiels).

### **Materialized Views**
Cache PostgreSQL natif utilisant des vues matérialisées pour optimiser les performances analytics sans infrastructure Redis externe.

### **Points Expiry**
Mécanisme d'expiration des points 18 mois après génération avec alertes automatiques 60 jours avant expiration pour maintenir l'engagement.

---

## 🎯 **Acronymes Projet**

### **MVP/V1/V2**
Phases de développement : MVP (Mois 1-4 fonctionnalités critiques), V1 (Mois 5-8 améliorations), V2 (Mois 9+ innovations).

### **CAC/LTV/ROI**
Métriques business : Cost of Acquisition Customer (€150 target), Lifetime Value (€400+), Return on Investment (garanti >120% en produits).

### **ROI (Retour sur Investissement)**
Dans le contexte de Make the CHANGE, le ROI désigne la **valeur totale des produits récupérables** via le système de points, comparée à la contribution initiale. Il est **garanti supérieur à 100%** (de 120% à 130% selon le niveau d'abonnement).

### **Admin-First (Stratégie)**
Approche de développement qui consiste à construire les outils d'administration (création de projets, de produits) *avant* les interfaces de consommation (application mobile). Cela permet de peupler la plateforme avec du contenu réel et de découpler les équipes de développement.

### **KYC (Know Your Customer)**
Processus de vérification de l'identité des utilisateurs, obligatoire pour la conformité légale et la lutte contre le blanchiment d'argent. Les niveaux de vérification dépendent des montants des abonnements.

### **MVP (Minimum Viable Product)**
La première version du produit contenant uniquement les fonctionnalités essentielles pour valider le concept de base et la proposition de valeur auprès des premiers utilisateurs.
