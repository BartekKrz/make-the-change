# Authentification - Site E-commerce

## 🎯 Objectif

Permettre aux utilisateurs de s'inscrire, se connecter et récupérer leur mot de passe de manière sécurisée et fluide.

## 👤 Utilisateurs Cibles

- **Visiteurs anonymes** : Inscription pour accéder aux fonctionnalités
- **Utilisateurs existants** : Connexion rapide et sécurisée
- **Tous personas** : Processus d'onboarding simplifié

## 🎨 Design & Layout

### Structure de Page

```text
[Header Minimal]
├── Container Centré
│   ├── Logo & Branding
│   ├── Tabs (Connexion / Inscription)
│   ├── Formulaires
│   └── Actions Secondaires
└── [Footer Minimal]
```

### Layout Authentification

```jsx
<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4">
  <div className="max-w-md w-full space-y-8">
    {/* Header avec logo */}
    <div className="text-center">
      <Link href="/" className="inline-block">
        <img
          src="/logo-make-the-change.svg"
          alt="Make the CHANGE"
          className="h-12 w-auto mx-auto"
        />
      </Link>
      <h1 className="mt-6 text-3xl font-bold text-slate-900">
        {isLogin ? 'Bon retour !' : 'Rejoignez-nous'}
      </h1>
      <p className="mt-2 text-slate-600">
        {isLogin 
          ? 'Connectez-vous à votre compte' 
          : 'Créez votre compte et commencez à faire la différence'
        }
      </p>
    </div>

    {/* Tabs Login/Register */}
    <Tabs value={authMode} onValueChange={setAuthMode} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Se connecter</TabsTrigger>
        <TabsTrigger value="register">S'inscrire</TabsTrigger>
      </TabsList>

      {/* Formulaire de connexion */}
      <TabsContent value="login">
        <Card>
          <CardContent className="p-6">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="votre@email.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Mot de passe</FormLabel>
                        <Button
                          variant="link"
                          className="px-0 font-normal"
                          onClick={() => setShowForgotPassword(true)}
                        >
                          Mot de passe oublié ?
                        </Button>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm">
                    Se souvenir de moi
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Formulaire d'inscription */}
      <TabsContent value="register">
        <Card>
          <CardContent className="p-6">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={registerForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input placeholder="Jean" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Dupont" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="votre@email.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Au moins 8 caractères avec majuscules, minuscules et chiffres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmer le mot de passe</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de naissance</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="DD/MM/YYYY"
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Vous devez avoir au moins 18 ans
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={setAcceptTerms}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      J'accepte les{' '}
                      <Link href="/conditions" className="text-green-600 hover:underline">
                        conditions générales
                      </Link>
                      {' '}et la{' '}
                      <Link href="/confidentialite" className="text-green-600 hover:underline">
                        politique de confidentialité
                      </Link>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={acceptNewsletter}
                      onCheckedChange={setAcceptNewsletter}
                    />
                    <Label htmlFor="newsletter" className="text-sm">
                      Je souhaite recevoir les actualités et offres spéciales
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !acceptTerms}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création du compte...
                    </>
                  ) : (
                    'Créer mon compte'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    {/* Séparateur */}
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <Separator className="w-full" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-2 text-slate-500">Ou continuer avec</span>
      </div>
    </div>

    {/* Connexion sociale */}
    <div className="grid grid-cols-2 gap-3">
      <Button variant="outline" onClick={() => signIn('google')}>
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Google
      </Button>
      <Button variant="outline" onClick={() => signIn('apple')}>
        <Apple className="mr-2 h-4 w-4" />
        Apple
      </Button>
    </div>

    {/* Footer */}
    <div className="text-center text-sm text-slate-500">
      <p>
        En vous inscrivant, vous acceptez nos{' '}
        <Link href="/conditions" className="text-green-600 hover:underline">
          conditions d'utilisation
        </Link>
      </p>
    </div>
  </div>
</div>
```

## 🔐 Modal Mot de Passe Oublié

```jsx
<Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
      <DialogDescription>
        Entrez votre adresse email pour recevoir un lien de réinitialisation
      </DialogDescription>
    </DialogHeader>
    
    <Form {...forgotPasswordForm}>
      <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
        <FormField
          control={forgotPasswordForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="votre@email.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter className="flex-col sm:flex-col space-y-2">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              'Envoyer le lien'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setShowForgotPassword(false)}
          >
            Annuler
          </Button>
        </DialogFooter>
      </form>
    </Form>
  </DialogContent>
</Dialog>
```

## 🔄 États & Validations

### Schémas de Validation

```typescript
const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis')
});

const registerSchema = z.object({
  firstName: z.string().min(2, 'Prénom trop court'),
  lastName: z.string().min(2, 'Nom trop court'),
  email: z.string().email('Email invalide'),
  password: z.string()
    .min(8, 'Au moins 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Doit contenir majuscules, minuscules et chiffres'),
  confirmPassword: z.string(),
  birthDate: z.string().refine((date) => {
    const birth = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    return age >= 18;
  }, 'Vous devez avoir au moins 18 ans')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide')
});
```

### Gestion des États

```typescript
const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
const [isLoading, setIsLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [showForgotPassword, setShowForgotPassword] = useState(false);
const [acceptTerms, setAcceptTerms] = useState(false);
const [acceptNewsletter, setAcceptNewsletter] = useState(false);

// Gestion des erreurs
const [authError, setAuthError] = useState<string | null>(null);
const [successMessage, setSuccessMessage] = useState<string | null>(null);
```

## 📡 API & Intégrations

### Endpoints tRPC

```typescript
// Authentification
auth.login: {
  input: {
    email: string;
    password: string;
    remember?: boolean;
  };
  output: {
    user: User;
    session: Session;
    redirect_url?: string;
  };
}

auth.register: {
  input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    birthDate: string;
    newsletter: boolean;
  };
  output: {
    user: User;
    verification_required: boolean;
  };
}

auth.forgotPassword: {
  input: { email: string };
  output: { 
    sent: boolean; 
    message: string 
  };
}

auth.resetPassword: {
  input: {
    token: string;
    password: string;
  };
  output: {
    success: boolean;
    redirect_url: string;
  };
}
```

### Intégration Supabase Auth

```typescript
// NOTE: L'authentification est unifiée avec l'application mobile via le même backend Supabase Auth
// pour garantir une expérience SSO (Single Sign-On) transparente pour l'utilisateur.

// Configuration Supabase
export const supabaseConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await verifyUser(credentials.email, credentials.password);
        
        if (user && user.verified) {
          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName
          };
        }
        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_SECRET!,
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.firstName = user.firstName;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.firstName = token.firstName;
      return session;
    }
  }
};
```

## 🔐 Sécurité & Validation

### Mesures de Sécurité

```typescript
// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives par IP
  message: 'Trop de tentatives de connexion, réessayez plus tard'
});

// Validation email existence
const validateEmailDomain = async (email: string) => {
  const domain = email.split('@')[1];
  const bannedDomains = ['tempmail.com', '10minutemail.com'];
  
  if (bannedDomains.includes(domain)) {
    throw new Error('Domaine email non autorisé');
  }
};

// Hash password sécurisé
const hashPassword = async (password: string) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};
```

### Validation Côté Client

```typescript
// Vérification force mot de passe en temps réel
const checkPasswordStrength = (password: string) => {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*]/.test(password)
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  
  return {
    score,
    strength: score < 3 ? 'Faible' : score < 4 ? 'Moyen' : 'Fort',
    checks
  };
};
```

## 📱 Responsive & Accessibilité

### Mobile First

```jsx
// Version mobile optimisée
<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 px-4 py-8 sm:px-6 lg:px-8">
  <div className="max-w-sm mx-auto sm:max-w-md">
    {/* Header simplifié sur mobile */}
    <div className="text-center mb-8">
      <img src="/logo.svg" alt="Logo" className="h-8 mx-auto mb-4 sm:h-12 sm:mb-6" />
      <h1 className="text-2xl font-bold sm:text-3xl">
        {authMode === 'login' ? 'Connexion' : 'Inscription'}
      </h1>
    </div>
    
    {/* Formulaires empilés sur mobile */}
    <div className="space-y-4">
      {/* Contenu formulaire... */}
    </div>
  </div>
</div>
```

### Accessibilité

```typescript
// Labels et ARIA
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel htmlFor="email">Email</FormLabel>
      <FormControl>
        <Input
          id="email"
          type="email"
          aria-describedby="email-error"
          aria-invalid={!!form.formState.errors.email}
          {...field}
        />
      </FormControl>
      <FormMessage id="email-error" />
    </FormItem>
  )}
/>
```

## 📝 Tests Utilisateur

### Scénarios Critiques

1. **Inscription fluide** : Compte créé <60s
2. **Connexion rapide** : Login <10s
3. **Récupération mot de passe** : Email reçu <2min
4. **Validation temps réel** : Feedback immédiat
5. **Mobile friendly** : Expérience optimisée

### Métriques Success

- **Taux conversion inscription** : >85%
- **Temps moyen inscription** : <45s
- **Erreurs utilisateur** : <5%
- **Abandons formulaire** : <15%
- **Satisfaction** : >4.5/5

---

**Stack Technique** : Supabase Auth + bcrypt + Zod + React Hook Form  
**Priorité** : 🔥 Critique - Porte d'entrée utilisateurs  
**Estimation** : 6-8 jours développement + sécurisation
