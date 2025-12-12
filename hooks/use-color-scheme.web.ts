import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme(): 'light' | 'dark' {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { colorScheme } = useTheme();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Return theme context colorScheme after hydration, otherwise default to 'light' for SSR
  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
