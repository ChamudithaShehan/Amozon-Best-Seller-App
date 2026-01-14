import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Platform, RefreshControl, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';

import { CategoryChips } from '@/components/CategoryChips';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ProductCard } from '@/components/ProductCard';
import { ShimmerLoader } from '@/components/ShimmerLoader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useBestsellers } from '@/hooks/useBestsellers';
import { BestsellerProduct } from '@/services/rainforestApi';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('bestsellers_fashion');
  const { bestsellers, loading, error, refetch, fromCache, lastUpdated } = useBestsellers({ categoryId: selectedCategory });
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 380;

  // Format last updated time
  const getLastUpdatedText = () => {
    if (!lastUpdated) return '';
    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return lastUpdated.toLocaleDateString();
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const renderProduct = ({ item }: { item: BestsellerProduct }) => (
    <ProductCard product={item} onPress={() => { }} />
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: colors.gradientStart,
        dark: colors.gradientEnd
      }}
      headerImage={
        <View style={styles.headerContent}>
          {/* Premium Gradient Background */}
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
            <View style={styles.decorativeCircle3} />

            {/* Content Container */}
            <View style={styles.headerInner}>
              {/* Logo Section */}
              <View style={styles.logoContainer}>
                <View style={styles.logoIconWrapper}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                    style={styles.logoGradient}
                  />
                  <ThemedText style={styles.logoEmoji}>📊</ThemedText>
                </View>
                <View style={styles.logoTextContainer}>
                  <ThemedText style={styles.headerTitle}>amazon</ThemedText>
                  {/* <View style={styles.smileContainer}>
                    <View style={styles.smileLine} />
                    <View style={styles.smileArrow} />
                  </View> */}
                </View>
              </View>

              {/* Subtitle */}
              <ThemedText style={styles.headerSubtitle}>BESTSELLERS EXPLORER</ThemedText>

              {/* Status and Update Info */}
              <View style={styles.headerInfoRow}>
                {!fromCache && (
                  <View style={styles.liveBadge}>
                    <View style={styles.liveDotOuter}>
                      <View style={styles.liveDotInner} />
                    </View>
                    <ThemedText style={styles.liveText}>LIVE</ThemedText>
                  </View>
                )}
                {lastUpdated && (
                  <View style={styles.updateBadge}>
                    <ThemedText style={styles.updateIcon}>🕐</ThemedText>
                    <ThemedText style={styles.updateText}>
                      {getLastUpdatedText()}
                    </ThemedText>
                  </View>
                )}
              </View>

              {/* Stats Row - hide on small screens */}
              {!isSmallDevice && (
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <ThemedText style={styles.statIcon}>🔥</ThemedText>
                    <ThemedText style={styles.statLabel}>Updated Daily</ThemedText>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <ThemedText style={styles.statIcon}>⭐</ThemedText>
                    <ThemedText style={styles.statLabel}>Top 50 Products</ThemedText>
                  </View>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>
      }>

      {/* Category Filter */}
      <CategoryChips
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />

      {/* Loading State */}
      {loading && bestsellers.length === 0 && (
        <ThemedView style={styles.loaderContainer}>
          <ShimmerLoader count={4} />
        </ThemedView>
      )}

      {/* Error State */}
      {error && (
        <View style={[styles.errorContainer, {
          backgroundColor: colors.errorLight,
          borderColor: colorScheme === 'light' ? 'rgba(229, 62, 62, 0.15)' : 'rgba(248, 113, 113, 0.25)',
        }]}>
          <LinearGradient
            colors={['transparent', colors.errorLight]}
            style={styles.errorGradient}
          />
          <View style={styles.errorIconContainer}>
            <ThemedText style={styles.errorIcon}>⚠️</ThemedText>
          </View>
          <View style={styles.errorTextContainer}>
            <ThemedText style={[styles.errorTitle, { color: colors.error }]}>
              Unable to load products
            </ThemedText>
            <ThemedText style={[styles.errorText, { color: colors.textSecondary }]}>
              {error}
            </ThemedText>
          </View>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.error }]}
            onPress={refetch}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.retryIcon}>🔄</ThemedText>
            <ThemedText style={styles.retryText}>Retry</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {/* Empty State */}
      {!loading && bestsellers.length === 0 && !error && (
        <View style={[styles.emptyContainer, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.emptyIconBg, { backgroundColor: colors.primeLight }]}>
            <ThemedText style={styles.emptyIcon}>📦</ThemedText>
          </View>
          <ThemedText style={styles.emptyTitle}>No products found</ThemedText>
          <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
            Try selecting a different category to explore more products
          </ThemedText>
          <TouchableOpacity
            style={[styles.emptyButton, { backgroundColor: colors.prime }]}
            onPress={() => setSelectedCategory('bestsellers_appliances')}
          >
            <ThemedText style={styles.emptyButtonText}>Browse Appliances</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {/* Products List */}
      {bestsellers.length > 0 && (
        <>
          {/* Results Header */}
          <View style={styles.resultsHeader}>
            <ThemedText style={[styles.resultsCount, { color: colors.text }]}>
              {bestsellers.length} Products
            </ThemedText>
            <View style={[styles.sortBadge, { backgroundColor: colors.chipBg }]}>
              <ThemedText style={[styles.sortText, { color: colors.textSecondary }]}>
                Sorted by Rank
              </ThemedText>
            </View>
          </View>

          <FlatList
            data={bestsellers}
            renderItem={renderProduct}
            keyExtractor={(item, index) => item.asin || `product-${index}`}
            scrollEnabled={false}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={refetch}
                tintColor={colors.tint}
                colors={[colors.tint]}
              />
            }
            contentContainerStyle={styles.listContainer}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          />
        </>
      )}

      {/* Refreshing Overlay */}
      {loading && bestsellers.length > 0 && (
        <View style={styles.refreshingOverlay}>
          <View style={[styles.refreshingBadge, {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }]}>
            <ActivityIndicator size="small" color={colors.tint} />
            <ThemedText style={[styles.refreshingText, { color: colors.text }]}>
              Updating products...
            </ThemedText>
          </View>
        </View>
      )}
    </ParallaxScrollView>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 380;

const styles = StyleSheet.create({
  headerContent: {
    flex: 1,
    width: '100%',
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: isSmallScreen ? 16 : 20,
    paddingTop: isSmallScreen ? 16 : 20,
    paddingBottom: isSmallScreen ? 16 : 24,
    overflow: 'hidden',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: -50,
    right: -50,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -30,
    left: -30,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    top: 60,
    left: 40,
  },
  headerInner: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallScreen ? 8 : 12,
    marginBottom: isSmallScreen ? 4 : 8,
  },
  logoIconWrapper: {
    width: isSmallScreen ? 40 : 48,
    height: isSmallScreen ? 40 : 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  logoGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  logoEmoji: {
    fontSize: isSmallScreen ? 20 : 24,
  },
  logoTextContainer: {
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: isSmallScreen ? 32 : 40,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  smileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -6,
    marginLeft: 30,
  },
  smileLine: {
    width: 60,
    height: 4,
    backgroundColor: '#FFD700',
    borderRadius: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
      },
    }),
  },
  smileArrow: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 0,
    borderTopWidth: 6,
    borderLeftColor: '#FFD700',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    marginLeft: -1,
    marginTop: 4,
    transform: [{ rotate: '95deg' }],
  },
  headerSubtitle: {
    fontSize: isSmallScreen ? 10 : 12,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '700',
    letterSpacing: isSmallScreen ? 2 : 3,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  headerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isSmallScreen ? 6 : 10,
    marginTop: isSmallScreen ? 8 : 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: isSmallScreen ? 8 : 10,
    paddingVertical: isSmallScreen ? 4 : 6,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  liveDotOuter: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: isSmallScreen ? 9 : 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  updateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: isSmallScreen ? 8 : 10,
    paddingVertical: isSmallScreen ? 4 : 5,
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
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallScreen ? 6 : 10,
    marginTop: isSmallScreen ? 8 : 12,
    paddingHorizontal: isSmallScreen ? 10 : 14,
    paddingVertical: isSmallScreen ? 6 : 10,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statIcon: {
    fontSize: 14,
  },
  statLabel: {
    color: '#FFFFFF',
    fontSize: isSmallScreen ? 10 : 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.md,
  },
  listContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sortBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  sortText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loaderContainer: {
    paddingVertical: Spacing.lg,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    marginHorizontal: Spacing.xs,
    marginVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: Spacing.md,
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  errorGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  errorIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  errorIcon: {
    fontSize: 24,
  },
  errorTextContainer: {
    flex: 1,
    minWidth: 150,
    gap: 4,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  errorText: {
    fontSize: 13,
    lineHeight: 18,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    ...Platform.select({
      ios: {
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  retryIcon: {
    fontSize: 14,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxl,
    margin: Spacing.xs,
    borderRadius: BorderRadius.xl,
    gap: Spacing.md,
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
    }),
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  emptyButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.md,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  refreshingOverlay: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  refreshingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  refreshingText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
