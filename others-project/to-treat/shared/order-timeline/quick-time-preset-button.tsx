import { cn } from '@/src/components/lib/cn';
import { FC } from 'react';
import { Platform, Text, TouchableOpacity } from 'react-native';

type QuickTimePresetButton = {
  onPress?: () => void;
  disabled?: boolean;
  label: string;
};

export const QuickTimePresetButton: FC<QuickTimePresetButton> = ({ onPress, disabled, label }) => (
  <TouchableOpacity
    className={cn(
      'rounded-2xl px-5 py-2',
      disabled ? 'bg-gray-300' : 'bg-gray-500',
      Platform.OS === 'android' ? 'px-6 pt-2.5' : 'pt-2'
    )}
    onPress={disabled ? undefined : onPress}
  >
    <Text className='font-poppins-regular text-white'>{label}</Text>
  </TouchableOpacity>
);
