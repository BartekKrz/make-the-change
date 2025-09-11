import { msg, t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { FC } from 'react';
import { useRefuseOrderMutation } from '@/src/api/legacy/orders/refuse-order';
import { useModalContext } from '@/src/utils/use-modal/use-modal';
import { useAppForm } from '@/src/components/form/app-form';
import { useETAFormContext } from '../../shared/order-eta-form-context';
import { z } from 'zod';
import { toast } from 'sonner-native';
import { AgnosticModal } from '../../../shared/modal';
import { View } from 'react-native';

type RefuseOrderModalProps = {
  visible: boolean;
  orderId: number;
};

const refuseOrderSchema = z.object({
  rejectionReason: z.string().min(1, msg`La raison du refus doit contenir au moins 1 caractères`)
});

export const RefuseOrderModal: FC<RefuseOrderModalProps> = ({ orderId }) => {
  const modal = useModalContext();
  const etaForm = useETAFormContext();
  const { mutateAsync: refuseOrderAsync } = useRefuseOrderMutation();

  const form = useAppForm({
    defaultValues: {
      rejectionReason: ''
    },
    validators: {
      onSubmit: refuseOrderSchema
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await refuseOrderAsync({ orderId, reasonPhrase: value.rejectionReason });
        modal.close();
        formApi.reset();
        etaForm.reset();
      } catch {
        toast.error(t`Erreur lors du refus de la commande.`);
      }
    }
  });

  return (
    <AgnosticModal.Layout visible={modal.currentModal === 'order-refusal-confirmation'} onClose={modal.close}>
      <AgnosticModal.Title title={t`Raison du refus`} />
      <AgnosticModal.Content>
        <View className='min-h-48 bg-gray-100 p-4'>
          <form.AppForm>
            <form.AppField
              name='rejectionReason'
              children={(field) => (
                <field.FormTextFieldMultiline
                  placeholder={t`ex: Aucun moyen de vous contacter, rupture de stock, etc.`}
                  autoCapitalize='none'
                  autoCorrect={false}
                  onSubmitEditing={form.handleSubmit}
                  returnKeyType={'done'}
                />
              )}
            />
          </form.AppForm>
        </View>
      </AgnosticModal.Content>
      <AgnosticModal.Actions>
        <form.Subscribe selector={(state) => [state.isSubmitting, state.isDirty]}>
          {([isSubmitting, isDirty]) => (
            <>
              <AgnosticModal.Button
                onPress={form.handleSubmit}
                disabled={isSubmitting || !isDirty}
                isLoading={isSubmitting}
                variant='danger'
              >
                <Trans>Refuser</Trans>
              </AgnosticModal.Button>
              <AgnosticModal.Button
                onPress={() => {
                  form.reset();
                  modal.close();
                }}
                disabled={isSubmitting}
                variant='cancel'
              >
                <Trans>Annuler</Trans>
              </AgnosticModal.Button>
            </>
          )}
        </form.Subscribe>
      </AgnosticModal.Actions>
    </AgnosticModal.Layout>
  );
};
