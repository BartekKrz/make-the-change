import { FC } from 'react';
import { View, Text, FlatList, Linking } from 'react-native';
import { Trans } from '@lingui/react/macro';
import { cssInterop } from 'nativewind';
import { OrderProduct } from '@/src/features/shop/orders/to-treat/shared/order-product';
import { AppetitoIcon } from '@/src/components/ui/appetito-icon';
import { OrderItem } from '@/src/api/dashboard/orders/common-interface';
import { GetPendingOrdersResponseItem } from '@/src/api/dashboard/orders/get-pending-orders';
import { t } from '@lingui/core/macro';
import { colors } from '@/src/components/colors';
import { OrderFeesInfo } from '@/src/features/shop/orders/shared/order-fees/order-fees-info';
import { InfoItem } from '../../../shared/info-item';
import { OrderPaymentInfo } from '../../../shared/order-payment-info';
import { DeliveryAddress } from '../../../shared/delivery-address';
import { OrderTimeline } from '../../../shared/order-timeline';
import { OrderHeader } from './order-header';

type OrderDetailsProps = {
  order: GetPendingOrdersResponseItem;
};

export const OrderDetails: FC<OrderDetailsProps> = ({ order }) => (
  <StyledFlatList
    data={order.orderItems}
    ListHeaderComponent={() => (
      <>
        <OrderHeader orderMode={order.orderMode} orderRef={order.orderRef} />

        <View className='gap-2'>
          <View className='border-b border-gray-200 p-4'>
            <Text className='text-md mb-2 font-poppins-bold uppercase text-gray-700'>
              <Trans>Coordonnées :</Trans>
            </Text>
            <InfoItem iconName='single-02' text={order.fullName} />
            <InfoItem
              iconName='phone-2'
              text={order.phoneNumber}
              onPress={() => Linking.openURL(`tel:${order.phoneNumber}`)}
            />
            {order.orderMode === 'Delivery' && (
              <DeliveryAddress
                deliveryAddress={order.deliveryAddress ?? t`Address is unavailable`}
                deliveryLatitude={+order.deliveryLatitude}
                deliveryLongitude={+order.deliveryLongitude}
              />
            )}
          </View>

          <OrderTimeline
            requestedAtUTC={order.requestedAtUTC}
            sentAtUTC={order.sentAtUTC}
            etaUTC={order.requestedAtUTC ?? order.sentAtUTC}
          />
        </View>

        {order.comments && order.comments.trim().length > 0 && (
          <View className='gap-2 border-b border-gray-200 p-4'>
            <Text className='font-poppins-bold uppercase text-gray-700'>
              <Trans>Commentaire du client:</Trans>
            </Text>
            <Text className='font-poppins-regular text-gray-600'>{order.comments.trim()}</Text>
          </View>
        )}

        <OrderPaymentInfo totalAmount={order.totalAmount} isPaid={order.isPaid} />

        <View className='flex-row items-center gap-2 bg-gray-100 px-4 pt-4'>
          <View className='w-6'>
            <AppetitoIcon name='cutlery' size={18} color={colors.secondary} />
          </View>
          <Text className='font-poppins-bold text-lg text-gray-900'>
            <Trans>Produits commandés</Trans>
          </Text>
        </View>
      </>
    )}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <OrderProduct
        categoryName={item.categoryName}
        productName={item.productName}
        quantity={item.quantity}
        totalAmount={item.totalAmount}
        orderItemOptions={item.orderItemOptions}
      />
    )}
    ListFooterComponent={() => (
      <OrderFeesInfo
        deliveryFeeAmount={order.deliveryFeeAmount}
        packagingFeeAmount={order.packagingFeeAmount}
        subAmount={order.subAmount}
        usedVoucherTotalAmount={order.usedVoucherTotalAmount}
        orderMode={order.orderMode}
        ticketLabel={order.usedVoucher?.ticketLabel}
        packagingFee={order.packagingFee}
      />
    )}
    className='rounded-t-2xl bg-white'
  />
);

const StyledFlatList = cssInterop(FlatList<OrderItem>, { className: 'style' });
