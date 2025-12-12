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
                    shadowColor: colorScheme === 'light' ? '#000' : '#000',
                    shadowOpacity: hovered ? 0.15 : 0.08,
                },
            ]}
        >
            {/* Position Badge - Top Right */}
            {product.position && (
                <View style={[
                    styles.positionBadge,
                    {
                        backgroundColor: colors.accent,
                        shadowColor: colors.accent,
                    }
                ]}>
                    <ThemedText style={styles.positionText}>#{product.position}</ThemedText>
                </View>
            )}

            {/* Product Image Section */}
            <View style={styles.imageSection}>
                <View style={[
                    styles.imageContainer,
                    {
                        backgroundColor: colorScheme === 'light' ? '#F5F5F5' : colors.glassOverlay,
                        shadowColor: '#000',
                        shadowOpacity: colorScheme === 'light' ? 0.1 : 0.3,
                    }
                ]}>
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

                {/* Top Seller Medal */}
                {product.position && product.position <= 3 && (
                    <View style={[
                        styles.medalBadge,
                        {
                            backgroundColor: colors.gradientEnd,
                            shadowColor: colors.gradientEnd,
                        }
                    ]}>
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
                                ({product.ratings_total.toLocaleString()})
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
                            <ThemedText style={[styles.priceCents, { color: colors.textSecondary }]}>
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
                            View on Amazon
                        </ThemedText>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        padding: 18,
        marginBottom: 16,
        marginHorizontal: 4,
        borderRadius: 20,
        borderWidth: 1,
        gap: 16,
        overflow: 'visible',
        position: 'relative',
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: 6 },
                shadowRadius: 16,
            },
            android: {
                elevation: 8,
            },
            web: {
                boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
            },
        }),
    },
    imageSection: {
        position: 'relative',
    },
    imageContainer: {
        width: 120,
        height: 140,
        borderRadius: 16,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 12,
            },
            android: {
                elevation: 6,
            },
            web: {
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            },
        }),
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
        fontSize: 36,
        opacity: 0.5,
    },
    positionBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        minWidth: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        zIndex: 10,
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.5,
                shadowRadius: 8,
            },
            android: {
                elevation: 6,
            },
            web: {
                boxShadow: '0 3px 12px rgba(255, 153, 0, 0.4)',
            },
        }),
    },
    positionText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 0.3,
    },
    medalBadge: {
        position: 'absolute',
        bottom: -6,
        left: -6,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.5,
                shadowRadius: 8,
            },
            android: {
                elevation: 6,
            },
            web: {
                boxShadow: '0 3px 12px rgba(0,0,0,0.3)',
            },
        }),
    },
    medalText: {
        fontSize: 16,
    },
    infoSection: {
        flex: 1,
        justifyContent: 'space-between',
        gap: 8,
        paddingVertical: 2,
    },
    productTitle: {
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 22,
        letterSpacing: -0.3,
        marginBottom: 2,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
        marginTop: 4,
    },
    starsText: {
        fontSize: 14,
        letterSpacing: 1.5,
    },
    ratingValue: {
        fontSize: 14,
        fontWeight: '800',
        marginLeft: 2,
    },
    reviewCount: {
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 2,
    },
    priceSection: {
        marginTop: 8,
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 2,
    },
    priceSymbol: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 1,
    },
    priceValue: {
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: -1.2,
        lineHeight: 32,
    },
    priceCents: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 1,
    },
    noPriceText: {
        fontSize: 14,
        fontStyle: 'italic',
        fontWeight: '500',
    },
    linkRow: {
        marginTop: 8,
    },
    amazonBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        alignSelf: 'flex-start',
        ...Platform.select({
            web: {
                transition: 'all 0.2s ease',
            },
        }),
    },
    amazonText: {
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    asinText: {
        fontSize: 10,
        marginTop: 4,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
});
