'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { toast } from '@/hooks/use-toast';

import type { TRPCClientErrorLike } from '@trpc/client';

type EntityConfig = {
  redirectTo: string;
  entityType: string;
};

export const useEntityErrorHandler = (
  error: TRPCClientErrorLike<any> | null,
  config: EntityConfig
) => {
  const router = useRouter();
  const t = useTranslations('errors');

  useEffect(() => {
    if (!error) return;

    const httpStatus = error.data?.httpStatus;
    const { entityType, redirectTo } = config;

    // Récupérer les traductions pour l'entité
    const entitySingular = t(`entities.${entityType}.singular`);
    const entityArticle = t(`entities.${entityType}.article`);

    if (httpStatus === 404) {
      toast({
        variant: 'destructive',
        title: t('notFound.title', {
          entity:
            entitySingular.charAt(0).toUpperCase() + entitySingular.slice(1),
        }),
        description: t('notFound.description', {
          article: entityArticle,
          entity: entitySingular,
        }),
      });
    } else if (httpStatus === 403) {
      toast({
        variant: 'destructive',
        title: t('accessDenied.title'),
        description: t('accessDenied.description', {
          article: entityArticle,
          entity: entitySingular,
        }),
      });
    } else if (httpStatus >= 500) {
      toast({
        variant: 'destructive',
        title: t('serverError.title'),
        description: t('serverError.description'),
      });
    } else {
      toast({
        variant: 'destructive',
        title: t('loadingError.title'),
        description:
          error.message ||
          t('loadingError.description', {
            article: entityArticle,
            entity: entitySingular,
          }),
      });
    }

    const redirectTimer = setTimeout(() => {
      router.push(redirectTo);
    }, 2000);

    return () => clearTimeout(redirectTimer);
  }, [error, config, router, t]);
};
