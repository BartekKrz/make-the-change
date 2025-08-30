# ADR-0001: Choix du Monorepo et de la Stack Technique

- **Statut :** Accepté
- **Date :** 2025-08-22

## Contexte

Le projet Make the CHANGE est une plateforme complexe composée de plusieurs applications distinctes : une application mobile (Expo), un dashboard web pour les administrateurs (Next.js 15.5 App Router sur Vercel), et un site e-commerce public. Ces applications doivent partager de la logique, des types, et des composants UI. Nous avons besoin d'une structure de projet qui facilite ce partage, optimise les builds et simplifie la gestion des dépendances.

De plus, la stack technique doit être moderne, performante, scalable, et permettre un développement rapide et sécurisé avec une équipe de taille réduite pour le MVP.

## Décision

Nous avons décidé d'adopter une **architecture monorepo** gérée par **Turborepo v2** et **pnpm workspaces**.

La **stack technique principale** retenue est la suivante :

- **Frontend Mobile :** Expo SDK 53 (React Native) avec NativeWind v4 pour le style.
- **Frontend Web (Admin & E-commerce) :** Next.js 15.5 (App Router) déployé sur Vercel, stylé avec Tailwind CSS et shadcn/ui v2.
- **Backend API :** tRPC v11, tournant sur Vercel (Edge pour l’API, Node pour les webhooks Stripe).
- **Base de Données & Auth :** Supabase (utilisant PostgreSQL 15) pour sa base de données managée, son système d'authentification intégré et son généreux free tier pour le MVP.
- **Gestion de l'état serveur :** TanStack Query v5 sur toutes les plateformes pour une gestion unifiée du cache et du data fetching.

## Conséquences

### Positives
- **Cohérence :** Le partage de code (types, logique, composants) entre les différentes applications est grandement simplifié, réduisant la duplication et les incohérences.
- **Type-Safety de bout en bout :** L'utilisation de TypeScript sur l'ensemble de la stack, combinée à tRPC, élimine une classe entière de bugs d'intégration entre le frontend et le backend.
- **Performance :** Le choix de Next.js (Vercel) pour le web et de Vercel Edge pour l’API, ainsi que l'utilisation de NativeWind pour le mobile, sont des choix orientés performance.
- **Scalabilité :** L'architecture serverless (Vercel Edge + Node, Supabase) permet une montée en charge automatique avec des coûts maîtrisés.
- **Efficacité de développement :** Turborepo optimise les builds et les tests dans le monorepo. La stack choisie est très populaire et bien documentée, facilitant l'onboarding.
- **Maîtrise des coûts MVP :** La combinaison de Supabase Free Tier et des offres gratuites de Vercel permet de démarrer avec un budget d'infrastructure proche de 0€/mois.

### Négatives ou Risques
- **Complexité du Monorepo :** La gestion d'un monorepo peut devenir complexe si une gouvernance stricte n'est pas maintenue (identifié dans `risk-analysis.md`).
- **Dépendance à l'écosystème Vercel/Supabase :** Bien que performant, cela crée une dépendance à des fournisseurs spécifiques. Une couche d'abstraction est nécessaire pour mitiger ce risque.
- **Courbe d'apprentissage :** Bien que populaires, certains outils (tRPC, Turborepo) peuvent nécessiter un temps d'adaptation pour les nouveaux développeurs.
