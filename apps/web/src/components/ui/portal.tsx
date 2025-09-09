'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  containerId?: string;
}

export const Portal: React.FC<PortalProps> = ({ 
  children, 
  containerId = 'dropdown-portal-root' 
}) => {
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let portalRoot = document.getElementById(containerId);
    
    if (!portalRoot) {
      portalRoot = document.createElement('div');
      portalRoot.id = containerId;
      portalRoot.style.position = 'relative';
      portalRoot.style.zIndex = '9999';
      document.body.appendChild(portalRoot);
    }
    
    setContainer(portalRoot);
    setMounted(true);

    return () => {
      // Ne pas supprimer le conteneur car d'autres portals pourraient l'utiliser
    };
  }, [containerId]);

  if (!mounted || !container) {
    return null;
  }

  return createPortal(children, container);
};