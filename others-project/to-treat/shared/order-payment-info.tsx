import { FC } from 'react';
import { View, Text } from 'react-native';
import { Trans } from '@lingui/react/macro';
import { formatPrice } from '@/src/features/shop/orders/utils/format-price';
import { cn } from '@/src/components/lib/cn';

type OrderPaymentInfoProps = {
  totalAmount: number;
  isPaid: boolean;
  className?: string;
};

export const OrderPaymentInfo: FC<OrderPaymentInfoProps> = ({ totalAmount, isPaid, className }) => (
  <View
    className={cn(
      'flex-row flex-wrap items-center justify-between border-b border-gray-200 bg-gray-100 p-4',
      className
    )}
  >
    <View className='gap-1'>
      <Text className='font-poppins-bold text-2xl'>
        <Trans>Montant total</Trans>
      </Text>
      <PaymentStatusBadge isPaid={isPaid} />
    </View>
    <View className='flex-row items-center'>
      <Text className='font-poppins-bold text-2xl'>{formatPrice(totalAmount)}</Text>
    </View>
  </View>
);

type PaymentStatusBadgeProps = {
  isPaid: boolean;
};

const PaymentStatusBadge = ({ isPaid }: PaymentStatusBadgeProps) => (
  <View className={cn(`mr-2 self-start rounded-full px-3 py-1.5`, isPaid ? 'bg-success' : 'bg-error')}>
    <Text className='font-poppins-bold text-xs uppercase text-white'>
      <Trans>{isPaid ? 'Payé' : 'Non payé'}</Trans>
    </Text>
  </View>
);
