'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { type FC } from 'react';

import { OrderDetailController } from '@/app/[locale]/admin/(dashboard)/orders/[id]/components/order-detail-controller';
import { trpc } from '@/lib/trpc';
const AdminOrderEditPage: FC = () => {
  const params = useParams<{ id: string }>();
  const orderId = params?.id as string;
  const utils = trpc.useUtils();

  const { data: order, isLoading } = trpc.admin.orders.detail.useQuery(
    { orderId },
    { enabled: !!orderId, retry: 1, retryDelay: 500 }
  );
  const update = trpc.admin.orders.update.useMutation({
    onMutate: async vars => {
      await utils.admin.orders.detail.cancel({ orderId });

      const prevDetail = utils.admin.orders.detail.getData({ orderId });

      if (prevDetail) {
        utils.admin.orders.detail.setData(
          { orderId },
          { ...prevDetail, ...vars.patch }
        );
      }

      return { prevDetail };
    },
    onError: (error, _vars, ctx) => {
      if (ctx?.prevDetail) {
        utils.admin.orders.detail.setData({ orderId }, ctx.prevDetail);
      }
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la sauvegarde');
    },
    onSettled: () => {
      utils.admin.orders.detail.invalidate({ orderId });
    },
  });

  const orderData = useMemo(() => {
    return order || null;
  }, [order]);

  if (!orderId) return <div className="p-8">Missing orderId</div>;
  if (isLoading && !orderData) return <div className="p-8">Chargement…</div>;
  if (!orderData) return <div className="p-8">Commande non trouvée</div>;

  const handleSave = async (patch: any) => {
    if (!orderId) return;

    try {
      await update.mutateAsync({
        orderId,
        patch,
      });
      console.warn('Updating order:', { id: orderId, patch });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  return <OrderDetailController orderData={orderData} onSave={handleSave} />;
};
export default AdminOrderEditPage;
