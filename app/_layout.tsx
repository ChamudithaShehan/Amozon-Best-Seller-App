import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import 'react-native-reanimated';

import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { useAllCategories } from '@/hooks/useAllCategories';
import { cacheService } from '@/services/cacheService';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const { colorScheme } = useTheme();
  const cleanupIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
