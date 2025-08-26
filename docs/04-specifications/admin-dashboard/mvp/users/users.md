# 👥 Gestion des Utilisateurs

**Interface complète de gestion des utilisateurs avec KYC, profils détaillés, et outils d'administration.**

## 🎯 Objectif

Gérer l'ensemble de la base utilisateurs avec capacités de recherche, filtrage, édition des profils, gestion KYC, et support client intégré.

## 👤 Utilisateurs Cibles

- **Support client** : Assistance utilisateurs et résolution problèmes
- **Compliance officers** : Gestion KYC et conformité réglementaire  
- **Administrateurs** : Gestion des accès et modération
- **Analystes** : Études comportements et segmentation

## 🎨 Design & Layout

### Structure Page
```text
┌─────────────────────────────────────────────────────────────┐
│ Utilisateurs | 1,247 inscrits            [+ Nouveau] [⚙️]  │
├─────────────────────────────────────────────────────────────┤
│ 🔍 [Recherche...] [Filtres ▼] [Export ▼] [Actions ▼]      │
├─────────────────────────────────────────────────────────────┤
│ Table Utilisateurs                                          │
│ ┌─────┬─────────────┬─────────────┬─────────┬─────────────┐ │
│ │ ✓   │ Nom         │ Email       │ Status  │ Actions     │ │
│ ├─────┼─────────────┼─────────────┼─────────┼─────────────┤ │
│ │ ☐   │ Claire N.   │ claire@...  │ Active  │ [👁️] [✏️] [🚫] │ │
│ │ ☐   │ Marc D.     │ marc@...    │ KYC     │ [👁️] [✏️] [✅] │ │
│ └─────┴─────────────┴─────────────┴─────────┴─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ [◀️ Précédent] Page 1 sur 25 [Suivant ▶️]                  │
└─────────────────────────────────────────────────────────────┘
```

### Panneau Détail Utilisateur (Slide-over)
```text
┌─────────────────────┐
│ Claire Nouveau [✕]  │
├─────────────────────┤
│ 📷 Avatar           │
│ claire@example.com  │
│ +33 6 12 34 56 78   │
├─────────────────────┤
│ 📊 Statistiques     │
│ Investissements: 2  │
│ Total investi: €600 │
│ Points: 576 pts     │
│ Commandes: 3        │
├─────────────────────┤
│ 🔒 KYC Status       │
│ ✅ Identité vérifiée │
│ ✅ Adresse confirmée │
│ ⏳ Document en cours │
├─────────────────────┤
│ 📝 Notes Support    │
│ [Ajouter note...]   │
└─────────────────────┘
```

## 📱 Composants UI

### Header Page
```tsx
<div className="flex justify-between items-center mb-6">
  <div>
    <h1 className="text-3xl font-bold">Utilisateurs</h1>
    <p className="text-muted-foreground">{totalUsers} inscrits total</p>
  </div>
  <div className="flex gap-2">
    <Button variant="outline" onClick={exportUsers}>
      <Download className="h-4 w-4 mr-2" />
      Export
    </Button>
    <Button onClick={createUser}>
      <Plus className="h-4 w-4 mr-2" />
      Nouveau
    </Button>
  </div>
</div>
```

### Barre de Recherche et Filtres
```tsx
<div className="flex gap-4 mb-4">
  <div className="flex-1">
    <Input
      placeholder="Rechercher par nom, email, téléphone..."
      value={searchQuery}
      onChange={setSearchQuery}
      className="max-w-md"
    />
  </div>
  <Select value={statusFilter} onValueChange={setStatusFilter}>
    <SelectTrigger className="w-32">
      <SelectValue placeholder="Status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Tous</SelectItem>
      <SelectItem value="active">Actifs</SelectItem>
      <SelectItem value="pending_kyc">KYC en cours</SelectItem>
      <SelectItem value="suspended">Suspendus</SelectItem>
    </SelectContent>
  </Select>
  <Select value={kycFilter} onValueChange={setKycFilter}>
    <SelectTrigger className="w-32">
      <SelectValue placeholder="KYC" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Tous</SelectItem>
      <SelectItem value="verified">Vérifiés</SelectItem>
      <SelectItem value="pending">En attente</SelectItem>
      <SelectItem value="rejected">Rejetés</SelectItem>
    </SelectContent>
  </Select>
</div>
```

### Table Utilisateurs (TanStack Table)
```tsx
const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => (
      <div className="flex items-center">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={row.original.avatar} />
          <AvatarFallback>{row.original.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-muted-foreground">
            ID: {row.original.id.slice(0, 8)}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status === 'active' ? 'success' : 'secondary'}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "kyc_status",
    header: "KYC",
    cell: ({ row }) => {
      const kyc = row.original.kyc_status;
      const variants = {
        verified: 'success',
        pending: 'warning',
        rejected: 'destructive',
        none: 'secondary'
      };
      return <Badge variant={variants[kyc]}>{kyc}</Badge>;
    },
  },
  {
    accessorKey: "total_invested",
    header: "Total Investi",
    cell: ({ row }) => `€${row.original.total_invested}`,
  },
  {
    accessorKey: "points_balance",
    header: "Points",
    cell: ({ row }) => `${row.original.points_balance} pts`,
  },
  {
    accessorKey: "created_at",
    header: "Inscription",
    cell: ({ row }) => formatDate(row.original.created_at),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => viewUser(row.original.id)}>
            <Eye className="mr-2 h-4 w-4" />
            Voir profil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editUser(row.original.id)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => suspendUser(row.original.id)}
            className="text-destructive"
          >
            <Ban className="mr-2 h-4 w-4" />
            Suspendre
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
```

### Panneau Détail Utilisateur
```tsx
<Sheet open={selectedUser !== null} onOpenChange={closeUserPanel}>
  <SheetContent className="w-96">
    <SheetHeader>
      <SheetTitle>{selectedUser?.name}</SheetTitle>
      <SheetDescription>
        Inscrit le {formatDate(selectedUser?.created_at)}
      </SheetDescription>
    </SheetHeader>
    
    <div className="space-y-6 mt-6">
      {/* Informations Personnelles */}
      <div>
        <h3 className="font-medium mb-2">Informations</h3>
        <div className="space-y-2 text-sm">
          <div>Email: {selectedUser?.email}</div>
          <div>Téléphone: {selectedUser?.phone}</div>
          <div>Status: <Badge>{selectedUser?.status}</Badge></div>
        </div>
      </div>

      {/* Statistiques */}
      <div>
        <h3 className="font-medium mb-2">Statistiques</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-3">
            <div className="text-sm text-muted-foreground">Investissements</div>
            <div className="text-xl font-bold">{selectedUser?.investment_count}</div>
          </Card>
          <Card className="p-3">
            <div className="text-sm text-muted-foreground">Total investi</div>
            <div className="text-xl font-bold">€{selectedUser?.total_invested}</div>
          </Card>
        </div>
      </div>

      {/* KYC Status */}
      <div>
        <h3 className="font-medium mb-2">Vérification KYC</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Identité</span>
            <Badge variant={selectedUser?.kyc?.identity ? 'success' : 'secondary'}>
              {selectedUser?.kyc?.identity ? 'Vérifiée' : 'En attente'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Adresse</span>
            <Badge variant={selectedUser?.kyc?.address ? 'success' : 'secondary'}>
              {selectedUser?.kyc?.address ? 'Vérifiée' : 'En attente'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Documents</span>
            <Badge variant={selectedUser?.kyc?.documents ? 'success' : 'secondary'}>
              {selectedUser?.kyc?.documents ? 'Approuvés' : 'En cours'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Notes Support */}
      <div>
        <h3 className="font-medium mb-2">Notes Support</h3>
        <Textarea
          placeholder="Ajouter une note..."
          value={supportNote}
          onChange={(e) => setSupportNote(e.target.value)}
        />
        <Button size="sm" className="mt-2" onClick={addSupportNote}>
          Ajouter note
        </Button>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Button variant="outline" className="w-full" onClick={sendEmail}>
          <Mail className="mr-2 h-4 w-4" />
          Envoyer email
        </Button>
        <Button variant="outline" className="w-full" onClick={resetPassword}>
          <Key className="mr-2 h-4 w-4" />
          Reset mot de passe
        </Button>
      </div>

      {/* Gestion RGPD */}
      <div className="mt-4 pt-4 border-t">
        <h3 className="font-medium mb-2 text-yellow-600">Gestion RGPD</h3>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full" onClick={exportUserData}>
            <Download className="mr-2 h-4 w-4" />
            Exporter les données
          </Button>
          <Button variant="destructive" size="sm" className="w-full" onClick={anonymizeUser}>
            <Trash2 className="mr-2 h-4 w-4" />
            Anonymiser l'utilisateur
          </Button>
        </div>
      </div>

      {/* Actions Administratives */}
      <div className="mt-4 pt-4 border-t">
        <h3 className="font-medium mb-2 text-red-600">Zone de Danger</h3>
        <div className="space-y-2">
          <Button variant="destructive" className="w-full" onClick={suspendUser}>
            <Ban className="mr-2 h-4 w-4" />
            Suspendre compte
          </Button>
        </div>
      </div>
    </div>
  </SheetContent>
</Sheet>
```

## 🔄 États & Interactions

### Recherche et Filtrage
```typescript
interface UserFilters {
  search: string;                    // Nom, email, téléphone
  status: 'all' | 'active' | 'pending_kyc' | 'suspended';
  kyc_status: 'all' | 'verified' | 'pending' | 'rejected';
  created_date_range: [Date, Date];  // Période d'inscription
  investment_range: [number, number]; // Montant investi
  has_points: boolean;               // Utilisateurs avec points
}
```

### Actions Bulk
- **Sélection multiple** : Checkbox sur chaque ligne + header
- **Actions groupées** : Export sélection, envoi email masse, modification status
- **Confirmation** : AlertDialog pour actions destructives

### États de Chargement
```tsx
// Table loading state
{isLoading ? (
  <div className="space-y-2">
    {Array.from({ length: 10 }).map((_, i) => (
      <Skeleton key={i} className="h-16 w-full" />
    ))}
  </div>
) : (
  <DataTable columns={columns} data={users} />
)}
```

## 📡 API & Données

### Routes tRPC
```typescript
// Liste utilisateurs avec pagination et filtres
admin.users.list: {
  input: {
    page: number;
    limit: number;
    search?: string;
    status?: UserStatus;
    kyc_status?: KYCStatus;
    date_range?: [Date, Date];
  };
  output: {
    users: User[];
    total: number;
    pages: number;
    current_page: number;
  };
}

// Détail utilisateur complet
admin.users.detail: {
  input: { id: string };
  output: {
    user: UserDetail;
    investments: Investment[];
    orders: Order[];
    points_history: PointsTransaction[];
    kyc_documents: KYCDocument[];
    support_notes: SupportNote[];
  };
}

// Actions utilisateur
admin.users.update_status: {
  input: { id: string; status: UserStatus };
  output: { success: boolean };
}

admin.users.update_kyc: {
  input: { id: string; kyc_status: KYCStatus; reason?: string };
  output: { success: boolean };
}

admin.users.add_support_note: {
  input: { id: string; note: string; admin_id: string };
  output: { success: boolean };
}

// Export
admin.users.export: {
  input: { filters: UserFilters; format: 'csv' | 'xlsx' };
  output: { download_url: string };
}
```

### Modèles de Données
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'pending_kyc' | 'suspended' | 'banned';
  kyc_status: 'none' | 'pending' | 'verified' | 'rejected';
  total_invested: number;
  investment_count: number;
  points_balance: number;
  orders_count: number;
  created_at: Date;
  last_login?: Date;
}

interface UserDetail extends User {
  address?: Address;
  kyc?: KYCData;
  investments: Investment[];
  orders: Order[];
  points_history: PointsTransaction[];
  support_notes: SupportNote[];
}

interface KYCData {
  identity: boolean;
  identity_document_url?: string;
  address: boolean;
  address_document_url?: string;
  documents: boolean;
  rejection_reason?: string;
  verified_at?: Date;
  verified_by?: string;
}
```

## ✅ Validations

### Permissions
- **Support** : Lecture seule + notes
- **Manager** : Édition profils + KYC
- **Admin** : Toutes actions sauf suppression
- **Super Admin** : Toutes actions

### Contraintes Business
- **Suspension** : Impossible si investissements actifs
- **KYC reject** : Raison obligatoire
- **Export** : Max 10,000 utilisateurs par export
- **Notes support** : Max 1000 caractères

## 🚨 Gestion d'Erreurs

### Messages d'Erreur
```typescript
const errorMessages = {
  USER_NOT_FOUND: "Utilisateur introuvable",
  CANNOT_SUSPEND_ACTIVE_INVESTMENTS: "Impossible de suspendre : investissements actifs",
  KYC_UPDATE_FAILED: "Échec mise à jour KYC",
  EXPORT_TOO_LARGE: "Export trop volumineux, affinez les filtres",
  PERMISSION_DENIED: "Permissions insuffisantes"
};
```

### Recovery Actions
- **Erreur réseau** : Bouton retry avec backoff
- **Permissions** : Redirection vers page appropriée
- **Données corrompues** : Fallback vers données cached

## 🔗 Navigation

### Liens Contextuels
```typescript
const userActions = {
  viewInvestments: `/admin/investments?user_id=${userId}`,
  viewOrders: `/admin/orders?user_id=${userId}`,
  viewPoints: `/admin/points?user_id=${userId}`,
  sendEmail: `/admin/communications/email?to=${userId}`,
  editProfile: `/admin/users/${userId}/edit`
};
```

### Breadcrumb
```
Dashboard > Utilisateurs > [Claire Nouveau]
```

## 📝 Tests Utilisateur

### Scénarios Critiques
1. **Recherche rapide** : Trouver utilisateur <3s
2. **Bulk actions** : Sélection multiple fluide
3. **KYC workflow** : Approbation/rejet documents
4. **Support notes** : Historique conversations
5. **Export** : Génération fichier <30s

### Performance Targets
- **Table load** : <1s pour 50 utilisateurs
- **Search/filter** : <500ms response
- **Detail panel** : <800ms open
- **Export** : <30s pour 1000 users

## 💾 Stockage Local

### Filtres et Préférences
```typescript
interface UserTablePrefs {
  defaultFilters: UserFilters;
  columnVisibility: Record<string, boolean>;
  pageSize: number;
  sortBy: { field: string; direction: 'asc' | 'desc' };
}
```

### Cache
- **User list** : 2min cache avec invalidation
- **User details** : 30s cache
- **Filters state** : Session storage

---

**Stack Technique** : TanStack Table + React Hook Form + shadcn/ui  
**Priorité** : 🔥 Critique - Gestion base utilisateurs  
**Estimation** : 7-10 jours développement + intégration KYC
