# Vercel Integration - Make the CHANGE

 Scope: Next.js hosting, Edge/Node runtimes, caching, environment, cron.

## Functions
- tRPC routes on Edge runtime; Stripe webhooks on Node runtime.
- `vercel.json` to map runtimes; configure headers and caching.

## Caching
- RSC data with `revalidate`/tags; client with TanStack Query; avoid double fetch.

## Environment
- Set env vars per environment (dev/preview/prod); restrict access.

## Cron
- Schedule view refresh and expiry jobs using Vercel Cron.

## Analytics
- Enable Vercel Analytics; watch Core Web Vitals and error rates.

## References
- `tech-stack.md`, `architecture-overview.md`.

