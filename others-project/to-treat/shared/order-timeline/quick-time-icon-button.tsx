import { cn } from '@/src/components/lib/cn';
import { AppetitoIcon } from '@/src/components/ui/appetito-icon';
import { FC } from 'react';
import { TouchableOpacity } from 'react-native';

type QuickTimeIconButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  iconName: 'd-add' | 'd-delete';
};

export const QuickTimeIconButton: FC<QuickTimeIconButtonProps> = ({ onPress, disabled, iconName }) => (
  <TouchableOpacity
    onPress={onPress}
    className={cn('rounded-2xl px-4 py-2', disabled ? 'bg-gray-300' : 'bg-gray-500')}
    disabled={disabled}
  >
    <AppetitoIcon name={iconName} size={16} color={'white'} />
  </TouchableOpacity>
);
