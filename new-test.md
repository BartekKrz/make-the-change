Micro-stock ciblé (Phase 1) — Blueprint opérationnel
Objectif

Créer une “vitrine” MTC premium (unboxing, coffrets) et sécuriser +10–15 pts de marge blendée vs. pur dropship, tout en gardant le dropship pour le reste du catalogue.

Sélection initiale (2–3 SKUs max)

Alimentaire premium (Ilanga) : 1 miel 250 g “héros” (goût le plus consensuel) + 1 mini-coffret (ex. 3 miels/épices).

Bien-être (Habeebee) : 1 coffret mini-savons (ou 1 baume best-seller).
Astuce : sélectionner des références non saisonnières, à rotation naturelle (cadeaux, usage quotidien) et risque faible de DLC.

Quantités & budget (ordre de grandeur)

Pilote : 200–300 unités au total (mixées entre 2–3 SKUs).

Cash immobilisé : quelques k€ (selon remise grossiste).

Réassort : dès que stock < ventes hebdo × lead-time + stock sécurité (simple et redoutablement efficace).

Exemple chiffré (illustratif)

Achat unitaire moyen (wholesale) : 6 € → revente 12–14 € TTC → marge brute 50–57%.

Sur 250 unités, CA ≈ 3 000–3 500 €, marge brute ≈ 1 500–2 000 € avant frais d’expédition/emballage.

Négociation fournisseurs (quick wins)

Remise de gros progressive + droit co-branding (sleeve/étiquette MTC).

Option consignation / take-or-pay 60–90j si possible (réduit le risque cash).

Réassort prioritaire (file “MTC”) quand on performe.

Fulfillment & image de marque

Micro-hub Benelux (chez toi ou mini-3PL) → expé J+1 sur ces SKUs.

Unboxing MTC : carton kraft + étui/coffret + sticker + carte de remerciement (QR “voir l’avancée de votre ruche/olivier”).

SOP expé (checklist) : contrôle visuel, pesée, bordereau, photo colis, n° tracking SMS/email.

Légal & qualité (essentiel mais simple)

Denrées : étiquetage UE (ingrédients, origine, DDM/lot/allergènes), langues FR/NL au minimum.

Cosmétiques : conformité étiquetage, batch/lot, précautions d’usage.

Traçabilité : enregistrer lot + date à l’envoi (tableau simple).

Politique retours claire (casse, erreur, insatisfaction).

KPI à suivre (pilotage 30 jours)

Rotation par SKU, marge nette / commande, taux casse/retour, délai moyen expé, NPS post-livraison.

Décision : scale (ajouter 1 SKU, +quantités) ou pivot (bundles, prix, packaging).

App native Partenaires — Spécification MVP (2–4 semaines de dev focus)

But : permettre aux partenaires de publier facilement des updates (photos/vidéos/notes) sur leurs ruches/oliviers, mettre à jour un statut, et (optionnel MVP+) déclarer un envoi (tracking) ou le stock d’un produit.

Choix technique recommandé

React Native (avec Expo Dev Client) pour aller vite, réutiliser ta stack, et bénéficier de la caméra, du offline et des push.

Offline-first : file d’upload locale (SQLite/MMKV) + reprise automatique.

Stockage médias : S3/R2 via URL pré-signées + thumbnails générés côté serveur.

Auth : email+magic-link ou OAuth (rôles : Owner, Staff).

Push : notification aux admins MTC (modération) puis aux abonnés du projet (après publication).

Parcours clés (user stories)

Créer une update

En tant que Partenaire, je prends des photos/vidéo, je saisis un titre + note (ex. “Récolte de printemps”), je choisis la ruche/olivier ciblé, et j’envoie → statut : Draft.

Modération & publication

L’admin MTC reçoit une notif, valide/edite et publie → notif aux utilisateurs abonnés au projet (+ flux public du projet).

Changement de statut

Partenaire change le statut d’un projet : installée → floraison → récolte → repos, etc. (liste configurable côté back-office).

(MVP+) Déclarer une expédition

Partenaire scanne/colle le tracking, marque “expédié”, l’utilisateur voit l’avancement (utile si on ouvre ce flux à certains partenaires).

(MVP+) Inventaire simple

Partenaire met à jour stock d’un SKU (utile si l’on vend ses produits en points).

Écrans (MVP)

Login → Liste projets → Détail projet (fil d’updates + statut) → Nouvelle update → Upload en cours/Terminé → Historique.

Paramètres : profil partenaire, langue, aide/FAQ (bonnes pratiques photo).

Contraintes média & UX terrain

Compression client (images < 2–3 Mo, vidéos < 30–45 s).

Upload robuste : pause/reprise, barre de progression, envoi en arrière-plan.

Géolocalisation (option) : géotag des prises de vue (utile pour cartes d’impact).

Accessibilité : prise de vue guidée (règle des tiers, check luminosité).

Sécurité & conformité

JWT court + refresh ; permissions par rôle et scopées à l’org du partenaire.

Scan anti-virus média côté serveur, modération obligatoire avant diffusion publique.

Journalisation (qui a publié quoi / quand).

Modèle de données minimal

Partner { id, name, users[] }

Project { id, partnerId, type:"RUCHE"|"OLIVIER"|..., status, geo, … }

ProjectUpdate { id, projectId, authorId, kind:"PHOTO"|"VIDEO"|"NOTE", media[], text, status:"DRAFT|PENDING|PUBLISHED", createdAt }

Product { id, partnerId, title, … } (MVP+)

Inventory { productId, qty } (MVP+)

Shipment { orderId, carrier, tracking, status } (MVP+)

Back-office (ce qu’il te faut tout de suite)

Modèle Projet paramétrable (coût unitaire, points, quotas, calendrier d’updates, SLA contenu).

File de modération des updates, traduction FR/EN si besoin, publication → notif.

Mapping Projet ↔ Récompenses (points immédiats ou envoi différé “après récolte”).

Tableau de bord SLA partenaires (délais, incidents, qualité média).