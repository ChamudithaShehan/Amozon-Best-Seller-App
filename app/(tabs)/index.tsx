import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Platform, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';

import { CategoryChips } from '@/components/CategoryChips';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ProductCard } from '@/components/ProductCard';
import { ShimmerLoader } from '@/components/ShimmerLoader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
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

            {/* Status and Update Info */}
            {!fromCache && (
              <View style={styles.headerInfoRow}>
                <View style={[styles.headerStatusBadge, { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}>
                  <View style={[styles.headerLiveDot, { backgroundColor: '#FFFFFF' }]} />
                  <ThemedText style={styles.headerStatusText}>LIVE</ThemedText>
                </View>
                {lastUpdated && (
                  <ThemedText style={styles.headerUpdateTime}>
                    Updated {getLastUpdatedText()}
                  </ThemedText>
                )}
              </View>
            )}
            {fromCache && lastUpdated && (
              <View style={styles.headerInfoRow}>
                <ThemedText style={styles.headerUpdateTime}>
                  Updated {getLastUpdatedText()}
                </ThemedText>
              </View>
            )}

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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 6,
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
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
    fontSize: 44,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  smileLine: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginTop: -4,
    marginLeft: 'auto',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    opacity: 0.95,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  headerStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
  },
  headerStatusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  headerLiveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  headerUpdateTime: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.85,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    justifyContent: 'center',
  },
  statBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  infoContainer: {
    gap: 8,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
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
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    flex: 1,
    minWidth: 200,
  },
  lastUpdated: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.7,
  },
  loaderContainer: {
    paddingVertical: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 4,
    marginVertical: 16,
    borderRadius: 16,
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
    gap: 4,
    flexDirection: 'column',
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
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
    paddingVertical: 10,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
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
