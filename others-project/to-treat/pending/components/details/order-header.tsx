import { FC } from 'react';
import { Text } from 'react-native';
import { Trans } from '@lingui/react/macro';
import { GradientView } from '@/src/components/ui/gradient/gradient-view';
import { OrderMode } from '@/src/api/dashboard/orders/common-interface';
import { OrderSubHeader } from '../../../shared/order-sub-header';

type OrderHeaderProps = {
  orderMode: OrderMode;
  orderRef: string;
};

export const OrderHeader: FC<OrderHeaderProps> = ({ orderRef, orderMode }) => (
  <GradientView className='rounded-t-lg p-4'>
    <Text className='mb-2 font-poppins-bold text-xl text-white'>
      <Trans>Une nouvelle commande est arrivée</Trans>
    </Text>
    <OrderSubHeader orderMode={orderMode} orderRef={orderRef} />
  </GradientView>
);
