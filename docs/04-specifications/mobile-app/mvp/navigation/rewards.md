# Récompenses MVP - Navigation Mobile

**Ajouté pour corriger le gap fonctionnel MVP : assurer que les utilisateurs peuvent accéder aux produits qu'ils gagnent avec leurs points.**

## 📱 Vue d'Ensemble

Interface basique de consultation et échange des points contre des produits artisanaux. Version MVP simplifiée pour permettre le parcours utilisateur complet "Investissement → Points → Produits".

### Status MVP
- **Phase** : MVP (Mois 3-4)
- **Priorité** : P0 (Critique pour parcours utilisateur)
- **Justification** : Sans accès aux récompenses, les utilisateurs ne peuvent pas utiliser leurs points

## 🎯 Fonctionnalités MVP

### Catalogue Produits Simplifié
```typescript
interface RewardProduct {
  id: string
  name: string
  description: string
  image: string
  points_price: number
  category: 'miel' | 'huile-olive' | 'artisanal'
  in_stock: boolean
  partner: 'HABEEBEE' | 'ILANGA_NATURE' | 'PROMIEL'
}
```

### Composants Essentiels
- **Solde Points** : Affichage du solde actuel
- **Produits Disponibles** : Liste simple avec filtres de base
- **Détail Produit** : Information + bouton échange
- **Confirmation Échange** : Validation simple

## 🖼️ Interface MVP

### Navigation Tab
```typescript
<Tab>
  <TabIcon name="gift" />
  <TabLabel>Récompenses</TabLabel>
  <Badge count={availableProducts} />
</Tab>
```

### Écran Principal
```typescript
function RewardsScreen() {
  return (
    <ScrollView>
      <PointsBalance />
      <ProductCategories />
      <ProductList />
    </ScrollView>
  )
}
```

### Composant Solde Points
```typescript
function PointsBalance({ balance }: { balance: number }) {
  return (
    <Card className="mb-4 bg-emerald-50">
      <CardContent className="p-4">
        <Text className="text-emerald-800 text-sm">Vos Points</Text>
        <Text className="text-emerald-900 text-2xl font-bold">
          {balance} points
        </Text>
        <Text className="text-emerald-600 text-xs">
          ≈ {balance.toFixed(2)}€ de produits
        </Text>
      </CardContent>
    </Card>
  )
}
```

## 🛍️ Fonctionnalités Échange

### Processus Simplifié
1. **Sélection Produit** → Détail produit
2. **Validation Points** → Vérification solde suffisant
3. **Confirmation** → Modal de confirmation
4. **Commande** → API call vers admin
5. **Confirmation** → Écran succès avec timeline livraison

### États UI Critiques
```typescript
type ExchangeState = 
  | 'idle'
  | 'insufficient_points'
  | 'out_of_stock'
  | 'exchanging'
  | 'success'
  | 'error'
```

## 📡 Intégration API

### Endpoints Requis
```typescript
// Liste produits disponibles
GET /api/products/rewards
→ RewardProduct[]

// Détail produit
GET /api/products/rewards/:id
→ RewardProduct & { delivery_time: string }

// Échange points
POST /api/orders/exchange
{
  product_id: string
  quantity: number
}
→ { order_id: string, delivery_estimate: string }
```

## 🚫 Limitations MVP

### Fonctionnalités Reportées V1
- Wishlist / Favoris
- Notifications stock
- Historique commandes détaillé
- Avis / Reviews produits
- Programme fidélité avancé

### Interface Simplifiée
- Pas de recherche avancée
- Filtres basiques seulement
- Pas de comparaison produits
- Livraison standard uniquement

## 🎨 Design Guidelines

### Cohérence Visuelle
- **Couleurs** : Emerald-600 (#059669) pour succès, Amber-600 (#D97706) pour attention
- **Typographie** : Inter, cohérent avec le reste de l'app
- **Icônes** : Lucide React, style outline

### Accessibilité MVP
- Contraste WCAG AA minimum
- Taille touch targets ≥44px
- Labels accessibles pour screen readers

## 🔗 Navigation Integration

### Bottom Tab Update
```typescript
const tabs = [
  { name: 'Dashboard', icon: 'home' },
  { name: 'Projects', icon: 'leaf' },
  { name: 'Rewards', icon: 'gift' },     // NOUVEAU MVP
  { name: 'Profile', icon: 'user' }
]
```

### Deep Links
- `/rewards` → Liste produits
- `/rewards/product/:id` → Détail produit
- `/rewards/success/:orderId` → Confirmation commande

## 📊 Métriques MVP

### KPIs Critiques
- **Taux utilisation points** : >60% des points gagnés échangés
- **Temps jusqu'au premier échange** : <7 jours après premiers points
- **Satisfaction échange** : >4/5 rating
- **Taux abandon panier** : <30%

### Analytics Events
```typescript
const rewardsEvents = {
  'rewards_tab_viewed': { timestamp: number },
  'product_viewed': { product_id: string, category: string },
  'exchange_initiated': { product_id: string, points_cost: number },
  'exchange_completed': { order_id: string, delivery_time: string }
}
```

## ✅ Acceptance Criteria

### Fonctionnel
- [ ] Utilisateur peut voir son solde points
- [ ] Utilisateur peut parcourir produits disponibles
- [ ] Utilisateur peut échanger points contre produits
- [ ] Utilisateur reçoit confirmation avec timeline livraison
- [ ] Gestion erreurs (points insuffisants, rupture stock)

### Technique
- [ ] Performance : <2s chargement liste produits
- [ ] Offline : Cache produits pour consultation hors-ligne
- [ ] Sync : Synchronisation solde points temps réel
- [ ] Erreurs : Gestion graceful des erreurs réseau

---

**Note** : Cette fonctionnalité Rewards MVP a été ajoutée pour résoudre l'incohérence critique identifiée où les utilisateurs mobile ne pouvaient pas accéder aux produits qu'ils gagnent avec leurs investissements. Elle assure un parcours utilisateur complet dès le MVP.
