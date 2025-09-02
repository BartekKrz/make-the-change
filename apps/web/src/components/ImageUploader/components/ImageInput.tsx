import { forwardRef } from 'react';

interface ImageInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  multiple?: boolean;
  disabled?: boolean;
}

export const ImageInput = forwardRef<HTMLInputElement, ImageInputProps>(
  ({ onChange, className = '', multiple = false, disabled = false }, ref) => (
    <input
      type="file"
      accept="image/*"
      onChange={onChange}
      className={`absolute inset-0 w-full h-full opacity-0 z-[-1] ${className}`}
      ref={ref}
      aria-label="Télécharger une image"
      multiple={multiple}
      disabled={disabled}
    />
  )
);

ImageInput.displayName = 'ImageInput';
