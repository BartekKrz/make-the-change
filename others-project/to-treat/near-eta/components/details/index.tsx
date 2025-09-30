import { FC } from 'react';
import { View, Text, FlatList, Linking } from 'react-native';
import { Trans } from '@lingui/react/macro';
import { cssInterop } from 'nativewind';
import { OrderPaymentInfo } from '@/src/features/shop/orders/to-treat/shared/order-payment-info';
import { OrderTimeline } from '@/src/features/shop/orders/to-treat/shared/order-timeline';
import { AppetitoIcon } from '@/src/components/ui/appetito-icon';
import { OrderItem, OrderStatus } from '@/src/api/dashboard/orders/common-interface';
import { t } from '@lingui/core/macro';
import { colors as appcolors } from '@/src/components/colors';
import { InfoItem } from '@/src/features/shop/orders/to-treat/shared/info-item';
import { DeliveryAddress } from '@/src/features/shop/orders/to-treat/shared/delivery-address';
import { OrderFeesInfo } from '@/src/features/shop/orders/shared/order-fees/order-fees-info';
import colors from 'tailwindcss/colors';
import { FontAwesome6 } from '@expo/vector-icons';
import { OrderStatusActionsLocal } from './order-status-actions-local';
import { OrderProduct } from '../../../shared/order-product';
import { OrderHeader } from './order-header';
import { GetActiveOrdersResponseItem } from '@/src/api/dashboard/orders/get-active-orders';

type OrderDetailsProps = {
  order: GetActiveOrdersResponseItem;
  orderStatus: OrderStatus;
  setOrderStatus: (status: OrderStatus) => void;
};

export const OrderDetails: FC<OrderDetailsProps> = ({ order, orderStatus, setOrderStatus }) => (
  <StyledFlatList
    data={order.orderItems}
    ListHeaderComponent={() => (
      <>
        <OrderHeader orderMode={order.orderMode} orderRef={order.orderRef} />
        <OrderWarningBanner />
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

          <OrderTimeline requestedAtUTC={order.requestedAtUTC} sentAtUTC={order.sentAtUTC} etaUTC={order.etaUTC} />
          <View className='p-4'>
            <Text className='text-md mb-2 font-poppins-bold uppercase text-gray-700'>
              <Trans>Modifier le statut :</Trans>
            </Text>
            <OrderStatusActionsLocal
              setOrderStatus={setOrderStatus}
              orderStatus={orderStatus}
              orderMode={order.orderMode}
              variant='withLabel'
            />
          </View>
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
            <AppetitoIcon name='cutlery' size={18} color={appcolors.secondary} />
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

const OrderWarningBanner: FC = () => (
  <View className='px-4 py-3'>
    <View className='rounded-lg border-2 border-red-500 bg-red-50 p-4 shadow-sm'>
      <View className='flex-row items-start gap-3'>
        <FontAwesome6 className='hidden lg:flex' name='calendar-day' size={22} color={colors.red[700]} />
        <View className='flex-1'>
          <Text className='font-poppins-bold text-red-700'>
            <Trans>La date prévue de la commande approche et vous n'avez pas encore mis à jour le statut.</Trans>
          </Text>
          <View className='mt-3 gap-2'>
            <View className='flex-row items-center'>
              <FontAwesome6 name='clock' size={16} color={colors.red[700]} style={{ marginRight: 6 }} />
              <Text className='flex-1 font-poppins-medium text-red-700'>
                <Trans>Veuillez mettre à jour l'heure prévue si vous avez du retard</Trans>
              </Text>
            </View>
            <View className='flex-row items-center'>
              <FontAwesome6 name='arrows-rotate' size={16} color={colors.red[700]} style={{ marginRight: 6 }} />
              <Text className='flex-1 font-poppins-medium text-red-700'>
                <Trans>Mettez à jour le statut de la commande si elle est en cours de traitement</Trans>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  </View>
);

const StyledFlatList = cssInterop(FlatList<OrderItem>, { className: 'style' });
