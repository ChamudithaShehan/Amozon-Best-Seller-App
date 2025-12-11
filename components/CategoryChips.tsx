import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

interface Category {
    id: string;
    name: string;
}

// Rainforest API bestseller category IDs
// These are VERIFIED WORKING category IDs for amazon.com
// Format: bestsellers_[amazon_category_slug]
const CATEGORIES: Category[] = [
    { id: 'bestsellers_appliances', name: '🏠 Appliances' },
    { id: 'bestsellers_electronics', name: '📱 Electronics' },
    { id: 'bestsellers_books', name: '📚 Books' },
    { id: 'bestsellers_sports', name: '⚽ Sports' },
    { id: 'bestsellers_home', name: '🛋️ Home' },
    { id: 'bestsellers_kitchen', name: '🍳 Kitchen' },
    { id: 'bestsellers_garden', name: '🌿 Garden' },
    { id: 'bestsellers_office', name: '💼 Office' },
    { id: 'bestsellers_videogames', name: '🎮 Video Games' },
    { id: 'bestsellers_music', name: '🎵 Music' },
    { id: 'bestsellers_movies', name: '🎬 Movies' },
];

interface CategoryChipsProps {
    selectedCategory: string;
    onSelectCategory: (categoryId: string) => void;
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
                    <TouchableOpacity
                        key={category.id}
                        onPress={() => onSelectCategory(category.id)}
                        style={[
                            styles.chip,
                            {
                                backgroundColor: isActive ? colors.chipActiveBg : colors.chipBg,
                                borderColor: isActive ? colors.accent : colors.border,
                            },
                        ]}
                        activeOpacity={0.7}
                    >
                        <ThemedText
                            style={[
                                styles.chipText,
                                {
                                    color: isActive ? colors.chipActiveText : colors.text,
                                    fontWeight: isActive ? '700' : '500',
                                },
                            ]}
                        >
                            {category.name}
                        </ThemedText>
                    </TouchableOpacity>
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
        paddingHorizontal: 4,
        paddingVertical: 8,
        gap: 10,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        borderWidth: 1.5,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
            },
        }),
    },
    chipText: {
        fontSize: 14,
        letterSpacing: 0.3,
    },
});
