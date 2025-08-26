# 🛒 Gestion des Commandes

**Interface complète de gestion des commandes avec fulfillment, tracking, et gestion des retours.**

## 🎯 Objectif

Gérer le cycle complet des commandes passées avec des points : traitement, fulfillment, expédition, livraison, et gestion des retours.

## 👤 Utilisateurs Cibles

- **Équipe fulfillment** : Traitement et préparation commandes
- **Logistique** : Expédition et tracking
- **Support client** : Assistance et résolution problèmes
- **Gestionnaires** : Supervision et analytics

## 🎨 Design & Layout

### Page Liste Commandes
```text
┌─────────────────────────────────────────────────────────────┐
│ Commandes | 1,247 total                           [📊] [⚙️] │
├─────────────────────────────────────────────────────────────┤
│ 🔍 [Recherche #, client, produit] [Statut ▼] [Période ▼]   │
├─────────────────────────────────────────────────────────────┤
│ ⚡ Actions Rapides                                          │
│ [📦 En attente: 12] [🚚 À expédier: 8] [❌ Problèmes: 3]   │
├─────────────────────────────────────────────────────────────┤
│ Table Commandes                                             │
│ ┌─────┬─────────┬─────────────┬─────────┬─────────┬───────┐ │
│ │ #   │ Client  │ Produits    │ Points  │ Statut  │ Actions│ │
│ ├─────┼─────────┼─────────────┼─────────┼─────────┼───────┤ │
│ │ 1247│ Claire  │ Miel+Savon  │ 180 pts │ Expédié │ [👁️][📄]│ │
│ │ 1246│ Marc    │ Huile olive │ 120 pts │ En prep │ [✏️][📦]│ │
│ │ 1245│ Fatima  │ Coffret     │ 250 pts │ Livré   │ [👁️][📞]│ │
│ └─────┴─────────┴─────────────┴─────────┴─────────┴───────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Panel Détail Commande
```text
┌─────────────────────────────────────────────────────────────┐
│ Commande #1247 | Claire Nouveau                         [✕] │
├─────────────────────────────────────────────────────────────┤
│ 📋 Informations                                             │
│ • Passée le: 15/08/2025 14:30                              │
│ • Client: claire@example.com (+33 6 12 34 56 78)          │
│ • Statut: En préparation                                   │
│ • Total: 180 points                                        │
│                                                             │
│ 📦 Produits                                                 │
│ • Miel de lavande (250g) - 80 pts                          │
│ • Savon au miel (2x) - 100 pts                             │
│                                                             │
│ 🚚 Livraison                                                │
│ Claire Nouveau                                              │
│ 15 rue des Fleurs                                          │
│ 75008 Paris, France                                        │
│                                                             │
│ 📊 Timeline                                                 │
│ ✅ Commandé (15/08 14:30)                                   │
│ ✅ Confirmé (15/08 14:31)                                   │
│ 🔄 En préparation (16/08 09:15) ← Actuel                   │
│ ⏳ Expédition (prévu 17/08)                                │
│ ⏳ Livraison (prévu 19/08)                                 │
│                                                             │
│ 🛠️ Actions                                                  │
│ [Marquer expédiée] [Problème qualité] [Annuler commande]   │
└─────────────────────────────────────────────────────────────┘
```

## 📱 Composants UI

### Header avec Métriques Rapides
```tsx
<div className="mb-6">
  <div className="flex justify-between items-center mb-4">
    <div>
      <h1 className="text-3xl font-bold">Commandes</h1>
      <p className="text-muted-foreground">
        {totalOrders} commandes • {totalPointsUsed} points utilisés
      </p>
    </div>
    <div className="flex gap-2">
      <Button variant="outline" onClick={exportOrders}>
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button variant="outline" onClick={printPackingSlips}>
        <Printer className="h-4 w-4 mr-2" />
        Bons de préparation
      </Button>
    </div>
  </div>
  
  {/* Métriques rapides */}
  <div className="flex gap-4">
    <Button
      variant={statusFilter === 'pending' ? 'default' : 'outline'}
      onClick={() => setStatusFilter('pending')}
    >
      📦 En attente ({pendingCount})
    </Button>
    <Button
      variant={statusFilter === 'preparing' ? 'default' : 'outline'}
      onClick={() => setStatusFilter('preparing')}
    >
      🔄 En préparation ({preparingCount})
    </Button>
    <Button
      variant={statusFilter === 'ready_to_ship' ? 'default' : 'outline'}
      onClick={() => setStatusFilter('ready_to_ship')}
    >
      🚚 À expédier ({readyToShipCount})
    </Button>
    <Button
      variant={statusFilter === 'issues' ? 'destructive' : 'outline'}
      onClick={() => setStatusFilter('issues')}
    >
      ❌ Problèmes ({issuesCount})
    </Button>
  </div>
</div>
```

### Table Commandes
```tsx
const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "order_number",
    header: "N° Commande",
    cell: ({ row }) => (
      <span className="font-mono font-medium">
        #{row.original.order_number}
      </span>
    ),
  },
  {
    accessorKey: "customer",
    header: "Client",
    cell: ({ row }) => (
      <div className="flex items-center">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={row.original.customer.avatar} />
          <AvatarFallback>{row.original.customer.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{row.original.customer.name}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.customer.email}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "items",
    header: "Produits",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">
          {row.original.items.length} produit{row.original.items.length > 1 ? 's' : ''}
        </div>
        <div className="text-sm text-muted-foreground">
          {row.original.items.slice(0, 2).map(item => item.product.name).join(', ')}
          {row.original.items.length > 2 && ' +' + (row.original.items.length - 2)}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "total_points",
    header: "Total",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.total_points} pts
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.original.status;
      const variants = {
        pending: 'warning',
        confirmed: 'default',
        preparing: 'secondary',
        ready_to_ship: 'default',
        shipped: 'default',
        delivered: 'success',
        cancelled: 'destructive',
        returned: 'destructive'
      };
      const labels = {
        pending: 'En attente',
        confirmed: 'Confirmée',
        preparing: 'En préparation',
        ready_to_ship: 'Prête à expédier',
        shipped: 'Expédiée',
        delivered: 'Livrée',
        cancelled: 'Annulée',
        returned: 'Retournée'
      };
      return (
        <Badge variant={variants[status]}>
          {labels[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.created_at),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => viewOrderDetail(order.id)}>
              <Eye className="mr-2 h-4 w-4" />
              Voir détail
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => printPackingSlip(order.id)}>
              <Printer className="mr-2 h-4 w-4" />
              Bon de préparation
            </DropdownMenuItem>
            {order.status === 'ready_to_ship' && (
              <DropdownMenuItem onClick={() => markAsShipped(order.id)}>
                <Truck className="mr-2 h-4 w-4" />
                Marquer expédiée
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => contactCustomer(order.customer.id)}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Contacter client
            </DropdownMenuItem>
            {['pending', 'confirmed', 'preparing'].includes(order.status) && (
              <DropdownMenuItem 
                onClick={() => cancelOrder(order.id)}
                className="text-destructive"
              >
                <X className="mr-2 h-4 w-4" />
                Annuler commande
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
```

### Panel Détail Commande
```tsx
<Sheet open={selectedOrder !== null} onOpenChange={closeOrderPanel}>
  <SheetContent className="w-96 overflow-y-auto">
    <SheetHeader>
      <SheetTitle>Commande #{selectedOrder?.order_number}</SheetTitle>
      <SheetDescription>
        {selectedOrder?.customer.name} • {formatDate(selectedOrder?.created_at)}
      </SheetDescription>
    </SheetHeader>
    
    <div className="space-y-6 mt-6">
      {/* Statut et Actions rapides */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Statut actuel</span>
          <Badge variant={getStatusVariant(selectedOrder?.status)}>
            {getStatusLabel(selectedOrder?.status)}
          </Badge>
        </div>
        
        {/* Actions selon statut */}
        {selectedOrder?.status === 'preparing' && (
          <Button size="sm" className="w-full" onClick={() => markReadyToShip(selectedOrder.id)}>
            <Package className="h-4 w-4 mr-2" />
            Marquer prête à expédier
          </Button>
        )}
        
        {selectedOrder?.status === 'ready_to_ship' && (
          <div className="space-y-2">
            <Button size="sm" className="w-full" onClick={() => markAsShipped(selectedOrder.id)}>
              <Truck className="h-4 w-4 mr-2" />
              Marquer expédiée
            </Button>
            <Button size="sm" variant="outline" className="w-full" onClick={() => addTrackingNumber(selectedOrder.id)}>
              <Scan className="h-4 w-4 mr-2" />
              Ajouter n° suivi
            </Button>
          </div>
        )}
      </div>

      {/* Informations client */}
      <div>
        <h3 className="font-medium mb-2">Client</h3>
        <div className="space-y-1 text-sm">
          <div>{selectedOrder?.customer.name}</div>
          <div className="text-muted-foreground">{selectedOrder?.customer.email}</div>
          <div className="text-muted-foreground">{selectedOrder?.customer.phone}</div>
        </div>
      </div>

      {/* Adresse de livraison */}
      <div>
        <h3 className="font-medium mb-2">Livraison</h3>
        <div className="text-sm space-y-1">
          <div>{selectedOrder?.shipping_address.name}</div>
          <div>{selectedOrder?.shipping_address.street}</div>
          <div>
            {selectedOrder?.shipping_address.postal_code} {selectedOrder?.shipping_address.city}
          </div>
          <div>{selectedOrder?.shipping_address.country}</div>
        </div>
      </div>

      {/* Produits */}
      <div>
        <h3 className="font-medium mb-2">Produits</h3>
        <div className="space-y-2">
          {selectedOrder?.items.map(item => (
            <div key={item.id} className="flex justify-between items-center p-2 border rounded">
              <div>
                <div className="font-medium text-sm">{item.product.name}</div>
                <div className="text-xs text-muted-foreground">
                  Qté: {item.quantity} • {item.points_per_unit} pts/unité
                </div>
              </div>
              <div className="text-sm font-medium">
                {item.total_points} pts
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-medium mt-2 pt-2 border-t">
          <span>Total</span>
          <span>{selectedOrder?.total_points} points</span>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h3 className="font-medium mb-2">Historique</h3>
        <div className="space-y-2">
          {selectedOrder?.timeline.map(event => (
            <div key={event.id} className="flex items-center text-sm">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                event.completed ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <div className="flex-1">
                <div className="font-medium">{event.label}</div>
                <div className="text-xs text-muted-foreground">
                  {event.completed ? formatDateTime(event.completed_at) : 'En attente'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes et problèmes */}
      <div>
        <h3 className="font-medium mb-2">Notes</h3>
        <Textarea
          placeholder="Ajouter une note..."
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
        />
        <Button size="sm" className="mt-2" onClick={addOrderNote}>
          Ajouter note
        </Button>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Button variant="outline" className="w-full" onClick={() => printPackingSlip(selectedOrder?.id)}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimer bon de préparation
        </Button>
        <Button variant="outline" className="w-full" onClick={() => contactCustomer(selectedOrder?.customer.id)}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Contacter client
        </Button>
        <Button variant="outline" className="w-full" onClick={() => viewCustomerOrders(selectedOrder?.customer.id)}>
          <User className="mr-2 h-4 w-4" />
          Autres commandes client
        </Button>
      </div>
    </div>
  </SheetContent>
</Sheet>
```

## 🔄 États & Interactions

### Workflow Commande
```typescript
type OrderStatus = 
  | 'pending'        // En attente confirmation
  | 'confirmed'      // Confirmée, points débités
  | 'preparing'      // En cours de préparation
  | 'ready_to_ship'  // Prête à expédier
  | 'shipped'        // Expédiée avec tracking
  | 'delivered'      // Livrée (confirmée)
  | 'cancelled'      // Annulée (points recrédités)
  | 'returned';      // Retournée (gestion retour)

// Lors d'un changement de statut (ex: 'shipped'), une option "Notifier le client"
// doit être cochée par défaut pour déclencher un email/push automatique.

// Transitions autorisées
const allowedTransitions = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready_to_ship', 'cancelled'],
  ready_to_ship: ['shipped'],
  shipped: ['delivered', 'returned'],
  delivered: ['returned'], // retour après livraison
  cancelled: [], // état final
  returned: []   // état final
};
```

### Actions Bulk
```tsx
// Sélection multiple pour actions groupées
const BulkActions = () => {
  const selectedOrders = table.getSelectedRowModel().rows;
  
  if (selectedOrders.length === 0) return null;
  
  return (
    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
      <span className="text-sm">{selectedOrders.length} commandes sélectionnées</span>
      <Button size="sm" onClick={bulkMarkPreparing}>
        Marquer en préparation
      </Button>
      <Button size="sm" onClick={bulkPrintPackingSlips}>
        Imprimer bons
      </Button>
      <Button size="sm" variant="outline" onClick={bulkExport}>
        Exporter sélection
      </Button>
    </div>
  );
};
```

## 📡 API & Données

### Routes tRPC
```typescript
// Liste et filtrage commandes
admin.orders.list: {
  input: {
    page: number;
    limit: number;
    search?: string;
    status?: OrderStatus;
    customer_id?: string;
    date_range?: [Date, Date];
    product_id?: string;
  };
  output: {
    orders: Order[];
    total: number;
    summary: OrderSummary;
  };
}

// Détail commande complet
admin.orders.detail: {
  input: { id: string };
  output: {
    order: OrderDetail;
    timeline: OrderTimelineEvent[];
    notes: OrderNote[];
    related_orders: Order[]; // autres commandes du client
  };
}

// Actions sur commandes
admin.orders.update_status: {
  input: { 
    id: string; 
    status: OrderStatus; 
    tracking_number?: string;
    note?: string;
  };
  output: { success: boolean; order: Order };
}

admin.orders.bulk_update: {
  input: {
    order_ids: string[];
    status: OrderStatus;
    note?: string;
  };
  output: {
    success: boolean;
    updated_count: number;
    failed_ids: string[];
  };
}

// Communication
admin.orders.add_note: {
  input: { order_id: string; note: string; admin_id: string };
  output: { success: boolean; note: OrderNote };
}

admin.orders.send_customer_update: {
  input: { order_id: string; message: string; include_tracking: boolean };
  output: { success: boolean };
}

// Exports et impressions
admin.orders.export: {
  input: { 
    filters: OrderFilters; 
    format: 'csv' | 'xlsx';
    fields: string[];
  };
  output: { download_url: string };
}

admin.orders.generate_packing_slip: {
  input: { order_id: string };
  output: { pdf_url: string };
}
```

### Modèles de Données
```typescript
interface Order {
  id: string;
  order_number: string;
  customer: Customer;
  status: OrderStatus;
  total_points: number;
  items: OrderItem[];
  shipping_address: Address;
  tracking_number?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  shipped_at?: Date;
  delivered_at?: Date;
}

interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  points_per_unit: number;
  total_points: number;
}

interface OrderTimelineEvent {
  id: string;
  order_id: string;
  status: OrderStatus;
  label: string;
  completed: boolean;
  completed_at?: Date;
  admin_id?: string;
  note?: string;
}

interface OrderNote {
  id: string;
  order_id: string;
  admin_id: string;
  admin: Admin;
  note: string;
  created_at: Date;
}
```

## ✅ Validations

### Contraintes Business
- **Annulation** : Possible jusqu'à "ready_to_ship"
- **Points recrédités** : Automatique en cas d'annulation
- **Tracking requis** : Pour passage "shipped"
- **Timeline complète** : Tous événements tracés

### Permissions
- **Fulfillment** : Update status jusqu'à "ready_to_ship"
- **Logistics** : Statuts "shipped" et "delivered"
- **Support** : Toutes actions + annulations + notes
- **Admin** : Toutes actions + modifications données

## 🚨 Gestion d'Erreurs

### Scenarios Problématiques
```typescript
const orderIssues = {
  STOCK_SHORTAGE: "Stock insuffisant pour cette commande",
  PAYMENT_POINTS_FAILED: "Échec débit points client", 
  SHIPPING_ADDRESS_INVALID: "Adresse de livraison invalide",
  PRODUCT_DISCONTINUED: "Produit non disponible",
  CUSTOMER_SUSPENDED: "Compte client suspendu"
};
```

### Recovery Actions
- **Stock manquant** : Commande partielle + notification client
- **Adresse invalide** : Contact client pour correction
- **Produit discontinué** : Proposition de substitution

## 🔗 Navigation

### Liens Contextuels
```typescript
const orderActions = {
  viewCustomer: `/admin/users/${customerId}`,
  viewProduct: `/admin/products/${productId}`,
  orderHistory: `/admin/orders?customer_id=${customerId}`,
  analytics: `/admin/analytics/orders`,
  fulfillmentQueue: `/admin/orders?status=preparing&sort=created_asc`
};
```

## 📝 Tests Utilisateur

### Scénarios Critiques
1. **Traitement commande** : De "pending" à "shipped" <5min
2. **Bulk operations** : 50+ commandes <30s
3. **Impression bons** : Génération PDF <10s
4. **Recherche/filtrage** : Résultats <1s
5. **Communication client** : Envoi notifications fluide

### Performance
- **Liste commandes** : <1s pour 200 commandes
- **Détail commande** : <500ms load complet
- **Bulk update** : <20s pour 100 commandes
- **Export** : <60s pour 1000 commandes

## 💾 Stockage Local

### Préférences Fulfillment
```typescript
interface OrderManagementPrefs {
  defaultView: 'table' | 'kanban';
  defaultFilters: OrderFilters;
  autoRefresh: boolean;
  notificationSound: boolean;
  bulkConfirmation: boolean;
  quickStatusButtons: OrderStatus[];
}
```

### Cache Optimisé
- **Order list** : 2min cache avec invalidation
- **Order details** : 30s cache
- **Customer data** : 5min cache
- **Product data** : 10min cache

---

**Stack Technique** : TanStack Table + React Hook Form + jsPDF  
**Priorité** : 🔥 Critique - Operations quotidiennes  
**Estimation** : 7-10 jours développement + intégration fulfillment
