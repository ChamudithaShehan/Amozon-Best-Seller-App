import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { PriceInsightsModal } from '@/components/PriceInsightsModal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TopRatedModal } from '@/components/TopRatedModal';
import { TrendingModal } from '@/components/TrendingModal';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAllCategories } from '@/hooks/useAllCategories';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  colors: typeof Colors.light;
  onPress?: () => void;
  loading?: boolean;
}

function FeatureCard({ icon, title, description, colors, onPress, loading }: FeatureCardProps) {
  return (
    <TouchableOpacity
      style={[styles.featureCard, {
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={loading}
    >
      <View style={[styles.featureIconContainer, { backgroundColor: colors.primeLight }]}>
        <ThemedText style={styles.featureIcon}>{icon}</ThemedText>
      </View>
      <View style={styles.featureContent}>
        <ThemedText style={styles.featureTitle}>{title}</ThemedText>
        <ThemedText style={[styles.featureDescription, { color: colors.textSecondary }]}>
          {description}
        </ThemedText>
      </View>
      {loading ? (
        <ThemedText style={styles.loadingDots}>...</ThemedText>
      ) : (
        <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
}

export default function ExploreScreen() {
  const { colorScheme, themeMode, setThemeMode, toggleTheme } = useTheme();
  const colors = Colors[colorScheme];
  const router = useRouter();

  const {
    loading,
    trendingProducts,
    priceInsights,
    topRatedProducts,
    lastUpdated
  } = useAllCategories();

  // Modal states
  const [trendingModalVisible, setTrendingModalVisible] = useState(false);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [topRatedModalVisible, setTopRatedModalVisible] = useState(false);

  const handleBrowseCategories = () => {
    router.push('/');
  };

  const getLastUpdatedText = () => {
    if (!lastUpdated) return 'Not yet loaded';
    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return lastUpdated.toLocaleDateString();
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: colors.background,
        dark: colors.background
      }}
      headerImage={undefined}>

      {/* Title Section */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.mainTitle}>
          Features & Capabilities
        </ThemedText>
        <View style={styles.subtitleRow}>
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
            Explore bestseller insights
          </ThemedText>
          {lastUpdated && (
            <ThemedText style={[styles.lastUpdated, { color: colors.textSecondary }]}>
              Updated {getLastUpdatedText()}
            </ThemedText>
          )}
        </View>
      </ThemedView>

      {/* Feature Cards */}
      <View style={styles.featuresContainer}>
        <FeatureCard
          icon="📈"
          title="Trending Products"
          description={`Top #1 products from ${trendingProducts.length} categories`}
          colors={colors}
          onPress={() => setTrendingModalVisible(true)}
          loading={loading}
        />
        <FeatureCard
          icon="📊"
          title="Price Insights"
          description={`Pricing data from ${priceInsights.filter(p => p.avgPrice > 0).length} categories`}
          colors={colors}
          onPress={() => setPriceModalVisible(true)}
          loading={loading}
        />
        <FeatureCard
          icon="⭐"
          title="Top Rated"
          description={`${topRatedProducts.length} highest rated products`}
          colors={colors}
          onPress={() => setTopRatedModalVisible(true)}
          loading={loading}
        />
        <FeatureCard
          icon="🔍"
          title="Browse Categories"
          description="Go to Bestsellers tab to explore"
          colors={colors}
          onPress={handleBrowseCategories}
        />
      </View>

      {/* Settings Section */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Settings
        </ThemedText>
      </ThemedView>

      {/* Theme Switcher */}
      <View style={[styles.settingsCard, {
        backgroundColor: colors.cardBackground,
        borderColor: colors.border
      }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <View style={[styles.settingIconBg, { backgroundColor: colors.primeLight }]}>
              <ThemedText style={styles.settingIcon}>
                {colorScheme === 'dark' ? '🌙' : '☀️'}
              </ThemedText>
            </View>
            <View>
              <ThemedText style={styles.settingLabel}>Dark Mode</ThemedText>
              <ThemedText style={[styles.settingDescription, { color: colors.textSecondary }]}>
                {themeMode === 'system' ? 'Following system' : themeMode === 'dark' ? 'Always dark' : 'Always light'}
              </ThemedText>
            </View>
          </View>
          <Switch
            value={colorScheme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.prime }}
            thumbColor={colorScheme === 'dark' ? colors.accent : '#FFFFFF'}
          />
        </View>

        {/* Theme Mode Selector */}
        <View style={styles.themeModeSelector}>
          {(['light', 'system', 'dark'] as const).map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => setThemeMode(mode)}
              style={[
                styles.themeModeButton,
                {
                  backgroundColor: themeMode === mode ? colors.prime : 'transparent',
                  borderColor: themeMode === mode ? colors.prime : colors.border,
                }
              ]}
            >
              <ThemedText style={[
                styles.themeModeText,
                { color: themeMode === mode ? '#FFFFFF' : colors.text }
              ]}>
                {mode === 'light' ? '☀️ Light' : mode === 'dark' ? '🌙 Dark' : '📱 System'}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* App Info Footer */}
      <ThemedView style={[styles.appInfoContainer, { borderColor: colors.border }]}>
        <View style={styles.appInfoRow}>
          <ThemedText style={[styles.appInfoLabel, { color: colors.textSecondary }]}>Version</ThemedText>
          <ThemedText style={styles.appInfoValue}>1.0.0</ThemedText>
        </View>
        <View style={styles.appInfoRow}>
          <ThemedText style={[styles.appInfoLabel, { color: colors.textSecondary }]}>Built with</ThemedText>
          <ThemedText style={styles.appInfoValue}>Expo + React Native</ThemedText>
        </View>
        <View style={styles.appInfoRow}>
          <ThemedText style={[styles.appInfoLabel, { color: colors.textSecondary }]}>Data Source</ThemedText>
          <ThemedText style={styles.appInfoValue}>Rainforest API</ThemedText>
        </View>
        <View style={styles.appInfoRow}>
          <ThemedText style={[styles.appInfoLabel, { color: colors.textSecondary }]}>Categories</ThemedText>
          <ThemedText style={styles.appInfoValue}>11 Active</ThemedText>
        </View>
      </ThemedView>

      {/* Modals */}
      <TrendingModal
        visible={trendingModalVisible}
        onClose={() => setTrendingModalVisible(false)}
        trendingProducts={trendingProducts}
        colorScheme={colorScheme}
      />
      <PriceInsightsModal
        visible={priceModalVisible}
        onClose={() => setPriceModalVisible(false)}
        priceInsights={priceInsights}
        colorScheme={colorScheme}
      />
      <TopRatedModal
        visible={topRatedModalVisible}
        onClose={() => setTopRatedModalVisible(false)}
        topRatedProducts={topRatedProducts}
        colorScheme={colorScheme}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    gap: 8,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  lastUpdated: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 32,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      },
    }),
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  loadingDots: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionContainer: {
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  settingsCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    gap: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 20,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  settingDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  themeModeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  themeModeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeModeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  appInfoContainer: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
    marginBottom: 24,
  },
  appInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appInfoLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  appInfoValue: {
    fontSize: 13,
    fontWeight: '600',
  },
});
