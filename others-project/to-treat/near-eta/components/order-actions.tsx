import { FC, PropsWithChildren } from 'react';
import { View, Text, TouchableOpacityProps, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Trans } from '@lingui/react/macro';
import colors from 'tailwindcss/colors';
import { cn } from '@/src/components/lib/cn';
import { toast } from 'sonner-native';
import { t } from '@lingui/core/macro';
import { OrderMode, OrderStatus } from '@/src/api/dashboard/orders/common-interface';
import { useOrderUpdate } from '../../../processed/order-status/use-order-status-update';
import { useETAFormContext, etaFieldContext, useETAFieldContext } from '../../shared/order-eta-form-context';
import { NEAR_ETA_DELIVERY_TIME_MS, NEAR_ETA_TAKEAWAY_TIME_MS } from '../min-eta-difference-minutes';

type OrderActionsProps = {
  orderId: number;
  orderStatus: OrderStatus;
  orderMode: OrderMode;
  etaUtc: Date;
};

export const OrderActions: FC<OrderActionsProps> = ({ orderStatus, orderMode, orderId, etaUtc }) => {
  const form = useETAFormContext();

  return (
    <View className='w-full flex-row flex-wrap justify-between gap-4 rounded-b-2xl border-t border-t-gray-200 bg-white px-3 py-4'>
      <form.Field name='eta'>
        {(field) => (
          <etaFieldContext.Provider value={field}>
            <UpdateButtonForm orderStatus={orderStatus} orderId={orderId} orderMode={orderMode} etaUtc={etaUtc} />
          </etaFieldContext.Provider>
        )}
      </form.Field>
    </View>
  );
};

type UpdateButtonFormProps = {
  orderStatus: OrderStatus;
  orderMode: OrderMode;
  orderId: number;
  etaUtc: Date;
};

const UpdateButtonForm: FC<UpdateButtonFormProps> = ({ orderStatus, orderMode, orderId, etaUtc }) => {
  const { handleStatusChange, isPending } = useOrderUpdate();
  const field = useETAFieldContext<Date>();

  const max = new Date(Math.max(Date.now(), etaUtc.getTime()));
  const minDate = new Date(
    max.getFullYear(),
    max.getMonth(),
    max.getDate(),
    max.getHours(),
    max.getMinutes(),
    0,
    0
  ).getTime();

  const minEtaDate = new Date(
    minDate + (orderMode === 'Delivery' ? NEAR_ETA_DELIVERY_TIME_MS : NEAR_ETA_TAKEAWAY_TIME_MS)
  );

  const newEtaIsLaterEnough = field.state.value >= minEtaDate;

  return (
    <SubmitButton
      isLoading={isPending}
      className='flex-1'
      disabled={isPending || (orderStatus === OrderStatus.Accepted && !newEtaIsLaterEnough)}
      onPress={async () => {
        try {
          await handleStatusChange({ orderId, eta: field.state.value, newStatus: orderStatus });
        } catch {
          toast.error(t`Erreur lors de l'acceptation de la commande.`);
        } finally {
          // ! todo: SetTimeout pour éviter le flash de la modal
          setTimeout(() => field.form.reset(), 500);
        }
      }}
    >
      <Trans>Mettre à jour</Trans>
    </SubmitButton>
  );
};

type SubmitButtonProps = TouchableOpacityProps & {
  isLoading?: boolean;
};

const SubmitButton: FC<PropsWithChildren<SubmitButtonProps>> = ({ isLoading, disabled, children, ...props }) => (
  <TouchableOpacity role='button' disabled={disabled} {...props}>
    <View
      className={cn(
        'flex-row items-center justify-center gap-4 rounded-full p-4',
        disabled ? 'border border-gray-200 bg-transparent' : `border border-transparent bg-success`
      )}
    >
      {isLoading && <ActivityIndicator color={colors.gray[400]} />}
      <Text className={cn('font-poppins-bold', disabled ? 'text-gray-400' : 'text-white')}>{children}</Text>
    </View>
  </TouchableOpacity>
);
