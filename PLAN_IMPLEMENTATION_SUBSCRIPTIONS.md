# 📋 Plan d'Implémentation : Gestion Abonnements (CRUD + Actions)

## 🎯 **Objectif : Gestion complète des abonnements admin en 2-3 jours**

### 📊 **Contexte Technique**
- **Base de données** : Système dual billing déjà migré ✅
- **Utilisateurs existants** : 4 utilisateurs avec données réelles ✅  
- **Architecture** : tRPC + Supabase + shadcn/ui ✅
- **Patterns établis** : AdminPageContainer, DataList, DetailController ✅

---

## 📁 **Architecture des Fichiers**

### Structure Cible
```
apps/web/src/app/admin/(dashboard)/subscriptions/
├── page.tsx                              # Liste principale abonnements
├── [id]/
│   ├── page.tsx                          # Détail/édition abonnement
│   └── components/
│       ├── subscription-breadcrumbs.tsx
│       ├── subscription-compact-header.tsx
│       ├── subscription-detail-controller.tsx
│       ├── subscription-detail-layout.tsx
│       └── subscription-details-editor.tsx
├── new/
│   └── page.tsx                          # Création abonnement
└── components/
    ├── subscriptions-list.tsx
    ├── subscription-actions.tsx
    ├── subscription-filters.tsx
    └── subscription-status-badge.tsx
```

### Nouveaux fichiers tRPC
```
packages/api/src/router/admin/
└── subscriptions.ts                      # Routes CRUD abonnements
```

---

## 🛠️ **Jour 1 : Foundation & Liste**

### **Matin (4h) : Setup Architecture + Routes tRPC**

#### 1. Routes tRPC de base

```typescript
// packages/api/src/router/admin/subscriptions.ts
import { z } from 'zod';
import { createTRPCRouter, adminProcedure } from '../../trpc';
import { createSupabaseServer } from '@/supabase/server';

const subscriptionFilterSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(20),
  search: z.string().optional(),
  status: z.enum(['active', 'cancelled', 'suspended', 'past_due']).optional(),
  planType: z.enum(['ambassador_standard', 'ambassador_premium']).optional(),
  billingFrequency: z.enum(['monthly', 'annual']).optional(),
});

const subscriptionUpdateSchema = z.object({
  id: z.string(),
  patch: z.object({
    plan_type: z.enum(['ambassador_standard', 'ambassador_premium']).optional(),
    billing_frequency: z.enum(['monthly', 'annual']).optional(),
    status: z.enum(['active', 'cancelled', 'suspended', 'past_due']).optional(),
    amount: z.number().optional(),
  }),
});

export const adminSubscriptionsRouter = createTRPCRouter({
  // ✅ Lecture - Liste avec filtres
  list: adminProcedure
    .input(subscriptionFilterSchema)
    .query(async ({ input }) => {
      const supabase = await createSupabaseServer();
      
      let query = supabase
        .from('subscriptions')
        .select(`
          *,
          users!inner(email, id),
          user_profiles!inner(first_name, last_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      // Filtres
      if (input.status) {
        query = query.eq('status', input.status);
      }
      if (input.planType) {
        query = query.eq('plan_type', input.planType);
      }
      if (input.billingFrequency) {
        query = query.eq('billing_frequency', input.billingFrequency);
      }
      if (input.search) {
        query = query.or(`users.email.ilike.%${input.search}%,user_profiles.first_name.ilike.%${input.search}%,user_profiles.last_name.ilike.%${input.search}%`);
      }

      // Pagination
      const from = (input.page - 1) * input.limit;
      const to = from + input.limit - 1;
      
      const { data, error, count } = await query
        .range(from, to)
        .select('*', { count: 'exact' });

      if (error) throw new Error(error.message);

      return {
        items: data || [],
        total: count || 0,
        hasMore: (count || 0) > to + 1,
      };
    }),

  // ✅ Lecture - Détail abonnement
  byId: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const supabase = await createSupabaseServer();
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          users!inner(email, id),
          user_profiles!inner(first_name, last_name, avatar_url, phone),
          subscription_billing_history(*)
        `)
        .eq('id', input.id)
        .single();

      if (error) throw new Error(error.message);
      if (!data) throw new Error('Abonnement introuvable');

      return data;
    }),

  // ✅ Création - Nouvel abonnement
  create: adminProcedure
    .input(z.object({
      user_id: z.string(),
      plan_type: z.enum(['ambassador_standard', 'ambassador_premium']),
      billing_frequency: z.enum(['monthly', 'annual']),
      amount: z.number(),
      start_date: z.string(),
    }))
    .mutation(async ({ input }) => {
      const supabase = await createSupabaseServer();
      
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          ...input,
          status: 'active',
          next_billing_date: new Date(
            new Date(input.start_date).getTime() + 
            (input.billing_frequency === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000
          ).toISOString(),
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }),

  // ✅ Mise à jour - Modification abonnement
  update: adminProcedure
    .input(subscriptionUpdateSchema)
    .mutation(async ({ input }) => {
      const supabase = await createSupabaseServer();
      
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          ...input.patch,
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }),

  // ✅ Actions - Suspension
  suspend: adminProcedure
    .input(z.object({
      id: z.string(),
      reason: z.string(),
    }))
    .mutation(async ({ input }) => {
      const supabase = await createSupabaseServer();
      
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          status: 'suspended',
          suspended_reason: input.reason,
          suspended_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }),

  // ✅ Actions - Réactivation
  reactivate: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const supabase = await createSupabaseServer();
      
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          suspended_reason: null,
          suspended_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }),
});
```

#### 2. Types TypeScript

```typescript
// apps/web/src/lib/types/subscription.ts
export interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'ambassador_standard' | 'ambassador_premium';
  billing_frequency: 'monthly' | 'annual';
  status: 'active' | 'cancelled' | 'suspended' | 'past_due';
  amount: number;
  currency: string;
  stripe_subscription_id?: string;
  start_date: string;
  end_date?: string;
  next_billing_date: string;
  suspended_reason?: string;
  suspended_at?: string;
  created_at: string;
  updated_at: string;

  // Relations
  users: {
    id: string;
    email: string;
  };
  user_profiles: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
    phone?: string;
  };
}

export interface SubscriptionFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: Subscription['status'];
  planType?: Subscription['plan_type'];
  billingFrequency?: Subscription['billing_frequency'];
}
```

### **Après-midi (4h) : Page Liste + Composants de Base**

#### 3. Page principale liste

```typescript
// apps/web/src/app/admin/(dashboard)/subscriptions/page.tsx
"use client";

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { AdminPageContainer } from '@/app/admin/(dashboard)/components/layout/admin-page-container';
import { AdminPageHeader } from '@/app/admin/(dashboard)/components/layout/admin-page-header';
import { AdminPagination } from '@/app/admin/(dashboard)/components/layout/admin-pagination';
import { Button } from '@/app/admin/(dashboard)/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { SubscriptionsList } from './components/subscriptions-list';
import { SubscriptionFilters } from './components/subscription-filters';
import type { SubscriptionFilters as TSubscriptionFilters } from '@/lib/types/subscription';

export default function AdminSubscriptionsPage() {
  const [filters, setFilters] = useState<TSubscriptionFilters>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading, refetch } = trpc.admin.subscriptions.list.useQuery(filters, {
    keepPreviousData: true,
  });

  const utils = trpc.useUtils();

  const handleFiltersChange = (newFilters: Partial<TSubscriptionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Gestion des Abonnements"
        description="Administration des abonnements dual billing"
        actions={
          <Button asChild>
            <Link href="/admin/subscriptions/new">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Abonnement
            </Link>
          </Button>
        }
      />

      <div className="space-y-6">
        <SubscriptionFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        <SubscriptionsList
          data={data?.items || []}
          isLoading={isLoading}
          onRefresh={() => refetch()}
          utils={utils}
        />

        {data && (
          <AdminPagination
            currentPage={filters.page || 1}
            totalItems={data.total}
            itemsPerPage={filters.limit || 20}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </AdminPageContainer>
  );
}
```

#### 4. Composant Filtres

```typescript
// apps/web/src/app/admin/(dashboard)/subscriptions/components/subscription-filters.tsx
"use client";

import { useState } from 'react';
import { Input } from '@/app/admin/(dashboard)/components/ui/input';
import { Button } from '@/app/admin/(dashboard)/components/ui/button';
import { SimpleSelect } from '@/app/admin/(dashboard)/components/ui/select';
import { Card, CardContent } from '@/app/admin/(dashboard)/components/ui/card';
import { Search, X } from 'lucide-react';
import type { SubscriptionFilters as TSubscriptionFilters } from '@/lib/types/subscription';

interface SubscriptionFiltersProps {
  filters: TSubscriptionFilters;
  onFiltersChange: (filters: Partial<TSubscriptionFilters>) => void;
}

export function SubscriptionFilters({ filters, onFiltersChange }: SubscriptionFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ search: searchInput || undefined });
  };

  const clearFilters = () => {
    setSearchInput('');
    onFiltersChange({
      search: undefined,
      status: undefined,
      planType: undefined,
      billingFrequency: undefined,
    });
  };

  const hasActiveFilters = filters.search || filters.status || filters.planType || filters.billingFrequency;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          {/* Recherche */}
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par email ou nom..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>
          </form>

          {/* Filtres Status */}
          <div className="min-w-[140px]">
            <SimpleSelect
              value={filters.status || ''}
              onValueChange={(value) => 
                onFiltersChange({ status: value || undefined })
              }
              placeholder="Statut"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="suspended">Suspendu</option>
              <option value="cancelled">Annulé</option>
              <option value="past_due">En retard</option>
            </SimpleSelect>
          </div>

          {/* Filtres Plan */}
          <div className="min-w-[140px]">
            <SimpleSelect
              value={filters.planType || ''}
              onValueChange={(value) =>
                onFiltersChange({ planType: value || undefined })
              }
              placeholder="Plan"
            >
              <option value="">Tous les plans</option>
              <option value="ambassador_standard">Standard</option>
              <option value="ambassador_premium">Premium</option>
            </SimpleSelect>
          </div>

          {/* Filtres Fréquence */}
          <div className="min-w-[140px]">
            <SimpleSelect
              value={filters.billingFrequency || ''}
              onValueChange={(value) =>
                onFiltersChange({ billingFrequency: value || undefined })
              }
              placeholder="Facturation"
            >
              <option value="">Toutes fréquences</option>
              <option value="monthly">Mensuel</option>
              <option value="annual">Annuel</option>
            </SimpleSelect>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button type="submit" onClick={handleSearchSubmit}>
              Rechercher
            </Button>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

#### 5. Badge Status

```typescript
// apps/web/src/app/admin/(dashboard)/subscriptions/components/subscription-status-badge.tsx
import { Badge } from '@/app/admin/(dashboard)/components/badge';
import type { Subscription } from '@/lib/types/subscription';

interface SubscriptionStatusBadgeProps {
  status: Subscription['status'];
  className?: string;
}

export function SubscriptionStatusBadge({ status, className }: SubscriptionStatusBadgeProps) {
  const variants = {
    active: { variant: 'success' as const, label: 'Actif' },
    suspended: { variant: 'warning' as const, label: 'Suspendu' },
    cancelled: { variant: 'destructive' as const, label: 'Annulé' },
    past_due: { variant: 'destructive' as const, label: 'En retard' },
  };

  const config = variants[status];

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
```

---

## 🔧 **Jour 2 : CRUD Complet + Actions**

### **Matin (4h) : Liste des Abonnements + Actions**

#### 6. Composant Liste Principal

```typescript
// apps/web/src/app/admin/(dashboard)/subscriptions/components/subscriptions-list.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataList } from '@/app/admin/(dashboard)/components/ui/data-list';
import { Button } from '@/app/admin/(dashboard)/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import { SubscriptionStatusBadge } from './subscription-status-badge';
import { SubscriptionActions } from './subscription-actions';
import type { Subscription } from '@/lib/types/subscription';

interface SubscriptionsListProps {
  data: Subscription[];
  isLoading: boolean;
  onRefresh: () => void;
  utils: any; // tRPC utils
}

export function SubscriptionsList({ data, isLoading, onRefresh, utils }: SubscriptionsListProps) {
  const router = useRouter();
  const { toast } = useToast();

  const columns = [
    {
      key: 'user',
      label: 'Utilisateur',
      render: (subscription: Subscription) => (
        <div className="space-y-1">
          <p className="font-medium text-sm">
            {subscription.user_profiles.first_name} {subscription.user_profiles.last_name}
          </p>
          <p className="text-xs text-muted-foreground">
            {subscription.users.email}
          </p>
        </div>
      ),
    },
    {
      key: 'plan',
      label: 'Plan',
      render: (subscription: Subscription) => (
        <div className="space-y-1">
          <p className="font-medium text-sm">
            {subscription.plan_type === 'ambassador_premium' ? 'Premium' : 'Standard'}
          </p>
          <p className="text-xs text-muted-foreground">
            {subscription.billing_frequency === 'annual' ? 'Annuel' : 'Mensuel'}
          </p>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Montant',
      render: (subscription: Subscription) => (
        <div className="text-right">
          <p className="font-medium">€{subscription.amount}</p>
          <p className="text-xs text-muted-foreground">
            /{subscription.billing_frequency === 'annual' ? 'an' : 'mois'}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      render: (subscription: Subscription) => (
        <SubscriptionStatusBadge status={subscription.status} />
      ),
    },
    {
      key: 'next_billing',
      label: 'Prochaine facturation',
      render: (subscription: Subscription) => (
        <div className="text-sm">
          {formatDate(subscription.next_billing_date)}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (subscription: Subscription) => (
        <SubscriptionActions
          subscription={subscription}
          onSuccess={onRefresh}
          utils={utils}
        />
      ),
    },
  ];

  const actions = [
    {
      label: 'Voir détails',
      onClick: (subscription: Subscription) => {
        router.push(`/admin/subscriptions/${subscription.id}`);
      },
    },
  ];

  return (
    <DataList
      title="Abonnements"
      description="Liste de tous les abonnements utilisateurs"
      data={data}
      columns={columns}
      actions={actions}
      isLoading={isLoading}
      emptyMessage="Aucun abonnement trouvé"
      emptyDescription="Créez le premier abonnement pour commencer"
    />
  );
}
```

#### 7. Composant Actions

```typescript
// apps/web/src/app/admin/(dashboard)/subscriptions/components/subscription-actions.tsx
"use client";

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/app/admin/(dashboard)/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/app/admin/(dashboard)/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/admin/(dashboard)/components/ui/dialog';
import { Input } from '@/app/admin/(dashboard)/components/ui/input';
import { Label } from '@/app/admin/(dashboard)/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MoreHorizontal, Play, Pause, Edit, Trash2 } from 'lucide-react';
import type { Subscription } from '@/lib/types/subscription';

interface SubscriptionActionsProps {
  subscription: Subscription;
  onSuccess: () => void;
  utils: any;
}

export function SubscriptionActions({ subscription, onSuccess, utils }: SubscriptionActionsProps) {
  const { toast } = useToast();
  const [suspendDialog, setSuspendDialog] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');

  const suspendMutation = trpc.admin.subscriptions.suspend.useMutation({
    onMutate: async () => {
      await utils.admin.subscriptions.list.cancel();
      const prevData = utils.admin.subscriptions.list.getData();
      
      if (prevData) {
        utils.admin.subscriptions.list.setData(undefined, {
          ...prevData,
          items: prevData.items.map((sub: Subscription) =>
            sub.id === subscription.id
              ? { ...sub, status: 'suspended' as const }
              : sub
          ),
        });
      }
      
      return { prevData };
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Abonnement suspendu',
        description: 'L\'abonnement a été suspendu avec succès.',
      });
      setSuspendDialog(false);
      setSuspendReason('');
      onSuccess();
    },
    onError: (error, variables, context) => {
      if (context?.prevData) {
        utils.admin.subscriptions.list.setData(undefined, context.prevData);
      }
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de suspendre l\'abonnement.',
      });
    },
  });

  const reactivateMutation = trpc.admin.subscriptions.reactivate.useMutation({
    onMutate: async () => {
      await utils.admin.subscriptions.list.cancel();
      const prevData = utils.admin.subscriptions.list.getData();
      
      if (prevData) {
        utils.admin.subscriptions.list.setData(undefined, {
          ...prevData,
          items: prevData.items.map((sub: Subscription) =>
            sub.id === subscription.id
              ? { ...sub, status: 'active' as const }
              : sub
          ),
        });
      }
      
      return { prevData };
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Abonnement réactivé',
        description: 'L\'abonnement a été réactivé avec succès.',
      });
      onSuccess();
    },
    onError: (error, variables, context) => {
      if (context?.prevData) {
        utils.admin.subscriptions.list.setData(undefined, context.prevData);
      }
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de réactiver l\'abonnement.',
      });
    },
  });

  const handleSuspend = () => {
    if (!suspendReason.trim()) {
      toast({
        variant: 'destructive',
        title: 'Raison requise',
        description: 'Veuillez indiquer une raison pour la suspension.',
      });
      return;
    }

    suspendMutation.mutate({
      id: subscription.id,
      reason: suspendReason,
    });
  };

  const handleReactivate = () => {
    reactivateMutation.mutate({ id: subscription.id });
  };

  const canSuspend = subscription.status === 'active';
  const canReactivate = subscription.status === 'suspended';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {canSuspend && (
            <DropdownMenuItem
              onClick={() => setSuspendDialog(true)}
              className="text-orange-600"
            >
              <Pause className="h-4 w-4 mr-2" />
              Suspendre
            </DropdownMenuItem>
          )}
          
          {canReactivate && (
            <DropdownMenuItem
              onClick={handleReactivate}
              className="text-green-600"
            >
              <Play className="h-4 w-4 mr-2" />
              Réactiver
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog Suspension */}
      <Dialog open={suspendDialog} onOpenChange={setSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspendre l'abonnement</DialogTitle>
            <DialogDescription>
              Cette action suspendra l'abonnement de {subscription.user_profiles.first_name} {subscription.user_profiles.last_name}.
              Veuillez indiquer une raison.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Raison de la suspension</Label>
            <Input
              id="reason"
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="Ex: Non-paiement, violation des conditions..."
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendDialog(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleSuspend}
              disabled={suspendMutation.isLoading}
            >
              {suspendMutation.isLoading ? 'Suspension...' : 'Suspendre'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

### **Après-midi (4h) : Pages Détail et Création**

#### 8. Page Détail/Édition

```typescript
// apps/web/src/app/admin/(dashboard)/subscriptions/[id]/page.tsx
"use client";

import { useParams } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { SubscriptionDetailController } from './components/subscription-detail-controller';
import { LoadingSpinner } from '@/app/admin/(dashboard)/components/ui/loading-spinner';

export default function AdminSubscriptionEditPage() {
  const params = useParams<{ id: string }>();
  const subscriptionId = params?.id as string;

  const { data: subscription, isLoading, error } = trpc.admin.subscriptions.byId.useQuery(
    { id: subscriptionId },
    {
      enabled: !!subscriptionId,
      retry: 1,
      retryDelay: 500,
    }
  );

  const utils = trpc.useUtils();

  const updateMutation = trpc.admin.subscriptions.update.useMutation({
    onMutate: async (vars) => {
      await utils.admin.subscriptions.byId.cancel({ id: subscriptionId });
      await utils.admin.subscriptions.list.cancel();

      const prevDetail = utils.admin.subscriptions.byId.getData({ id: subscriptionId });
      const prevList = utils.admin.subscriptions.list.getData();

      if (prevDetail) {
        utils.admin.subscriptions.byId.setData(
          { id: subscriptionId },
          { ...prevDetail, ...vars.patch }
        );
      }

      if (prevList) {
        utils.admin.subscriptions.list.setData(undefined, {
          ...prevList,
          items: prevList.items.map((sub) =>
            sub.id === subscriptionId ? { ...sub, ...vars.patch } : sub
          ),
        });
      }

      return { prevDetail, prevList };
    },
    onError: (error, vars, ctx) => {
      if (ctx?.prevDetail) {
        utils.admin.subscriptions.byId.setData({ id: subscriptionId }, ctx.prevDetail);
      }
      if (ctx?.prevList) {
        utils.admin.subscriptions.list.setData(undefined, ctx.prevList);
      }
    },
    onSettled: () => {
      utils.admin.subscriptions.byId.invalidate({ id: subscriptionId });
      utils.admin.subscriptions.list.invalidate();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Erreur lors du chargement de l'abonnement</p>
      </div>
    );
  }

  return (
    <SubscriptionDetailController
      subscriptionData={subscription}
      onSave={async (patch) => {
        await updateMutation.mutateAsync({
          id: subscriptionId,
          patch,
        });
      }}
    />
  );
}
```

#### 9. Page Création

```typescript
// apps/web/src/app/admin/(dashboard)/subscriptions/new/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useToast } from '@/hooks/use-toast';
import { AdminPageContainer } from '@/app/admin/(dashboard)/components/layout/admin-page-container';
import { AdminPageHeader } from '@/app/admin/(dashboard)/components/layout/admin-page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/admin/(dashboard)/components/ui/card';
import { Button } from '@/app/admin/(dashboard)/components/ui/button';
import { Input } from '@/app/admin/(dashboard)/components/ui/input';
import { Label } from '@/app/admin/(dashboard)/components/ui/label';
import { SimpleSelect } from '@/app/admin/(dashboard)/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const PLANS = {
  ambassador_standard: { monthly: 18, annual: 180 },
  ambassador_premium: { monthly: 32, annual: 320 },
};

export default function NewSubscriptionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    user_id: '',
    plan_type: 'ambassador_standard' as const,
    billing_frequency: 'monthly' as const,
    start_date: new Date().toISOString().split('T')[0],
  });

  const { data: users } = trpc.admin.users.list.useQuery();

  const createMutation = trpc.admin.subscriptions.create.useMutation({
    onSuccess: (data) => {
      toast({
        variant: 'success',
        title: 'Abonnement créé',
        description: 'L\'abonnement a été créé avec succès.',
      });
      router.push(`/admin/subscriptions/${data.id}`);
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de créer l\'abonnement.',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = PLANS[formData.plan_type][formData.billing_frequency];
    
    createMutation.mutate({
      ...formData,
      amount,
    });
  };

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Nouvel Abonnement"
        description="Créer un nouvel abonnement utilisateur"
        breadcrumbs={[
          { label: 'Abonnements', href: '/admin/subscriptions' },
          { label: 'Nouveau' },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link href="/admin/subscriptions">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Informations de l'abonnement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Utilisateur */}
              <div className="space-y-2">
                <Label htmlFor="user_id">Utilisateur</Label>
                <SimpleSelect
                  value={formData.user_id}
                  onValueChange={(value) =>
                    setFormData(prev => ({ ...prev, user_id: value }))
                  }
                  required
                >
                  <option value="">Sélectionner un utilisateur</option>
                  {users?.items?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.email}
                    </option>
                  ))}
                </SimpleSelect>
              </div>

              {/* Plan */}
              <div className="space-y-2">
                <Label htmlFor="plan_type">Plan</Label>
                <SimpleSelect
                  value={formData.plan_type}
                  onValueChange={(value) =>
                    setFormData(prev => ({ 
                      ...prev, 
                      plan_type: value as typeof formData.plan_type 
                    }))
                  }
                >
                  <option value="ambassador_standard">Ambassador Standard</option>
                  <option value="ambassador_premium">Ambassador Premium</option>
                </SimpleSelect>
              </div>

              {/* Fréquence */}
              <div className="space-y-2">
                <Label htmlFor="billing_frequency">Fréquence de facturation</Label>
                <SimpleSelect
                  value={formData.billing_frequency}
                  onValueChange={(value) =>
                    setFormData(prev => ({ 
                      ...prev, 
                      billing_frequency: value as typeof formData.billing_frequency 
                    }))
                  }
                >
                  <option value="monthly">Mensuel</option>
                  <option value="annual">Annuel</option>
                </SimpleSelect>
              </div>

              {/* Date de début */}
              <div className="space-y-2">
                <Label htmlFor="start_date">Date de début</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, start_date: e.target.value }))
                  }
                  required
                />
              </div>
            </div>

            {/* Résumé */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Résumé</h4>
              <div className="space-y-1 text-sm">
                <p>Plan: {formData.plan_type === 'ambassador_premium' ? 'Premium' : 'Standard'}</p>
                <p>Facturation: {formData.billing_frequency === 'annual' ? 'Annuelle' : 'Mensuelle'}</p>
                <p className="font-semibold">
                  Montant: €{PLANS[formData.plan_type][formData.billing_frequency]}
                  /{formData.billing_frequency === 'annual' ? 'an' : 'mois'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={!formData.user_id || createMutation.isLoading}
              >
                {createMutation.isLoading ? 'Création...' : 'Créer l\'abonnement'}
              </Button>
              <Button variant="outline" type="button" asChild>
                <Link href="/admin/subscriptions">Annuler</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AdminPageContainer>
  );
}
```

---

## 🧪 **Jour 3 : Détail Controller + Tests**

### **Matin (4h) : Detail Controller Pattern**

#### 10. Subscription Detail Controller

```typescript
// apps/web/src/app/admin/(dashboard)/subscriptions/[id]/components/subscription-detail-controller.tsx
"use client";

import { useState } from 'react';
import { type FC } from 'react';
import { SubscriptionDetailLayout } from './subscription-detail-layout';
import { SubscriptionCompactHeader } from './subscription-compact-header';
import { SubscriptionDetailsEditor } from './subscription-details-editor';
import { SubscriptionBreadcrumbs } from './subscription-breadcrumbs';
import type { Subscription } from '@/lib/types/subscription';

type SubscriptionFormData = {
  plan_type: Subscription['plan_type'];
  billing_frequency: Subscription['billing_frequency'];
  status: Subscription['status'];
  amount: number;
};

type SubscriptionDetailControllerProps = {
  subscriptionData: Subscription;
  onSave: (patch: Partial<SubscriptionFormData>) => Promise<void>;
};

export const SubscriptionDetailController: FC<SubscriptionDetailControllerProps> = ({
  subscriptionData,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingData, setPendingData] = useState<Partial<SubscriptionFormData>>({});

  const handleEditToggle = (editing: boolean) => {
    if (!editing) {
      setPendingData({});
    }
    setIsEditing(editing);
  };

  const handleDataChange = (data: Partial<SubscriptionFormData>) => {
    setPendingData(prev => ({ ...prev, ...data }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const patch: Partial<SubscriptionFormData> = {};
      
      // Compare et ne sauvegarde que les champs modifiés
      for (const key of ['plan_type', 'billing_frequency', 'status', 'amount'] as const) {
        if (key in pendingData && (subscriptionData as any)[key] !== (pendingData as any)[key]) {
          (patch as any)[key] = (pendingData as any)[key];
        }
      }

      if (Object.keys(patch).length > 0) {
        await onSave(patch);
      }

      setPendingData({});
      setIsEditing(false);
    } catch (error) {
      // L'erreur est gérée par le parent
    } finally {
      setIsSaving(false);
    }
  };

  const currentData = { ...subscriptionData, ...pendingData };

  return (
    <SubscriptionDetailLayout>
      <SubscriptionBreadcrumbs subscriptionData={subscriptionData} />
      
      <SubscriptionCompactHeader
        subscriptionData={currentData}
        isEditing={isEditing}
        isSaving={isSaving}
        onEditToggle={handleEditToggle}
        onSave={handleSave}
        hasChanges={Object.keys(pendingData).length > 0}
      />
      
      <SubscriptionDetailsEditor
        subscriptionData={currentData}
        isEditing={isEditing}
        onDataChange={handleDataChange}
      />
    </SubscriptionDetailLayout>
  );
};
```

### **Après-midi (4h) : Composants Support + Tests**

#### 11. Tests Unitaires

```typescript
// apps/web/src/app/admin/(dashboard)/subscriptions/__tests__/subscriptions-list.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { SubscriptionsList } from '../components/subscriptions-list';
import type { Subscription } from '@/lib/types/subscription';

const mockSubscription: Subscription = {
  id: '1',
  user_id: 'user-1',
  plan_type: 'ambassador_premium',
  billing_frequency: 'annual',
  status: 'active',
  amount: 320,
  currency: 'EUR',
  start_date: '2025-01-01',
  next_billing_date: '2026-01-01',
  created_at: '2025-01-01',
  updated_at: '2025-01-01',
  users: {
    id: 'user-1',
    email: 'test@example.com',
  },
  user_profiles: {
    first_name: 'John',
    last_name: 'Doe',
    avatar_url: null,
  },
};

const mockProps = {
  data: [mockSubscription],
  isLoading: false,
  onRefresh: jest.fn(),
  utils: {
    admin: {
      subscriptions: {
        list: {
          cancel: jest.fn(),
          getData: jest.fn(),
          setData: jest.fn(),
        },
      },
    },
  },
};

describe('SubscriptionsList', () => {
  it('renders subscription data correctly', () => {
    render(<SubscriptionsList {...mockProps} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('Annuel')).toBeInTheDocument();
    expect(screen.getByText('€320')).toBeInTheDocument();
    expect(screen.getByText('Actif')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<SubscriptionsList {...mockProps} isLoading={true} data={[]} />);
    
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('shows empty state', () => {
    render(<SubscriptionsList {...mockProps} data={[]} />);
    
    expect(screen.getByText('Aucun abonnement trouvé')).toBeInTheDocument();
  });
});
```

#### 12. Tests E2E

```typescript
// apps/web/tests/e2e/admin-subscriptions.spec.ts
import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';

test.describe('Admin Subscriptions Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should display subscriptions list', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    // Vérifier le header
    await expect(page.locator('h1')).toContainText('Gestion des Abonnements');
    
    // Vérifier les filtres
    await expect(page.locator('[placeholder="Rechercher par email ou nom..."]')).toBeVisible();
    
    // Vérifier le bouton de création
    await expect(page.locator('text=Nouvel Abonnement')).toBeVisible();
    
    // Vérifier la liste (au moins un abonnement existe)
    await expect(page.locator('[data-testid="subscriptions-table"]')).toBeVisible();
  });

  test('should filter subscriptions', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    // Test filtre par statut
    await page.selectOption('[data-testid="status-filter"]', 'active');
    await page.click('text=Rechercher');
    
    // Vérifier que seuls les abonnements actifs sont affichés
    const statusBadges = page.locator('[data-testid="status-badge"]');
    const count = await statusBadges.count();
    
    for (let i = 0; i < count; i++) {
      await expect(statusBadges.nth(i)).toContainText('Actif');
    }
  });

  test('should suspend and reactivate subscription', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    // Trouver un abonnement actif
    const firstSubscription = page.locator('[data-testid="subscription-row"]').first();
    await firstSubscription.locator('[data-testid="actions-menu"]').click();
    
    // Suspendre
    await page.click('text=Suspendre');
    await page.fill('[data-testid="suspend-reason"]', 'Test de suspension');
    await page.click('text=Suspendre');
    
    // Vérifier le toast de succès
    await expect(page.locator('.toast-success')).toBeVisible();
    
    // Vérifier le changement de statut
    await expect(firstSubscription.locator('[data-testid="status-badge"]')).toContainText('Suspendu');
    
    // Réactiver
    await firstSubscription.locator('[data-testid="actions-menu"]').click();
    await page.click('text=Réactiver');
    
    // Vérifier la réactivation
    await expect(page.locator('.toast-success')).toBeVisible();
    await expect(firstSubscription.locator('[data-testid="status-badge"]')).toContainText('Actif');
  });

  test('should create new subscription', async ({ page }) => {
    await page.goto('/admin/subscriptions');
    
    // Aller à la création
    await page.click('text=Nouvel Abonnement');
    await expect(page).toHaveURL('/admin/subscriptions/new');
    
    // Remplir le formulaire
    await page.selectOption('[data-testid="user-select"]', 'user-1');
    await page.selectOption('[data-testid="plan-select"]', 'ambassador_premium');
    await page.selectOption('[data-testid="billing-select"]', 'annual');
    
    // Soumettre
    await page.click('text=Créer l\'abonnement');
    
    // Vérifier la redirection et le succès
    await expect(page).toHaveURL(/\/admin\/subscriptions\/[^\/]+$/);
    await expect(page.locator('.toast-success')).toBeVisible();
  });
});
```

---

## 📋 **Planning Détaillé**

### **Jour 1 : Foundation (8h)**
- **✅ 09:00-13:00** : Routes tRPC + Types TypeScript
- **✅ 14:00-18:00** : Page liste + Filtres + Badge Status

### **Jour 2 : CRUD + Actions (8h)**
- **✅ 09:00-13:00** : Liste abonnements + Actions (suspend/reactivate)
- **✅ 14:00-18:00** : Pages détail et création

### **Jour 3 : Detail Controller + Tests (8h)**
- **✅ 09:00-13:00** : Detail Controller pattern + composants support
- **✅ 14:00-18:00** : Tests unitaires + E2E + documentation

---

## 🎯 **Checklist de Validation**

### **Fonctionnalités Core ✅**
- [ ] Liste abonnements avec pagination
- [ ] Filtres (statut, plan, fréquence, recherche)
- [ ] Actions : suspension, réactivation, modification
- [ ] Création nouvel abonnement
- [ ] Détail/édition abonnement
- [ ] Optimistic updates tRPC

### **UX/UI ✅**
- [ ] Design cohérent avec admin existant
- [ ] États de chargement
- [ ] Gestion erreurs avec toasts
- [ ] Responsive design
- [ ] Accessibility (aria-labels, keyboard nav)

### **Technique ✅**
- [ ] Types TypeScript stricts
- [ ] Patterns existants respectés
- [ ] Performance optimisée (cache tRPC)
- [ ] Tests unitaires (>80% coverage)
- [ ] Tests E2E complets

### **Données ✅**
- [ ] Connexion aux vraies tables Supabase
- [ ] 4 utilisateurs existants utilisables
- [ ] Validation Zod côté serveur
- [ ] RLS Supabase respecté

---

## 🚀 **Prêt à Démarrer**

Ce plan d'implémentation est **immédiatement actionnable** avec :

- **Code complet** respectant les patterns existants
- **Architecture tRPC** intégrée au système actuel
- **Tests inclus** pour validation
- **Planning réaliste** sur 2-3 jours

**Le backend dual billing étant déjà opérationnel, l'implémentation peut commencer immédiatement !** 🎯
