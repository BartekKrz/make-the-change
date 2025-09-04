'use client';
import { FC, type ReactNode } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerTitle,
  DrawerClose,
} from '../ui/drawer';

// Version avec props - plus explicite et testable
type FilterButtonProps = {
  onClick: () => void;
};

const FilterButton: FC<FilterButtonProps> = ({ onClick }) => {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={onClick}
      className="h-9 w-9 p-0 relative focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
    >
      <Filter className="h-4 w-4" />
    </Button>
  );
};


type FilterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const FilterModal: FC<FilterModalProps> = ({ isOpen, onClose, children }) => (
  <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <DrawerContent onSwipeClose={onClose}>
      <DrawerHeader>
        <DrawerTitle>Filtres</DrawerTitle>
        <DrawerClose asChild>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            ×
          </Button>
        </DrawerClose>
      </DrawerHeader>
      <DrawerBody>
        {children}
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);

export { FilterButton, FilterModal };
