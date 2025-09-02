import Image from 'next/image';
import { ImageActionButtons } from './ImageActionButtons';
import { cn } from '@/lib/utils';

interface ImageDisplayProps {
  src: string;
  onRemove: () => void;
  onChange: () => void;
  disabled?: boolean;
  className?: string;
}

export const ImageDisplay = ({ 
  src, 
  onRemove, 
  onChange, 
  disabled = false,
  className = ''
}: ImageDisplayProps) => (
  <div className={cn('relative group w-full h-full', className)}>
    <Image
      src={src}
      alt="Image uploadée"
      fill
      className="rounded-xl object-cover shadow-lg"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
    {!disabled && (
      <ImageActionButtons 
        onRemove={onRemove} 
        onChange={onChange} 
        disabled={disabled}
      />
    )}
  </div>
);
