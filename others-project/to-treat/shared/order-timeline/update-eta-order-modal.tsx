import { Trans } from '@lingui/react/macro';
import { FC, useState } from 'react';
import { View, Text } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { AgnosticModal } from '../../../shared/modal';
import { useETAFieldContext } from '../order-eta-form-context';
import { t } from '@lingui/core/macro';

type UpdateETAOrderModalProps = {
  visible: boolean;
  etaUTC: Date;
  onClose: () => void;
};

export const UpdateETAOrderModal: FC<UpdateETAOrderModalProps> = ({ visible, etaUTC, onClose }) => {
  const field = useETAFieldContext<Date>();
  const [selectedDate, setSelectedDate] = useState(field.state.value);

  const handleConfirm = () => {
    field.setValue(selectedDate);
    field.form.handleSubmit();
  };

  return (
    <AgnosticModal.Layout visible={visible} onClose={onClose}>
      <AgnosticModal.Title title={t`Heure prévue`} />

      <AgnosticModal.Content>
        <Text className='text-m font-poppins-regular color-gray-700'>
          <Trans>Informez le client de la nouvelle heure prévue pour cette commande.</Trans>
        </Text>

        <View className='w-full items-center justify-center'>
          <DatePicker date={selectedDate} mode='datetime' minimumDate={etaUTC} onDateChange={setSelectedDate} />
        </View>
      </AgnosticModal.Content>

      <AgnosticModal.Actions>
        <AgnosticModal.Button variant='success' onPress={handleConfirm}>
          <Trans>Confirmer</Trans>
        </AgnosticModal.Button>
        <AgnosticModal.Button variant='cancel' onPress={onClose}>
          <Trans>Annuler</Trans>
        </AgnosticModal.Button>
      </AgnosticModal.Actions>
    </AgnosticModal.Layout>
  );
};
