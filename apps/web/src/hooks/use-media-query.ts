'use client';

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Listen for changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// todo a supprimer car on peut le faire avec tailwind
// marquer comme déprecié
// Hook spécifique pour détecter mobile
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}
