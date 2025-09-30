import { FC, useMemo } from 'react';
import { View, Text } from 'react-native';
import { AppetitoIconName } from '@/src/components/ui/appetito-icon';
import { OrderMode, OrderStatus } from '@/src/api/dashboard/orders/common-interface';
import {
  OrderStateType,
  ButtonVariant,
  OrderButtonShowMode
} from '../../../../processed/order-status/order-status-button-types';
import { OrderStatusButton } from '../../../../processed/order-status/order-status-action-button/order-status-button';
import { t } from '@lingui/core/macro';
import { getOrderStatusButtonVisualState } from '../../../../processed/order-status/order-status-action-button/get-order-status-button-visual-state';

type OrderStatusActionsLocalProps = {
  orderMode: OrderMode;
  variant: ButtonVariant;
  orderStatus: OrderStatus;
  setOrderStatus: (status: OrderStatus) => void;
};

export const OrderStatusActionsLocal: FC<OrderStatusActionsLocalProps> = ({
  orderMode,
  variant,
  orderStatus,
  setOrderStatus
}) => {
  const buttonsWithState = useMemo(
    () =>
      getOrderStatusButton()
        .filter((button) => button.showFor === 'all' || button.showFor === orderMode)
        .map((button) => {
          const orderStatusButtonVisualState = getOrderStatusButtonVisualState({
            currentStatus: orderStatus,
            targetStatus: button.status,
            orderMode
          });

          return {
            ...button,
            visualState: orderStatusButtonVisualState,

            disabled: orderStatusButtonVisualState !== OrderStateType.Actionable
          };
        }),
    [orderStatus, orderMode]
  );

  const currentStatusLabel = useMemo(
    () => getOrderStatusButton().find((button) => button.status === orderStatus)?.label,
    [orderStatus]
  );

  return (
    <View className={variant === 'withLabel' ? 'mb-6 flex-row justify-between gap-4' : 'flex gap-3'}>
      <View
        className={
          variant === 'withLabel'
            ? 'flex-1 flex-row justify-between gap-4'
            : 'flex-row items-start justify-between gap-2'
        }
      >
        {buttonsWithState.map((button) => (
          <OrderStatusButton
            key={button.status}
            currentStatus={orderStatus}
            targetStatus={button.status}
            iconName={button.iconName}
            disabled={button.disabled}
            isLoading={false}
            label={button.label}
            onPress={() => setOrderStatus(button.status)}
            orderMode={orderMode}
            variant={variant}
          />
        ))}
      </View>

      {variant === 'iconOnly' && (
        <Text className='font-poppins-bold text-sm uppercase text-secondary'>{currentStatusLabel}</Text>
      )}
    </View>
  );
};

type GetOrderStatusButtonReturnType = () => {
  status: OrderStatus;
  iconName: AppetitoIconName;
  label: string;
  showFor: OrderButtonShowMode;
}[];

const getOrderStatusButton: GetOrderStatusButtonReturnType = () => [
  {
    status: OrderStatus.Accepted,
    iconName: 'receipt-list',
    label: t`Acceptée`,
    showFor: 'all'
  },
  {
    status: OrderStatus.Preparing,
    iconName: 'pan',
    label: t`En préparation`,
    showFor: 'all'
  },
  {
    status: OrderStatus.Delivering,
    iconName: 'vespa-front',
    label: t`En livraison`,
    showFor: 'Delivery'
  },
  {
    status: OrderStatus.Ready,
    iconName: 'takeaway-2',
    label: t`Prête à être retirée`,
    showFor: 'Takeaway'
  }
];
