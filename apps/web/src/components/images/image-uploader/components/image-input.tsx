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
      ref={ref}
      accept="image/*"
      aria-label="Télécharger une image"
      className={`absolute inset-0 w-full h-full opacity-0 z-[-1] ${className}`}
      disabled={disabled}
      multiple={multiple}
      type="file"
      onChange={(e) => {
        onChange(e);
      }}
    />
  )
);

ImageInput.displayName = 'ImageInput';
