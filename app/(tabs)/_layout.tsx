import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

export default function TabLayout() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  return (
    <Tabs
      key={colorScheme}
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.cardBackground,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
            },
            android: {
              elevation: 16,
            },
            web: {
              boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
          letterSpacing: 0.2,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Bestsellers',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={24}
              name={focused ? "house.fill" : "house"}
              color={color || colors.tabIconDefault}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={24}
              name={focused ? "sparkles" : "sparkle"}
              color={color || colors.tabIconDefault}
            />
          ),
        }}
      />
    </Tabs>
  );
}
