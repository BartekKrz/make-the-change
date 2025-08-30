# 🧩 Components Library - 12 Patterns UI Prêts à l'Emploi
**Make the CHANGE - Application Biodiversité & Écologie Durable**

**📍 DOCUMENT TYPE**: Bibliothèque de Composants UI | **🗓️ DATE**: 27 Août 2025 | **⭐️ PRIORITÉ**: Critique

## 🎯 Vue d'Ensemble

Cette bibliothèque contient **12 patterns UI production-ready** spécifiquement conçus pour l'application Make the CHANGE. Chaque pattern inclut les spécifications complètes pour l'implémentation cross-platform (iOS/Android), les considérations d'accessibilité, et les métriques de performance.

### 📋 Structure Pattern
Pour chaque pattern : **Contexte d'utilisation** → **Solution UI proposée** → **Anatomie composant** → **Variantes iOS/Android** → **Accessibilité** → **Erreurs/Récupération** → **Instrumentation** → **KPIs succès**

---

## Pattern 1: Onboarding progressif & éducatif

• **Contexte**: Première ouverture de l'app – utilisateur curieux mais potentiellement submergé par les fonctionnalités (investissement, boutique, gamification). Besoin de guider sans lasser, et de communiquer la proposition de valeur écolo dès le départ.

• **Solution UI**: Onboarding en 3–5 écrans swipeables maximum, combinant visuels inspirants (abeilles, oliviers) et bénéfices clairs (« Parrainez une ruche », « Récoltez des points, agissez pour la planète »). Option « Passer » toujours visible. Utiliser éventuellement une courte vidéo ou animation illustrant l'impact durable (tout en restant léger pour la performance).

• **Anatomie**: 
  - **Écran 1** : logo + tagline + demande de consentement cookies/minimum
  - **Écrans 2–4** : carrousel d'illustrations + texte court (≤ 2 phrases) + indicateur de progression (petits points)
  - **Dernier écran** : CTA principal « Commencer » + CTA secondaire « J'ai déjà un compte »

• **Variantes iOS/Android**: 
  - **iOS** : UIPageControl natif pour les points de carrousel, typographie San Francisco, bouton « Passer » aligné à droite
  - **Android** : Material Design avec bouton Back hardware qui skippe l'onboarding, boutons textuels « Skip » en haut à droite

• **Accessibilité**: 
  - Textes localisés en 4 langues (FR, EN, DE, NL)
  - Contraste élevé ≥4.5:1 (texte blanc sur fond vert foncé)
  - Navigation VoiceOver/TalkBack complète avec rôles heading pour titres
  - Alternatives textuelles pour toutes les informations visuelles

• **Erreurs/Récupération**: 
  - Onboarding skippable (non critique)
  - En cas de crash/fermeture, relance à la prochaine ouverture
  - Gestion propre des refus d'autorisations : « Vous pourrez activer X plus tard dans les paramètres »

• **Instrumentation**: 
  ```javascript
  // Événements à tracker
  Onboarding_Start, Onboarding_Complete, Onboarding_Skipped
  // Métriques : temps par écran, taux de complétion, points de décrochage
  ```

• **KPIs**: 
  - **Complétion** : >85% terminent l'onboarding
  - **Activation** : taux de création de compte post-onboarding
  - **Rétention D1** : impact sur retour jour 1

---

## Pattern 2: Connexion simplifiée & Inscription sans mot de passe

• **Contexte**: L'app propose une expérience freemium ; la création de compte est nécessaire pour investir ou commander. Un formulaire long ferait chuter la conversion initiale. Il faut faciliter login/signup sans freiner l'utilisateur.

• **Solution UI**: Écran de connexion unifié avec options de SSO (Sign in with Apple/Google) bien mises en avant en boutons larges, et une option « Continuer en invité » tant que l'utilisateur n'a pas besoin des fonctions avancées. Inscription par e-mail allégée : un seul champ e-mail, pas de mot de passe (lien magique ou code OTP). Biométrie (FaceID/TouchID) proposée après le 1er login.

• **Anatomie**: 
  - **Titre** : « Bienvenue »
  - **Boutons SSO** : Apple (icône officielle), Google (bouton brandé)
  - **Section email** : champ + bouton « Recevoir un lien de connexion »
  - **Accès invité** : « Continuer sans compte » (accès limité)

• **Variantes iOS/Android**: 
  - **iOS** : Sign in with Apple obligatoire si autres SSO présents, FaceID/TouchID natif
  - **Android** : Google Sign-In prioritaire, possibilité numéro de téléphone, Fingerprint API

• **Accessibilité**: 
  - Labels officiels localisés pour SSO
  - Navigation clavier complète avec focus visible
  - Alternative PIN 4 chiffres si pas de biométrie
  - Parcours invité clairement identifiable (texte souligné)

• **Erreurs/Récupération**: 
  - Validation email inline en temps réel
  - Renvoi de lien magique si expiration
  - Messages d'erreur SSO non techniques
  - Bouton retour toujours disponible

• **Instrumentation**: 
  ```javascript
  // Events: Login_Show, Login_Method_Selected, Login_Success, Login_Fail
  // Tracking: % invités vs comptes, conversion invités→comptes
  ```

• **KPIs**: 
  - **Conversion** : >70% utilisateurs identifiés (compte ou invité)
  - **Temps** : création de compte <2min en moyenne
  - **Échecs** : taux d'erreur de connexion <5%

---

## Pattern 3: Navigation principale par onglets (Bottom Nav)

• **Contexte**: L'application regroupe plusieurs volets (investissement participatif, boutique e-commerce, gamification, profil). Une navigation centrale claire est nécessaire pour orienter l'utilisateur et lui permettre de passer d'une section à l'autre facilement.

• **Solution UI**: Barre d'onglets fixe en bas de l'écran avec 4 icônes (5 max) : Accueil (tableau de bord), Investir (projets), Boutique (produits durables), Récompenses (gamification/profil). Chacune avec icône explicite + label court. L'onglet actif est mis en surbrillance (couleur accent).

• **Anatomie**: 
  - **Structure** : UITabBarController (iOS) / BottomNavigationView (Android)
  - **Éléments** : icône (24px) + label dessous pour chaque section
  - **States** : actif (surbrillance) vs inactif (couleur neutre)

• **Variantes iOS/Android**: 
  - **iOS** : SF Symbols, UITabBar natif, icônes remplis/outlines
  - **Android** : Material Icons, labels persistants forcés pour compréhension

• **Accessibilité**: 
  - Zones tactiles ≥48px de côté
  - Contraste suffisant pour onglet sélectionné
  - VoiceOver/TalkBack : « Accueil, onglet 1 sur 4, sélectionné »

• **Erreurs/Récupération**: 
  - Contenu non chargé : message dans la vue sans bloquer navigation
  - Utilisateur non logué : redirection vers Login pattern

• **Instrumentation**: 
  ```javascript
  // Event: Tab_Select (propriété: nom onglet)
  // Métriques: fréquence d'utilisation par section, temps par section
  ```

• **KPIs**: 
  - **Équilibre usage** : >30% sessions incluant « Investir » et « Boutique »
  - **Navigation fluide** : score élevé en tests utilisateurs

---

## Pattern 4: Liste de projets participatifs (Investissement)

• **Contexte**: L'utilisateur découvre les projets biodiversité (ruches, arbres, etc.) à financer. Il faut une liste/galerie de projets attrayante, filtrable, donnant envie de cliquer. Écran clé pour la conversion investissement.

• **Solution UI**: Cards avec photo du projet, titre court, indicateur d'avancement (ex. 70% financé), localisation (icône carte) et badge de catégorie. En haut : filtres par catégorie et champ de recherche. Projets mis en avant avec accent visuel.

• **Anatomie**: 
  - **En-tête** : barre de recherche + bouton filtre
  - **Corps** : RecyclerView/TableView de cartes
  - **Carte** : image + titre + barre progression + infos secondaires

• **Variantes iOS/Android**: 
  - **iOS** : UICollectionView grille 1 colonne, corners arrondis
  - **Android** : Material CardView, filtres en BottomSheet

• **Accessibilité**: 
  - Chaque carte accessible avec label global descriptif
  - Barres de progression avec couleurs contrastées
  - Filtres manipulables sans tactile direct

• **Erreurs/Récupération**: 
  - État vide explicite si pas de réseau
  - Pull-to-refresh standard
  - Pagination avec gestion d'erreur

• **Instrumentation**: 
  ```javascript
  // Events: Project_List_View, Project_Card_Click
  // Tracking: taux clic carte, usage filtres, requêtes populaires
  ```

• **KPIs**: 
  - **Conversion** : liste→fiche projet >50%
  - **Rapidité** : ouverture fiche <30s depuis liste

---

## Pattern 5: Fiche projet participatif & parcours d'investissement

• **Contexte**: L'écran de détail du projet doit convaincre et permettre d'investir facilement. On raconte l'histoire du projet, on montre l'impact et on guide vers la contribution financière.

• **Solution UI**: Page scrollable avec sections : 1) Bannière visuelle + statut, 2) Description, 3) Impact/Chiffres, 4) Appel à contribution avec curseur montant, 5) Mises à jour. Bouton « Investir » reste visible via barre fixe en bas.

• **Anatomie**: 
  - **Header** : image plein largeur avec parallax
  - **Contenu** : sections séparées par titres
  - **CTA** : bouton « Investir » sticky en bas → flux paiement

• **Variantes iOS/Android**: 
  - **iOS** : UITableView avec header parallax
  - **Android** : CoordinatorLayout + CollapsingToolbar

• **Accessibilité**: 
  - Structure navigable via Headings H1-H6
  - Slider de montant accessible (VoiceOver compatible)
  - Couleurs des indicateurs avec légende texte
  - Support Dynamic Type complet

• **Erreurs/Récupération**: 
  - Message d'erreur + retry si API échoue
  - Gestion échec paiement sans perte de contexte
  - Cache local des données projet

• **Instrumentation**: 
  ```javascript
  // Events: Project_View, Invest_Click, Favorite_Toggle
  // Tracking: scroll depth, temps sur fiche, conversion paiement
  ```

• **KPIs**: 
  - **Conversion** : fiche → investissement final >15%
  - **Engagement** : temps moyen sur fiche >2min

---

## Pattern 6: Carte interactive & traçabilité géolocalisée

• **Contexte**: Insister sur la dimension locale et traçable des projets. Une carte permet de visualiser où se situent les projets parrainés et de suivre leur évolution.

• **Solution UI**: Écran « Carte » avec pins géographiques pour chaque projet. Deux modes : Vue globale et Vue personnelle. Timeline pour voir l'évolution temporelle.

• **Anatomie**: 
  - **Map** : composant plein écran avec pins personnalisés
  - **Contrôles** : boutons de filtre en haut
  - **Interaction** : tap sur pin → bulle overlay
  - **Panel** : panneau coulissant en bas avec liste projets

• **Variantes iOS/Android**: 
  - **iOS** : MapKit avec pins personnalisés, contrôles natifs
  - **Android** : Google Maps API, Material FAB pour contrôles

• **Accessibilité**: 
  - Alternative liste pour non-voyants
  - Infobulles focusables avec descriptions complètes
  - Formes/symboles distincts pour types de projets
  - Support VoiceOver pour navigation carte

• **Erreurs/Récupération**: 
  - Carte grise si problème réseau avec retry
  - Gestion refus autorisation localisation
  - Mode dégradé avec liste si carte indisponible

• **Instrumentation**: 
  ```javascript
  // Events: Map_Open, Map_Pin_Click, Map_Filter_Change
  // Tracking: % fiches ouvertes via carte vs liste
  ```

• **KPIs**: 
  - **Adoption** : 30% des utilisateurs utilisent la carte
  - **Interaction** : nombre moyen de pins cliqués par session
  - **Conversion** : impact sur investissement via carte

---

## Pattern 7: Catalogue e-commerce de produits durables

• **Contexte**: Boutique intégrée (miel, huile, cosmétiques éco). Pattern différent de l'investissement : conversion achat avec catalogue produit similaire à un e-commerce classique.

• **Solution UI**: Liste de produits en grille : image, nom, prix, label (Bio/Artisan), note avis. Catégories en menu horizontal scrollable. Barre de recherche dédiée produits.

• **Anatomie**: 
  - **En-tête** : catégories scrollables horizontales
  - **Grid** : 2 colonnes avec image carrée, nom, prix
  - **Panier** : persistent avec nombre d'articles visibles

• **Variantes iOS/Android**: 
  - **iOS** : UICollectionView style App Store, icône panier nav bar
  - **Android** : RecyclerView GridLayout, FAB panier Material

• **Accessibilité**: 
  - Prix correctement associés aux produits via labels
  - Images avec alt-text descriptif
  - Espacement suffisant entre items (touch targets)
  - Support lecteurs d'écran pour grille

• **Erreurs/Récupération**: 
  - Visuel « Aucun produit trouvé » si catalogue vide
  - Bouton réessayer en cas d'échec chargement
  - Gestion hors stock avec alternatives

• **Instrumentation**: 
  ```javascript
  // Events: Product_List_View, Product_Click, Add_to_Cart
  // Tracking: taux clic par produit, usage recherche, catégories populaires
  ```

• **KPIs**: 
  - **Conversion** : liste→fiche produit >50%
  - **Panier** : valeur moyenne commande, taux d'abandon
  - **Recherche** : temps pour trouver et ajouter produit

---

## Pattern 8: Fiche produit e-commerce & ajout panier

• **Contexte**: Détails produit pour acheter en confiance : description, labels, avis, prix clair, sélection de variante. Pattern orienté conversion rapide.

• **Solution UI**: Page structurée : 1) Galerie images swipe, 2) Infos principales, 3) Description dépliable, 4) Bouton « Ajouter au panier » persistent, 5) Avis clients. Interface optimisée mobile-first.

• **Anatomie**: 
  - **Galerie** : carrousel images swipeable en haut
  - **Infos** : titre + prix + choix quantité/variante
  - **Actions** : boutons « Ajouter panier » et « Favori »
  - **Détails** : description dépliable puis section avis

• **Variantes iOS/Android**: 
  - **iOS** : UIScrollView simple, boutons iOS style
  - **Android** : NestedScrollView avec AppBar, boutons Material

• **Accessibilité**: 
  - Galerie navigable avec descriptions détaillées d'images
  - Étoiles avis avec alternative textuelle (« 4,5 sur 5 étoiles »)
  - Variateur quantité accessible (+ / - boutons larges)
  - Support Dynamic Type pour descriptions

• **Erreurs/Récupération**: 
  - État « En rupture » si stock épuisé avec alternatives
  - Toast/snackbar si échec ajout panier avec retry
  - Sauvegarde favoris locale en cas d'erreur réseau

• **Instrumentation**: 
  ```javascript
  // Events: Product_View, Add_to_Cart_Click, Favorite_Toggle
  // Tracking: taux ajout panier, scroll jusqu'avis, temps sur fiche
  ```

• **KPIs**: 
  - **Conversion** : fiche → ajout panier >30%
  - **Engagement** : faible taux de retour sans action

---

## Pattern 9: Flux de commande & paiement (Checkout mobile)

• **Contexte**: Parcours de checkout décisif pour les revenus. Paiement en quelques taps, sans friction. Optimiser chaque étape en minimisant la saisie manuelle.

• **Solution UI**: Checkout en 3 écrans max : 1) Panier (révision), 2) Adresse & livraison, 3) Paiement. Apple Pay/Google Pay en un tap prioritaires. Design épuré avec éléments de réassurance (sécurité, retours).

• **Anatomie**: 
  - **Panier** : liste items modifiables + total + promos
  - **Adresse** : champs avec autocomplétion géographique
  - **Paiement** : Apple/Google Pay ou champs carte sécurisés
  - **Confirmation** : récapitulatif final avant validation

• **Variantes iOS/Android**: 
  - **iOS** : Apple Pay prioritaire, PKPaymentAuthorizationViewController
  - **Android** : Google Pay, frameworks scan carte, clavier numérique

• **Accessibilité**: 
  - Formulaires compatibles VoiceOver/TalkBack complet
  - Navigation tab logique entre champs
  - Touch targets larges pour +/- panier (48px min)
  - Messages d'erreur clairement associés aux champs

• **Erreurs/Récupération**: 
  - Validation temps réel avec feedback immédiat
  - Gestion échec paiement avec retry automatique
  - Cache local du panier (survit aux crashes)
  - Messages d'erreur constructifs (« Carte expirée » vs « Erreur »)

• **Instrumentation**: 
  ```javascript
  // Events: Checkout_Start, Checkout_Step_Completed, Payment_Success/Failure
  // Tracking: drop-off par étape, méthodes paiement populaires
  ```

• **KPIs**: 
  - **Conversion** : panier→achat >60%
  - **Abandon** : <20% par étape de checkout
  - **Rapidité** : temps checkout total <3min

---

## Pattern 10: Dashboard personnel & gamification

• **Contexte**: Écran principal post-connexion montrant l'impact de l'utilisateur, ses investissements, points gagnés, défis en cours. Hub central motivant pour l'engagement long terme.

• **Solution UI**: Dashboard avec cartes d'information modulaires : impact total (CO₂ économisé, projets soutenus), solde de points avec évolution, défis en cours avec récompenses, activité récente. Design motivant avec actions rapides accessibles.

• **Anatomie**: 
  - **Header** : salutation personnalisée + notifications
  - **Cartes principales** : « Mon Impact », « Mes Points », « Défis »
  - **Actions** : boutons rapides vers fonctions clés
  - **Activité** : timeline des actions récentes en bas

• **Variantes iOS/Android**: 
  - **iOS** : cartes avec ombres subtiles, navigation fluide
  - **Android** : Material Cards avec élévation, FAB actions

• **Accessibilité**: 
  - Cartes accessibles avec descriptions complètes de contenu
  - Couleurs contrastées pour tous indicateurs de progression
  - Support complet Dynamic Type pour textes
  - Navigation logique entre sections de dashboard

• **Erreurs/Récupération**: 
  - États de chargement progressifs (skeleton screens)
  - Retry indépendant pour chaque section si échec
  - Mode dégradé avec données en cache si réseau instable

• **Instrumentation**: 
  ```javascript
  // Events: Dashboard_View, Card_Click, Challenge_Accept, Quick_Action_Click
  // Tracking: temps sur dashboard, interactions par carte
  ```

• **KPIs**: 
  - **Engagement** : taux d'interaction avec défis >40%
  - **Rétention** : fréquence de visite dashboard (daily active)
  - **Conversion** : challenges→actions réelles

---

## Pattern 11: Système de notifications & engagement

• **Contexte**: Maintenir l'engagement utilisateur via notifications pertinentes : mises à jour projets, défis, promotions. Équilibre entre information utile et sur-sollicitation.

• **Solution UI**: Centre de notifications in-app avec catégorisation claire. Paramètres granulaires de notification par type. Badges sur icônes pour nouveautés. Design respectant les préférences utilisateur.

• **Anatomie**: 
  - **Liste** : chronologique des notifications avec icônes par type
  - **Actions** : swipe rapides (marquer lu, archiver, supprimer)
  - **Paramètres** : contrôles granulaires par catégorie de notification
  - **États** : lu/non lu visuellement distincts

• **Variantes iOS/Android**: 
  - **iOS** : style natif avec swipe actions, badge app icon
  - **Android** : Material avec action buttons, notification channels

• **Accessibilité**: 
  - Notifications lisibles par lecteurs d'écran avec contexte
  - Contrôles d'actions accessibles au clavier/switch
  - Respect des paramètres système (Do Not Disturb, etc.)
  - Alternative visuelle pour notifications sonores

• **Erreurs/Récupération**: 
  - Gestion échec de chargement avec retry
  - Synchronisation offline des états lus/archivés
  - Fallback si permissions notif refusées

• **Instrumentation**: 
  ```javascript
  // Events: Notification_Received, Notification_Opened, Settings_Changed
  // Tracking: taux ouverture par type, opt-out par catégorie
  ```

• **KPIs**: 
  - **Engagement** : taux d'ouverture notifications >20%
  - **Rétention** : D7 des utilisateurs avec notifications ON vs OFF
  - **Pertinence** : faible taux de désactivation (<10%)

---

## Pattern 12: Profil utilisateur & paramètres

• **Contexte**: Espace personnel pour gérer compte, préférences, historique, et se déconnecter. Interface de confiance pour données sensibles avec transparence totale.

• **Solution UI**: Écran profil avec photo/avatar, informations de base modifiables, menu organisé des paramètres. Sections logiques : Compte, Notifications, Confidentialité, Aide & Support. Design rassurant pour gestion données personnelles.

• **Anatomie**: 
  - **Header** : photo utilisateur + nom + email (modifiables)
  - **Menu** : liste organisée avec icônes et navigation claire
  - **Sections** : Compte, Préférences, Confidentialité, Support
  - **Actions** : déconnexion sécurisée en bas avec confirmation

• **Variantes iOS/Android**: 
  - **iOS** : style Settings natif avec chevrons de navigation
  - **Android** : Material avec sous-titres explicatifs par option

• **Accessibilité**: 
  - Éléments de menu focusables avec descriptions complètes
  - Confirmations obligatoires pour actions critiques (suppression)
  - Navigation logique avec retours possibles partout
  - Support lecteurs d'écran pour toutes informations

• **Erreurs/Récupération**: 
  - Validation des modifications avec feedback
  - Confirmation double pour suppression compte
  - Sauvegarde locale des modifications en cours
  - Annulation possible des changements non sauvés

• **Instrumentation**: 
  ```javascript
  // Events: Profile_View, Settings_Change, Account_Delete_Request, Logout_Click
  // Tracking: modifications populaires, temps sur profil
  ```

• **KPIs**: 
  - **Personnalisation** : taux d'adoption paramètres personnalisés >60%
  - **Satisfaction** : feedback positif sur gestion profil
  - **Support** : réduction tickets via self-service

---

## 🎯 Guidelines d'Implémentation Cross-Platform

### 📱 **Standards Techniques**
- **Touch Targets** : minimum 44px (iOS) / 48px (Android)
- **Typography** : SF Pro (iOS) / Roboto (Android) / System fonts (Web)
- **Icons** : SF Symbols (iOS) / Material Icons (Android)
- **Navigation** : UITabBar (iOS) / BottomNavigationView (Android)

### ♿ **Accessibilité Obligatoire**
- **WCAG 2.2 AAA** : contraste ≥4.5:1, focus visible, navigation clavier
- **Screen Readers** : VoiceOver (iOS) / TalkBack (Android) support complet
- **Dynamic Type** : redimensionnement texte jusqu'à 200%
- **Reduced Motion** : respect des préférences utilisateur

### 🔧 **Performance & Monitoring**
- **Loading States** : skeletons preferés aux spinners
- **Error Recovery** : retry automatique + feedback utilisateur
- **Offline Support** : cache local des données critiques
- **Analytics** : instrumentation complète pour chaque pattern

---

## 📊 KPIs Globaux de la Bibliothèque

### 🎯 **Conversion Objectives**
- **Onboarding→Activation** : >80%
- **Liste→Détail** : >50% 
- **Détail→Action** : >15%
- **Panier→Achat** : >60%

### ⚡ **Performance Targets**
- **Loading Time** : <2s cold start
- **UI Response** : <300ms interactions
- **Error Rate** : <1% crashes
- **Accessibility Score** : 100% WCAG 2.2

### 📈 **Engagement Metrics**
- **Daily Active Users** : >60% retention D7
- **Session Length** : >5min moyenne
- **Feature Adoption** : >40% utilisent gamification
- **Support Satisfaction** : >4.5/5 auto-résolution

---

*Cette bibliothèque de composants est extraite et adaptée du document ui.md original (17,516 mots) et optimisée pour l'implémentation Make the CHANGE. Chaque pattern est production-ready avec spécifications complètes iOS/Android et conformité accessibilité.*

*Dernière mise à jour : 27 août 2025*