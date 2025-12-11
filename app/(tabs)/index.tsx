import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Platform, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';

import { CategoryChips } from '@/components/CategoryChips';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ProductCard } from '@/components/ProductCard';
import { ShimmerLoader } from '@/components/ShimmerLoader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useBestsellers } from '@/hooks/useBestsellers';
import { BestsellerProduct } from '@/services/rainforestApi';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('bestsellers_appliances');
  const { bestsellers, loading, error, refetch, fromCache, lastUpdated } = useBestsellers({ categoryId: selectedCategory });
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

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
          {/* Gradient Overlay */}
          <View style={[styles.headerGradient, { backgroundColor: colorScheme === 'light' ? colors.gradientStart : colors.gradientEnd }]}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <View style={[styles.logoIcon, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
                <ThemedText style={styles.logoEmoji}>📊</ThemedText>
              </View>
              <View style={styles.logoTextContainer}>
                <ThemedText style={styles.headerTitle}>amazon</ThemedText>
                <View style={[styles.smileLine, { backgroundColor: colors.accent }]} />
              </View>
            </View>

            {/* Subtitle */}
            <ThemedText style={styles.headerSubtitle}>Bestsellers Explorer</ThemedText>

            {/* Search Bar Placeholder */}
            <TouchableOpacity
              style={[styles.searchBar, {
                backgroundColor: colorScheme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30, 30, 30, 0.95)',
                borderColor: colorScheme === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)',
              }]}
              activeOpacity={0.8}
            >
              <IconSymbol name="magnifyingglass" size={18} color={colors.textSecondary} />
              <ThemedText style={[styles.searchPlaceholder, { color: colors.textSecondary }]}>
                Search bestselling products...
              </ThemedText>
            </TouchableOpacity>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={[styles.statBadge, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
                <ThemedText style={styles.statText}>🔥 Updated Daily</ThemedText>
              </View>
              <View style={[styles.statBadge, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
                <ThemedText style={styles.statText}>⭐ Top 50 Products</ThemedText>
              </View>
            </View>
          </View>
        </View>
      }>

      {/* Title Section */}
      <ThemedView style={styles.titleContainer}>
        <View style={styles.titleRow}>
          <ThemedText type="title" style={styles.mainTitle}>Top Products</ThemedText>
          {fromCache ? (
            <View style={[styles.cacheBadge, { backgroundColor: colors.primeLight }]}>
              <ThemedText style={[styles.cacheText, { color: colors.prime }]}>💾 Cached</ThemedText>
            </View>
          ) : (
            <View style={[styles.liveBadge, { backgroundColor: colors.successLight }]}>
              <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
              <ThemedText style={[styles.liveText, { color: colors.success }]}>LIVE</ThemedText>
            </View>
          )}
        </View>
        <View style={styles.subtitleRow}>
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
            Browse the most popular products on Amazon
          </ThemedText>
          {lastUpdated && (
            <ThemedText style={[styles.lastUpdated, { color: colors.textSecondary }]}>
              Updated {getLastUpdatedText()}
            </ThemedText>
          )}
        </View>
      </ThemedView>

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
        <ThemedView style={[styles.errorContainer, {
          backgroundColor: colorScheme === 'light' ? 'rgba(229, 62, 62, 0.08)' : 'rgba(255, 107, 107, 0.12)',
          borderColor: colorScheme === 'light' ? 'rgba(229, 62, 62, 0.15)' : 'rgba(255, 107, 107, 0.25)',
        }]}>
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
            <ThemedText style={styles.retryText}>Retry</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}

      {/* Empty State */}
      {!loading && bestsellers.length === 0 && !error && (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText style={styles.emptyIcon}>📦</ThemedText>
          <ThemedText style={styles.emptyTitle}>No products found</ThemedText>
          <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
            Try selecting a different category
          </ThemedText>
        </ThemedView>
      )}

      {/* Products List */}
      {bestsellers.length > 0 && (
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
          ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        />
      )}

      {/* Refreshing Overlay */}
      {loading && bestsellers.length > 0 && (
        <View style={styles.refreshingOverlay}>
          <View style={[styles.refreshingBadge, { backgroundColor: colors.cardBackground }]}>
            <ActivityIndicator size="small" color={colors.tint} />
            <ThemedText style={[styles.refreshingText, { color: colors.textSecondary }]}>
              Updating...
            </ThemedText>
          </View>
        </View>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    flex: 1,
    width: '100%',
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 24,
  },
  logoTextContainer: {
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -2,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  smileLine: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginTop: -4,
    marginLeft: 'auto',
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    opacity: 0.9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    maxWidth: 360,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  searchPlaceholder: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  statBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  titleContainer: {
    gap: 6,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cacheBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cacheText: {
    fontSize: 10,
    fontWeight: '700',
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
    lineHeight: 20,
  },
  lastUpdated: {
    fontSize: 11,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  loaderContainer: {
    paddingVertical: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 4,
    marginVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    flexWrap: 'wrap',
  },
  errorIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 24,
  },
  errorTextContainer: {
    flex: 1,
    minWidth: 150,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  errorText: {
    fontSize: 13,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 24,
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
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  refreshingText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
