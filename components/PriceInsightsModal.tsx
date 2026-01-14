import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import React from 'react';
import { Modal, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

interface PriceStats {
    category: string;
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
    productCount: number;
}

interface PriceInsightsModalProps {
    visible: boolean;
    onClose: () => void;
    priceInsights: PriceStats[];
    colorScheme: 'light' | 'dark';
}

export function PriceInsightsModal({ visible, onClose, priceInsights, colorScheme }: PriceInsightsModalProps) {
    const colors = Colors[colorScheme];

    // Calculate overall stats
    const allPrices = priceInsights.filter(p => p.avgPrice > 0);
    const overallAvg = allPrices.length > 0
        ? allPrices.reduce((sum, p) => sum + p.avgPrice, 0) / allPrices.length
        : 0;
    const overallMin = allPrices.length > 0
        ? Math.min(...allPrices.map(p => p.minPrice).filter(p => p > 0))
        : 0;
    const overallMax = allPrices.length > 0
        ? Math.max(...allPrices.map(p => p.maxPrice))
        : 0;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
            presentationStyle="fullScreen"
        >
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <ThemedView style={[styles.modalContent, { backgroundColor: colors.background }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerTitle}>
                            <ThemedText style={styles.headerEmoji}>📊</ThemedText>
                            <ThemedText style={styles.title}>Price Insights</ThemedText>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <IconSymbol name="xmark.circle.fill" size={28} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Pricing overview across all categories
                    </ThemedText>

                    {/* Overall Stats */}
                    <View style={[styles.overallStats, { backgroundColor: colors.primeLight }]}>
                        <View style={styles.statItem}>
                            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Average</ThemedText>
                            <ThemedText style={[styles.statValue, { color: colors.prime }]}>
                                ${overallAvg.toFixed(2)}
                            </ThemedText>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.statItem}>
                            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Lowest</ThemedText>
                            <ThemedText style={[styles.statValue, { color: colors.success }]}>
                                ${overallMin.toFixed(2)}
                            </ThemedText>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.statItem}>
                            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Highest</ThemedText>
                            <ThemedText style={[styles.statValue, { color: colors.accent }]}>
                                ${overallMax.toFixed(2)}
                            </ThemedText>
                        </View>
                    </View>

                    {/* Category Breakdown */}
                    <ThemedText style={styles.sectionTitle}>By Category</ThemedText>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                    >
                        {priceInsights.filter(p => p.avgPrice > 0).map((stats, index) => (
                            <View
                                key={stats.category}
                                style={[styles.categoryCard, {
                                    backgroundColor: colors.background,
                                    borderColor: colors.border,
                                }]}
                            >
                                <View style={styles.categoryHeader}>
                                    <ThemedText style={styles.categoryName}>{stats.category}</ThemedText>
                                    <ThemedText style={[styles.productCount, { color: colors.textSecondary }]}>
                                        {stats.productCount} products
                                    </ThemedText>
                                </View>

                                <View style={styles.priceRow}>
                                    <View style={styles.priceItem}>
                                        <ThemedText style={[styles.priceLabel, { color: colors.textSecondary }]}>Min</ThemedText>
                                        <ThemedText style={[styles.priceValue, { color: colors.success }]}>
                                            ${stats.minPrice.toFixed(0)}
                                        </ThemedText>
                                    </View>
                                    <View style={styles.priceItem}>
                                        <ThemedText style={[styles.priceLabel, { color: colors.textSecondary }]}>Avg</ThemedText>
                                        <ThemedText style={styles.priceValue}>
                                            ${stats.avgPrice.toFixed(0)}
                                        </ThemedText>
                                    </View>
                                    <View style={styles.priceItem}>
                                        <ThemedText style={[styles.priceLabel, { color: colors.textSecondary }]}>Max</ThemedText>
                                        <ThemedText style={[styles.priceValue, { color: colors.accent }]}>
                                            ${stats.maxPrice.toFixed(0)}
                                        </ThemedText>
                                    </View>
                                </View>

                                {/* Price bar visualization */}
                                <View style={[styles.priceBar, { backgroundColor: colors.border }]}>
                                    <View
                                        style={[
                                            styles.priceBarFill,
                                            {
                                                backgroundColor: colors.prime,
                                                width: `${Math.min((stats.avgPrice / overallMax) * 100, 100)}%`,
                                            }
                                        ]}
                                    />
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </ThemedView>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerEmoji: {
        fontSize: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
    },
    closeButton: {
        padding: 4,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 16,
    },
    overallStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
    },
    statDivider: {
        width: 1,
        height: '100%',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    scrollView: {
        flex: 1,
        minHeight: 0,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    categoryCard: {
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 10,
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    categoryName: {
        fontSize: 15,
        fontWeight: '700',
    },
    productCount: {
        fontSize: 12,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    priceItem: {
        alignItems: 'center',
        flex: 1,
    },
    priceLabel: {
        fontSize: 10,
        fontWeight: '600',
    },
    priceValue: {
        fontSize: 16,
        fontWeight: '700',
    },
    priceBar: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    priceBarFill: {
        height: '100%',
        borderRadius: 3,
    },
});
