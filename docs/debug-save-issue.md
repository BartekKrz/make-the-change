# 🔧 Guide de Débogage - Sauvegarde des Images Produits

## Contexte du Problème

Le système d'upload fonctionne parfaitement (status 200, URLs générées), mais la sauvegarde du formulaire ne déclenche aucun log côté frontend, suggérant un problème dans la chaîne de sauvegarde TanStack Query/Form.

---

## 📋 Checklist de Diagnostic

### ✅ Vérifications Déjà Effectuées

#### 1. **Backend tRPC Endpoint** ✅
- Endpoint `admin.products.update` configuré et fonctionnel
- Accepte le champ `images: z.array(z.string().url()).optional()`
- Logs backend ajoutés pour tracer les requêtes

#### 2. **Base de Données** ✅
- Table `products` avec champ `images` de type `text[]`
- Politiques RLS configurées pour les admins
- Tests SQL de mise à jour réussis

#### 3. **Upload Système** ✅
- API upload retourne status 200
- URLs Supabase générées correctement
- Composant `ImageUpload` fonctionnel

### 🔍 Points à Vérifier

#### 1. **Configuration tRPC Client**
```typescript
// Dans lib/trpc.ts - Vérifier la configuration
export const trpc = createTRPCReact<AppRouter>();

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        retryDelay: 500,
      },
      mutations: {
        retry: 1,
      },
    },
  }));

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          // ⚠️ VÉRIFIER: Headers d'authentification
          headers() {
            return {
              authorization: `Bearer ${token}`, // Token présent ?
            };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

#### 2. **Variables d'Environnement**
```bash
# Dans .env.local - Vérifier ces variables
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Clé présente ?
NEXTAUTH_SECRET=secret...        # Secret présent ?
```

#### 3. **Authentification Utilisateur**
```typescript
// Vérifier que l'utilisateur est bien authentifié
const { data: session } = useSession();
console.log('Session:', session);

// Vérifier les permissions admin
const user = trpc.auth.me.useQuery();
console.log('User:', user.data);
console.log('Is admin:', user.data?.user_level === 'admin');
```

---

## 🐛 Procédure de Débogage

### Étape 1 : Tests Simples

#### **Test 1.1 : Vérifier la Connectivité tRPC**
```typescript
// Dans la console du navigateur
const testQuery = await window.trpc?.admin.products.list.query({});
console.log('Test query result:', testQuery);
```

#### **Test 1.2 : Vérifier l'Authentification**
```typescript
// Dans un composant React
const { data: user } = trpc.auth.me.useQuery();
console.log('Current user:', user);
```

#### **Test 1.3 : Test de Mutation Simple**
```typescript
// Test avec un champ simple (sans images)
const update = trpc.admin.products.update.useMutation();

await update.mutateAsync({
  id: '427a0f0d-e73c-42ca-91f8-1baa0596f373',
  patch: { name: 'Test Name' }
});
```

### Étape 2 : Logs Frontend Attendus

Après les améliorations de logging, vous devriez voir :

```
🔄 ProductDetailController.handleSave() - Début
📊 Données actuelles: {...}
📝 Données en attente: {...}
🔄 Champ images modifié: { ancien: [...], nouveau: [...] }
📦 Patch final: { images: [...] }
📊 Taille du patch: 1
✅ Appel de onSave()...
💾 HandleSave called with patch: {...}
🔄 Calling update.mutate with: { id: '...', patch: {...} }
🔄 TanStack Query onMutate - Début
📦 Variables reçues: { id: '...', patch: {...} }
```

### Étape 3 : Logs Backend Attendus

Côté serveur (logs du terminal) :
```
🔄 Backend: admin.products.update - Début
📦 Input reçu: { id: '...', patch: { images: [...] } }
📊 Produit avant mise à jour: { images: [...] }
🔄 Patch appliqué: { images: [...] }
✅ Produit mis à jour: { images: [...] }
🎉 Backend: admin.products.update - Succès
```

---

## 🔧 Solutions Possibles

### **Solution 1 : Problème d'Authentification**

#### Symptômes :
- Pas de logs backend du tout
- Erreur 401/403 dans la console

#### Diagnostic :
```typescript
// Vérifier le token dans les headers
const headers = trpc.httpBatchLink.headers();
console.log('Headers:', headers);
```

#### Solution :
```typescript
// S'assurer que le token est inclus
headers() {
  const token = localStorage.getItem('token'); // ou useSession()
  return token ? { authorization: `Bearer ${token}` } : {};
}
```

### **Solution 2 : Problème de Validation Zod**

#### Symptômes :
- Logs frontend présents
- Erreur 400 côté backend

#### Diagnostic :
```typescript
// Tester la validation côté client
const testSchema = z.array(z.string().url());
const result = testSchema.safeParse(yourImagesArray);
console.log('Validation result:', result);
```

### **Solution 3 : Problème de Cache TanStack Query**

#### Symptômes :
- Mutation semble réussir mais pas de changement visible
- Données restent identiques après sauvegarde

#### Solution :
```typescript
// Forcer l'invalidation du cache
await queryClient.invalidateQueries(['admin.products.detail', productId]);
await queryClient.invalidateQueries(['admin.products.list']);
```

### **Solution 4 : Problème de RLS**

#### Symptômes :
- Logs backend présents mais erreur de permissions

#### Diagnostic :
```sql
-- Vérifier les politiques RLS
SELECT * FROM pg_policies WHERE tablename = 'products';
```

#### Solution :
```sql
-- Politique manquante pour les updates admin
CREATE POLICY "Admin update products" ON products
FOR UPDATE USING (auth.role() = 'service_role');
```

---

## 🧪 Tests de Validation

### **Test Complet de Sauvegarde**

```typescript
// 1. Préparer les données de test
const testImages = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  'https://ebmjxinsyyjwshnynwwu.supabase.co/storage/v1/object/public/products/427a0f0d-e73c-42ca-91f8-1baa0596f373/gallery/test.webp'
];

// 2. Tester la mutation directement
const update = trpc.admin.products.update.useMutation({
  onSuccess: (data) => console.log('✅ Success:', data),
  onError: (error) => console.error('❌ Error:', error),
});

await update.mutateAsync({
  id: '427a0f0d-e73c-42ca-91f8-1baa0596f373',
  patch: { images: testImages }
});
```

### **Test de l'Interface Utilisateur**

1. Ouvrir la page d'édition du produit
2. Ajouter une nouvelle image via `ImageUpload`
3. Vérifier que `newImages` contient l'URL
4. Cliquer sur "Sauvegarder"
5. Vérifier les logs dans la console
6. Rafraîchir la page pour voir si l'image est sauvegardée

---

## 📞 Points de Contrôle

- [ ] **Frontend** : Logs présents dans la console navigateur
- [ ] **TanStack Query** : Mutation appelée avec les bonnes variables
- [ ] **tRPC** : Headers d'authentification présents
- [ ] **Backend** : Logs présents côté serveur
- [ ] **Base de données** : Mise à jour effective des données
- [ ] **Interface** : Images affichées après rechargement

---

## 🎯 Actions Immédiates

### **1. Vérifier les Logs**
1. Ouvrir la console du navigateur (F12)
2. Ouvrir les logs du serveur (terminal)
3. Reproduire le problème de sauvegarde
4. Comparer les logs attendus vs réels

### **2. Test Simple**
```typescript
// Tester avec un champ simple d'abord
const update = trpc.admin.products.update.useMutation();
await update.mutateAsync({
  id: '427a0f0d-e73c-42ca-91f8-1baa0596f373',
  patch: { name: 'Test Update' }
});
```

### **3. Diagnostic Approfondi**
Si les tests simples fonctionnent mais pas avec les images :
- Problème de validation Zod des URLs
- Problème de sérialisation des arrays
- Problème de taille des données

---

## 📋 Résumé des Logs Ajoutés

### **Frontend (3 fichiers modifiés)**
- `product-detail-controller.tsx` : Logs détaillés de sauvegarde
- `products/[id]/page.tsx` : Logs TanStack Query complets
- Composants d'upload : Logs de génération d'URLs

### **Backend (1 fichier modifié)**
- `packages/api/src/routers.ts` : Logs complets de l'endpoint update

**Avec ces logs, vous devriez pouvoir identifier exactement où se bloque la chaîne de sauvegarde !** 🎯






