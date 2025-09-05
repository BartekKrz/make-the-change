import { RoundActionButton } from './round-action-button';
import { Trash2, ImagePlus } from 'lucide-react';

interface ImageActionButtonsProps {
  onRemove: () => void;
  onChange: () => void;
  disabled?: boolean;
}

export const ImageActionButtons = ({ 
  onRemove, 
  onChange, 
  disabled = false 
}: ImageActionButtonsProps) => (
  <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] rounded-xl" />
    <RoundActionButton onClick={onRemove} disabled={disabled} className="relative z-10">
      <Trash2 className="w-4 h-4 text-destructive" />
    </RoundActionButton>
    <RoundActionButton onClick={onChange} disabled={disabled} className="relative z-10">
      <ImagePlus className="w-4 h-4 text-primary" />
    </RoundActionButton>
  </div>
);
