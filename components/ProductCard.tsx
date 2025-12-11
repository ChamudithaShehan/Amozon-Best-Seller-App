import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BestsellerProduct } from '@/services/rainforestApi';
import { Image } from 'expo-image';
import React from 'react';
import { Linking, Platform, Pressable, StyleSheet, View } from 'react-native';

interface ProductCardProps {
    product: BestsellerProduct;
    onPress?: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalf = rating - fullStars >= 0.5;
        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '★';
        if (hasHalf) stars += '½';
        for (let i = Math.ceil(rating); i < 5; i++) stars += '☆';
        return stars;
    };

    const handleViewOnAmazon = () => {
        if (product.link) {
            Linking.openURL(product.link);
        }
    };

    return (
        <Pressable
            onPress={handleViewOnAmazon}
            style={({ pressed, hovered }) => [
                styles.card,
                {
                    backgroundColor: colors.cardBackground,
                    borderColor: hovered ? colors.accent : colors.border,
                    transform: [{ scale: pressed ? 0.98 : hovered ? 1.01 : 1 }],
                },
            ]}
        >
            {/* Product Image Section */}
            <View style={styles.imageSection}>
                <View style={[styles.imageContainer, { backgroundColor: colorScheme === 'light' ? '#FAFAFA' : colors.glassOverlay }]}>
                    {product.image ? (
                        <Image
                            source={{ uri: product.image }}
                            style={styles.productImage}
                            contentFit="contain"
                            transition={300}
                        />
                    ) : (
                        <View style={[styles.imagePlaceholder, { backgroundColor: colors.shimmerBase }]}>
                            <ThemedText style={styles.placeholderIcon}>📦</ThemedText>
                        </View>
                    )}
                </View>

                {/* Position Badge */}
                {product.position && (
                    <View style={[styles.positionBadge, { backgroundColor: colors.accent }]}>
                        <ThemedText style={styles.positionText}>#{product.position}</ThemedText>
                    </View>
                )}

                {/* Top Seller Medal */}
                {product.position && product.position <= 3 && (
                    <View style={[styles.medalBadge, { backgroundColor: colors.gradientEnd }]}>
                        <ThemedText style={styles.medalText}>
                            {product.position === 1 ? '🥇' : product.position === 2 ? '🥈' : '🥉'}
                        </ThemedText>
                    </View>
                )}
            </View>

            {/* Product Info Section */}
            <View style={styles.infoSection}>
                {/* Title */}
                <ThemedText numberOfLines={2} style={styles.productTitle}>
                    {product.title || 'Untitled Product'}
                </ThemedText>

                {/* Rating */}
                {product.rating && (
                    <View style={styles.ratingRow}>
                        <ThemedText style={[styles.starsText, { color: colors.accent }]}>
                            {renderStars(product.rating)}
                        </ThemedText>
                        <ThemedText style={[styles.ratingValue, { color: colors.accent }]}>
                            {product.rating.toFixed(1)}
                        </ThemedText>
                        {product.ratings_total && (
                            <ThemedText style={[styles.reviewCount, { color: colors.textSecondary }]}>
                                ({product.ratings_total.toLocaleString()} reviews)
                            </ThemedText>
                        )}
                    </View>
                )}

                {/* Price Section */}
                <View style={styles.priceSection}>
                    {product.price?.value ? (
                        <View style={styles.priceRow}>
                            <ThemedText style={[styles.priceSymbol, { color: colors.text }]}>
                                {product.price.currency || '$'}
                            </ThemedText>
                            <ThemedText style={[styles.priceValue, { color: colors.text }]}>
                                {Math.floor(product.price.value)}
                            </ThemedText>
                            <ThemedText style={[styles.priceCents, { color: colors.text }]}>
                                {((product.price.value % 1) * 100).toFixed(0).padStart(2, '0')}
                            </ThemedText>
                        </View>
                    ) : (
                        <ThemedText style={[styles.noPriceText, { color: colors.textSecondary }]}>
                            Price not available
                        </ThemedText>
                    )}
                </View>

                {/* View on Amazon Link */}
                <View style={styles.linkRow}>
                    <View style={[styles.amazonBadge, { backgroundColor: colors.primeLight }]}>
                        <ThemedText style={[styles.amazonText, { color: colors.prime }]}>
                            🔗 View on Amazon
                        </ThemedText>
                    </View>
                </View>

                {/* ASIN for reference */}
                {product.asin && (
                    <ThemedText style={[styles.asinText, { color: colors.textSecondary }]}>
                        ASIN: {product.asin}
                    </ThemedText>
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        padding: 14,
        marginBottom: 14,
        marginHorizontal: 2,
        borderRadius: 16,
        borderWidth: 1.5,
        gap: 14,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 6,
            },
            web: {
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.25s ease',
                cursor: 'pointer',
            },
        }),
    },
    imageSection: {
        position: 'relative',
    },
    imageContainer: {
        width: 110,
        height: 130,
        borderRadius: 12,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderIcon: {
        fontSize: 32,
    },
    positionBadge: {
        position: 'absolute',
        top: -6,
        right: -6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        minWidth: 32,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#FF9900',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 6,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    positionText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    medalBadge: {
        position: 'absolute',
        bottom: -4,
        left: -4,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    medalText: {
        fontSize: 14,
    },
    infoSection: {
        flex: 1,
        justifyContent: 'space-between',
        gap: 6,
    },
    productTitle: {
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 21,
        letterSpacing: -0.2,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        flexWrap: 'wrap',
    },
    starsText: {
        fontSize: 13,
        letterSpacing: 1,
    },
    ratingValue: {
        fontSize: 13,
        fontWeight: '700',
    },
    reviewCount: {
        fontSize: 12,
    },
    priceSection: {
        marginTop: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    priceSymbol: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: 2,
    },
    priceValue: {
        fontSize: 26,
        fontWeight: '700',
        letterSpacing: -1,
        lineHeight: 28,
    },
    priceCents: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: 2,
    },
    noPriceText: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    linkRow: {
        marginTop: 6,
    },
    amazonBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    amazonText: {
        fontSize: 12,
        fontWeight: '600',
    },
    asinText: {
        fontSize: 10,
        marginTop: 4,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
});
