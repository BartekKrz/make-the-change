# Admin Dashboard – Inspirations depuis `others-project` (Next.js 15.4)

Objectif: lister les patterns solides de `others-project` (ancien dashboard Next.js 15.4) réutilisables pour le dashboard admin de Make the CHANGE, avec des recommandations concrètes d’adaptation.

## Vue d’Ensemble

- Auth & middleware Supabase SSR bien structurés (cookies, RLS-friendly) avec redirection par rôle.
- Page de connexion moderne basée sur Server Actions (Zod, mapping d’erreurs, transitions UI).
- Thème (light/dark) via CSS variables + Tailwind v4, composants UI génériques réutilisables.
- Configuration Next 15.4 optimisée (PPR, cache) et base ESLint/TS très stricte.

## Authentification & Middleware (SSR Supabase)

- Client Supabase côté middleware (cookies) pour vérifier la session et router en amont:
  - others-project/src/supabase/middleware.ts:1
  - others-project/middleware.ts:1

- Client Supabase côté serveur (Server Components) avec cookies persistés:
  - others-project/src/supabase/server.ts:1

- Client Supabase côté navigateur (composants client):
  - others-project/src/supabase/client.ts:1

- Séparation claire des responsabilités:
  - Récupération du rôle utilisateur via RPC (peut être adapté à un champ/claim admin):
    - others-project/src/utils/get-user-roles.ts:1
  - Protection de routes serveur + redirections par rôle:
    - others-project/src/supabase/auth.ts:1
  - Middleware central qui:
    - autorise les routes publiques
    - redirige si non authentifié (avec `redirect_to` conservé)
    - applique les règles d’accès par rôle (trainer/trainee → admin/user chez MTC)
    - others-project/middleware.ts:1

- Déconnexion via query param (utile pour scénarios support, SSO, tests):
  - others-project/src/components/auth/client-auth-wrapper.tsx:1
  - others-project/src/components/auth/logout-handler.tsx:1

Recommandations MTC:
- Migrer l’auth côté web admin vers `@supabase/ssr` pour la cohérence server/client/middleware.
- Introduire un middleware `/admin/**` calqué sur `others-project/middleware.ts:1` (matcher et redirections) avec `createMiddlewareClient`.
- Remplacer le RPC rôle par l’un de ces choix:
  - A. Table `users` avec champ `role` ou `is_admin` (RLS simple) et lecture via `supabase.from('users') ... eq('id', auth.uid())`.
  - B. Claim `app_metadata.role` dans Supabase Auth (nécessite gestion côté sign-up/admin).
- Implémenter `requireAuth({ requiredRole: 'admin' })` réutilisable en Server Components (cf. others-project/src/supabase/auth.ts:1).

## Page de Connexion (Server Actions + Zod)

- Server Action de login avec validation Zod et mapping d’erreurs lisible:
  - others-project/src/app/(public)/sign-in/logic/sign-in.ts:1
  - others-project/src/app/(public)/sign-in/logic/handle-auth-error.ts:1

- Formulaire client robuste (gestion d’états, messages champs/généraux, CTA animé):
  - others-project/src/app/(public)/sign-in/components/sign-in-form.tsx:1
  - others-project/src/app/(public)/sign-in/page.tsx:1

Recommandations MTC:
- Réutiliser ce pattern pour `/admin/login` avec Server Action:
  - Zod (email/password), messages localisés, erreurs précises (email non confirmé, credentials, réseau).
  - `redirect_to` en query et redirection post-login (ex: `/admin/dashboard`).
- Conserver le composant `FormError` et la gestion d’erreurs différenciée “validation/credentials/server”.

## Thème & UI (Tailwind + next-themes)

- Thème persisté (light/dark) avec `next-themes` ou provider maison, CSS variables pour tokens:
  - others-project/src/components/theme/theme-provider.tsx:1
  - others-project/src/components/theme/theme-toggle.tsx:1
  - others-project/tailwind.config.ts:1

- Librairie UI interne (inputs, boutons, modals, toasts, tabs, cards, progress, etc.) prête à l’emploi:
  - Quelques exemples: 
    - others-project/src/components/ui/input.tsx:1
    - others-project/src/components/ui/submit-button.tsx:1
    - others-project/src/components/ui/toast.tsx:1
    - others-project/src/components/ui/tabs.tsx:1
    - others-project/src/components/ui/card.tsx:1

Recommandations MTC:
- Reprendre le mapping Tailwind→CSS variables pour harmoniser le thème admin.
- Intégrer le `ThemeToggle` dans le header admin pour accès rapide.
- Importer progressivement les composants UI utiles (submit-button, toast, dialog) pour le back-office.

## Next Config & Performance

- `next.config.ts` exploite PPR incrémental et cache:
  - others-project/next.config.ts:1
  - Note: features “experimental” → valider compatibilité avant usage en prod MTC.

- ESLint v9 + TS strict (robuste pour code back-office):
  - others-project/eslint.config.mjs:1
  - Règles pertinentes à reprendre: `consistent-type-imports`, `array-type`, `prefer-optional-chain`, `prefer-const`, etc.

- TSConfig strict et moderne (sécurité des types accrue):
  - `noUncheckedIndexedAccess`, `moduleDetection: 'force'`, `verbatimModuleSyntax`
  - others-project/tsconfig.json:1

Recommandations MTC:
- Porter au minimum les règles TS utiles (`noUncheckedIndexedAccess`, `consistent-type-imports`).
- Monter ESLint/TS versions si souhaité (sinon garder V8 côté MTC, adapter la config).

## Routage par Rôle (Trainer/Trainee → Admin/User)

- Redirections HOME et garde des sous-arborescences:
  - HOME (`/`) redirige selon rôle (trainer → `/trainer`, trainee → `/trainee/...`).
  - Garde d’accès aux segments (ADMIN_ROUTES/PARTICIPANT_ROUTES): others-project/middleware.ts:1

Recommandations MTC:
- Simplifier à deux niveaux: `admin` vs `user`.
- HOME (`/`) et `/admin` redirigent intelligemment selon état et rôle.
- Conserver le `redirect_to` pour retour après login.

## Plan d’Intégration (Étapes)

1) Supabase SSR côté web admin
   - Ajouter `@supabase/ssr`.
   - Créer `src/supabase/{server.ts,client.ts,middleware.ts}` calqués sur others-project.
   - Introduire `requireAuth` pour Server Components admin.

2) Middleware `/admin/**` (Single-role MTC)
   - Utiliser `createMiddlewareClient` + cookies.
   - Si non authentifié → `/admin/login?redirect=/admin/dashboard`.
   - Pas de logique de rôles: une session valide suffit.
   - (Option sécurité) `ADMIN_EMAIL_ALLOWLIST` (liste d’emails séparés par virgule) — si définie, bloquer toute session dont l’email n’est pas autorisé.

3) Page `/admin/login` (Server Action)
   - Zod validation + messages clairs (email non confirmé, credentials invalides).
   - Redirection post-login vers param `redirect`.

4) Single-role (aucun super admin)
   - Supprimer toute logique multi-rôles (trainer/trainee). Uniquement “utilisateur connecté”.
   - (Option sécurité) allowlist email côté middleware/server (voir 2)).

5) UI/Thème
   - Introduire `ThemeProvider` + toggle dans le header admin.
   - Reprendre quelques composants UI (inputs/boutons/toasts) pour homogénéité.

6) Qualité
   - Améliorer `tsconfig.json` (au minimum `noUncheckedIndexedAccess`).
   - Évaluer l’adoption progressive des règles ESLint de others-project.

## Pièges & Différences à Anticiper

- MTC utilise déjà tRPC côté web; l’auth admin via Supabase (SSO) reste compatible, mais:
  - Bien propager le token vers `/api/trpc` si endpoints protégés requièrent auth.
  - Éviter d’exposer la `SERVICE_ROLE_KEY` côté web; utiliser toujours l’ANON client.

- Tailwind versions: others-project utilise Tailwind v4 + tokens CSS; MTC est en v3.4 actuellement côté web.
  - Si on reste en v3 pour l’instant, adapter les tokens sans casser les build.

- Features expérimentales Next (PPR/cache): conserver de côté tant que la stabilité n’est pas validée.

## Drop-in snippets – MTC (single-role)

- apps/web/middleware.ts (protection `/admin/**` + allowlist optionnelle)

```ts
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export const config = {
  matcher: ['/admin/:path*']
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => cookies.forEach((c) => response.cookies.set(c))
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    const url = new URL('/admin/login', request.url)
    url.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search)
    return NextResponse.redirect(url)
  }

  const allow = (process.env.ADMIN_EMAIL_ALLOWLIST || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)
  if (allow.length && !allow.includes((user.email || '').toLowerCase())) {
    return NextResponse.redirect(new URL('/admin/login?denied=1', request.url))
  }

  return response
}
```

- apps/web/src/supabase/server.ts

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServer() {
  const store = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (cs) => { try { cs.forEach(c => store.set(c.name, c.value, c.options)) } catch {}
        }
      }
    }
  )
}
```

- apps/web/src/supabase/client.ts

```ts
import { createBrowserClient } from '@supabase/ssr'
export const supabaseBrowser = () => createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

- apps/web/src/app/admin/login/actions.ts (Server Action Zod)

```ts
'use server'
import { z } from 'zod'
import { createSupabaseServer } from '@/supabase/server'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  redirect: z.string().optional()
})

export async function signInAction(_: unknown, formData: FormData) {
  const parsed = schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    redirect: formData.get('redirect')
  })
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }
  const supabase = await createSupabaseServer()
  const { error, data } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) return { success: false, message: error.message }

  const allow = (process.env.ADMIN_EMAIL_ALLOWLIST || '')
    .split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
  if (allow.length && !allow.includes((data.user?.email || '').toLowerCase())) {
    await supabase.auth.signOut()
    return { success: false, message: 'Access denied' }
  }
  return { success: true, redirectTo: parsed.data.redirect || '/admin/dashboard' }
}
```

- apps/web/src/app/admin/login/page.tsx (form côté client minimal)

```tsx
'use client'
import { useActionState } from 'react'
import { signInAction } from './actions'

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(signInAction, null)
  return (
    <form action={formAction} className="max-w-md mx-auto p-6">
      <input name="email" type="email" placeholder="Email" className="input" />
      <input name="password" type="password" placeholder="Password" className="input" />
      <input name="redirect" type="hidden" />
      <button disabled={pending} type="submit">Se connecter</button>
      {state?.message && <p role="alert">{state.message}</p>}
      {state?.success && state.redirectTo && (window.location.href = state.redirectTo)}
    </form>
  )
}
```

## Variables d’environnement (MTC)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ADMIN_EMAIL_ALLOWLIST` (optionnel, ex: `alice@mtc.com,bob@mtc.com`)

## Exemples de Références

- Middleware SSR + gestion cookies:
  - others-project/src/supabase/middleware.ts:1
  - others-project/middleware.ts:1

- Server Action login (Zod + mapping erreurs):
  - others-project/src/app/(public)/sign-in/logic/sign-in.ts:1
  - others-project/src/app/(public)/sign-in/logic/handle-auth-error.ts:1

- Formulaire de login (client):
  - others-project/src/app/(public)/sign-in/components/sign-in-form.tsx:1

- Thème & tokens CSS:
  - others-project/src/components/theme/theme-provider.tsx:1
  - others-project/tailwind.config.ts:1

---

Conclusion: `others-project` apporte une base très exploitable pour l’admin MTC, surtout sur l’auth SSR Supabase, la garde middleware, les Server Actions de login et le système de thème/UX. En suivant le plan d’intégration ci‑dessus, on peut sécuriser et polir rapidement l’expérience d’administration avec un minimum de risques.
