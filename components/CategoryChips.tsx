import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

interface Category {
    id: string;
    name: string;
    icon: string;
}

// Rainforest API bestseller category IDs
// These are VERIFIED WORKING category IDs for amazon.com
const CATEGORIES: Category[] = [
    { id: 'bestsellers_fashion', name: 'Clothing & Jewelry', icon: '👗' },
    { id: 'bestsellers_appliances', name: 'Appliances', icon: '🏠' },
    { id: 'bestsellers_electronics', name: 'Electronics', icon: '📱' },
    { id: 'bestsellers_kitchen', name: 'Kitchen & Dining', icon: '🍳' },
    { id: 'bestsellers_books', name: 'Books', icon: '📚' },
    { id: 'bestsellers_automotive', name: 'Automotive', icon: '🚗' },
];

interface CategoryChipsProps {
    selectedCategory: string;
    onSelectCategory: (categoryId: string) => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

function CategoryChip({
    category,
    isActive,
    colors,
    colorScheme,
    onPress,
}: {
    category: Category;
    isActive: boolean;
    colors: typeof Colors.light;
    colorScheme: 'light' | 'dark';
    onPress: () => void;
}) {
    const scale = useSharedValue(1);
    const pressed = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.92, {
            damping: 15,
            stiffness: 350,
        });
        pressed.value = withTiming(1, { duration: 100 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, {
            damping: 15,
            stiffness: 350,
        });
        pressed.value = withTiming(0, { duration: 150 });
    };

    return (
        <AnimatedTouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
            style={[
                styles.chip,
                isActive && styles.chipActive,
                {
                    borderColor: isActive ? colors.accent : colors.border,
                    borderWidth: isActive ? 2 : 1.5,
                },
                animatedStyle,
            ]}
        >
            {/* Background */}
            {isActive ? (
                <LinearGradient
                    colors={colorScheme === 'light'
                        ? [colors.accent, colors.gradientMiddle]
                        : [colors.accent, '#FF9500']
                    }
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
            ) : (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.chipBg }]} />
            )}

            {/* Glassmorphism overlay for inactive chips */}
            {!isActive && (
                <View style={[styles.glassOverlay, { backgroundColor: colors.glassOverlay }]} />
            )}

            {/* Content */}
            <View style={styles.chipContent}>
                <View style={[
                    styles.iconContainer,
                    {
                        backgroundColor: isActive
                            ? 'rgba(255, 255, 255, 0.25)'
                            : colors.background,
                    }
                ]}>
                    <ThemedText style={styles.iconEmoji}>{category.icon}</ThemedText>
                </View>
                <ThemedText
                    style={[
                        styles.chipText,
                        {
                            color: isActive ? '#FFFFFF' : colors.text,
                            fontWeight: isActive ? '700' : '600',
                        },
                    ]}
                >
                    {category.name}
                </ThemedText>
            </View>

            {/* Active indicator dot */}
            {isActive && (
                <View style={styles.activeDot}>
                    <View style={styles.activeDotInner} />
                </View>
            )}
        </AnimatedTouchableOpacity>
    );
}

export function CategoryChips({ selectedCategory, onSelectCategory }: CategoryChipsProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    return (
        <View style={styles.wrapper}>
            {/* Section Label */}
            <View style={styles.labelContainer}>
                <ThemedText style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                    Categories
                </ThemedText>
                <View style={[styles.categoryCount, { backgroundColor: colors.primeLight }]}>
                    <ThemedText style={[styles.categoryCountText, { color: colors.prime }]}>
                        {CATEGORIES.length}
                    </ThemedText>
                </View>
            </View>

            {/* Chips ScrollView */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.container}
                style={styles.scrollView}
            >
                {CATEGORIES.map((category) => {
                    const isActive = selectedCategory === category.id;
                    return (
                        <CategoryChip
                            key={category.id}
                            category={category}
                            isActive={isActive}
                            colors={colors}
                            colorScheme={colorScheme}
                            onPress={() => onSelectCategory(category.id)}
                        />
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: Spacing.lg,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
        paddingHorizontal: Spacing.xs,
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    categoryCount: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: BorderRadius.sm,
    },
    categoryCountText: {
        fontSize: 11,
        fontWeight: '700',
    },
    scrollView: {
        marginLeft: -Spacing.xs,
    },
    container: {
        paddingHorizontal: Spacing.xs,
        paddingVertical: Spacing.sm,
        gap: Spacing.md,
    },
    chip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        position: 'relative',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
            },
            android: {
                elevation: 4,
            },
            web: {
                boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                transition: 'all 0.25s ease',
                cursor: 'pointer',
            },
        }),
    },
    chipActive: {
        ...Platform.select({
            ios: {
                shadowColor: '#FF9900',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 10,
            },
            android: {
                elevation: 8,
            },
            web: {
                boxShadow: '0 6px 20px rgba(255, 153, 0, 0.35)',
            },
        }),
    },
    glassOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    chipContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: BorderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconEmoji: {
        fontSize: 16,
    },
    chipText: {
        fontSize: 13,
        letterSpacing: 0.2,
    },
    activeDot: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeDotInner: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
    },
});
