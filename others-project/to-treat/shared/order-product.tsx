import { FC } from 'react';
import { View, Text } from 'react-native';
import { formatPrice } from '@/src/features/shop/orders/utils/format-price';
import { OrderItemOption } from '@/src/api/dashboard/orders/common-interface';
import { cn } from '@/src/components/lib/cn';
import { groupBy } from '@/src/features/shop/orders/utils/group-order-item-options';

type OrderProductProps = {
  quantity: number;
  categoryName: string;
  productName: string;
  totalAmount: number;
  orderItemOptions: OrderItemOption[];
  className?: string;
};

export const OrderProduct: FC<OrderProductProps> = ({
  quantity,
  categoryName,
  productName,
  totalAmount,
  orderItemOptions,
  className
}) => {
  const groupedOptions = groupBy(orderItemOptions, 'productOptionCategory');

  return (
    <View className={cn('bg-gray-100 p-4', className)}>
      <View className='mb-1 w-full flex-row flex-wrap justify-between gap-4 md:justify-end'>
        <View className='flex-1'>
          <View className='flex-row flex-wrap items-center gap-2'>
            <Text className='font-poppins-regular text-gray-700'>{quantity} x</Text>
            <Text className='font-poppins-bold text-gray-700'>[{categoryName}]</Text>
            <Text className='flex font-poppins-bold text-gray-700'>{productName}</Text>
          </View>
        </View>
        <Text className='font-poppins-semibold text-gray-900'>{formatPrice(totalAmount)}</Text>
      </View>
      {orderItemOptions && orderItemOptions.length > 0 && (
        <View className='mt-1 w-full flex-1 gap-2'>
          {Object.entries(groupedOptions).map(([categoryName, options]) => (
            <View key={categoryName} className='gap-1'>
              <Text className='font-poppins-semibold text-xs uppercase text-gray-600'>{categoryName}</Text>
              {options.map((option) => (
                <View key={option.id} className='ml-2 flex-1 flex-row items-center justify-between gap-1'>
                  <View className='flex-1 flex-row items-center gap-2'>
                    <Text className='flex-1 font-poppins-regular text-sm text-gray-500'>
                      • {option.productOptionName}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
