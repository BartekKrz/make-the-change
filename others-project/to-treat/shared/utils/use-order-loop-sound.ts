import { SoundAlert } from '@/src/constants';
import { useSound } from '@/src/utils/use-sound';
import { useEffect } from 'react';

/**
 * Play a sound and every 30 seconds afterwards
 */
export const useOrderLoopSound = () => {
  const { playAsync, isLoaded, isError } = useSound(SoundAlert);

  useEffect(() => {
    if (!isLoaded || isError) return;

    playAsync();

    const interval = setInterval(() => {
      playAsync();
    }, 30_000);

    return () => {
      clearInterval(interval);
    };
  }, [isLoaded, isError]);
};
