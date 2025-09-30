'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  useState,
} from 'react';

import { cn } from '@/lib/utils';

const Drawer = DialogPrimitive.Root;

const DrawerTrigger = DialogPrimitive.Trigger;

const DrawerPortal = DialogPrimitive.Portal;

const DrawerClose = DialogPrimitive.Close;

const DrawerOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
      className
    )}
    {...props}
  />
));
DrawerOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DrawerContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    onSwipeClose?: () => void;
  }
>(({ className, children, onSwipeClose, ...props }, ref) => {
  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === null) return;

    const currentTouchY = e.touches[0].clientY;
    setCurrentY(currentTouchY);

    const diff = currentTouchY - startY;
    // Seulement permettre le swipe vers le bas
    if (diff > 0) {
      setTranslateY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (startY === null || currentY === null) return;

    const diff = currentY - startY;

    // Si swipe vers le bas > 100px, fermer le drawer
    if (diff > 100) {
      onSwipeClose?.();
    }

    // Reset des valeurs
    setStartY(null);
    setCurrentY(null);
    setTranslateY(0);
  };

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'overlay-sheet data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom fixed right-0 bottom-0 left-0 z-50 flex max-h-[85vh] flex-col duration-300',
          className
        )}
        style={{
          transform: translateY > 0 ? `translateY(${translateY}px)` : undefined,
          transition: translateY > 0 ? 'none' : undefined,
        }}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        {...props}
      >
        {/* Handle visuel pour indiquer qu'on peut swiper */}
        <div className="flex justify-center p-2">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>
        {children}
      </DialogPrimitive.Content>
    </DrawerPortal>
  );
});
DrawerContent.displayName = DialogPrimitive.Content.displayName;

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'border-border flex items-center justify-between border-b p-4',
      className
    )}
    {...props}
  />
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex-1 overflow-y-auto p-4', className)} {...props} />
);
DrawerBody.displayName = 'DrawerBody';

const DrawerTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold', className)}
    {...props}
  />
));
DrawerTitle.displayName = DialogPrimitive.Title.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerTitle,
};
