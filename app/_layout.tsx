import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import 'react-native-reanimated';

import { SplashScreen as CustomSplashScreen } from '@/components/SplashScreen';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { useAllCategories } from '@/hooks/useAllCategories';
import { cacheService } from '@/services/cacheService';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const { colorScheme } = useTheme();
  const cleanupIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const minSplashTimeRef = useRef<number>(Date.now());

  // Clean up expired cache on app startup and periodically
  useEffect(() => {
    const performCleanup = () => {
      cacheService.cleanupExpired().catch(err => {
        console.error('[App] Failed to cleanup expired cache:', err);
      });
    };

    // Initial cleanup on startup
    performCleanup();

    // Set up periodic cleanup every hour to catch expired cache
    cleanupIntervalRef.current = setInterval(performCleanup, 60 * 60 * 1000); // Every hour

    // Also check when app comes to foreground
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        performCleanup();
      }
    });

    return () => {
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
      }
      subscription.remove();
    };
  }, []);

  // Pre-fetch all categories on app launch
  useAllCategories();

  // Initialize app and hide splash screen when ready
  useEffect(() => {
    async function prepare() {
      try {
        // Wait for minimum splash time (1.5 seconds) for smooth UX
        const elapsed = Date.now() - minSplashTimeRef.current;
        const minDisplayTime = 1500;
        const remainingTime = Math.max(0, minDisplayTime - elapsed);

        await new Promise(resolve => setTimeout(resolve, remainingTime));

        // Mark app as ready
        setAppIsReady(true);

        // Wait a bit more for custom splash fade-out animation
        await new Promise(resolve => setTimeout(resolve, 400));

        // Hide native splash screen
        await SplashScreen.hideAsync();

        // Hide custom splash screen
        setShowSplash(false);
      } catch (e) {
        console.error('[App] Error during app initialization:', e);
        // Still hide splash even if there's an error
        setAppIsReady(true);
        await SplashScreen.hideAsync();
        setShowSplash(false);
      }
    }

    prepare();
  }, []);

  return (
    <>
      {showSplash && <CustomSplashScreen />}
      {appIsReady && (
        <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </NavigationThemeProvider>
      )}
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
