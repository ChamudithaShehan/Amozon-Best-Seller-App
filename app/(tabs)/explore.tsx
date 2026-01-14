import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { PriceInsightsModal } from '@/components/PriceInsightsModal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TopRatedModal } from '@/components/TopRatedModal';
import { TrendingModal } from '@/components/TrendingModal';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAllCategories } from '@/hooks/useAllCategories';
import { cacheService } from '@/services/cacheService';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  colors: typeof Colors.light;
  colorScheme: 'light' | 'dark';
  onPress?: () => void;
  loading?: boolean;
  accentColor?: string;
}

function FeatureCard({ icon, title, description, colors, colorScheme, onPress, loading, accentColor }: FeatureCardProps) {
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
      {/* Accent gradient overlay */}
      <LinearGradient
        colors={[`${accentColor || colors.prime}10`, 'transparent']}
        style={styles.featureGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={[styles.featureIconContainer, { backgroundColor: `${accentColor || colors.prime}15` }]}>
        <ThemedText style={styles.featureIcon}>{icon}</ThemedText>
      </View>
      <View style={styles.featureContent}>
        <ThemedText style={styles.featureTitle}>{title}</ThemedText>
        <ThemedText style={[styles.featureDescription, { color: colors.textSecondary }]}>
          {description}
        </ThemedText>
      </View>
      <View style={[styles.featureArrow, { backgroundColor: colors.chipBg }]}>
        {loading ? (
          <ThemedText style={styles.loadingDots}>...</ThemedText>
        ) : (
          <IconSymbol name="chevron.right" size={14} color={colors.textSecondary} />
        )}
      </View>
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
    lastUpdated,
    refetchAll
  } = useAllCategories();

  // Modal states
  const [trendingModalVisible, setTrendingModalVisible] = useState(false);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [topRatedModalVisible, setTopRatedModalVisible] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [researchComplete, setResearchComplete] = useState(false);
  const [researchError, setResearchError] = useState<string | null>(null);

  const handleBrowseCategories = () => {
    router.push('/');
  };

  const handleResearchProducts = () => {
    setResearchComplete(false);
    setResearchError(null);
    setConfirmModalVisible(true);
  };

  const confirmResearch = async () => {
    setConfirmModalVisible(false);
    setClearingCache(true);
    try {
      await cacheService.clearAll();
      await refetchAll();
      setResearchComplete(true);
      setConfirmModalVisible(true);
    } catch (error) {
      setResearchError('Unable to fetch new data. Please check your internet connection and try again.');
      setConfirmModalVisible(true);
      console.error('[Explore] Error researching products:', error);
    } finally {
      setClearingCache(false);
    }
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
        light: colors.gradientStart,
        dark: colors.gradientEnd
      }}
      headerImage={
        <View style={styles.headerContent}>
          <LinearGradient
            colors={colorScheme === 'light'
              ? ['#FF9900', '#FF6B00', '#FF5500']
              : ['#1A1A2E', '#16213E', '#0F3460']
            }
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Decorative Elements */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />

            <View style={styles.headerInner}>
              <View style={styles.logoContainer}>
                <View style={styles.logoIconWrapper}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                    style={styles.logoGradient}
                  />
                  <Text style={styles.logoEmoji}>🚀</Text>
                </View>
                <View style={styles.logoTextContainer}>
                  <Text style={styles.headerTitle}>Explore</Text>
                  {/* <View style={styles.smileLine} /> */}
                </View>
              </View>
              <Text style={styles.headerSubtitle}>FEATURES & INSIGHTS</Text>
              {lastUpdated && (
                <View style={styles.headerInfoRow}>
                  <View style={styles.updateBadge}>
                    <Text style={styles.updateIcon}>🕐</Text>
                    <Text style={styles.updateText}>
                      Updated {getLastUpdatedText()}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>
      }>

      {/* Title Section */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.mainTitle}>
          Features & Capabilities
        </ThemedText>
        <View style={styles.subtitleRow}>
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
            Explore bestseller insights and analytics
          </ThemedText>
        </View>
      </ThemedView>

      {/* Feature Cards */}
      <View style={styles.featuresContainer}>
        <FeatureCard
          icon="📈"
          title="Trending Products"
          description={`Top #1 products from ${trendingProducts.length} categories`}
          colors={colors}
          colorScheme={colorScheme}
          onPress={() => setTrendingModalVisible(true)}
          loading={loading}
          accentColor="#10B981"
        />
        <FeatureCard
          icon="📊"
          title="Price Insights"
          description={`Pricing data from ${priceInsights.filter(p => p.avgPrice > 0).length} categories`}
          colors={colors}
          colorScheme={colorScheme}
          onPress={() => setPriceModalVisible(true)}
          loading={loading}
          accentColor="#8B5CF6"
        />
        <FeatureCard
          icon="⭐"
          title="Top Rated"
          description={`${topRatedProducts.length} highest rated products`}
          colors={colors}
          colorScheme={colorScheme}
          onPress={() => setTopRatedModalVisible(true)}
          loading={loading}
          accentColor="#F59E0B"
        />
        <FeatureCard
          icon="🔍"
          title="Browse Categories"
          description="Go to Bestsellers tab to explore"
          colors={colors}
          colorScheme={colorScheme}
          onPress={handleBrowseCategories}
          accentColor={colors.prime}
        />
      </View>

      {/* Settings Section */}
      <ThemedView style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Settings
          </ThemedText>
          <View style={[styles.sectionBadge, { backgroundColor: colors.primeLight }]}>
            <ThemedText style={[styles.sectionBadgeText, { color: colors.prime }]}>
              Preferences
            </ThemedText>
          </View>
        </View>
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
              <ThemedText style={styles.settingLabel}>Appearance</ThemedText>
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

      {/* Research Products Card */}
      <View style={[styles.settingsCard, {
        backgroundColor: colors.cardBackground,
        borderColor: colors.border
      }]}>
        <TouchableOpacity
          onPress={handleResearchProducts}
          disabled={clearingCache}
          style={styles.clearCacheButton}
        >
          <View style={[styles.settingIconBg, { backgroundColor: colors.primeLight }]}>
            <ThemedText style={styles.settingIcon}>🔍</ThemedText>
          </View>
          <View style={styles.clearCacheInfo}>
            <ThemedText style={styles.settingLabel}>
              {clearingCache ? 'Researching...' : 'Research Best Products'}
            </ThemedText>
            <ThemedText style={[styles.settingDescription, { color: colors.textSecondary }]}>
              Fetch the latest bestseller rankings now
            </ThemedText>
          </View>
          <View style={[styles.clearCacheArrow, { backgroundColor: colors.primeLight }]}>
            <IconSymbol name="arrow.clockwise" size={16} color={colors.prime} />
          </View>
        </TouchableOpacity>
      </View>

      {/* App Info Footer */}
      <View style={[styles.appInfoContainer, {
        backgroundColor: colors.cardBackground,
        borderColor: colors.border
      }]}>
        <View style={styles.appInfoHeader}>
          <ThemedText style={styles.appInfoTitle}>App Information</ThemedText>
        </View>

        <View style={styles.appInfoGrid}>
          <View style={styles.appInfoItem}>
            <View style={[styles.appInfoIcon, { backgroundColor: colors.primeLight }]}>
              <ThemedText style={{ fontSize: 16 }}>📱</ThemedText>
            </View>
            <ThemedText style={[styles.appInfoLabel, { color: colors.textSecondary }]}>Version</ThemedText>
            <ThemedText style={styles.appInfoValue}>1.1.0</ThemedText>
          </View>

          <View style={styles.appInfoItem}>
            <View style={[styles.appInfoIcon, { backgroundColor: colors.successLight }]}>
              <ThemedText style={{ fontSize: 16 }}>⚡</ThemedText>
            </View>
            <ThemedText style={[styles.appInfoLabel, { color: colors.textSecondary }]}>Built with</ThemedText>
            <ThemedText style={styles.appInfoValue}>Expo + RN</ThemedText>
          </View>

          <View style={styles.appInfoItem}>
            <View style={[styles.appInfoIcon, { backgroundColor: colors.warningLight }]}>
              <ThemedText style={{ fontSize: 16 }}>🌐</ThemedText>
            </View>
            <ThemedText style={[styles.appInfoLabel, { color: colors.textSecondary }]}>Data Source</ThemedText>
            <ThemedText style={styles.appInfoValue}>Rainforest</ThemedText>
          </View>

          <View style={styles.appInfoItem}>
            <View style={[styles.appInfoIcon, { backgroundColor: `${colors.accent}15` }]}>
              <ThemedText style={{ fontSize: 16 }}>📂</ThemedText>
            </View>
            <ThemedText style={[styles.appInfoLabel, { color: colors.textSecondary }]}>Categories</ThemedText>
            <ThemedText style={styles.appInfoValue}>6 Active</ThemedText>
          </View>
        </View>
      </View>

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

      {/* Research Confirmation Modal */}
      <Modal
        visible={confirmModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => !clearingCache && setConfirmModalVisible(false)}
          />
          <View style={[styles.confirmModal, { backgroundColor: colors.cardBackground }]}>
            {/* Modal Header */}
            <View style={[styles.confirmHeader, {
              backgroundColor: researchComplete ? colors.successLight : researchError ? colors.errorLight : colors.primeLight
            }]}>
              <Text style={styles.confirmEmoji}>
                {researchComplete ? '✅' : researchError ? '❌' : '🔍'}
              </Text>
            </View>

            {/* Modal Content */}
            <View style={styles.confirmContent}>
              <ThemedText style={styles.confirmTitle}>
                {researchComplete
                  ? 'Research Complete!'
                  : researchError
                    ? 'Research Failed'
                    : 'Research Best Products'}
              </ThemedText>

              <ThemedText style={[styles.confirmMessage, { color: colors.textSecondary }]}>
                {researchComplete
                  ? 'Successfully fetched the latest bestseller products from Amazon!'
                  : researchError
                    ? researchError
                    : 'This will fetch the latest bestseller rankings directly from Amazon.\n\nThis may take a moment. Would you like to continue?'}
              </ThemedText>
            </View>

            {/* Modal Actions */}
            <View style={styles.confirmActions}>
              {researchComplete || researchError ? (
                <TouchableOpacity
                  style={[styles.confirmButton, styles.confirmButtonPrimary, {
                    backgroundColor: researchComplete ? colors.success : colors.prime
                  }]}
                  onPress={() => setConfirmModalVisible(false)}
                >
                  <ThemedText style={styles.confirmButtonTextPrimary}>
                    {researchComplete ? 'Great!' : 'OK'}
                  </ThemedText>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    style={[styles.confirmButton, styles.confirmButtonSecondary, { borderColor: colors.border }]}
                    onPress={() => setConfirmModalVisible(false)}
                  >
                    <ThemedText style={[styles.confirmButtonTextSecondary, { color: colors.text }]}>
                      Cancel
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.confirmButton, styles.confirmButtonPrimary, { backgroundColor: colors.prime }]}
                    onPress={confirmResearch}
                  >
                    <ThemedText style={styles.confirmButtonTextPrimary}>
                      Yes, Research Now
                    </ThemedText>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xs,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  featuresContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: Spacing.md,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      },
    }),
  },
  featureGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  featureIconContainer: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 26,
  },
  featureContent: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  featureArrow: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingDots: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionContainer: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  sectionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  settingsCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingIconBg: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 22,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  themeModeSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  themeModeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeModeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  clearCacheButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  clearCacheInfo: {
    flex: 1,
  },
  clearCacheArrow: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appInfoContainer: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    marginBottom: Spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  appInfoHeader: {
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  appInfoTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  appInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  appInfoItem: {
    width: '47%',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(0,0,0,0.02)',
    gap: Spacing.xs,
  },
  appInfoIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  appInfoLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  appInfoValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  headerContent: {
    flex: 1,
    width: '100%',
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
    overflow: 'hidden',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: -40,
    right: -40,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -20,
    left: -20,
  },
  headerInner: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  logoIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  logoEmoji: {
    fontSize: 28,
  },
  logoTextContainer: {
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  smileLine: {
    width: 60,
    height: 4,
    backgroundColor: '#FFD700',
    borderRadius: 2,
    marginTop: -4,
    marginLeft: 'auto',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '700',
    letterSpacing: 3,
    marginTop: Spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  headerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  updateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  updateIcon: {
    fontSize: 12,
  },
  updateText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '600',
  },
  // Confirmation Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  confirmModal: {
    width: '85%',
    maxWidth: 400,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: {
        elevation: 16,
      },
      web: {
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      },
    }),
  },
  confirmHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  confirmEmoji: {
    fontSize: 48,
  },
  confirmContent: {
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  confirmMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  confirmActions: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonPrimary: {
    // backgroundColor set dynamically
  },
  confirmButtonSecondary: {
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  confirmButtonTextPrimary: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  confirmButtonTextSecondary: {
    fontSize: 15,
    fontWeight: '600',
  },
});
