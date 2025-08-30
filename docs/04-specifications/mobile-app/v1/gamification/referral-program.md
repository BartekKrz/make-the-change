# 🏆 Programme de Parrainage "Gagnant-Gagnant-Planète" (V1)

**📍 VERSION: V1** | **🗓️ TIMELINE: Mois 5-6** | **⭐️ PRIORITÉ: P1 (Important)**

## 🎯 Objectif

Créer une boucle de viralité vertueuse en incitant les utilisateurs à inviter leurs proches. Le programme est conçu pour que le parrain, le filleul, et la planète soient tous gagnants, renforçant la mission communautaire du projet.

## 📋 Mécanisme "Gagnant-Gagnant-Planète"

Le parrainage n'est pas une simple transaction, mais un acte d'engagement.

1.  **Pour le Parrain** : Reçoit une récompense significative de **100 points** lorsque son filleul réalise son premier investissement (niveau Protecteur ou Ambassadeur). La récompense est conditionnée à la conversion pour assurer des parrainages de qualité.
2.  **Pour le Filleul** : Bénéficie d'un **bonus de bienvenue de +10% de points supplémentaires** sur son premier investissement, rendant l'invitation immédiatement attractive.
3.  **Pour la Planète** : Pour chaque parrainage réussi, Make the CHANGE s'engage à une action symbolique supplémentaire (ex: planter un arbre à Madagascar via ILANGA NATURE), renforçant le storytelling.

## 🖼️ Interface Utilisateur

### Écran de Parrainage
- **Accès** : Depuis l'onglet Profil et via des bannières contextuelles.
- **Contenu** :
    - **Proposition de valeur claire** : "Invitez un ami, recevez 100 points, offrez-lui 10% de bonus et plantez un arbre !"
    - **Lien de parrainage unique** : `makethechange.fr/rejoindre/pseudo` facile à copier et partager.
    - **Boutons de partage natifs** : WhatsApp, Messenger, Email, etc. avec des messages pré-rédigés.
    - **Tableau de bord de suivi** :
        - Invitations envoyées.
        - Inscriptions en cours.
        - Parrainages réussis (avec célébration visuelle ✨).
        - Total des points gagnés.

### Parcours du Filleul
- **Page d'atterrissage personnalisée** : "Claire vous invite à rejoindre Make the CHANGE ! Découvrez votre bonus de bienvenue."
- **Bonus appliqué automatiquement** lors du premier investissement.

## 🔧 Implémentation Technique

### API Endpoints
```typescript
// Générer/récupérer le code de parrainage
user.getReferralCode: { output: { code: string, link: string } }

// Appliquer un code lors de l'inscription
auth.register: { input: { ..., referralCode?: string } }

// Suivi des parrainages
user.getReferralStatus: { 
  output: { 
    pending: number, 
    completed: number, 
    earnedPoints: number 
  } 
}
```

### Modèle de Données
- **Table `users`** : Ajouter un champ `referrer_id` (nullable).
- **Table `referrals`** : Pour suivre l'état de chaque invitation (id, referrer_id, referee_id, status, created_at).

## 📊 KPIs de Succès
- **Taux d'invitation** : % d'utilisateurs actifs qui envoient au moins une invitation par mois.
- **Taux de conversion du parrainage** : % d'invités qui deviennent Protecteurs/Ambassadeurs.
- **Coefficient K (Viralité)** : `(Invitations envoyées par utilisateur) * (Taux de conversion)`. Objectif > 0.2.
