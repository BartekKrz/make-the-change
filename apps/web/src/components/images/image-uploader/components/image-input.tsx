import { type ChangeEvent, forwardRef } from 'react';

type ImageInputProps =  {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  multiple?: boolean;
  disabled?: boolean;
}

export const ImageInput = forwardRef<HTMLInputElement, ImageInputProps>(
  ({ onChange, className = '', multiple = false, disabled = false }, ref) => (
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        console.log('🎯 [ImageInput] onChange déclenché, files:', e.target.files);
        onChange(e);
      }}
      className={`absolute inset-0 w-full h-full opacity-0 z-[-1] ${className}`}
      ref={ref}
      aria-label="Télécharger une image"
      multiple={multiple}
      disabled={disabled}
    />
  )
);

ImageInput.displayName = 'ImageInput';
