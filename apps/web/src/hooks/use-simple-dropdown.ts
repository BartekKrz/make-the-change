'use client';

import { useEffect, useRef, useState } from 'react';

export const useSimpleDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number }>({ 
    top: 0, 
    left: 0, 
    width: 0 
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  const open = () => {
    updatePosition();
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);
  const toggle = () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  };

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return {
    isOpen,
    open,
    close,
    toggle,
    containerRef,
    dropdownPosition
  };
};