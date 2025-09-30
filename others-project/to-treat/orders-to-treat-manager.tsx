import { FC, useEffect, useState } from 'react';
import { useGetPendingOrdersQuery } from '@/src/api/dashboard/orders/get-pending-orders';
import { PendingOrderForm } from './pending/pending-order-form';
// import { NearETAForm } from './near-eta/near-eta-form';
import { NEAR_ETA_DELIVERY_TIME_MS, NEAR_ETA_TAKEAWAY_TIME_MS } from './near-eta/min-eta-difference-minutes';
import { OrderStatus } from '@/src/api/dashboard/orders/common-interface';
import { GetActiveOrdersResponseItem, useGetActiveOrdersQuery } from '@/src/api/dashboard/orders/get-active-orders';
import { useShopContext } from '@/src/providers/shop-provider';

const CHECK_NEAR_ETA_INTERVAL_MS = 15_000;

const getFirstNearETAOrderId = (activeOrders: GetActiveOrdersResponseItem[]) => {
  const nowUtc = new Date(Date.now());
  const nowUtcWithoutSecondsPrecisions = new Date(
    nowUtc.getFullYear(),
    nowUtc.getMonth(),
    nowUtc.getDate(),
    nowUtc.getHours(),
    nowUtc.getMinutes(),
    0,
    0
  ).getTime();

  const order = activeOrders
    .filter((o) => o.status === OrderStatus.Accepted)
    .find((o) => {
      const detectionDate = new Date(
        nowUtcWithoutSecondsPrecisions +
          (o.orderMode === 'Delivery' ? NEAR_ETA_DELIVERY_TIME_MS : NEAR_ETA_TAKEAWAY_TIME_MS)
      );

      return detectionDate >= o.etaUTC;
    });
  return order?.id ?? null;
};

export const OrdersToTreatManager: FC = () => {
  const { shop } = useShopContext();
  const [firstNearETAOrderId, setFirstNearETAOrderId] = useState<number | null>(null);

  const {
    data: activeOrders,
    isSuccess: isGetActiveOrdersSuccess,
    isLoading: isGetActiveOrdersLoading
  } = useGetActiveOrdersQuery(shop.id);

  const {
    data: pendingOrders,
    isSuccess: isGetPendingOrdersSuccess,
    isLoading: isGetPendingOrdersLoading
  } = useGetPendingOrdersQuery(shop.id);

  // Loop each NEAR ETA INTERVAL
  useEffect(() => {
    if (!(activeOrders && activeOrders.length > 0)) return;

    // Run once then at the interval
    const orderId = getFirstNearETAOrderId(activeOrders);
    if (orderId !== firstNearETAOrderId) {
      setFirstNearETAOrderId(orderId);
    }

    const interval = setInterval(() => {
      const orderId = getFirstNearETAOrderId(activeOrders);
      if (orderId !== firstNearETAOrderId) {
        setFirstNearETAOrderId(orderId);
      }
    }, CHECK_NEAR_ETA_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [activeOrders, firstNearETAOrderId]);

  // First priority is to show a near ETA order to force the user to either update its status or its ETA
  if (isGetActiveOrdersLoading) return null;
  if (!isGetActiveOrdersSuccess) return null;

  // if (activeOrders.length > 0 && firstNearETAOrderId) {
  //   const firstNearETAOrder = activeOrders.find((o) => o.id === firstNearETAOrderId);
  //   if (firstNearETAOrder) return <NearETAForm order={firstNearETAOrder} />;
  // }

  // Second priority is to show a pending order to force the user to either accept or refuse it
  if (isGetPendingOrdersLoading) return null;
  if (!isGetPendingOrdersSuccess) return null;
  return pendingOrders.length > 0 && <PendingOrderForm order={pendingOrders[0]} />;
};
