'use client';

import { useParams } from 'next/navigation';
import { type FC } from 'react';

import { SubscriptionDetailController } from '@/app/[locale]/admin/(dashboard)/subscriptions/[id]/components/subscription-detail-controller';
import { trpc } from '@/lib/trpc';

const AdminSubscriptionEditPage: FC = () => {
  const params = useParams<{ id: string }>();
  const subscriptionId = params?.id as string;
  const utils = trpc.useUtils();

  const {
    data: subscription,
    isLoading,
    error,
  } = trpc.admin.subscriptions.byId.useQuery(
    { id: subscriptionId! },
    {
      enabled: !!subscriptionId,
      retry: 1,
      retryDelay: 500,
    }
  );

  const update = trpc.admin.subscriptions.update.useMutation({
    onMutate: async vars => {
      await utils.admin.subscriptions.byId.cancel({ id: subscriptionId! });
      await utils.admin.subscriptions.list.cancel();

      const prevDetail = utils.admin.subscriptions.byId.getData({
        id: subscriptionId!,
      });
      const prevList = utils.admin.subscriptions.list.getData({
        search: undefined,
        status: undefined,
        subscriptionTier: undefined,
        limit: 20,
        page: 1,
      });

      if (prevDetail) {
        utils.admin.subscriptions.byId.setData(
          { id: subscriptionId! },
          { ...prevDetail, ...vars.patch }
        );
      }

      if (prevList) {
        utils.admin.subscriptions.list.setData(
          {
            search: undefined,
            status: undefined,
            subscriptionTier: undefined,
            limit: 20,
            page: 1,
          },
          {
            ...prevList,
            items: prevList.items.map(s =>
              s.id === subscriptionId ? { ...s, ...vars.patch } : s
            ),
          }
        );
      }

      return { prevDetail, prevList };
    },
    onError: (error, _vars, ctx) => {
      if (ctx?.prevDetail) {
        utils.admin.subscriptions.byId.setData(
          { id: subscriptionId! },
          ctx.prevDetail
        );
      }
      if (ctx?.prevList) {
        utils.admin.subscriptions.list.setData(
          {
            search: undefined,
            status: undefined,
            subscriptionTier: undefined,
            limit: 20,
            page: 1,
          },
          ctx.prevList
        );
      }
    },
    onSuccess: () => {
      utils.admin.subscriptions.byId.invalidate({ id: subscriptionId! });
      utils.admin.subscriptions.list.invalidate();
    },
  });

  const handleSave = async (patch: any) => {
    return update.mutateAsync({ id: subscriptionId!, patch });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="py-8 text-center">
        <h3 className="text-lg font-semibold text-red-600">Erreur</h3>
        <p className="text-muted-foreground">
          {error?.message || 'Abonnement introuvable'}
        </p>
      </div>
    );
  }

  return (
    <SubscriptionDetailController
      subscriptionData={subscription}
      onSave={handleSave}
    />
  );
};

export default AdminSubscriptionEditPage;
