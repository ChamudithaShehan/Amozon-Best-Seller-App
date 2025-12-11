// Re-export the theme hook from context for consistent usage across the app
// This hook returns the current color scheme ('light' or 'dark') based on:
// 1. User's manual preference (if set)
// 2. System default (if set to 'system' mode)

export { useColorScheme } from 'react-native';

// For components that need the full theme context (including setThemeMode),
// import { useTheme } from '@/contexts/ThemeContext' directly
