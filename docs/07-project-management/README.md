# 📅 Gestion de Projet

Cette section contient le planning, gestion des risques, milestones et suivi du projet Make the CHANGE.

## 📋 Contenu de cette Section

Documentation de gestion de projet couvrant planning, risques, ressources et suivi des milestones.

## 🗂️ Documents

| Document | Description | Status | Dernière MAJ |
|----------|-------------|--------|--------------|
| [sprint-planning.md](./sprint-planning.md) | Plan "Admin-First" 4 mois détaillé | ✅ Final | 2025-01-XX |
| [risk-analysis.md](./risk-analysis.md) | Analyse des risques et mitigation | ✅ Final | 2025-01-XX |
| [milestones.md](./milestones.md) | Jalons projet et deliverables | 📋 À créer | - |
| [resource-planning.md](./resource-planning.md) | Planning ressources équipe | 📋 À créer | - |
| **~~retrospectives/~~** | ~~Post-mortems et retours~~ | ❌ Supprimé | *Rétrospectives documentées dans sprint-planning.md* |

## 🎯 Approche "Admin-First"

### Stratégie Globale
Développement des outils administrateurs avant les interfaces utilisateurs pour éliminer les blocages et permettre la création de contenu dès le début.

### Workflow Type
```
Semaine N   : Admin crée contenus (projets, produits)
Semaine N+1 : Mobile consomme contenus + tests réels
```

## 📅 Planning Global - 4 Mois

### 🏗️ Mois 1 : Fondations
**Objectif** : Authentification complète sur les 3 plateformes

| Semaine | Backend | Mobile | Admin Web |
|---------|---------|--------|-----------|
| 1 | Setup monorepo + Prisma users | Setup Expo + navigation | Setup Vercel Edge Functions + layout |
| 2 | Route auth.register + validation | Formulaire inscription | Composants forms |
| 3 | Route auth.login + Supabase Auth | Formulaire connexion | Page login admin |
| 4 | Logout + déploiement staging | Navigation protégée | Dashboard admin protégé |

### 🚀 Mois 2 : Investissement (Admin-First)
**Objectif** : Cycle complet admin crée → mobile investit

| Semaine | Backend | Mobile | Admin Web |
|---------|---------|--------|-----------|
| 5 | Prisma projects + routes admin | Maintenance auth | **Gestion projets CRUD** |
| 6 | Routes projects.list + byId | **Découverte projets** | Finalisation interface |
| 7 | Investment + Stripe integration | **Tunnel investissement** | Vue investissements |
| 8 | Points generation + tests | **Confirmation + points** | Support données |

### 💰 Mois 3 : Dashboard & Analytics
**Objectif** : Vision complète utilisateur + admin

| Semaine | Backend | Mobile | Admin Web |
|---------|---------|--------|-----------|
| 9 | Points balance + investments.myList | **Dashboard utilisateur** | Détail utilisateurs |
| 10 | Admin users.list + pagination | Améliorations dashboard | **Gestion utilisateurs** |
| 11 | Filtres + optimisations | Performance mobile | **Pagination + filtres** |
| 12 | Buffer + refactoring | Buffer + optimisations | Buffer + UX |

### 🛒 Mois 4 : E-commerce (Admin-First)
**Objectif** : Admin crée produits → mobile achète avec points

| Semaine | Backend | Mobile | Admin Web |
|---------|---------|--------|-----------|
| 13 | Prisma products + admin routes | Maintenance | **Gestion produits** |
| 14 | Products.list + purchase logic | **Catalogue produits** | Vue commandes |
| 15 | Points → Products + fulfillment | **Achat avec points** | Gestion fulfillment |
| 16 | Testing + optimizations | **Confirmation commandes** | Analytics finales |

## 📊 Métriques de Suivi

### Vélocité Développement
- **Story Points** : Estimation Fibonacci
- **Burn Down** : Suivi sprint par sprint  
- **Velocity** : Points complétés par sprint
- **Blockers** : Identification et résolution

### Qualité Code
- **Code Coverage** : >90% target
- **Technical Debt** : <10% temps sprint
- **Bug Ratio** : <5% nouvelles features
- **Review Time** : <24h PRs

### Business Milestones
- **Phase 1** : 100 utilisateurs MVP
- **Phase 2** : 25 investissements
- **Phase 3** : €5,000 volume
- **Phase 4** : 15 achats produits

## ⚠️ Gestion des Risques

### Risques Techniques (Probabilité × Impact)
1. **Complexité tRPC** → Formation équipe
2. **Performance mobile** → Tests devices réels
3. **Intégration Stripe** → Sandbox testing
4. **Scalabilité DB** → Architecture review

### Risques Business
1. **Validation partenaires** → Meetings réguliers
2. **Conformité légale** → Audit juridique
3. **Adoption utilisateurs** → User testing
4. **Compétition** → Market monitoring

## 🔄 Processus Agile

### Sprints (2 semaines)
- **Planning** : Lundi estimation + commitment
- **Daily** : 15min standup progrès/blockers
- **Review** : Demo stakeholders + feedback
- **Retro** : Process improvement + actions

### Rôles & Responsabilités
- **Product Owner** : Vision + priorités + acceptance
- **Scrum Master** : Process + blockers + facilitation
- **Dev Team** : Estimation + développement + quality
- **Stakeholders** : Feedback + validation + support

## 🔗 Liens Connexes

- [🔧 03-Technical](../03-technical/architecture-overview.md) - Architecture technique
- [📱 04-Specifications](../04-specifications/) - Spécifications détaillées
- [💻 06-Development](../06-development/) - Workflow développement
- [💼 01-Strategy](../01-strategy/kpis-metrics.md) - KPIs business

## 📈 Success Metrics

### Phase 1 Completion (4 mois)
- ✅ **MVP fonctionnel** sur 3 plateformes
- ✅ **100 utilisateurs** enregistrés
- ✅ **25 investissements** réalisés
- ✅ **Tests E2E** passent à 100%
- ✅ **Production ready** architecture

### Long Term (12 mois)
- 📈 **1000+ utilisateurs** actifs
- 📈 **€50,000+** volume investissements
- 📈 **500+ commandes** produits
- 📈 **4.5+ stars** app stores

---
*Section maintenue par : Project Management Team | Dernière révision : 2025-01-XX*