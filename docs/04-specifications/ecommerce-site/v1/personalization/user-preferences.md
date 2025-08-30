# 🎯 Préférences Utilisateur (V1)

## 🎯 Objectif

Donner aux utilisateurs le contrôle sur leur expérience en leur permettant de définir leurs préférences, ce qui enrichit la personnalisation de la plateforme.

## 📋 Features V1

- **Centre de Préférences** : Page dédiée dans les paramètres du compte.
- **Préférences de Contenu** : 
  - Catégories de produits préférées (Miel, Cosmétiques, etc.).
  - Types de projets favoris (Apiculture, Reforestation, etc.).
- **Préférences de Communication** : 
  - Choix des canaux (Email, Push).
  - Fréquence des newsletters.
  - Types de notifications souhaitées (promos, updates projets, etc.).
- **Préférences d'Affichage** : 
  - Mode (Clair, Sombre, Système).
  - Langue.

## 🖼️ Interface Utilisateur

- **Formulaire avec Toggles et Sélecteurs** : Interface claire pour activer/désactiver les options.
- **Sauvegarde Automatique** : Les changements sont sauvegardés sans nécessiter un bouton de validation.

## 📡 API & Données

```typescript
// Gérer les préférences
GET /api/user/preferences
PUT /api/user/preferences
Body: { preferences: UserPreferences }
```

---
*Statut : ✅ Spécification détaillée*