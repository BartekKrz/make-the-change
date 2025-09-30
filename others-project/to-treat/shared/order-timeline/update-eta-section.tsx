import { FC, useCallback } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Trans } from '@lingui/react/macro';
import { cn } from '@/src/components/lib/cn';
import { dateUtils } from '@/src/utils/date-utils';
import { useModalContext } from '@/src/utils/use-modal/use-modal';
import { UpdateETAOrderModal } from './update-eta-order-modal';
import { QuickTimeIconButton } from './quick-time-icon-button';
import { QuickTimePresetButton } from './quick-time-preset-button';
import { useETAFieldContext } from '../order-eta-form-context';

type UpdateEtaSectionProps = {
  etaUTC: Date;
};

export const UpdateEtaSection: FC<UpdateEtaSectionProps> = ({ etaUTC }) => {
  const field = useETAFieldContext<Date>();
  const modal = useModalContext();

  const eta = field.state.value;

  const handleEtaChange = useCallback(
    (minutes: number) => {
      const newEta = dateUtils.addMinutes(eta, minutes);

      if (dateUtils.isDateBefore(newEta, etaUTC)) return;

      field.setValue(newEta);
    },
    [eta, etaUTC]
  );

  return (
    <>
      <UpdateETAOrderModal visible={modal.currentModal === 'update-order-eta'} etaUTC={etaUTC} onClose={modal.close} />
      <View className='mt-3'>
        <View className='flex-row flex-wrap items-center gap-1'>
          <Text className='font-poppins-bold uppercase text-gray-700'>
            <Trans>Heure prévue :</Trans>
          </Text>
          <Text className='font-poppins-medium text-sm text-gray-600'>{dateUtils.formatDateToDisplay(etaUTC)}</Text>
        </View>

        <TouchableOpacity
          onPress={() => modal.toggle('update-order-eta')}
          className='mt-2 flex-row items-center gap-1 self-start rounded-2xl border border-gray-100 bg-gray-50 p-2'
        >
          <QuickTimeIconButton
            onPress={() => handleEtaChange(-1)}
            iconName='d-delete'
            disabled={!dateUtils.isDateAfter(eta, etaUTC)}
          />
          <Text className={cn('min-w-16 text-center font-poppins-semibold text-base text-gray-700')}>
            {dateUtils.formatters.fullDateWithTime2.format(eta)}
          </Text>
          <QuickTimeIconButton onPress={() => handleEtaChange(1)} iconName='d-add' />
        </TouchableOpacity>

        <View className='mt-3 flex-row flex-wrap gap-2'>
          {QUICK_TIME_PRESETS.map((minutes) => (
            <QuickTimePresetButton key={minutes} onPress={() => handleEtaChange(minutes)} label={`+ ${minutes} min`} />
          ))}
        </View>
      </View>
    </>
  );
};

const QUICK_TIME_PRESETS = [15, 30, 60];
