import { AppetitoIcon } from '@/src/components/ui/appetito-icon';
import { View, Text } from 'react-native';
import { ORDER_MODE_ICONS } from './utils/get-order-mode-icon';
import { getOrderModeLabel } from './utils/get-order-mode-label';
import { OrderMode } from '@/src/api/dashboard/orders/common-interface';
import { colors as appColors } from '@/src/components/colors';

type OrderSubHeaderProps = {
  orderMode: OrderMode;
  orderRef: string;
};

export const OrderSubHeader = ({ orderMode, orderRef }: OrderSubHeaderProps) => (
  <View className='flex-row items-center gap-1'>
    <View className='flex-row items-center'>
      <View className='z-10 items-center justify-center rounded-full border border-gray-200 bg-white p-2'>
        <AppetitoIcon name={ORDER_MODE_ICONS[orderMode]} size={16} color={appColors.primary} />
      </View>
      <View className='-ml-5'>
        <View className='z-0 h-7 items-center justify-center rounded-xl bg-white pl-7 pr-4'>
          <Text className='font-poppins-bold text-sm uppercase text-primary'>{getOrderModeLabel(orderMode)}</Text>
        </View>
      </View>
    </View>
    <Text className='ml-2 font-poppins-bold text-lg text-white'>{orderRef}</Text>
  </View>
);
