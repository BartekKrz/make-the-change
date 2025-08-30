# 🔐 Authentification Admin

**Page de connexion sécurisée pour l'accès au dashboard administrateur Make the CHANGE.**

## 🎯 Objectif

Sécuriser l'accès à l'interface d'administration avec authentification multi-niveaux et session persistante.

## 👤 Utilisateurs Cibles

- **Administrateurs système** : Accès complet à toutes les fonctionnalités
- **Gestionnaires opérationnels** : Accès aux commandes, utilisateurs, support
- **Analystes business** : Accès aux analytics et rapports
- **Support client** : Accès limité aux utilisateurs et commandes

## 🎨 Design & Layout

### Structure Page
```
┌─────────────────────────────────────┐
│            Header Simple            │
│     Logo "Make the CHANGE"          │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│                                     │
│        [Card Centrale Auth]         │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Accès Administrateur      │   │
│  │                             │   │
│  │  Email: [_______________]   │   │
│  │  Password: [___________]    │   │
│  │                             │   │
│  │  [ Se connecter ]           │   │
│  │                             │   │
│  │  [Mot de passe oublié?]     │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Responsive Design
- **Desktop** : Card centrée 400px largeur
- **Tablet** : Card adaptative 90% largeur max 500px
- **Mobile** : Plein écran avec padding 16px

## 📱 Composants UI (shadcn/ui)

### Card Principale
```tsx
<Card className="w-full max-w-md mx-auto">
  <CardHeader>
    <CardTitle>Accès Administrateur</CardTitle>
    <CardDescription>
      Connectez-vous pour accéder au dashboard
    </CardDescription>
  </CardHeader>
  <CardContent>
    <Form>
      <FormField name="email">
        <Input type="email" placeholder="admin@makethechange.com" />
      </FormField>
      <FormField name="password">
        <Input type="password" placeholder="••••••••" />
      </FormField>
    </Form>
  </CardContent>
  <CardFooter>
    <Button type="submit" className="w-full">
      Se connecter
    </Button>
  </CardFooter>
</Card>
```

### États Visuels
- **Loading** : Button avec Spinner + texte "Connexion..."
- **Erreur** : Alert rouge avec message d'erreur
- **Succès** : Redirection immédiate vers dashboard

## 🔄 États & Interactions

### Workflow Authentification
```
1. Saisie credentials → Validation front-end
2. Submit form → Appel API auth.admin.login
3. Success → Stockage session + redirect /admin/dashboard
4. Error → Affichage message + reset password field
```

### Validations Front-End
- **Email** : Format email valide + requis
- **Password** : Minimum 8 caractères + requis
- **Rate limiting** : Max 3 tentatives / 5 minutes

### États du Formulaire
```typescript
interface AuthState {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
  attempts: number;
}
```

## 📡 API & Données

### Route tRPC
```typescript
// Endpoint : admin.auth.login
input: {
  email: string;     // admin@makethechange.com
  password: string;  // mot de passe sécurisé
}

output: {
  success: boolean;
  user: {
    id: string;
    email: string;
    role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'SUPPORT' | 'COMPLIANCE' | 'PARTNER';
    name: string;
    permissions: string[];
  };
  token: string;       // JWT token
  expiresAt: Date;
}
```

### Gestion Session
- **JWT Token** : Stocké en httpOnly cookie
- **Expiration** : 8 heures (renouvelable)
- **Permissions** : Basées sur le rôle utilisateur
- **Refresh** : Auto-refresh 30min avant expiration

## ✅ Validations

### Sécurité
- **Rate Limiting** : 3 tentatives / 5min par IP
- **CSRF Protection** : Token CSRF requis
- **Password Hashing** : bcrypt avec salt
- **Session Security** : httpOnly + secure cookies

### Contraintes Business
- **Rôles autorisés** : ADMIN, SUPER_ADMIN, MANAGER, SUPPORT
- **Comptes actifs seulement** : Status 'ACTIVE' requis
- **2FA** : Optionnel pour SUPER_ADMIN (Phase 2)

## 🚨 Gestion d'Erreurs

### Messages d'Erreur
```typescript
const errorMessages = {
  INVALID_CREDENTIALS: "Email ou mot de passe incorrect",
  ACCOUNT_DISABLED: "Compte désactivé, contactez l'administrateur",
  TOO_MANY_ATTEMPTS: "Trop de tentatives, réessayez dans 5 minutes",
  NETWORK_ERROR: "Erreur de connexion, vérifiez votre réseau",
  UNAUTHORIZED: "Accès non autorisé pour ce rôle"
};
```

### Recovery
- **Mot de passe oublié** : Lien vers reset password
- **Support technique** : Contact admin@makethechange.com
- **Aide contextuelle** : Tooltip sur les champs

## 🔗 Navigation

### Après Connexion Réussie
```typescript
const redirectByRole = {
  SUPER_ADMIN: '/admin/dashboard',
  ADMIN: '/admin/dashboard',
  MANAGER: '/admin/orders',
  SUPPORT: '/admin/users'
};
```

### Cas d'Échec
- **Erreur** : Reste sur page auth avec message
- **Rate limit** : Page bloquée avec countdown
- **Maintenance** : Page maintenance système

## 📝 Tests Utilisateur

### Scénarios de Test
1. **Login valide** : Admin avec credentials corrects
2. **Login invalide** : Mauvais mot de passe
3. **Compte désactivé** : User avec status INACTIVE
4. **Rate limiting** : 4+ tentatives consécutives
5. **Session expirée** : Token JWT expiré

### Critères de Succès
- **Temps connexion** : <2 secondes
- **Sécurité** : 100% tentatives malveillantes bloquées
- **UX** : Messages d'erreur clairs et actionnables
- **Performance** : Page charge <500ms

## 💾 Stockage Local

### Session Storage
```typescript
interface AdminSession {
  user: AdminUser;
  permissions: Permission[];
  loginTime: Date;
  lastActivity: Date;
  expiresAt: Date;
}
```

### Cookies
- **admin_session** : JWT token (httpOnly)
- **admin_csrf** : CSRF token
- **admin_prefs** : Préférences UI (theme, langue)

---

**Stack Technique** : Next.js 15.5 (App Router) sur Vercel + Supabase Auth + shadcn/ui + tRPC v11  
**Priorité** : 🔥 Critique - Bloquant pour tout développement admin  
**Estimation** : 3-5 jours développement + tests sécurité
