# Checkout - Site E-commerce

## 🎯 Objectif
Collecter l'adresse de livraison, finaliser la commande avec les points et confirmer l'achat de manière sécurisée et efficace.

## 👤 Utilisateurs Cibles
- **Utilisateurs connectés uniquement** : Page protégée par authentification
- **Tous personas** : Processus simple et rassurant
- **Focus Fatima** : Sécurité et transparence maximales

## 🎨 Design & Layout

### Structure de Page
```
[Header Global avec Progress]
├── Stepper Progress (3 étapes)
├── Layout 2 Colonnes:
│   ├── Formulaire Livraison (60%)
│   │   ├── Adresse de Livraison
│   │   ├── Instructions Spéciales
│   │   └── Actions Navigation
│   └── Récapitulatif Commande (40%)
│       ├── Résumé Articles
│       ├── Calculs Prix
│       └── Bouton Confirmation
└── [Footer Minimal]
```

### Header avec Progress
```jsx
<div className="bg-white border-b sticky top-0 z-10">
  <div className="container mx-auto py-4">
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold">Finaliser ma commande</h1>
      <Button variant="ghost" onClick={backToCart}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour au panier
      </Button>
    </div>
    
    {/* Progress Stepper */}
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
          1
        </div>
        <span className="ml-2 text-sm font-medium text-slate-900">Panier</span>
      </div>
      
      <div className="w-12 h-0.5 bg-emerald-500" />
      
      <div className="flex items-center">
        <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
          2
        </div>
        <span className="ml-2 text-sm font-medium text-slate-900">Livraison</span>
      </div>
      
      <div className="w-12 h-0.5 bg-slate-300" />
      
      <div className="flex items-center">
        <div className="w-8 h-8 bg-slate-300 text-slate-600 rounded-full flex items-center justify-center text-sm font-medium">
          3
        </div>
        <span className="ml-2 text-sm text-slate-600">Confirmation</span>
      </div>
    </div>
  </div>
</div>
```

### Formulaire Livraison
```jsx
<Card className="p-8">
  <form onSubmit={handleSubmit} className="space-y-8">
    {/* Section Adresse */}
    <div>
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
        Adresse de livraison
      </h2>
      
      {/* Adresses Enregistrées */}
      {user.savedAddresses.length > 0 && (
        <div className="mb-6">
          <Label className="text-sm font-medium text-slate-700 mb-3 block">
            Utiliser une adresse enregistrée
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {user.savedAddresses.map(address => (
              <Card 
                key={address.id}
                className={cn(
                  "p-4 cursor-pointer border-2 transition-colors",
                  selectedAddressId === address.id 
                    ? "border-emerald-500 bg-emerald-50" 
                    : "border-slate-200 hover:border-slate-300"
                )}
                onClick={() => selectSavedAddress(address)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{address.name}</div>
                    <div className="text-sm text-slate-600 mt-1">
                      {address.street}<br />
                      {address.postalCode} {address.city}
                    </div>
                  </div>
                  {selectedAddressId === address.id && (
                    <Check className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
              </Card>
            ))}
          </div>
          
          <Button 
            type="button"
            variant="link" 
            onClick={useNewAddress}
            className="mt-3"
          >
            + Utiliser une nouvelle adresse
          </Button>
        </div>
      )}

      {/* Formulaire Nouvelle Adresse */}
      {(!selectedAddressId || showNewAddressForm) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName" className="required">Prénom</Label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={(e) => updateForm('firstName', e.target.value)}
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="lastName" className="required">Nom</Label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={(e) => updateForm('lastName', e.target.value)}
              className="mt-1"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="street" className="required">Adresse</Label>
            <Input
              id="street"
              value={form.street}
              onChange={(e) => updateForm('street', e.target.value)}
              className="mt-1"
              placeholder="Numéro et nom de rue"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="postalCode" className="required">Code postal</Label>
            <Input
              id="postalCode"
              value={form.postalCode}
              onChange={(e) => updateForm('postalCode', e.target.value)}
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="city" className="required">Ville</Label>
            <Input
              id="city"
              value={form.city}
              onChange={(e) => updateForm('city', e.target.value)}
              className="mt-1"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="country" className="required">Pays</Label>
            <Select 
              value={form.country} 
              onValueChange={(value) => updateForm('country', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionner un pays" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FR">France</SelectItem>
                <SelectItem value="BE">Belgique</SelectItem>
                <SelectItem value="LU">Luxembourg</SelectItem>
                <SelectItem value="CH">Suisse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sauvegarde Adresse */}
          <div className="md:col-span-2">
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={form.saveAddress}
                onCheckedChange={(checked) => updateForm('saveAddress', checked)}
              />
              <span className="text-sm text-slate-700">
                Enregistrer cette adresse pour mes prochaines commandes
              </span>
            </label>
          </div>
        </div>
      )}
    </div>

    {/* Section Instructions */}
    <div>
      <h3 className="font-semibold mb-3 flex items-center">
        <MessageSquare className="w-4 h-4 mr-2 text-emerald-600" />
        Instructions de livraison (optionnel)
      </h3>
      <Textarea
        value={form.deliveryInstructions}
        onChange={(e) => updateForm('deliveryInstructions', e.target.value)}
        placeholder="Code d'accès, étage, instructions spéciales..."
        rows={3}
        className="resize-none"
      />
    </div>

    {/* Section Créneaux Livraison */}
    <div>
      <h3 className="font-semibold mb-3 flex items-center">
        <Clock className="w-4 h-4 mr-2 text-emerald-600" />
        Créneau de livraison
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {deliverySlots.map(slot => (
          <Card 
            key={slot.id}
            className={cn(
              "p-4 cursor-pointer border-2 transition-colors",
              form.deliverySlot === slot.id
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300"
            )}
            onClick={() => updateForm('deliverySlot', slot.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{slot.label}</div>
                <div className="text-sm text-slate-600">{slot.description}</div>
              </div>
              {form.deliverySlot === slot.id && (
                <Check className="w-5 h-5 text-emerald-600" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>

    {/* Navigation */}
    <div className="flex items-center justify-between pt-6 border-t">
      <Button type="button" variant="outline" onClick={backToCart}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour au panier
      </Button>
      
      <Button 
        type="submit" 
        size="lg"
        disabled={!isFormValid || isSubmitting}
        className="min-w-[200px]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Traitement...
          </>
        ) : (
          <>
            Confirmer ma commande
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  </form>
</Card>
```

### Récapitulatif Commande (Sidebar)
```jsx
<Card className="p-6 sticky top-24 h-fit">
  <h3 className="font-semibold mb-4">Votre commande</h3>
  
  {/* Articles */}
  <div className="space-y-3 mb-6">
    {cartItems.map(item => (
      <div key={item.id} className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
          <Image
            src={item.product.images[0]}
            alt={item.product.name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-900 truncate">
            {item.product.name}
          </div>
          <div className="text-xs text-slate-500">
            Qté: {item.quantity}
          </div>
        </div>
        <div className="text-sm font-medium">
          {item.product.pointsPrice * item.quantity} pts
        </div>
      </div>
    ))}
  </div>
  
  {/* Calculs */}
  <Separator className="my-4" />
  
  <div className="space-y-2 text-sm">
    <div className="flex justify-between">
      <span>Sous-total</span>
      <span>{subtotal} points</span>
    </div>
    <div className="flex justify-between text-emerald-600">
      <span>Livraison</span>
      <span>Gratuite</span>
    </div>
    {loyaltyDiscount > 0 && (
      <div className="flex justify-between text-emerald-600">
        <span>Réduction fidélité</span>
        <span>-{loyaltyDiscount} points</span>
      </div>
    )}
  </div>
  
  <Separator className="my-4" />
  
  <div className="flex justify-between font-semibold text-lg">
    <span>Total</span>
    <span className="text-emerald-600">{total} points</span>
  </div>
  
  {/* Solde Utilisateur */}
  <div className="mt-4 p-3 bg-slate-50 rounded-lg">
    <div className="flex justify-between text-sm mb-2">
      <span>Solde actuel</span>
      <span className="font-medium">{user.pointsBalance} points</span>
    </div>
    <div className="flex justify-between text-sm">
      <span>Après commande</span>
      <span className="font-medium text-emerald-600">
        {user.pointsBalance - total} points
      </span>
    </div>
  </div>
  
  {/* Sécurité */}
  <div className="mt-6 pt-4 border-t">
    <div className="flex items-center space-x-2 text-xs text-slate-500">
      <Shield className="w-3 h-3" />
      <span>Transaction sécurisée</span>
    </div>
    <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
      <Lock className="w-3 h-3" />
      <span>Données protégées SSL</span>
    </div>
  </div>
</Card>
```

## 🔧 Composants Requis

### Composants shadcn/ui
- `Card` avec `CardContent`, `CardHeader`
- `Input` pour champs texte
- `Textarea` pour instructions
- `Select` avec `SelectTrigger`, `SelectContent`, `SelectItem`
- `Checkbox` pour options
- `Button` (variants: default, outline, ghost, link)
- `Label` pour accessibilité
- `Separator` pour dividers

### Composants Custom
- `AddressSelector` : Sélecteur adresses sauvegardées
- `DeliverySlotPicker` : Sélection créneaux livraison
- `OrderSummary` : Récapitulatif avec calculs
- `ProgressStepper` : Indicateur progression checkout
- `SecurityBadges` : Badges sécurité/confiance

## 📊 Données Requises

### API Calls
```typescript
const { data: cartItems } = trpc.cart.getItems.useQuery();

const { data: user } = trpc.auth.getCurrentUser.useQuery();

const { data: deliverySlots } = trpc.delivery.getAvailableSlots.useQuery({
  country: form.country
});

const createOrderMutation = trpc.orders.create.useMutation({
  onSuccess: (order) => {
    router.push(`/checkout/confirmation/${order.id}`);
  }
});
```

### Types TypeScript
```typescript
interface CheckoutForm {
  // Adresse
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  
  // Options
  deliveryInstructions: string;
  deliverySlot: string;
  saveAddress: boolean;
  
  // Validation
  isValid: boolean;
  errors: Record<string, string>;
}

interface DeliverySlot {
  id: string;
  label: string;
  description: string;
  isAvailable: boolean;
  estimatedDays: number;
}

interface OrderSummary {
  subtotal: number;
  loyaltyDiscount: number;
  total: number;
  pointsRequired: number;
}
```

## 🔄 États & Interactions

### Validation Formulaire
```typescript
const validateForm = (form: CheckoutForm): boolean => {
  const errors: Record<string, string> = {};
  
  if (!form.firstName.trim()) errors.firstName = "Prénom requis";
  if (!form.lastName.trim()) errors.lastName = "Nom requis";
  if (!form.street.trim()) errors.street = "Adresse requise";
  if (!form.postalCode.trim()) errors.postalCode = "Code postal requis";
  if (!form.city.trim()) errors.city = "Ville requise";
  if (!form.country) errors.country = "Pays requis";
  
  // Validation code postal par pays
  if (form.country === 'FR' && !/^\d{5}$/.test(form.postalCode)) {
    errors.postalCode = "Code postal français invalide (5 chiffres)";
  }
  
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};
```

### Soumission Commande
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm(form)) return;
  
  setIsSubmitting(true);
  
  try {
    const orderData = {
      items: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        pointsPrice: item.product.pointsPrice
      })),
      shippingAddress: {
        firstName: form.firstName,
        lastName: form.lastName,
        street: form.street,
        postalCode: form.postalCode,
        city: form.city,
        country: form.country
      },
      deliveryInstructions: form.deliveryInstructions,
      deliverySlot: form.deliverySlot,
      totalPoints: orderSummary.total
    };
    
    const order = await createOrderMutation.mutateAsync(orderData);
    
    // Sauvegarde adresse si demandée
    if (form.saveAddress) {
      await saveAddressMutation.mutateAsync({
        name: `${form.firstName} ${form.lastName}`,
        ...orderData.shippingAddress
      });
    }
    
    // Redirection confirmation
    router.push(`/checkout/confirmation/${order.id}`);
    
  } catch (error) {
    toast.error("Erreur lors de la création de la commande");
  } finally {
    setIsSubmitting(false);
  }
};
```

## 📱 Responsive Design

### Mobile (< 768px)
- **Layout vertical** : Formulaire puis récapitulatif
- **Progress** : Version simplifiée du stepper
- **Adresses** : Cards full-width empilées
- **Actions** : Boutons full-width

### Tablet (768px-1024px)
- **Layout adapté** : Formulaire 60%, récapitulatif 40%
- **Grid responsive** : Champs 2 colonnes quand possible
- **Sticky sidebar** : Récapitulatif reste visible

### Desktop (> 1024px)
- **Layout optimal** : 2 colonnes avec proportions parfaites
- **Form UX** : Auto-focus, validation temps réel
- **Keyboard navigation** : Tab order optimisé

## ♿ Accessibilité

### Formulaires
- **Labels** : Associés à tous les inputs
- **Required** : Indication visuelle et programmatique
- **Errors** : Messages d'erreur associés via aria-describedby
- **Validation** : Feedback immédiat et accessible

### Navigation
- **Skip links** : Vers formulaire, vers récapitulatif
- **Progress** : Aria-label sur stepper
- **Focus management** : Maintien focus après actions

## 🧪 Tests & Validation

### Tests Unitaires
```typescript
describe('Checkout', () => {
  it('validates required fields', async () => {
    const { user } = render(<Checkout />);
    
    const submitBtn = screen.getByRole('button', { name: /confirmer/i });
    await user.click(submitBtn);
    
    expect(screen.getByText(/prénom requis/i)).toBeInTheDocument();
    expect(screen.getByText(/adresse requise/i)).toBeInTheDocument();
  });
  
  it('selects saved address correctly', async () => {
    const mockUser = {
      savedAddresses: [{ id: '1', name: 'Domicile', street: '123 rue Test' }]
    };
    
    const { user } = render(<Checkout user={mockUser} />);
    
    await user.click(screen.getByText('Domicile'));
    expect(screen.getByDisplayValue('123 rue Test')).toBeInTheDocument();
  });
});
```

### Tests E2E
```typescript
test('complete checkout flow', async ({ page }) => {
  await page.goto('/checkout');
  
  // Remplir adresse
  await page.fill('[name="firstName"]', 'John');
  await page.fill('[name="lastName"]', 'Doe');
  await page.fill('[name="street"]', '123 rue Test');
  await page.fill('[name="postalCode"]', '75001');
  await page.fill('[name="city"]', 'Paris');
  await page.selectOption('[name="country"]', 'FR');
  
  // Soumettre
  await page.click('[data-testid="submit-order"]');
  
  // Vérifier redirection
  await expect(page).toHaveURL(/\/checkout\/confirmation/);
});
```

## 📈 Métriques & Analytics

### Conversion Tracking
- **Form Completion Rate** : % formulaires complétés
- **Abandonment Points** : Étapes où users abandonnent
- **Error Rates** : Erreurs validation par champ
- **Address Usage** : Nouvelles vs sauvegardées

### UX Metrics
- **Time to Complete** : Durée moyenne checkout
- **Field Interaction** : Champs les plus problématiques
- **Slot Preferences** : Créneaux livraison populaires
- **Country Distribution** : Répartition géographique

## 📝 Notes Techniques

### Validation Côté Client
```typescript
// Validation temps réel avec debounce
const debouncedValidate = useMemo(
  () => debounce((field: string, value: string) => {
    const fieldErrors = validateField(field, value);
    setFormErrors(prev => ({ ...prev, [field]: fieldErrors }));
  }, 300),
  []
);
```

### Sécurité
- **CSRF Protection** : Tokens anti-CSRF
- **Rate Limiting** : Limite tentatives par IP
- **Input Sanitization** : Nettoyage données entrantes
- **Address Validation** : API validation adresses

---
*Spécification maintenue par : Product & Dev Team | Version : 1.0 | Dernière MAJ : 2025-01-XX*