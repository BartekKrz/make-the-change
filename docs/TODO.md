# ✅ Master TODO List - Make the CHANGE

Ce document centralise tous les `TODOs` et les actions à réaliser identifiés dans l'ensemble de la documentation. Il sert de checklist principale pour le développement du MVP et les phases ultérieures.

**Légende des Priorités :**
- **P0 - Urgent (🔥)** : Bloquant pour le MVP. Doit être fait dans les 4 premiers mois.
- **P1 - Important (🟠)** : Critique pour le succès post-lancement. À faire dans les mois 5-8.
- **P2 - Normal (🟢)** : Amélioration continue. À planifier après la V1.
- **P3 - Basse (🔵)** : Nice-to-have, à considérer pour le futur.

---

## 🚀 Phase 1 : MVP (Mois 1-4)

### 💼 Business & Opérations (P0)
- [ ] **(P0)** Définir le stock minimum pour déclencher les alertes de réassort.
- [ ] **(P0)** Établir les règles de réservation de stock pour les commandes en cours.
- [ ] **(P0)** Définir la politique en cas de rupture de stock (remboursement points, substitut, etc.).
- [ ] **(P0)** Obtenir et documenter les contacts d'urgence des partenaires.
- [ ] **(P0)** Formaliser les contrats et les SLAs avec les partenaires (délais, qualité).
- [ ] **(P0)** Négocier et finaliser les prix d'achat et les conditions de paiement avec les partenaires.
- [ ] **(P0)** Décider du lieu de stockage physique des produits.
- [ ] **(P0)** Définir qui prépare et expédie les commandes (interne, 3PL).
- [ ] **(P0)** Choisir les transporteurs pour chaque zone de livraison.
- [ ] **(P0)** Définir précisément les zones de livraison pour la Phase 1.
- [ ] **(P0)** Établir les délais de livraison garantis par zone.
- [ ] **(P0)** Assigner un responsable pour le monitoring quotidien des stocks.
- [ ] **(P0)** Choisir et configurer l'outil de support client (ex: Crisp).
- [ ] **(P0)** Définir les SLAs de réponse pour le support (chat, email).
- [ ] **(P0)** Rédiger le contenu des emails d'onboarding.
- [ ] **(P0)** Créer les templates pour la communication de crise.
- [ ] **(P0)** Définir le processus d'escalation du support.

### 🔧 Technique & Infrastructure (P0)
- [ ] **(P0)** Finaliser le choix du provider backend (Vercel – Edge + Node runtimes, Supabase).
- [ ] **(P0)** Mettre en place le pipeline CI/CD complet (GitHub Actions).
- [ ] **(P0)** Configurer le monitoring de production (Sentry, Vercel Analytics).
- [ ] **(P0)** Mettre en place la stratégie de backup automatique et la tester.
- [ ] **(P0)** Configurer les alertes automatiques pour l'infrastructure et les KPIs.
- [ ] **(P0)** Mettre en place l'infrastructure sécurisée (HTTPS, WAF, secrets).
- [ ] **(P0)** Documenter et tester les procédures de déploiement et de rollback.
- [ ] **(P0)** Implémenter les health checks pour tous les services critiques.
- [ ] **(P0)** Centraliser les logs.
- [ ] **(P0)** Mettre en place une plateforme de A/B testing.
- [ ] **(P0)** Définir et implémenter la stratégie de cache ( vues matérialisées).
- [ ] **(P0)** Configurer les security headers (CSP, HSTS).
- [ ] **(P0)** Mettre en place le scanning de vulnérabilités.

### 📊 Analytics & Tracking (P0)
- [ ] **(P0)** Implémenter le tracking de chaque étape du funnel de conversion.
- [ ] **(P0)** Configurer les outils d'analytics (GA4, etc.).
- [ ] **(P0)** Définir et calculer les "unit economics" par persona.
- [ ] **(P0)** Mettre en place les dashboards de suivi des KPIs en temps réel.
- [ ] **(P0)** Définir un modèle d'attribution pour les canaux d'acquisition.

### 🎨 Produit & UX (P1)
- [ ] **(P1)** Créer les 15 composants de base du Design System avec les couleurs de la marque.
- [ ] **(P1)** Définir les 5 patterns UX critiques (ex: navigation, formulaires).
- [ ] **(P1)** Générer les design tokens de couleurs.
- [ ] **(P1)** Compléter les spécifications "à développer" (🚧) pour le MVP.
- [ ] **(P1)** [Nouveau] Spécifier et designer l'écran du Classement d'Impact.
- [ ] **(P1)** [Nouveau] Définir les règles de confidentialité et d'anonymisation pour le classement.

---

## 🚀 Phase 2 : Amélioration & Croissance (Mois 5-8)

### 💼 Business & Opérations (P1)
- [ ] **(P1)** Identifier des partenaires de backup pour chaque catégorie de produits.
- [ ] **(P1)** Formaliser les standards de qualité et les processus de contrôle.
- [ ] **(P1)** Mettre en place un système de suivi des commandes partenaires.
- [ ] **(P1)** Définir le processus de contrôle qualité à la réception des produits.
- [ ] **(P1)** Créer une grille tarifaire pour l'expédition.
- [ ] **(P1)** Définir les emballages écologiques et brandés.
- [ ] **(P1)** Établir le processus de retour et de remboursement en points.
- [ ] **(P1)** Évaluer la faisabilité de la livraison DOM-TOM.

### 🔧 Technique & Infrastructure (P1)
- [ ] **(P1)** Mettre en place des tests de pénétration trimestriels.
- [ ] **(P1)** Créer un plan de réponse aux incidents de sécurité.
- [ ] **(P1)** Mettre en place des tests de charge pour simuler la croissance.
- [ ] **(P1)** Automatiser le scaling de l'infrastructure.
- [ ] **(P1)** Modéliser les coûts d'infrastructure en fonction de l'usage.
- [ ] **(P1)** [Nouveau] Créer la vue matérialisée `user_impact_summary` pour les scores d'impact.
- [ ] **(P1)** [Nouveau] Développer l'endpoint API `leaderboard.get` pour le classement.
- [ ] **(P1)** [Nouveau] Implémenter le cron job pour rafraîchir la vue matérialisée quotidiennement.


### 📞 Communication & Support (P1)
- [ ] **(P1)** Mettre en place la segmentation des audiences pour le messaging.
- [ ] **(P1)** A/B tester les campagnes d'emailing.
- [ ] **(P1)** Créer des campagnes de réactivation pour les utilisateurs inactifs.
- [ ] **(P1)** Implémenter le système de badges et de progression.
- [ ] **(P1)** Développer du contenu éducatif pour les familles (persona Fatima).
- [ ] **(P1)** Personnaliser les notifications push.
- [ ] **(P1)** Mettre en place une FAQ dynamique avec recherche.
- [ ] **(P1)** Lancer des sondages de satisfaction client (CSAT/NPS).

### 📊 Analytics & Optimisation (P1)
- [ ] **(P1)** Mettre en place l'analyse de cohortes.
- [ ] **(P1)** Développer des modèles prédictifs de churn.
- [ ] **(P1)** Segmenter les utilisateurs par niveau d'engagement.
- [ ] **(P1)** Mesurer l'impact de la gamification sur la rétention.
- [ ] **(P1)** Créer des dashboards analytics avancés pour le persona Marc.

---

## 🚀 Phase 3 et au-delà (Nice-to-have)

### ✨ Fonctionnalités Avancées (P2)
- [ ] **(P2)** Implémenter l'auto-commande chez les partenaires.
- [ ] **(P2)** Développer des modèles prédictifs pour le réapprovisionnement.
- [ ] **(P2)** Intégrer un chatbot IA pour le support de niveau 1.
- [ ] **(P2)** Mettre en place la personnalisation par IA du contenu et des notifications.
- [ ] **(P2)** Développer des challenges sociaux et des leaderboards.
- [ ] **(P2)** Mettre en place des tests multivariés.
- [ ] **(P2)** Développer le Dark Mode pour l'application.
- [ ] **(P2)** Mettre en place le mode hors-ligne.

### 🏢 Excellence Opérationnelle (P2)
- [ ] **(P2)** Mettre en place des scripts d'automatisation pour les tâches répétitives.
- [ ] **(P2)** Créer une base de connaissance interne (runbooks, etc.).
- [ ] **(P2)** Définir un plan de formation continue pour l'équipe.
