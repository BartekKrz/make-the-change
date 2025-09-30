import { FC } from 'react';
import { View, Text } from 'react-native';
import { Trans } from '@lingui/react/macro';
import { GradientView } from '@/src/components/ui/gradient/gradient-view';
import colors from 'tailwindcss/colors';
import { OrderMode } from '@/src/api/dashboard/orders/common-interface';
import { FontAwesome6 } from '@expo/vector-icons';
import { OrderSubHeader } from '../../../shared/order-sub-header';

type OrderHeaderProps = {
  orderMode: OrderMode;
  orderRef: string;
};

export const OrderHeader: FC<OrderHeaderProps> = ({ orderRef, orderMode }) => (
  <GradientView gradientColors={[colors.red[700], colors.orange[500]]} className='rounded-t-lg p-5'>
    <View className='mb-2 flex-row items-center'>
      <FontAwesome6 name='triangle-exclamation' size={24} color='white' className='mr-2' />
      <Text className='font-poppins-black text-xl text-white lg:text-2xl'>
        <Trans>Une action est requise: mettre à jour la commande</Trans>
      </Text>
    </View>
    <OrderSubHeader orderMode={orderMode} orderRef={orderRef} />
  </GradientView>
);
