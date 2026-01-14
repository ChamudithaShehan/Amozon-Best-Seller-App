import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BestsellerProduct } from '@/services/rainforestApi';
import { Image } from 'expo-image';
import React from 'react';
import { Linking, Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface ProductCardProps {
    product: BestsellerProduct;
    onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ProductCard({ product, onPress }: ProductCardProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const scale = useSharedValue(1);

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

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    };

    // Get rank styling
    const getRankStyle = (position: number | undefined) => {
        if (!position) return { bgColor: colors.textSecondary, label: '' };
        if (position === 1) return { bgColor: '#FFD700', label: '🥇' };
        if (position === 2) return { bgColor: '#C0C0C0', label: '🥈' };
        if (position === 3) return { bgColor: '#CD7F32', label: '🥉' };
        return { bgColor: colors.accent, label: '' };
    };

    const rankStyle = getRankStyle(product.position);
    const isTopThree = product.position && product.position <= 3;

    return (
        <AnimatedPressable
            onPress={handleViewOnAmazon}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
                styles.card,
                {
                    backgroundColor: colors.cardBackground,
                    borderColor: isTopThree ? `${rankStyle.bgColor}40` : colors.border,
                    borderWidth: isTopThree ? 1.5 : 1,
                },
                animatedStyle,
            ]}
        >
            {/* Rank Badge */}
            {product.position && (
                <View style={[
                    styles.rankBadge,
                    { backgroundColor: isTopThree ? rankStyle.bgColor : colors.accent }
                ]}>
                    <ThemedText style={styles.rankText}>
                        {isTopThree ? rankStyle.label : `#${product.position}`}
                    </ThemedText>
                    {isTopThree && (
                        <ThemedText style={styles.rankNumber}>#{product.position}</ThemedText>
                    )}
                </View>
            )}

            {/* Product Image */}
            <View style={[styles.imageContainer, { backgroundColor: colorScheme === 'light' ? '#F8F9FA' : colors.glassOverlay }]}>
                {product.image ? (
                    <Image
                        source={{ uri: product.image }}
                        style={styles.productImage}
                        contentFit="contain"
                        transition={200}
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <ThemedText style={styles.placeholderIcon}>📦</ThemedText>
                    </View>
                )}
            </View>

            {/* Product Details */}
            <View style={styles.detailsContainer}>
                {/* Title */}
                <ThemedText numberOfLines={2} style={styles.productTitle}>
                    {product.title}
                </ThemedText>

                {/* Rating Row */}
                {product.rating && (
                    <View style={styles.ratingRow}>
                        <View style={[styles.ratingBadge, { backgroundColor: colors.warningLight }]}>
                            <ThemedText style={[styles.starsText, { color: colors.accent }]}>
                                {renderStars(product.rating)}
                            </ThemedText>
                            <ThemedText style={[styles.ratingValue, { color: colors.accent }]}>
                                {product.rating.toFixed(1)}
                            </ThemedText>
                        </View>
                        {product.ratings_total && (
                            <ThemedText style={[styles.reviewCount, { color: colors.textSecondary }]}>
                                ({product.ratings_total.toLocaleString()} reviews)
                            </ThemedText>
                        )}
                    </View>
                )}

                {/* Price */}
                <View style={styles.priceRow}>
                    {product.price?.value ? (
                        <>
                            <ThemedText style={[styles.priceSymbol, { color: colors.text }]}>$</ThemedText>
                            <ThemedText style={[styles.priceValue, { color: colors.text }]}>
                                {Math.floor(product.price.value)}
                            </ThemedText>
                            <ThemedText style={[styles.priceCents, { color: colors.text }]}>
                                {(product.price.value % 1).toFixed(2).substring(1)}
                            </ThemedText>
                        </>
                    ) : (
                        <ThemedText style={[styles.priceUnavailable, { color: colors.textSecondary }]}>
                            Price unavailable
                        </ThemedText>
                    )}
                </View>

                {/* Amazon Button */}
                <Pressable
                    style={[styles.amazonButton, { backgroundColor: colors.prime }]}
                    onPress={handleViewOnAmazon}
                >
                    <ThemedText style={styles.amazonButtonText}>View on Amazon</ThemedText>
                    <ThemedText style={styles.amazonArrow}>→</ThemedText>
                </Pressable>
            </View>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        padding: 12,
        marginBottom: 10,
        marginHorizontal: 2,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        gap: 12,
        position: 'relative',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
            web: {
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
            },
        }),
    },
    rankBadge: {
        position: 'absolute',
        top: -6,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: BorderRadius.sm,
        zIndex: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 3,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    rankText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    rankNumber: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 10,
        fontWeight: '600',
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: BorderRadius.md,
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
        opacity: 0.5,
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    productTitle: {
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 19,
        marginBottom: 6,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: BorderRadius.xs,
    },
    starsText: {
        fontSize: 10,
        letterSpacing: -0.5,
    },
    ratingValue: {
        fontSize: 12,
        fontWeight: '700',
    },
    reviewCount: {
        fontSize: 11,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    priceSymbol: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
    priceValue: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    priceCents: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
    priceUnavailable: {
        fontSize: 13,
        fontStyle: 'italic',
    },
    amazonButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: BorderRadius.md,
        overflow: 'hidden',
    },
    amazonButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    amazonArrow: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});
