# 🤝 Système de Parrainage (V1)

## 🎯 Objectif

Acquérir de nouveaux utilisateurs de manière organique et rentable en transformant les membres actuels en ambassadeurs.

## 📋 Features V1

- **Mécanisme "Gagnant-Gagnant"** :
  - **Parrain** : Reçoit 100 points lorsque le filleul fait son premier investissement.
  - **Filleul** : Reçoit un bonus de 10% de points sur son premier investissement.
- **Code de Parrainage Unique** : Chaque utilisateur a un code et un lien de parrainage personnel.
- **Partage Facilité** : Boutons de partage natifs (WhatsApp, Email, etc.) avec des messages pré-remplis.
- **Tableau de Bord de Suivi** : Interface pour que le parrain suive le statut de ses invitations (envoyées, inscrites, converties) et ses gains.

## 🖼️ Interface Utilisateur

- **Page de Parrainage** : Accessible depuis le compte, avec le code, les boutons de partage et le tableau de bord.
- **Bannières Contextuelles** : Promouvoir le parrainage après un achat ou un avis positif.

## 📡 API & Données

```typescript
// Obtenir les infos de parrainage
GET /api/user/referral-info

// Appliquer un code de parrainage
POST /api/auth/register
Body: { ..., referralCode: string }
```

---
*Statut : ✅ Spécification détaillée*