import Image from 'next/image';
import { type FC } from 'react';

import { cn } from '@/lib/utils';

import { ImageActionButtons } from './image-action-buttons';

type ImageDisplayProps = {
  src: string;
  onRemove: () => void;
  onChange: () => void;
  disabled?: boolean;
  className?: string;
};

export const ImageDisplay: FC<ImageDisplayProps> = ({
  src,
  onRemove,
  onChange,
  disabled = false,
  className = '',
}) => (
  <div className={cn('group relative h-full w-full', className)}>
    <Image
      fill
      alt="Image uploadée"
      className="rounded-xl object-cover shadow-lg"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      src={src}
    />
    {!disabled && (
      <ImageActionButtons
        disabled={disabled}
        onChange={onChange}
        onRemove={onRemove}
      />
    )}
  </div>
);
