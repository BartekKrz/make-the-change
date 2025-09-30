'use client';

import { useFieldContext } from '@/app/[locale]/admin/(dashboard)/components/form/form-context';
import { ImageUploaderField } from '@/app/[locale]/admin/(dashboard)/components/images/image-uploader';

export type FormImagesUploaderProps = {
  productId?: string;
  multiple?: boolean;
  disabled?: boolean;
  width?: string;
  height?: string;
};

export const FormImagesUploader = ({
  productId,
  multiple = true,
  disabled = false,
  width = 'w-full',
  height = 'h-48',
}: FormImagesUploaderProps) => {
  const field = useFieldContext<string[]>();
  const value = field.state.value || [];

  return (
    <ImageUploaderField
      disabled={disabled}
      height={height}
      multiple={multiple}
      productId={productId}
      width={width}
      field={{
        state: { value },
        handleChange: updater => {
          const next = typeof updater === 'function' ? updater(value) : updater;
          field.handleChange(next);
        },
      }}
      onImagesChange={images => field.handleChange(images)}
    />
  );
};
