import { FC, PropsWithChildren } from 'react';
import { View, Text, TouchableOpacityProps, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Trans } from '@lingui/react/macro';
import colors from 'tailwindcss/colors';
import { cn } from '@/src/components/lib/cn';
import { useAcceptOrderMutation } from '@/src/api/legacy/orders/accept-order';
import { useModalContext } from '@/src/utils/use-modal/use-modal';
import {
  useETAFormContext,
  etaFieldContext,
  useETAFieldContext
} from '@/src/features/shop/orders/to-treat/shared/order-eta-form-context';
import { toast } from 'sonner-native';
import { t } from '@lingui/core/macro';
import { dateUtils } from '@/src/utils/date-utils';
import { RefuseOrderModal } from './refuse-order-modal';
import { useShopContext } from '@/src/providers/shop-provider';

type OrderActionsProps = {
  requestedAtUTC: Date | null;
  sentAtUTC: Date;
  orderId: number;
  onOrderAccepted: () => void;
};

export const OrderActions: FC<OrderActionsProps> = ({ requestedAtUTC, sentAtUTC, orderId, onOrderAccepted }) => {
  const form = useETAFormContext();

  const modal = useModalContext();
  const { shop } = useShopContext();

  return (
    <>
      <RefuseOrderModal orderId={orderId} visible={modal.currentModal === 'order-refusal-confirmation'} />
      <View className='w-full flex-row flex-wrap justify-between gap-4 rounded-b-2xl border-t border-t-gray-200 bg-white px-3 py-4'>
        <ActionButton
          variant='refuse'
          className='flex-1'
          disabled={!shop.canRefuseOrder}
          onPress={() => modal.toggle('order-refusal-confirmation')}
        >
          <Trans>Refuser</Trans>
        </ActionButton>
        <form.Field name='eta'>
          {(field) => (
            <etaFieldContext.Provider value={field}>
              <AcceptButtonForm
                sentAtUTC={sentAtUTC}
                orderId={orderId}
                requestedAtUTC={requestedAtUTC}
                onOrderAccepted={onOrderAccepted}
              />
            </etaFieldContext.Provider>
          )}
        </form.Field>
      </View>
    </>
  );
};

type AcceptButtonFormProps = {
  requestedAtUTC: Date | null;
  sentAtUTC: Date;
  orderId: number;
  onOrderAccepted: () => void;
};

const AcceptButtonForm: FC<AcceptButtonFormProps> = ({ requestedAtUTC, sentAtUTC, orderId, onOrderAccepted }) => {
  const { mutateAsync: acceptOrderAsync, isPending: isAccepting } = useAcceptOrderMutation();
  const field = useETAFieldContext<Date>();

  const getIsAcceptDisabled = () => {
    if (requestedAtUTC === null)
      return (
        !field.state.meta.isDirty ||
        isAccepting ||
        !dateUtils.isDateAfter(field.state.value, requestedAtUTC ?? sentAtUTC)
      );
    return isAccepting || !dateUtils.isDateEqualOrAfter(field.state.value, requestedAtUTC ?? sentAtUTC);
  };

  return (
    <ActionButton
      variant='accept'
      isLoading={isAccepting}
      className='flex-1'
      disabled={getIsAcceptDisabled()}
      onPress={async () => {
        try {
          await acceptOrderAsync({
            orderId,
            eta: field.state.value
          });

          onOrderAccepted();
        } catch {
          toast.error(t`Erreur lors de l'acceptation de la commande.`);
        } finally {
          // ! todo: SetTimeout pour éviter le flash de la modal
          setTimeout(() => field.form.reset(), 500);
        }
      }}
    >
      <Trans>Accepter</Trans>
    </ActionButton>
  );
};

type ButtonProps = TouchableOpacityProps & {
  isLoading?: boolean;
  variant: 'accept' | 'refuse';
};

const ActionButton: FC<PropsWithChildren<ButtonProps>> = ({ isLoading, disabled, children, variant, ...props }) => (
  <TouchableOpacity role='button' disabled={disabled} {...props}>
    <View
      className={cn(
        'flex-row items-center justify-center gap-4 rounded-full p-4',
        disabled
          ? 'border border-gray-200 bg-transparent'
          : `border border-transparent ${variant === 'accept' ? 'bg-success' : 'bg-error'}`
      )}
    >
      {isLoading && variant === 'accept' && <ActivityIndicator color={colors.gray[400]} />}
      <Text className={cn('font-poppins-bold', disabled ? 'text-gray-400' : 'text-white')}>{children}</Text>
    </View>
  </TouchableOpacity>
);
