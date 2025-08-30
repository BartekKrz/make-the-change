# API tRPC - Make the CHANGE

API backend TypeScript avec tRPC pour la plateforme Make the CHANGE.

## 🚀 Stack Technique

- **tRPC v11** - API type-safe avec TypeScript
- **Express** - Serveur HTTP
- **Supabase** - Base de données PostgreSQL + Auth
- **Zod** - Validation des schémas
- **TypeScript** - Type safety
- **Jose** - JWT validation

## 📋 Fonctionnalités Implémentées

### 🔐 Authentification (`/trpc/auth`)
- `register` - Inscription utilisateur avec points de bienvenue
- `login` - Connexion avec JWT
- `me` - Profil utilisateur actuel
- `updateProfile` - Mise à jour du profil
- `logout` - Déconnexion

### 👥 Utilisateurs (`/trpc/users`)
- `getPointsBalance` - Solde de points
- `getPointsHistory` - Historique des transactions
- `updateKycLevel` - Mise à jour KYC avec bonus
- `getInvestments` - Investissements utilisateur
- `list` - Liste utilisateurs (admin)
- `addPoints` - Attribution manuelle de points (admin)

## 🔧 Configuration

### Variables d'environnement

Copiez `env.example` vers `.env` :

```bash
cp env.example .env
```

Variables requises :
```env
SUPABASE_URL=https://ebmjxinsyyjwshnynwwu.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret
PORT=3001
NODE_ENV=development
```

## 🏃‍♂️ Démarrage

### Développement
```bash
pnpm dev
```

### Production
```bash
pnpm build
pnpm start
```

## 🔍 Endpoints

- **API Root** : `http://localhost:3001`
- **tRPC** : `http://localhost:3001/trpc`
- **Health** : `http://localhost:3001/health`

## 🧪 Test de l'API

### Health Check
```bash
curl http://localhost:3001/health
```

### Inscription
```bash
curl -X POST http://localhost:3001/trpc/auth.register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

## 🏗️ Architecture

```
apps/api/
├── src/
│   ├── lib/
│   │   ├── supabase.ts    # Client Supabase
│   │   └── trpc.ts        # Configuration tRPC
│   ├── utils/
│   │   └── jwt.ts         # Utilitaires JWT
│   └── index.ts           # Serveur Express
├── routers/
│   ├── auth.ts            # Router authentification
│   └── users.ts           # Router utilisateurs
└── README.md
```

## 🔒 Sécurité

### Authentification
- JWT tokens via Supabase Auth
- Service role key pour opérations admin
- Middleware de protection des routes

### Autorisation
- `publicProcedure` - Accès libre
- `protectedProcedure` - Authentification requise  
- `adminProcedure` - Rôle admin requis

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Configuration dans vercel.json
{
  "functions": {
    "apps/api/src/index.ts": {
      "runtime": "nodejs20.x"
    }
  }
}
```

### Variables d'environnement production
Configurez les mêmes variables dans votre plateforme de déploiement.

## 📚 Documentation API

L'API est auto-documentée via les types TypeScript. Utilisez l'autocomplétion dans votre IDE avec le client tRPC.

## 🧩 Extensions Futures

- Router projets (`projects.ts`)
- Router e-commerce (`products.ts`, `orders.ts`)  
- Router abonnements (`subscriptions.ts`)
- Webhooks Stripe
- Rate limiting
- Caching Redis
