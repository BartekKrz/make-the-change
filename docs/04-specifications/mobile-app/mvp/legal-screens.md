# ⚖️ Écrans Légaux - Spécifications App Mobile

**📍 VERSION: MVP** | **PRIORITÉ: CRITIQUE**

## 🎯 Objectif

Définir l'implémentation **spécifique à la plateforme mobile** des écrans légaux, en se basant sur le contenu défini dans le document central [`legal-screens-spec.md`](../../legal-screens-spec.md). L'accent est mis sur une expérience utilisateur native, lisible et accessible sur iOS et Android.

---

## 1. Navigation et Accès

L'accès aux documents légaux se fera de manière non intrusive, depuis les paramètres du profil utilisateur.

- **Chemin d'accès principal** : `Onglet Profil` → `Paramètres (icône ⚙️)` → `Section "Légal & Conformité"`
- **Liens contextuels** : Des liens directs vers la politique de confidentialité et les CGU seront présents sur l'écran d'inscription.

```typescript
// Structure du menu dans les paramètres
const legalSettingsMenu = {
  title: "Légal & Conformité",
  items: [
    { label: "Conditions Générales d'Utilisation", screen: "TermsOfService" },
    { label: "Politique de Confidentialité", screen: "PrivacyPolicy" },
    { label: "Conditions Générales de Vente", screen: "TermsOfSale" },
    { label: "Gestion des Cookies", screen: "CookiePreferences" },
    { label: "Mentions Légales", screen: "LegalNotices" }
  ]
};
```

---

## 2. Présentation des Documents (CGU, CGV, Politique de Confidentialité)

Pour une lisibilité optimale sur mobile, les documents longs seront présentés dans une vue dédiée avec des composants natifs.

### Composants UI
- **`LegalDocumentScreen`**: Un composant d'écran générique pour afficher un document légal.
  - **Header Natif** : Avec un titre clair et un bouton "Fermer" ou "Retour".
  - **`ScrollView`** : Pour permettre un défilement fluide du contenu.
  - **`Accordion` (Composant Dépliant)** : La meilleure approche pour les documents longs comme les CGU/CGV. Chaque article (ex: "Article 1", "Article 2") sera un item de l'accordéon, que l'utilisateur pourra déplier pour lire le contenu.

```typescript
interface LegalDocumentScreenProps {
  title: string;
  sections: {
    title: string;
    content: string;
  }[];
}

// Exemple d'utilisation pour les CGU
<LegalDocumentScreen
  title="Conditions d'Utilisation"
  sections={[
    { title: "Article 1: Définitions", content: "..." },
    { title: "Article 2: Objet", content: "..." },
    // ... autres articles
  ]}
/>
```

---

## 3. Gestion du Consentement (Cookies & RGPD)

### Bannière de Consentement
- **Type** : **Modale non-dismissable** au premier lancement de l'application.
- **Contenu** : Message court expliquant l'utilisation des données, avec trois actions claires.
- **Actions** :
  1. `Accepter tout` : Bouton principal.
  2. `Refuser (sauf essentiels)` : Bouton secondaire.
  3. `Personnaliser` : Ouvre l'écran de gestion des préférences.

### Écran de Préférences Cookies
- **Présentation** : Un écran dédié accessible depuis la bannière ou les paramètres.
- **Composants** : Utilisation de `Switch` natifs pour chaque catégorie de cookies (Analyse, Marketing). La catégorie "Essentiels" sera visible mais désactivée.
- **Sauvegarde** : Les choix de l'utilisateur sont sauvegardés immédiatement.

---

## 4. Gestion des Données Utilisateur (RGPD)

Ces écrans seront accessibles depuis `Profil` → `Paramètres` → `Mon Compte & Données`.

### Export de Données
- **Interface** : Un formulaire simple où l'utilisateur peut demander un export.
- **Processus** :
  1. L'utilisateur clique sur "Exporter mes données".
  2. Une modale de confirmation apparaît, expliquant que le processus peut prendre du temps.
  3. Après confirmation, une notification (email/push) est envoyée lorsque l'export est prêt à être téléchargé via un lien sécurisé.

### Suppression de Compte
- **Interface** : Un bouton clair mais distinct, avec une couleur destructive (rouge).
- **Processus** :
  1. L'utilisateur clique sur "Supprimer mon compte".
  2. Une **modale de confirmation critique** apparaît, expliquant les conséquences (perte des points, des investissements, etc.) et demandant une confirmation (ex: saisir "SUPPRIMER").
  3. Après confirmation, le compte est mis en attente de suppression pour une période de grâce de 30 jours, puis anonymisé.

---

## ✅ Critères de Validation pour le Mobile

- **Navigation Native** : L'accès et la présentation des écrans légaux doivent utiliser les conventions de navigation d'iOS et Android.
- **Lisibilité** : Les polices et les espacements doivent être optimisés pour une lecture confortable sur des écrans de 4 à 7 pouces.
- **Performance** : Le chargement des documents légaux doit être instantané.
- **Accessibilité** : Tous les écrans doivent être compatibles avec VoiceOver (iOS) et TalkBack (Android).
