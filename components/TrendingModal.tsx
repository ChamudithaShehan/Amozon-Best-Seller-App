import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { BestsellerProduct } from '@/services/rainforestApi';
import { Image } from 'expo-image';
import React from 'react';
import { Modal, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

interface TrendingProduct {
    product: BestsellerProduct;
    categoryName: string;
}

interface TrendingModalProps {
    visible: boolean;
    onClose: () => void;
    trendingProducts: TrendingProduct[];
    colorScheme: 'light' | 'dark';
}

export function TrendingModal({ visible, onClose, trendingProducts, colorScheme }: TrendingModalProps) {
    const colors = Colors[colorScheme];

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
                            <ThemedText style={styles.headerEmoji}>📈</ThemedText>
                            <ThemedText style={styles.title}>Trending Products</ThemedText>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <IconSymbol name="xmark.circle.fill" size={28} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Top #1 bestseller from each category
                    </ThemedText>

                    {/* Products List */}
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                    >
                        {trendingProducts.length === 0 ? (
                            <View style={styles.emptyState}>
                                <ThemedText style={styles.emptyText}>No trending products available</ThemedText>
                            </View>
                        ) : (
                            trendingProducts.map((item, index) => (
                                <View
                                    key={item.product.asin || index}
                                    style={[styles.productCard, {
                                        backgroundColor: colors.background,
                                        borderColor: colors.border,
                                    }]}
                                >
                                    <View style={[styles.rankBadge, { backgroundColor: colors.accent }]}>
                                        <ThemedText style={styles.rankText}>#1</ThemedText>
                                    </View>

                                    <View style={[styles.imageContainer, { backgroundColor: colors.glassOverlay }]}>
                                        {item.product.image ? (
                                            <Image
                                                source={{ uri: item.product.image }}
                                                style={styles.productImage}
                                                contentFit="contain"
                                            />
                                        ) : (
                                            <ThemedText style={styles.noImage}>📦</ThemedText>
                                        )}
                                    </View>

                                    <View style={styles.productInfo}>
                                        <View style={[styles.categoryBadge, { backgroundColor: colors.primeLight }]}>
                                            <ThemedText style={[styles.categoryText, { color: colors.prime }]}>
                                                {item.categoryName}
                                            </ThemedText>
                                        </View>
                                        <ThemedText numberOfLines={2} style={styles.productTitle}>
                                            {item.product.title}
                                        </ThemedText>
                                        {item.product.rating && (
                                            <ThemedText style={[styles.rating, { color: colors.accent }]}>
                                                ⭐ {item.product.rating.toFixed(1)}
                                            </ThemedText>
                                        )}
                                        {item.product.price?.value && (
                                            <ThemedText style={styles.price}>
                                                ${item.product.price.value.toFixed(2)}
                                            </ThemedText>
                                        )}
                                    </View>
                                </View>
                            ))
                        )}
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
    scrollView: {
        flex: 1,
        minHeight: 0,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    productCard: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
        gap: 12,
    },
    rankBadge: {
        position: 'absolute',
        top: -6,
        left: -6,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        zIndex: 1,
    },
    rankText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
    },
    imageContainer: {
        width: 70,
        height: 70,
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    noImage: {
        fontSize: 28,
    },
    productInfo: {
        flex: 1,
        gap: 4,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '700',
    },
    productTitle: {
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 18,
    },
    rating: {
        fontSize: 12,
        fontWeight: '600',
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
    },
});
