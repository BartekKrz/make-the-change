# 📱 App Native Partenaires - Spécification MVP

**📍 VERSION: MVP** | **🗓️ TIMELINE: 2-4 semaines dev focus** | **⭐️ PRIORITÉ: HAUTE**

## 🎯 Objectif

Permettre aux partenaires de publier facilement des updates (photos/vidéos/notes) sur leurs ruches/oliviers, mettre à jour un statut, et optionnellement déclarer un envoi ou gérer le stock d'un produit.

---

## 🛠️ Choix Technique

### **Stack Recommandé**
```yaml
Framework: React Native (avec Expo Dev Client)
Justification:
  - Réutilisation stack existante (cohérence avec app utilisateurs)
  - Accès caméra natif optimisé
  - Support offline robuste
  - Push notifications intégrées
  - Développement rapide (2-4 semaines)

Architecture:
  - Offline-first: file d'upload locale (SQLite/MMKV) + reprise automatique
  - Stockage médias: S3/R2 via URL pré-signées + thumbnails générés côté serveur
  - Auth: email + magic-link ou OAuth (rôles: Owner, Staff)
  - Push: notification aux admins MTC (modération) puis aux abonnés du projet
```

---

## 👥 Utilisateurs Cibles

### **Profils Utilisateurs**
```yaml
Owner (Propriétaire):
  - Accès complet à tous les projets de son organisation
  - Peut inviter/gérer d'autres utilisateurs Staff
  - Responsabilité finale des publications
  - Gestion des paramètres organisation

Staff (Employé):
  - Accès aux projets assignés uniquement
  - Peut créer des updates en mode Draft
  - Ne peut pas inviter d'autres utilisateurs
  - Validation Owner requise pour certaines actions
```

---

## 🔄 Parcours Clés (User Stories)

### **1. Créer une Update**
```yaml
En tant que: Partenaire (Owner/Staff)
Je veux: Prendre des photos/vidéos, saisir un titre + note
Pour que: Je puisse documenter l'avancée de mes projets

Actions:
  1. Sélectionner le projet (ruche/olivier) ciblé
  2. Capturer média (photo/vidéo) avec guide de qualité
  3. Saisir titre + description (ex. "Récolte de printemps")
  4. Choisir type d'update (milestone, routine, événement)
  5. Envoyer → statut: Draft (en attente modération)

Contraintes:
  - Photos: < 2-3 Mo, compression automatique
  - Vidéos: < 30-45 secondes, qualité adaptative
  - Géolocalisation optionnelle (géotag des prises)
  - Accessibilité: guide prise de vue (règle des tiers, luminosité)
```

### **2. Modération & Publication**
```yaml
En tant que: Admin MTC
Je veux: Recevoir une notification, valider/editer et publier
Pour que: Les updates soient qualitatives avant diffusion

Workflow:
  1. Partenaire soumet update → Draft
  2. Admin MTC reçoit notification push/email
  3. Admin valide/édite contenu via dashboard web
  4. Publication → notification aux utilisateurs abonnés au projet
  5. Update visible dans flux public du projet
```

### **3. Changement de Statut Projet**
```yaml
En tant que: Partenaire
Je veux: Changer le statut d'un projet
Pour que: Les utilisateurs voient l'évolution en temps réel

Statuts Configurables:
  - Installée → Floraison → Récolte → Repos (ruches)
  - Plantée → Croissance → Mature → Production (oliviers)
  - Liste configurable côté back-office admin

Actions:
  1. Sélectionner projet
  2. Choisir nouveau statut dans liste
  3. Optionnel: ajouter note explicative
  4. Validation → mise à jour temps réel
```

### **4. (MVP+) Déclarer une Expédition**
```yaml
En tant que: Partenaire (certains uniquement)
Je veux: Déclarer une expédition avec tracking
Pour que: L'utilisateur voie l'avancement de sa commande

Actions:
  1. Scanner/coller numéro tracking transporteur
  2. Marquer commande "expédiée"
  3. Système notifie automatiquement l'utilisateur
  4. Tracking intégré dans dashboard utilisateur
```

### **5. (MVP+) Inventaire Simple**
```yaml
En tant que: Partenaire
Je veux: Mettre à jour stock d'un SKU
Pour que: La disponibilité soit correcte sur la marketplace

Actions:
  1. Liste de mes produits avec stock actuel
  2. Mettre à jour quantité disponible
  3. Marquer temporairement indisponible si nécessaire
  4. Sync automatique avec catalogue MTC
```

---

## 📱 Écrans (MVP)

### **Architecture Navigation**
```yaml
Authentification:
  - Login (email/password ou magic-link)
  - Récupération mot de passe
  - Onboarding partenaire (première connexion)

Main Navigation (Tabs):
  - Projets: Liste projets assignés
  - Updates: Historique updates créées
  - Profil: Paramètres compte partenaire

Écrans Détail:
  - Détail Projet: Fil d'updates + statut actuel
  - Nouvelle Update: Caméra + saisie + envoi
  - Upload Progress: Barre progression + gestion reprise
  - Settings: Profil partenaire, langue, aide/FAQ
```

### **1. Écran Login**
```yaml
Layout: Simple et épuré
Champs:
  - Email partenaire (pré-rempli si possible)
  - Mot de passe
  - "Se souvenir de moi" (biométrie)
  - Lien "Mot de passe oublié"

Actions:
  - Connexion avec validation
  - Magic-link en alternative
  - Support multiple organisations (si partenaire multi-client)
```

### **2. Écran Liste Projets**
```yaml
Header: Logo partenaire + nom utilisateur
Contenu:
  - Cards par projet avec:
    * Photo projet (dernière update)
    * Nom projet + localisation
    * Statut actuel (badge coloré)
    * Nombre abonnés/investisseurs
    * Dernière update (date)
    * CTA "Nouvelle update"

Filtres:
  - Tous / Mes projets / Projets équipe
  - Par statut
  - Par type (ruche/olivier)

Actions:
  - Pull-to-refresh
  - Tap projet → Détail
  - FAB "+" → Nouvelle update
```

### **3. Écran Détail Projet**
```yaml
Header:
  - Photo banner projet
  - Nom + localisation + statut
  - Actions: Changer statut, Partager

Timeline Updates:
  - Chronologie updates (plus récent en haut)
  - Chaque update avec:
    * Média (photo/vidéo avec preview)
    * Titre + description
    * Date + auteur
    * Statut modération (Draft/Published/Rejected)

Metrics:
  - Nombre abonnés
  - Updates ce mois
  - Dernière activité
```

### **4. Écran Nouvelle Update**
```yaml
Workflow Guidé:
  1. Sélection Média:
     - Caméra (photo/vidéo) avec guides visuels
     - Galerie (sélection existante)
     - Compression automatique en arrière-plan
  
  2. Métadonnées:
     - Titre update (obligatoire, 50 char max)
     - Description (optionnelle, 500 char max)
     - Type update (dropdown: milestone, routine, événement)
     - Géolocalisation (toggle opt-in)
  
  3. Preview & Envoi:
     - Aperçu final avec média + texte
     - Estimation temps upload
     - Bouton "Envoyer" → Queue upload

Contraintes UX:
  - Sauvegarde automatique (draft local si interruption)
  - Guides photos (règle des tiers, check luminosité)
  - Upload en arrière-plan (notification progress)
```

### **5. Écran Upload Progress**
```yaml
État Upload:
  - Barre de progression globale
  - Détail par fichier (nom + taille + statut)
  - Estimation temps restant
  - Débit réseau actuel

Actions:
  - Pause/Reprendre upload
  - Annuler upload (confirmation)
  - Upload en arrière-plan (fermer app)

Gestion Erreurs:
  - Retry automatique (3 tentatives)
  - Message d'erreur explicite
  - Options: Retry, Sauvegarder en draft, Annuler
```

### **6. Écran Historique Updates**
```yaml
Liste Updates:
  - Cards chronologiques par update
  - Statut modération (couleur + icône):
    * Draft (gris) - En attente envoi
    * Pending (orange) - En modération
    * Published (vert) - Publié
    * Rejected (rouge) - Refusé avec raison
  
Filtres:
  - Par statut
  - Par projet
  - Par période

Actions:
  - Tap update → Détail/Édition (si Draft)
  - Swipe → Actions rapides (Dupliquer, Supprimer)
```

---

## 🔧 Contraintes Techniques & UX Terrain

### **Optimisations Média**
```yaml
Photos:
  - Compression client automatique (< 2-3 Mo final)
  - Format optimal: JPEG avec qualité adaptative
  - Thumbnails générés localement pour preview
  - Metadata EXIF preservé (géolocalisation, timestamp)

Vidéos:
  - Durée maximale: 30-45 secondes
  - Compression H.264 qualité moyenne
  - Résolution adaptative selon réseau
  - Preview thumbnail extrait automatiquement

Upload Robuste:
  - Système pause/reprise (chunks)
  - Upload en arrière-plan persistant
  - Retry automatique avec backoff exponentiel
  - Support connexion intermittente (terrain)
```

### **Géolocalisation & Privacy**
```yaml
Géotag Updates:
  - Opt-in par update (toggle explicite)
  - Précision modérée (100m) suffisante
  - Utile pour cartes d'impact dans app utilisateurs
  - Respect RGPD (consentement explicite)

Permission Management:
  - Caméra: obligatoire pour fonctionnalité core
  - Localisation: optionnelle avec value prop claire
  - Stockage: pour cache et uploads offline
  - Notifications: opt-in avec bénéfices expliqués
```

### **Accessibilité & Ergonomie**
```yaml
Prise de Vue Guidée:
  - Grille règle des tiers (overlay caméra)
  - Indicateur niveau luminosité
  - Stabilisation automatique (si supporté)
  - Mode macro pour détails (abeilles, fleurs)

Interface Terrain:
  - Boutons suffisamment grands (44px minimum)
  - Contraste élevé (lisibilité plein soleil)
  - Feedback haptic pour actions importantes
  - Mode offline visible (indicateur connexion)
```

---

## 🔒 Sécurité & Conformité

### **Authentification & Autorisations**
```yaml
Auth Système:
  - JWT courts + refresh token
  - Sessions expirables (sécurité)
  - Biométrie locale si supportée
  - Multi-factor optionnel (pour Owner)

Permissions Granulaires:
  - Rôles: Owner (full access) vs Staff (restricted)
  - Permissions scopées à l'organisation partenaire
  - Updates Draft/Published selon rôle
  - Audit trail des actions (qui/quand/quoi)
```

### **Protection des Données**
```yaml
Médias Upload:
  - Scan anti-virus côté serveur automatique
  - URL pré-signées pour uploads sécurisés
  - Stockage chiffré (S3/R2 encryption at rest)
  - Modération obligatoire avant diffusion publique

Données Personnelles:
  - Minimisation données collectées
  - Consentement explicite géolocalisation
  - Droit à l'effacement (RGPD)
  - Logs accès et modifications
```

### **Modération & Qualité**
```yaml
Workflow Modération:
  - Toutes updates → Queue modération automatique
  - Admin dashboard web pour validation
  - Templates réponses (approbation/refus)
  - Historique décisions modération

Critères Qualité:
  - Photos nettes et bien cadrées
  - Contenu pertinent au projet
  - Respect bonnes pratiques (pas de visages, marques)
  - Cohérence avec saison/timing projet
```

---

## 📊 Modèle de Données Minimal

### **Tables Principales**
```sql
-- Partenaires et utilisateurs
CREATE TABLE partners (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  organization_type VARCHAR(50), -- 'beekeeper', 'olive_grower'
  contact_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE partner_users (
  id UUID PRIMARY KEY,
  partner_id UUID REFERENCES partners(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) CHECK (role IN ('owner', 'staff')),
  password_hash VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projets assignés aux partenaires
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  partner_id UUID REFERENCES partners(id),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('ruche', 'olivier', 'jardin')),
  status VARCHAR(50) NOT NULL, -- configurable par type
  location POINT, -- PostGIS pour géolocalisation
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Updates créées par partenaires
CREATE TABLE project_updates (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  author_id UUID REFERENCES partner_users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  update_type VARCHAR(50), -- 'milestone', 'routine', 'event'
  status VARCHAR(20) CHECK (status IN ('draft', 'pending', 'published', 'rejected')),
  media_urls TEXT[], -- Array URLs média
  location POINT, -- Géotag optionnel
  moderation_notes TEXT, -- Notes admin si rejeté
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- (MVP+) Gestion expéditions
CREATE TABLE shipments (
  id UUID PRIMARY KEY,
  order_id UUID, -- Référence commande principale
  partner_id UUID REFERENCES partners(id),
  tracking_number VARCHAR(255),
  carrier VARCHAR(100),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- (MVP+) Inventaire partenaire
CREATE TABLE partner_inventory (
  id UUID PRIMARY KEY,
  partner_id UUID REFERENCES partners(id),
  product_id UUID, -- Référence produit catalogue
  quantity_available INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **API tRPC Essentielles**
```ts
// Auth
partners.app.login: mutation<{ email: string; password: string }, PartnerLoginResponseDTO>
partners.app.me: query<void, PartnerUserDTO>

// Projets
partners.app.projects: query<void, PartnerProjectDTO[]>

// Updates
partners.app.createUpdate: mutation<PartnerUpdateCreateInput, PartnerUpdateDTO>
partners.app.myUpdates: query<{ page?: number; limit?: number }, Paginated<PartnerUpdateDTO>>
partners.app.uploadMedia: mutation<{ updateId: string; files: FilePayload[] }, MediaUploadDTO[]>

// (MVP+) Expéditions
// partners.app.createShipment, partners.app.updateShipment

// (MVP+) Inventaire
// partners.app.listInventory, partners.app.updateInventory
```

---

## 🏗️ Back-office Admin Requis

### **Dashboard Modération**
```yaml
Vue Modération Updates:
  - Queue updates en attente (pending)
  - Aperçu média + métadonnées
  - Actions: Approuver/Rejeter/Demander modifications
  - Templates messages (gain temps)
  - Historique décisions par modérateur

Configuration Projets:
  - Mapping Projet ↔ Récompenses (points immédiats/différés)
  - Calendrier d'updates attendues
  - SLA contenu par type projet
  - Statuts configurables par type

Analytics Partenaires:
  - Tableau de bord SLA partenaires
  - Délais moyens updates
  - Qualité média (incidents/retours)
  - Performance par partenaire
```

### **Workflow Intégration**
```yaml
Publication Update:
  1. Partenaire crée update → Status "pending"
  2. Admin reçoit notification (email/push)
  3. Modération via dashboard web
  4. Si approuvé → Status "published" + notification abonnés projet
  5. Si rejeté → Status "rejected" + notification partenaire avec raison

Traduction & Localisation:
  - Support FR/EN minimum
  - Templates traduction si besoin
  - Adaptation culturelle contenu

Notification Système:
  - Push vers admins MTC (nouvelle update pending)
  - Push vers utilisateurs abonnés (update published)
  - Email backup si push fails
```

---

## 🚀 Planning Développement (2-4 semaines)

### **Semaine 1: Fondations**
```yaml
Objectifs:
  - Setup Expo app + navigation
  - Authentification partenaires
  - Écrans de base (login, liste projets)
  - API endpoints auth + projets

Livrables:
  - App installable et connexion fonctionnelle
  - Navigation entre écrans principaux
  - Première intégration API
```

### **Semaine 2: Fonctionnalités Core**
```yaml
Objectifs:
  - Caméra + prise photos/vidéos
  - Création updates avec médias
  - Upload vers stockage (URLs pré-signées)
  - États offline/online

Livrables:
  - Workflow complet création update
  - Upload robuste avec retry
  - Interface utilisateur intuitive
```

### **Semaine 3: Robustesse & Polish**
```yaml
Objectifs:
  - Système pause/reprise uploads
  - Gestion erreurs et edge cases
  - Performance et optimisations
  - Tests sur devices réels terrain

Livrables:
  - App stable en conditions terrain
  - Upload background fonctionnel
  - UX finalisée et testée
```

### **Semaine 4: Intégration & Déploiement**
```yaml
Objectifs:
  - Dashboard admin modération (web)
  - Workflow complet modération → publication
  - Tests end-to-end complets
  - Déploiement TestFlight/Play Console

Livrables:
  - App déployée et testable
  - Documentation utilisateur
  - Formation partenaires pilotes
```

---

**Cette app native partenaires constitue le maillon essentiel pour collecter du contenu authentique et maintenir l'engagement des investisseurs via des updates régulières et qualitatives de leurs projets soutenus.**
