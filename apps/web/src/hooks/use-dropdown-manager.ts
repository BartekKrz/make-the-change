'use client';

import { useEffect, useRef, useCallback } from 'react';

// Global state pour gérer un seul dropdown ouvert
let activeDropdownId: string | null = null;
const dropdownCallbacks = new Map<string, () => void>();

export const useDropdownManager = (dropdownId: string) => {
  const isActiveRef = useRef(false);

  const openDropdown = useCallback(() => {
    // Fermer le dropdown actuel s'il y en a un
    if (activeDropdownId && activeDropdownId !== dropdownId) {
      const closeCallback = dropdownCallbacks.get(activeDropdownId);
      if (closeCallback) {
        closeCallback();
      }
    }
    
    // Ouvrir ce dropdown
    activeDropdownId = dropdownId;
    isActiveRef.current = true;
  }, [dropdownId]);

  const closeDropdown = useCallback(() => {
    if (activeDropdownId === dropdownId) {
      activeDropdownId = null;
    }
    isActiveRef.current = false;
  }, [dropdownId]);

  const registerCloseCallback = useCallback((callback: () => void) => {
    dropdownCallbacks.set(dropdownId, callback);
  }, [dropdownId]);

  const unregisterCloseCallback = useCallback(() => {
    dropdownCallbacks.delete(dropdownId);
  }, [dropdownId]);

  const isActive = activeDropdownId === dropdownId;

  // Global click handler pour fermer tous les dropdowns
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      // Si ce dropdown est actif, on vérifie si le clic est en dehors
      if (isActive) {
        const target = event.target as Element;
        const dropdownElement = document.querySelector(`[data-dropdown-id="${dropdownId}"]`);
        
        if (dropdownElement && !dropdownElement.contains(target)) {
          closeDropdown();
          const callback = dropdownCallbacks.get(dropdownId);
          if (callback) {
            callback();
          }
        }
      }
    };

    if (isActive) {
      document.addEventListener('click', handleGlobalClick, true);
      return () => document.removeEventListener('click', handleGlobalClick, true);
    }
  }, [isActive, dropdownId, closeDropdown]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unregisterCloseCallback();
      if (activeDropdownId === dropdownId) {
        activeDropdownId = null;
      }
    };
  }, [dropdownId, unregisterCloseCallback]);

  return {
    isActive,
    openDropdown,
    closeDropdown,
    registerCloseCallback,
    unregisterCloseCallback
  };
};