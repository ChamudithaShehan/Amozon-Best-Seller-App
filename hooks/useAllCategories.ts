import { cacheService } from '@/services/cacheService';
import { BestsellerProduct, rainforestApi } from '@/services/rainforestApi';
import { useCallback, useEffect, useState } from 'react';

// All verified working category IDs
const ALL_CATEGORIES = [
    { id: 'bestsellers_appliances', name: 'Appliances' },
    { id: 'bestsellers_electronics', name: 'Electronics' },
    { id: 'bestsellers_books', name: 'Books' },
    { id: 'bestsellers_sports', name: 'Sports' },
    { id: 'bestsellers_home', name: 'Home' },
    { id: 'bestsellers_kitchen', name: 'Kitchen' },
    { id: 'bestsellers_garden', name: 'Garden' },
    { id: 'bestsellers_office', name: 'Office' },
    { id: 'bestsellers_videogames', name: 'Video Games' },
    { id: 'bestsellers_music', name: 'Music' },
    { id: 'bestsellers_movies', name: 'Movies' },
];

export interface CategoryData {
    categoryId: string;
    categoryName: string;
    products: BestsellerProduct[];
    fetchedAt: number;
}

export interface AllCategoriesData {
    categories: CategoryData[];
    lastFullFetch: number;
}

interface TrendingProduct {
    product: BestsellerProduct;
    categoryName: string;
}

interface PriceStats {
    category: string;
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
    productCount: number;
}

interface UseAllCategoriesReturn {
    loading: boolean;
    error: string | null;
    trendingProducts: TrendingProduct[];
    priceInsights: PriceStats[];
    topRatedProducts: TrendingProduct[];
    allCategories: CategoryData[];
    refetchAll: () => Promise<void>;
    lastUpdated: Date | null;
}

const ALL_CATEGORIES_CACHE_KEY = 'all_categories_data';

export function useAllCategories(): UseAllCategoriesReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [allData, setAllData] = useState<AllCategoriesData | null>(null);

    const fetchAllCategories = useCallback(async (forceRefresh: boolean = false) => {
        setLoading(true);
        setError(null);

        try {
            // Check cache first
            if (!forceRefresh) {
                const cached = await cacheService.get<AllCategoriesData>(ALL_CATEGORIES_CACHE_KEY);
                if (cached && cached.categories && cached.categories.length > 0) {
                    console.log('[useAllCategories] Using cached data for all categories');
                    setAllData(cached);
                    setLoading(false);
                    return;
                }
            }

            console.log('[useAllCategories] Fetching all categories from API...');

            // Fetch all categories in parallel
            const fetchPromises = ALL_CATEGORIES.map(async (cat) => {
                try {
                    // First check individual category cache
                    const cachedCategory = await cacheService.get<{ bestsellers: BestsellerProduct[], fetchedAt: number }>(cat.id);
                    if (cachedCategory && cachedCategory.bestsellers) {
                        return {
                            categoryId: cat.id,
                            categoryName: cat.name,
                            products: cachedCategory.bestsellers,
                            fetchedAt: cachedCategory.fetchedAt,
                        };
                    }

                    // Fetch from API
                    const data = await rainforestApi.getBestsellers({ categoryId: cat.id });
                    const products = data.bestsellers || [];

                    // Cache individual category
                    await cacheService.set(cat.id, {
                        bestsellers: products,
                        fetchedAt: Date.now(),
                    });

                    return {
                        categoryId: cat.id,
                        categoryName: cat.name,
                        products,
                        fetchedAt: Date.now(),
                    };
                } catch (err) {
                    console.error(`[useAllCategories] Error fetching ${cat.name}:`, err);
                    return {
                        categoryId: cat.id,
                        categoryName: cat.name,
                        products: [],
                        fetchedAt: Date.now(),
                    };
                }
            });

            const categories = await Promise.all(fetchPromises);

            const allCategoriesData: AllCategoriesData = {
                categories,
                lastFullFetch: Date.now(),
            };

            // Cache all categories data
            await cacheService.set(ALL_CATEGORIES_CACHE_KEY, allCategoriesData);
            setAllData(allCategoriesData);

            console.log(`[useAllCategories] Fetched ${categories.length} categories`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
            setError(errorMessage);
            console.error('[useAllCategories] Error:', errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch on mount
    useEffect(() => {
        fetchAllCategories(false);
    }, [fetchAllCategories]);

    // Compute trending products (top 1 from each category)
    const trendingProducts: TrendingProduct[] = (allData?.categories || [])
        .filter(cat => cat.products.length > 0)
        .map(cat => ({
            product: cat.products[0],
            categoryName: cat.categoryName,
        }));

    // Compute price insights
    const priceInsights: PriceStats[] = (allData?.categories || [])
        .filter(cat => cat.products.length > 0)
        .map(cat => {
            const prices = cat.products
                .map(p => p.price?.value)
                .filter((p): p is number => p !== undefined && p > 0);

            if (prices.length === 0) {
                return {
                    category: cat.categoryName,
                    avgPrice: 0,
                    minPrice: 0,
                    maxPrice: 0,
                    productCount: cat.products.length,
                };
            }

            return {
                category: cat.categoryName,
                avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
                minPrice: Math.min(...prices),
                maxPrice: Math.max(...prices),
                productCount: cat.products.length,
            };
        });

    // Compute top rated products
    const topRatedProducts: TrendingProduct[] = (allData?.categories || [])
        .flatMap(cat =>
            cat.products
                .filter(p => p.rating && p.rating > 0)
                .map(product => ({ product, categoryName: cat.categoryName }))
        )
        .sort((a, b) => (b.product.rating || 0) - (a.product.rating || 0))
        .slice(0, 20);

    return {
        loading,
        error,
        trendingProducts,
        priceInsights,
        topRatedProducts,
        allCategories: allData?.categories || [],
        refetchAll: () => fetchAllCategories(true),
        lastUpdated: allData ? new Date(allData.lastFullFetch) : null,
    };
}
