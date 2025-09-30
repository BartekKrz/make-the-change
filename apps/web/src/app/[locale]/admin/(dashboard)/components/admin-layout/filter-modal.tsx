'use client';
import { Filter, X } from 'lucide-react';
import { type FC, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerTitle,
  DrawerClose,
} from '../ui/drawer';

type FilterButtonProps = {
  onClick: () => void;
  isActive?: boolean;
};

const FilterButton: FC<FilterButtonProps> = ({ onClick, isActive = false }) => (
  <Button
    size="sm"
    variant={isActive ? 'default' : 'outline'}
    className={`focus-visible:ring-primary relative h-9 w-9 p-0 focus-visible:ring-2 focus-visible:ring-offset-1 ${
      isActive ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
    }`}
    onClick={onClick}
  >
    <Filter className="h-4 w-4" />
  </Button>
);

type FilterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const FilterModal: FC<FilterModalProps> = ({ isOpen, onClose, children }) => (
  <Drawer open={isOpen} onOpenChange={open => !open && onClose()}>
    <DrawerContent className="bg-white" onSwipeClose={onClose}>
      <DrawerHeader>
        <DrawerTitle>Filtres</DrawerTitle>
        <DrawerClose asChild>
          <Button className="h-8 w-8 p-0" size="sm" variant="ghost">
            <X className="h-4 w-4" />
          </Button>
        </DrawerClose>
      </DrawerHeader>
      <DrawerBody>{children}</DrawerBody>
    </DrawerContent>
  </Drawer>
);

export { FilterButton, FilterModal };
