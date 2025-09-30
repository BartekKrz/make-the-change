import { Trash2, ImagePlus } from 'lucide-react';

import { RoundActionButton } from './round-action-button';

import type { FC } from 'react';

type ImageActionButtonsProps = {
  onRemove: () => void;
  onChange: () => void;
  disabled?: boolean;
};

export const ImageActionButtons: FC<ImageActionButtonsProps> = ({
  onRemove,
  onChange,
  disabled = false,
}) => (
  <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
    <div className="absolute inset-0 rounded-xl bg-black/20 backdrop-blur-[2px]" />
    <RoundActionButton
      className="relative z-10"
      disabled={disabled}
      onClick={onRemove}
    >
      <Trash2 className="text-destructive h-4 w-4" />
    </RoundActionButton>
    <RoundActionButton
      className="relative z-10"
      disabled={disabled}
      onClick={onChange}
    >
      <ImagePlus className="text-primary h-4 w-4" />
    </RoundActionButton>
  </div>
);
