import { FC } from 'react';
import { View, Text } from 'react-native';
import { Trans } from '@lingui/react/macro';
import { UpdateEtaSection } from '@/src/features/shop/orders/to-treat/shared/order-timeline/update-eta-section';
import { dateUtils } from '@/src/utils/date-utils';
import { useETAFormContext, etaFieldContext } from '../order-eta-form-context';
import { getRequestedAtText } from '../../../shared/get-requested-at-text';

type OrderTimelineProps = {
  sentAtUTC: Date;
  requestedAtUTC: Date | null;
  etaUTC: Date;
};

export const OrderTimeline: FC<OrderTimelineProps> = ({ sentAtUTC, requestedAtUTC, etaUTC }) => {
  const form = useETAFormContext();

  return (
    <View className='gap-2 border-b border-gray-200 p-4'>
      <View className='flex-row flex-wrap items-center gap-1'>
        <Text className='text-md font-poppins-bold uppercase text-gray-700'>
          <Trans>Reçue le :</Trans>
        </Text>
        <Text className='font-poppins-medium text-sm text-gray-600'>{dateUtils.formatDateToDisplay(sentAtUTC)}</Text>
      </View>
      <View className='flex-row flex-wrap items-center gap-1'>
        <Text className='text-md font-poppins-bold uppercase text-gray-700'>
          <Trans>Désirée pour :</Trans>
        </Text>
        <Text className='font-poppins-medium text-sm text-gray-600'>{getRequestedAtText(requestedAtUTC)}</Text>
      </View>
      <form.Field name='eta'>
        {(field) => (
          <etaFieldContext.Provider value={field}>
            <UpdateEtaSection etaUTC={etaUTC} />
          </etaFieldContext.Provider>
        )}
      </form.Field>
    </View>
  );
};
