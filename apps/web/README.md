# Make the CHANGE - Web Application

Application web Next.js 15.4 avec authentification Supabase et TanStack Query.

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (installé au niveau du monorepo)
- Compte Supabase configuré

### Environment Variables

1. Copiez le fichier d'exemple :

```bash
cp .env.example .env.local
```

2. Configurez vos variables Supabase :

```bash
# Get these from https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Development

```bash
# Install dependencies (from monorepo root)
pnpm install

# Start development server
pnpm dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

## 🧪 Testing Authentication

Visitez [http://localhost:3000/test](http://localhost:3000/test) pour tester :

- Création de compte avec vérification email
- Connexion/déconnexion
- Gestion des erreurs

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 15.4 (App Router)
- **Language**: TypeScript 5.9+ (strict mode)
- **Styling**: Tailwind CSS v4
- **State Management**: TanStack Query v5.85.6
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL

### Structure

```
src/
├── app/                 # Next.js App Router
│   ├── (auth)/         # Auth pages group (future)
│   ├── test/           # Authentication test page
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── providers.tsx   # React Query provider
├── components/         # React components
├── hooks/             # Custom hooks (useAuth)
├── lib/               # Utilities (Supabase client)
└── types/             # TypeScript types
```

### Features

- ✅ Supabase Authentication
- ✅ Real-time auth state management
- ✅ Error handling and user feedback
- ✅ Responsive design
- ✅ TypeScript strict mode
- ✅ TanStack Query integration

## 🚀 Production

L'application est déployée sur Vercel : [make-the-change.vercel.app](https://make-the-change.vercel.app)

### Build

```bash
pnpm build
```

### Environment Variables (Vercel)

Configurez les variables d'environnement dans Vercel Dashboard :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📋 Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript compiler

## 🔗 Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/ebmjxinsyyjwshnynwwu
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentation**: ../../docs/
