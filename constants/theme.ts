/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#FF9900';
const tintColorDark = '#FFB84D';

export const Colors = {
  light: {
    text: '#1a1a1a',
    textSecondary: '#666666',
    background: '#F8F9FA',
    tint: tintColorLight,
    icon: '#666666',
    tabIconDefault: '#999999',
    tabIconSelected: tintColorLight,
    cardBackground: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.08)',
    border: '#E8E8E8',
    borderLight: 'rgba(255, 153, 0, 0.2)',
    accent: '#FF9900',
    accentSecondary: '#232F3E',
    success: '#00A86B',
    successLight: 'rgba(0, 168, 107, 0.1)',
    warning: '#FF6B35',
    error: '#E53E3E',
    prime: '#00A8E1',
    primeLight: 'rgba(0, 168, 225, 0.1)',
    gradientStart: '#FF9900',
    gradientMiddle: '#FF6B00',
    gradientEnd: '#232F3E',
    glassBg: 'rgba(255, 255, 255, 0.85)',
    glassOverlay: 'rgba(255, 255, 255, 0.4)',
    shimmerBase: '#E8E8E8',
    shimmerHighlight: '#F5F5F5',
    chipBg: '#F0F0F0',
    chipActiveBg: '#FF9900',
    chipActiveText: '#FFFFFF',
  },
  dark: {
    text: '#F5F5F5',
    textSecondary: '#A0A0A0',
    background: '#0A0A0A',
    tint: tintColorDark,
    icon: '#B0B0B0',
    tabIconDefault: '#606060',
    tabIconSelected: tintColorDark,
    cardBackground: '#141414',
    cardShadow: 'rgba(0, 0, 0, 0.6)',
    border: '#252525',
    borderLight: 'rgba(255, 184, 77, 0.15)',
    accent: '#FFB84D',
    accentSecondary: '#37475A',
    success: '#00D9A5',
    successLight: 'rgba(0, 217, 165, 0.15)',
    warning: '#FF8C5A',
    error: '#FF6B6B',
    prime: '#00D4FF',
    primeLight: 'rgba(0, 212, 255, 0.15)',
    gradientStart: '#FFB84D',
    gradientMiddle: '#FF8C00',
    gradientEnd: '#1A1A1A',
    glassBg: 'rgba(20, 20, 20, 0.9)',
    glassOverlay: 'rgba(255, 255, 255, 0.05)',
    shimmerBase: '#1E1E1E',
    shimmerHighlight: '#2A2A2A',
    chipBg: '#1E1E1E',
    chipActiveBg: '#FFB84D',
    chipActiveText: '#0A0A0A',
  },
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
