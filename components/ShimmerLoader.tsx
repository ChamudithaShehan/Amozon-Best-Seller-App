import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';

interface ShimmerLoaderProps {
    count?: number;
}

export function ShimmerLoader({ count = 3 }: ShimmerLoaderProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: Platform.OS !== 'web',
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1200,
                    useNativeDriver: Platform.OS !== 'web',
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [shimmerAnim]);

    const opacity = shimmerAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.4, 0.8, 0.4],
    });

    const LoaderCard = () => (
        <Animated.View
            style={[
                styles.card,
                {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                    opacity,
                },
            ]}
        >
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.shimmerBase }]} />
            <View style={styles.content}>
                <View style={[styles.titleLine, { backgroundColor: colors.shimmerBase }]} />
                <View style={[styles.titleLineShort, { backgroundColor: colors.shimmerBase }]} />
                <View style={[styles.ratingLine, { backgroundColor: colors.shimmerBase }]} />
                <View style={[styles.priceLine, { backgroundColor: colors.shimmerBase }]} />
            </View>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            {Array.from({ length: count }).map((_, index) => (
                <LoaderCard key={index} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 16,
    },
    card: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 16,
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
    imagePlaceholder: {
        width: 110,
        height: 110,
        borderRadius: 12,
    },
    content: {
        flex: 1,
        gap: 10,
        paddingVertical: 4,
    },
    titleLine: {
        height: 16,
        borderRadius: 8,
        width: '100%',
    },
    titleLineShort: {
        height: 16,
        borderRadius: 8,
        width: '70%',
    },
    ratingLine: {
        height: 14,
        borderRadius: 7,
        width: '40%',
        marginTop: 8,
    },
    priceLine: {
        height: 24,
        borderRadius: 12,
        width: '35%',
        marginTop: 8,
    },
});
