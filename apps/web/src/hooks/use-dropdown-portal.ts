'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import React from 'react';

export const useDropdownPortal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);

  // S'assurer qu'on est côté client
  useEffect(() => {
    setMounted(true);
    
    // Créer le conteneur portal s'il n'existe pas
    let portalRoot = document.getElementById('dropdown-portal');
    if (!portalRoot) {
      portalRoot = document.createElement('div');
      portalRoot.id = 'dropdown-portal';
      portalRoot.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 999999;
      `;
      document.body.appendChild(portalRoot);
    }
    
    portalRef.current = portalRoot;
  }, []);

  const updatePosition = () => {
    if (triggerRef.current) {
      // Chercher l'input dans le conteneur, ou utiliser le conteneur principal s'il a une classe avec 'rounded-lg'
      const inputContainer = triggerRef.current.querySelector('.rounded-lg') as HTMLElement;
      const targetElement = inputContainer || triggerRef.current;
      
      const rect = targetElement.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 2, // +2 pour un petit espacement
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  const open = () => {
    updatePosition();
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const toggle = () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  };

  // Click outside handler
  useEffect(() => {
    if (!isOpen || !mounted) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        // Vérifier si le clic est dans le dropdown portal
        const portalContent = document.querySelector('#dropdown-portal .dropdown-content');
        if (portalContent && !portalContent.contains(event.target as Node)) {
          close();
        } else if (!portalContent) {
          close();
        }
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, mounted]);

  const renderInPortal = (content: React.ReactNode) => {
    if (!mounted || !portalRef.current || !isOpen) return null;
    
    return createPortal(
      React.createElement('div', {
        className: 'dropdown-content',
        style: {
          position: 'absolute',
          top: position.top,
          left: position.left,
          width: position.width,
          pointerEvents: 'auto'
        }
      }, content),
      portalRef.current
    );
  };

  return {
    isOpen,
    open,
    close,
    toggle,
    triggerRef,
    renderInPortal,
    position
  };
};