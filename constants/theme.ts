/**
 * Premium theme configuration for Amazon Bestsellers Explorer
 * Features: Modern color palette, glassmorphism, smooth gradients
 */

import { Platform } from 'react-native';

const tintColorLight = '#FF9900';
const tintColorDark = '#FFB84D';

export const Colors = {
  light: {
    // Core colors
    text: '#1A1A1A',
    textSecondary: '#5A5A5A',
    background: '#F5F7FA',
    tint: tintColorLight,
    icon: '#6B7280',

    // Tab bar
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,

    // Cards & surfaces
    cardBackground: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.08)',
    cardHover: '#FAFBFC',

    // Borders
    border: '#E5E7EB',
    borderLight: 'rgba(255, 153, 0, 0.2)',
    borderFocus: tintColorLight,

    // Accent colors
    accent: '#FF9900',
    accentLight: 'rgba(255, 153, 0, 0.1)',
    accentSecondary: '#232F3E',

    // Status colors
    success: '#10B981',
    successLight: 'rgba(16, 185, 129, 0.1)',
    warning: '#F59E0B',
    warningLight: 'rgba(245, 158, 11, 0.1)',
    error: '#EF4444',
    errorLight: 'rgba(239, 68, 68, 0.08)',

    // Prime blue
    prime: '#00A8E1',
    primeLight: 'rgba(0, 168, 225, 0.1)',
    primeDark: '#0088BB',

    // Gradients
    gradientStart: '#FF9900',
    gradientMiddle: '#FF6B00',
    gradientEnd: '#232F3E',

    // Glassmorphism
    glassBg: 'rgba(255, 255, 255, 0.85)',
    glassOverlay: 'rgba(255, 255, 255, 0.4)',
    glassBorder: 'rgba(255, 255, 255, 0.5)',

    // Shimmer
    shimmerBase: '#E5E7EB',
    shimmerHighlight: '#F3F4F6',

    // Chips
    chipBg: '#F3F4F6',
    chipActiveBg: '#FF9900',
    chipActiveText: '#FFFFFF',
    chipHoverBg: '#E5E7EB',

    // Premium accents
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32',

    // Featured sections
    featuredBg: 'linear-gradient(135deg, #FF9900 0%, #FF6B00 100%)',
    featuredText: '#FFFFFF',
  },
  dark: {
    // Core colors
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    background: '#0A0A0F',
    tint: tintColorDark,
    icon: '#9CA3AF',

    // Tab bar
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,

    // Cards & surfaces
    cardBackground: '#141419',
    cardShadow: 'rgba(0, 0, 0, 0.5)',
    cardHover: '#1A1A22',

    // Borders
    border: '#27272A',
    borderLight: 'rgba(255, 184, 77, 0.15)',
    borderFocus: tintColorDark,

    // Accent colors
    accent: '#FFB84D',
    accentLight: 'rgba(255, 184, 77, 0.15)',
    accentSecondary: '#3B4252',

    // Status colors
    success: '#34D399',
    successLight: 'rgba(52, 211, 153, 0.15)',
    warning: '#FBBF24',
    warningLight: 'rgba(251, 191, 36, 0.15)',
    error: '#F87171',
    errorLight: 'rgba(248, 113, 113, 0.12)',

    // Prime blue
    prime: '#38BDF8',
    primeLight: 'rgba(56, 189, 248, 0.15)',
    primeDark: '#0EA5E9',

    // Gradients
    gradientStart: '#FFB84D',
    gradientMiddle: '#FF8C00',
    gradientEnd: '#0F0F14',

    // Glassmorphism
    glassBg: 'rgba(20, 20, 25, 0.9)',
    glassOverlay: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',

    // Shimmer
    shimmerBase: '#1F1F28',
    shimmerHighlight: '#2A2A35',

    // Chips
    chipBg: '#1F1F28',
    chipActiveBg: '#FFB84D',
    chipActiveText: '#0A0A0F',
    chipHoverBg: '#27272F',

    // Premium accents
    gold: '#FFD700',
    silver: '#E5E5E5',
    bronze: '#E0A875',

    // Featured sections
    featuredBg: 'linear-gradient(135deg, #FFB84D 0%, #FF8C00 100%)',
    featuredText: '#0A0A0F',
  },
};

// Premium shadows for different elevations
export const Shadows = Platform.select({
  ios: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
    },
    glow: (color: string) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
    }),
  },
  android: {
    small: { elevation: 3 },
    medium: { elevation: 8 },
    large: { elevation: 16 },
    glow: () => ({ elevation: 8 }),
  },
  default: {
    small: { elevation: 3 },
    medium: { elevation: 8 },
    large: { elevation: 16 },
    glow: () => ({ elevation: 8 }),
  },
});

// Premium border radii
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

// Premium spacing scale
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
