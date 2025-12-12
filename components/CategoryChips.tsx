import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface Category {
    id: string;
    name: string;
}

// Rainforest API bestseller category IDs
// These are VERIFIED WORKING category IDs for amazon.com
// Format: bestsellers_[amazon_category_slug]
const CATEGORIES: Category[] = [
    { id: 'bestsellers_fashion', name: '👗 Clothing & Jewelry' },
    { id: 'bestsellers_appliances', name: '🏠 Appliances' },
    { id: 'bestsellers_toys', name: '🧸 Toys & Games' },
    { id: 'bestsellers_kitchen', name: '🍳 Kitchen & Dining' },
    { id: 'bestsellers_sports', name: '⚽ Sports&Outdoors' },
    { id: 'bestsellers_automotive', name: '🚗 Automotive' },
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
    onPress,
}: {
    category: Category;
    isActive: boolean;
    colors: typeof Colors.light;
    onPress: () => void;
}) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.95, {
            damping: 15,
            stiffness: 300,
        });
        opacity.value = withTiming(0.8, { duration: 100 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, {
            damping: 15,
            stiffness: 300,
        });
        opacity.value = withTiming(1, { duration: 100 });
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
                    backgroundColor: isActive ? colors.chipActiveBg : colors.chipBg,
                    borderColor: isActive ? colors.accent : colors.border,
                    borderWidth: isActive ? 2 : 1.5,
                },
                animatedStyle,
            ]}
        >
            <ThemedText
                style={[
                    styles.chipText,
                    {
                        color: isActive ? colors.chipActiveText : colors.text,
                        fontWeight: isActive ? '700' : '600',
                    },
                ]}
            >
                {category.name}
            </ThemedText>
        </AnimatedTouchableOpacity>
    );
}

export function CategoryChips({ selectedCategory, onSelectCategory }: CategoryChipsProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    return (
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
                        onPress={() => onSelectCategory(category.id)}
                    />
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        marginBottom: 20,
    },
    container: {
        paddingHorizontal: 3,
        paddingVertical: 6,
        gap: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 32,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
            },
        }),
    },
    chipActive: {
        ...Platform.select({
            ios: {
                shadowColor: '#FF9900',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
            },
            android: {
                elevation: 4,
            },
            web: {
                boxShadow: '0 4px 12px rgba(255, 153, 0, 0.3)',
            },
        }),
    },
    chipText: {
        fontSize: 12,
        letterSpacing: 0.2,
        textAlign: 'center',
        lineHeight: 16,
    },
});
