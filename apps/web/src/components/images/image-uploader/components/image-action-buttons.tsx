import { Trash2, ImagePlus } from 'lucide-react';

import { RoundActionButton } from './round-action-button';

import type { FC } from 'react';

type ImageActionButtonsProps = {
  onRemove: () => void;
  onChange: () => void;
  disabled?: boolean;
}

export const ImageActionButtons: FC<ImageActionButtonsProps> = ({ onRemove, onChange, disabled = false }) => (
  <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] rounded-xl" />
    <RoundActionButton className="relative z-10" disabled={disabled} onClick={onRemove}>
      <Trash2 className="w-4 h-4 text-destructive" />
    </RoundActionButton>
    <RoundActionButton className="relative z-10" disabled={disabled} onClick={onChange}>
      <ImagePlus className="w-4 h-4 text-primary" />
    </RoundActionButton>
  </div>
);
