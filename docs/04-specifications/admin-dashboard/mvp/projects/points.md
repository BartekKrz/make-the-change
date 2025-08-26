# 🎯 Gestion des Points

**Système complet de gestion des points avec expiry, bonus, conversions, et analytics détaillées.**

## 🎯 Objectif

Gérer l'économie de points Make the CHANGE : attribution, expiry, bonus, conversions, audit trail, et résolution des problèmes utilisateurs.

## 👤 Utilisateurs Cibles

- **Finance team** : Gestion économie points et audit
- **Support client** : Résolution problèmes points utilisateurs
- **Administrateurs** : Ajustements et corrections manuelles
- **Analystes** : Analytics et optimisation du système

## 🎨 Design & Layout

### Dashboard Points Principal
```text
┌─────────────────────────────────────────────────────────────┐
│ Système Points | 1,234,567 pts en circulation          [⚙️] │
├─────────────────────────────────────────────────────────────┤
│ 📊 KPIs Points                                              │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│ │ Total Actifs│ │ Expiry 30j  │ │ Conversion  │ │ Revenue │ │
│ │ 1,234,567   │ │ 45,230      │ │ 68.5%       │ │ €89,450 │ │
│ │ pts         │ │ pts ⚠️       │ │ ce mois     │ │ généré  │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────────┤
│ 📈 Graphiques Analytics                                     │
│ [Évolution circulation] [Taux conversion] [Points expiry]   │
└─────────────────────────────────────────────────────────────┘
```

### Table Transactions Points
```text
┌─────────────────────────────────────────────────────────────┐
│ Transactions Points | Dernières 30 jours              [📊] │
├─────────────────────────────────────────────────────────────┤
│ 🔍 [Recherche user/transaction] [Type ▼] [Status ▼] [📅]   │
├─────────────────────────────────────────────────────────────┤
│ ┌─────┬─────────────┬─────────┬─────────┬─────────┬─────────┐ │
│ │ ID  │ Utilisateur │ Type    │ Points  │ Status  │ Actions │ │
│ ├─────┼─────────────┼─────────┼─────────┼─────────┼─────────┤ │
│ │ T1  │ Claire N.   │ Earn    │ +375    │ Active  │ [👁️] [✏️] │ │
│ │ T2  │ Marc D.     │ Spend   │ -150    │ Used    │ [👁️] [📄] │ │
│ │ T3  │ Fatima B.   │ Bonus   │ +52     │ Active  │ [👁️] [⚠️] │ │
│ │ T4  │ Maxime L.   │ Expired │ -80     │ Expired │ [👁️] [↩️] │ │
│ └─────┴─────────────┴─────────┴─────────┴─────────┴─────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Panel Gestion Expiry
```text
┌─────────────────────────────────────────────────────────────┐
│ Gestion Points Expiry | 45,230 pts expiry 30j          [🔔] │
├─────────────────────────────────────────────────────────────┤
│ ⚠️ Alertes Expiry                                           │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 47 utilisateurs ont des points expirant dans 7 jours   │ │
│ │ [Envoyer notifications] [Voir détail] [Étendre expiry] │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ 📅 Échéances par Période                                   │
│ • 7 jours : 12,450 pts (47 users)                          │
│ • 15 jours : 18,220 pts (73 users)                         │
│ • 30 jours : 14,560 pts (51 users)                         │
│                                                             │
│ 🛠️ Actions Bulk                                            │
│ [Étendre tous +30j] [Notifications masse] [Export liste]   │
└─────────────────────────────────────────────────────────────┘
```

## 📱 Composants UI

### KPIs Dashboard Points
```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">Points Actifs</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">1,234,567</div>
      <div className="text-xs text-muted-foreground">
        <span className="text-green-600">+8.2%</span> vs mois dernier
      </div>
    </CardContent>
  </Card>
  
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">Expiry 30j</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-orange-600">45,230</div>
      <div className="text-xs text-muted-foreground">
        171 utilisateurs concernés
      </div>
    </CardContent>
  </Card>
  
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">Taux Conversion</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">68.5%</div>
      <div className="text-xs text-muted-foreground">
        <span className="text-green-600">+2.1%</span> ce mois
      </div>
    </CardContent>
  </Card>
  
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">Revenue Généré</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">€89,450</div>
      <div className="text-xs text-muted-foreground">
        Via conversions points
      </div>
    </CardContent>
  </Card>
</div>
```

### Table Transactions
```tsx
const transactionColumns: ColumnDef<PointsTransaction>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-sm">
        {row.original.id.slice(0, 8)}
      </span>
    ),
  },
  {
    accessorKey: "user",
    header: "Utilisateur",
    cell: ({ row }) => (
      <div className="flex items-center">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={row.original.user.avatar} />
          <AvatarFallback>{row.original.user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{row.original.user.name}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.user.email}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      const variants = {
        earn: 'success',
        spend: 'secondary',
        bonus: 'default',
        expired: 'destructive',
        adjustment: 'warning'
      };
      const icons = {
        earn: '+',
        spend: '-',
        bonus: '★',
        expired: '⏰',
        adjustment: '⚙️'
      };
      return (
        <Badge variant={variants[type]}>
          {icons[type]} {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Points",
    cell: ({ row }) => {
      const amount = row.original.amount;
      const isPositive = amount > 0;
      return (
        <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
          {isPositive ? '+' : ''}{amount} pts
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variants = {
        active: 'success',
        used: 'secondary',
        expired: 'destructive',
        pending: 'warning'
      };
      return <Badge variant={variants[status]}>{status}</Badge>;
    },
  },
  {
    accessorKey: "expiry_date",
    header: "Expiration",
    cell: ({ row }) => {
      const expiryDate = row.original.expiry_date;
      if (!expiryDate) return '-';
      
      const daysUntilExpiry = Math.ceil(
        (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      
      const isExpiringSoon = daysUntilExpiry <= 30;
      
      return (
        <div className={isExpiringSoon ? 'text-orange-600' : ''}>
          {formatDate(expiryDate)}
          {isExpiringSoon && (
            <div className="text-xs">
              {daysUntilExpiry}j restants ⚠️
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => viewTransaction(row.original.id)}>
            <Eye className="mr-2 h-4 w-4" />
            Voir détail
          </DropdownMenuItem>
          {row.original.status === 'active' && (
            <DropdownMenuItem onClick={() => extendExpiry(row.original.id)}>
              <Clock className="mr-2 h-4 w-4" />
              Étendre expiry
            </DropdownMenuItem>
          )}
          {row.original.status === 'expired' && (
            <DropdownMenuItem onClick={() => reactivatePoints(row.original.id)}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Réactiver
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => addAdjustment(row.original.user_id)}>
            <Edit className="mr-2 h-4 w-4" />
            Ajustement manuel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
```

### Panel Ajustement Manuel
```tsx
<Dialog open={showAdjustmentDialog} onOpenChange={setShowAdjustmentDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Ajustement Points Manuel</DialogTitle>
      <DialogDescription>
        Utilisateur: {selectedUser?.name} ({selectedUser?.email})
        <br />
        Solde actuel: {selectedUser?.points_balance} pts
      </DialogDescription>
    </DialogHeader>
    
    <Form {...adjustmentForm}>
      <form onSubmit={adjustmentForm.handleSubmit(onSubmitAdjustment)} className="space-y-4">
        <FormField
          control={adjustmentForm.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type d'ajustement</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="add">➕ Ajouter points</SelectItem>
                  <SelectItem value="remove">➖ Retirer points</SelectItem>
                  <SelectItem value="extend">⏰ Étendre expiry</SelectItem>
                  <SelectItem value="reset">🔄 Reset expiry</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        {(adjustmentForm.watch('type') === 'add' || adjustmentForm.watch('type') === 'remove') && (
          <FormField
            control={adjustmentForm.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Montant (points)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="100" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        
        {(adjustmentForm.watch('type') === 'extend' || adjustmentForm.watch('type') === 'reset') && (
          <FormField
            control={adjustmentForm.control}
            name="expiry_extension_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Extension (jours)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" max="365" placeholder="30" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={adjustmentForm.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Raison (obligatoire)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Expliquer la raison de cet ajustement..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Cette raison sera visible dans l'audit trail
              </FormDescription>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setShowAdjustmentDialog(false)}>
            Annuler
          </Button>
          <Button type="submit">
            Appliquer ajustement
          </Button>
        </div>
      </form>
    </Form>
  </DialogContent>
</Dialog>
```

### Alertes Expiry
```tsx
<Card className="mb-6">
  <CardHeader>
    <CardTitle className="flex items-center">
      <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
      Points Expiry - Alertes
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {expiryAlerts.map(alert => (
        <Alert key={alert.timeframe} variant={alert.urgency === 'high' ? 'destructive' : 'warning'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>
            <div className="mt-2">
              <p>{alert.points_count} points • {alert.users_count} utilisateurs</p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => sendExpiryNotifications(alert.timeframe)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer notifications
                </Button>
                <Button size="sm" variant="outline" onClick={() => viewExpiryDetails(alert.timeframe)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Voir détail
                </Button>
                <Button size="sm" variant="outline" onClick={() => bulkExtendExpiry(alert.timeframe)}>
                  <Clock className="h-4 w-4 mr-2" />
                  Étendre tous +30j
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  </CardContent>
</Card>
```

## 🔄 États & Interactions

### Types de Transactions
```typescript
type PointsTransactionType = 
  | 'investment' // Gain via investissement
  | 'spend'       // Dépense produits
  | 'bonus'       // Bonus fidélité/saisonnier
  | 'expired'     // Expiration automatique
  | 'adjustment'  // Ajustement manuel admin
  | 'refund';     // Remboursement annulation

type PointsStatus = 
  | 'active'      // Points utilisables
  | 'used'        // Points dépensés
  | 'expired'     // Points expirés
  | 'pending';    // En attente validation
```

### Calculs Points
```typescript

```

### Automation Expiry
```typescript
// Job quotidien - alertes expiry
const checkExpiryAlerts = async () => {
  const alerts = await findPointsExpiringIn([7, 15, 30]); // jours
  
  for (const alert of alerts) {
    if (alert.shouldSendNotification) {
      await sendExpiryNotificationToUser(alert.userId, alert.expiryDate, alert.pointsAmount);
    }
  }
};

// Job quotidien - expiry automatique
const processExpiredPoints = async () => {
  const expiredPoints = await findExpiredPoints();
  
  for (const transaction of expiredPoints) {
    await markPointsAsExpired(transaction.id);
    await logAuditEvent('points_expired', transaction);
  }
};
```

## 📡 API & Données

### Routes tRPC
```typescript
// Dashboard points
admin.points.dashboard: {
  output: {
    total_active: number;
    expiring_30d: number;
    conversion_rate: number;
    revenue_generated: number;
    trends: {
      weekly_earned: Array<{ week: string; points: number }>;
      weekly_spent: Array<{ week: string; points: number }>;
      conversion_by_category: Array<{ category: string; rate: number }>;
    };
  };
}

// Transactions avec filtres
admin.points.transactions: {
  input: {
    page: number;
    limit: number;
    user_id?: string;
    type?: PointsTransactionType;
    status?: PointsStatus;
    date_range?: [Date, Date];
    expiring_soon?: boolean;
  };
  output: {
    transactions: PointsTransaction[];
    total: number;
    summary: TransactionSummary;
  };
}

// Gestion expiry
admin.points.expiry_alerts: {
  output: {
    alerts: Array<{
      timeframe: number; // jours
      points_count: number;
      users_count: number;
      urgency: 'low' | 'medium' | 'high';
    }>;
  };
}

admin.points.extend_expiry: {
  input: { 
    transaction_ids: string[]; 
    extension_days: number; 
    reason: string; 
  };
  output: { success: boolean; updated_count: number };
}

// Ajustements manuels
admin.points.manual_adjustment: {
  input: {
    user_id: string;
    type: 'add' | 'remove' | 'extend' | 'reset';
    amount?: number;
    expiry_extension_days?: number;
    reason: string;
  };
  output: { 
    success: boolean; 
    new_balance: number;
    transaction_id: string;
  };
}

// Audit trail
admin.points.audit_trail: {
  input: {
    user_id?: string;
    admin_id?: string;
    action_type?: string;
    date_range?: [Date, Date];
  };
  output: {
    audit_logs: AuditLog[];
    total: number;
  };
}
```

### Modèles de Données
```typescript
interface PointsTransaction {
  id: string;
  user_id: string;
  user: User;
  type: PointsTransactionType;
  status: PointsStatus;
  amount: number;
  description: string;
  reference_id?: string; // ID investissement/commande
  reference_type?: 'subscription' | 'order' | 'bonus';
  earned_date: Date;
  expiry_date?: Date;
  used_date?: Date;
  created_at: Date;
}

interface PointsAdjustment {
  id: string;
  transaction_id: string;
  admin_id: string;
  admin: Admin;
  type: 'add' | 'remove' | 'extend' | 'reset';
  amount_before: number;
  amount_after: number;
  expiry_before?: Date;
  expiry_after?: Date;
  reason: string;
  created_at: Date;
}

interface PointsAuditLog {
  id: string;
  user_id: string;
  admin_id?: string;
  action: string;
  details: any;
  ip_address: string;
  user_agent: string;
  created_at: Date;
}
```

## ✅ Validations

### Contraintes Business
- **Ajustement maximum** : ±10,000 points par opération
- **Extension expiry** : Max 365 jours
- **Raison obligatoire** : Pour tous ajustements manuels
- **Audit trail** : Traçabilité complète

### Permissions
- **Support** : Voir transactions + alertes expiry
- **Manager** : Ajustements ±1000 pts + extensions 30j
- **Admin** : Ajustements ±5000 pts + extensions 90j
- **Super Admin** : Tous ajustements + audit complet

### Validation Ajustements
```typescript
const validateAdjustment = (adjustment: PointsAdjustment, adminRole: string) => {
  const limits = {
    support: { maxAmount: 0, maxExtension: 0 },
    manager: { maxAmount: 1000, maxExtension: 30 },
    admin: { maxAmount: 5000, maxExtension: 90 },
    super_admin: { maxAmount: 10000, maxExtension: 365 }
  };
  
  const limit = limits[adminRole];
  
  if (Math.abs(adjustment.amount) > limit.maxAmount) {
    throw new Error('Montant ajustement trop élevé pour ce rôle');
  }
  
  if (adjustment.extension_days > limit.maxExtension) {
    throw new Error('Extension trop longue pour ce rôle');
  }
};
```

## 🚨 Gestion d'Erreurs

### Scenarios d'Erreur
```typescript
const pointsErrors = {
  INSUFFICIENT_BALANCE: "Solde points insuffisant",
  POINTS_ALREADY_EXPIRED: "Ces points ont déjà expiré",
  ADJUSTMENT_TOO_LARGE: "Ajustement trop important pour votre rôle",
  NEGATIVE_BALANCE_NOT_ALLOWED: "Le solde ne peut pas être négatif",
  EXPIRY_EXTENSION_FAILED: "Échec de l'extension d'expiry",
  BULK_OPERATION_PARTIAL: "Opération bulk partiellement réussie"
};
```

### Recovery & Rollback
- **Ajustement erroné** : Fonction d'annulation avec audit
- **Expiry accidentelle** : Réactivation avec justification
- **Bulk operations** : Transaction atomique avec rollback

## 🔗 Navigation

### Actions Contextuelles
```typescript
const pointsActions = {
  viewUserPoints: `/admin/users/${userId}?tab=points`,
  viewSubscriptionPoints: `/admin/subscriptions/${subscriptionId}?tab=points`,
  viewOrderPoints: `/admin/orders/${orderId}?tab=points`,
  pointsAnalytics: `/admin/analytics/points`,
  auditTrail: `/admin/audit/points?user_id=${userId}`
};
```

## 📝 Tests Utilisateur

### Scénarios Critiques
1. **Ajustement manuel** : Process complet <2min
2. **Extension expiry bulk** : 100+ transactions <30s
3. **Alertes expiry** : Identification et action rapide
4. **Audit trail** : Recherche et filtrage précis
5. **Calculs points** : Validation formules business

### Performance
- **Dashboard load** : <1.5s toutes métriques
- **Transaction search** : <800ms results
- **Bulk operations** : <30s pour 1000 items
- **Analytics charts** : <2s load complet

## 💾 Stockage Local

### Préférences Filtres
```typescript
interface PointsManagementPrefs {
  defaultTimeRange: '7d' | '30d' | '90d';
  defaultTransactionTypes: PointsTransactionType[];
  autoRefreshInterval: number;
  showExpiryWarnings: boolean;
  bulkOperationConfirmation: boolean;
}
```

### Cache Stratégique
- **Dashboard metrics** : 5min cache
- **Transaction list** : 2min cache avec invalidation
- **Expiry alerts** : 10min cache
- **Audit logs** : 1h cache (données historiques)

---

**Stack Technique** : TanStack Query + Recharts + Background Jobs  
**Priorité** : 🔥 Critique - Cœur économie plateforme  
**Estimation** : 10-15 jours développement + intégration audit
