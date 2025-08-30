# 📱 Messages In-App & Notifications UI

> **💡 RÉFÉRENCE** : Voir [../mobile-conventions/03-conventions-patterns.md](../mobile-conventions/03-conventions-patterns.md) pour les patterns complets d'utilisation des composants Screen et les conventions de hooks.

**📍 VERSION: MVP** | **PRIORITÉ: CRITIQUE**

## 🎯 Objectif

Définir les composants UI pour afficher les notifications et les alertes directement dans l'application mobile. Ces composants doivent être cohérents avec le design system, non-intrusifs mais efficaces, et adaptés au niveau d'urgence de l'information, notamment pour l'expiration des points.

---

## 🎨 Types de Messages In-App

### 1. Bannière d'Information (Urgence Faible à Moyenne)

Utilisée pour les rappels à 30 jours ou les informations générales.

**Design** :
- **Position** : Attachée en haut de l'écran, sous le header.
- **Apparence** : Un bandeau avec une couleur de fond douce (bleu pour info, orange pour avertissement), une icône, un message court et un CTA (Call to Action).
- **Interaction** : Peut être fermée par l'utilisateur (`dismissible`).

```typescript
interface InAppBannerProps {
  id: string;
  visible: boolean;
  level: 'info' | 'warning'; // Adapte la couleur
  icon: string; // ex: 'info' ou 'alert-triangle'
  message: string;
  cta?: {
    text: string;
    onPress: () => void;
  };
  onDismiss: (bannerId: string) => void;
}

// Exemple: Alerte à 30 jours
<InAppBanner
  level="warning"
  icon="clock"
  message="Vos 150 points expirent dans 30 jours."
  cta={{ text: "Voir les produits", onPress: () => navigate('Rewards') }}
  onDismiss={...}
/>
```

### 2. Bannière Persistante (Urgence Haute)

Utilisée pour l'alerte critique à 7 jours.

**Design** :
- **Similaire à la bannière d'information**, mais ne peut pas être fermée par l'utilisateur (`dismissible: false`).
- **Couleur** : Rouge ou orange vif pour marquer l'urgence.
- **Visibilité** : Reste visible sur tous les écrans principaux (Dashboard, Projets, Récompenses) jusqu'à ce que l'utilisateur interagisse avec.

```typescript
// Exemple: Alerte à 7 jours
<InAppBanner
  level="error" // Visuellement plus fort
  icon="alert-circle"
  message="URGENT: 250 points expirent dans 7 jours !"
  cta={{ text: "Utiliser maintenant", onPress: () => navigate('ExpressCheckout') }}
  dismissible={false}
/>
```

### 3. Modale de Dernière Chance (Urgence Critique)

Utilisée pour l'alerte à 24 heures. C'est une interruption volontaire du parcours pour forcer une décision.

**Design** :
- **Type** : Modale qui apparaît au-dessus du contenu actuel.
- **Apparence** : Contenu centré, avec une icône proéminente (ex: grande horloge rouge), un titre et un message très clairs, et des boutons d'action.
- **Interaction** : L'utilisateur doit faire un choix pour fermer la modale.

```typescript
interface CriticalExpiryModalProps {
  visible: boolean;
  points_amount: number;
  suggested_product?: ProductSummary; // Produit achetable en un clic
  onQuickPurchase: (productId: string) => void;
  onBrowseCatalog: () => void;
  onAcknowledge: () => void; // "J'accepte de perdre mes points"
}

// Exemple: Alerte à 24h
<CriticalExpiryModal
  points_amount={180}
  suggested_product={...}
  // ... actions
/>
```

### 4. Toasts / Snackbars (Confirmations)

Utilisés pour des confirmations d'action rapides et non bloquantes.

**Design** :
- **Position** : Apparaît en bas de l'écran et disparaît automatiquement après quelques secondes.
- **Apparence** : Simple bandeau avec un message court et une icône de succès ou d'erreur.
- **Interaction** : Pas d'interaction requise, purement informatif.

```typescript
interface ToastNotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number; // en ms, défaut 3000
}

// Exemple: Ajout au panier réussi
showToast({ message: "Miel ajouté au panier !", type: 'success' });
```

---

## 🔧 Implémentation Technique

- **Gestionnaire de Notifications In-App** : Un service global dans l'application sera responsable de la file d'attente, de l'affichage et de la logique de persistance des messages.
- **Déclencheurs** : Les messages seront déclenchés par des événements serveur (via Push silencieux) ou par des logiques client (ex: au lancement de l'app, vérifier si une alerte doit être affichée).
- **Composants** : Utilisation de librairies comme `react-native-toast-message` pour les toasts et des composants custom pour les bannières et modales, en utilisant le design system de l'app.

---

## ✅ Critères de Validation MVP

- [ ] La bannière d'alerte à 30 jours s'affiche correctement.
- [ ] La bannière d'alerte à 7 jours est persistante et non-dismissable.
- [ ] La modale critique à 24h s'affiche au lancement de l'app si les conditions sont remplies.
- [ ] Les messages sont clairs, concis et incitent à l'action.
- [ ] L'expérience est fluide et ne bloque pas l'utilisateur de manière injustifiée (sauf pour l'alerte critique).
