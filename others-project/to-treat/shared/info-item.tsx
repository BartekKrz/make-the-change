import { colors } from '@/src/components/colors';
import { cn } from '@/src/components/lib/cn';
import { AppetitoIcon, AppetitoIconName } from '@/src/components/ui/appetito-icon';
import { FC } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

type InfoItemProps = {
  iconName: AppetitoIconName;
  text: string;
  onPress?: () => void;
};

export const InfoItem: FC<InfoItemProps> = ({ iconName, text, onPress }) => {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper className='flex-row items-center gap-3 py-2' onPress={onPress}>
      <AppetitoIcon className='h-6' name={iconName} size={16} color={colors.secondary} />
      <View className='flex-1'>
        <Text className={cn('font-poppins-medium text-gray-500', onPress ? 'underline' : '')}>{text}</Text>
      </View>
    </Wrapper>
  );
};
