import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Langues supportées
  locales: ['fr', 'en', 'nl'],

  // Langue par défaut
  defaultLocale: 'fr',
});
