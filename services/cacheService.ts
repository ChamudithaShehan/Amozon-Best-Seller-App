import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = 'bestsellers_cache_';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CachedData<T> {
    data: T;
    timestamp: number;
    categoryId: string;
}

/**
 * Cache service for storing API responses locally
 * Data is cached for 24 hours per category to minimize API costs
 */
export const cacheService = {
    /**
     * Get cached data for a category if it exists and is not expired
     */
    async get<T>(categoryId: string): Promise<T | null> {
        try {
            const cacheKey = `${CACHE_PREFIX}${categoryId}`;
            const cachedJson = await AsyncStorage.getItem(cacheKey);

            if (!cachedJson) {
                console.log(`[Cache] No cache found for ${categoryId}`);
                return null;
            }

            const cached: CachedData<T> = JSON.parse(cachedJson);
            const now = Date.now();
            const age = now - cached.timestamp;

            if (age > CACHE_DURATION_MS) {
                console.log(`[Cache] Cache expired for ${categoryId} (age: ${Math.round(age / 1000 / 60)} minutes)`);
                // Delete expired cache immediately to free storage
                await AsyncStorage.removeItem(cacheKey);
                return null;
            }

            const remainingHours = Math.round((CACHE_DURATION_MS - age) / 1000 / 60 / 60);
            console.log(`[Cache] Using cached data for ${categoryId} (valid for ${remainingHours} more hours)`);
            return cached.data;
        } catch (error) {
            console.error('[Cache] Error reading cache:', error);
            return null;
        }
    },

    /**
     * Store data in cache with current timestamp
     */
    async set<T>(categoryId: string, data: T): Promise<void> {
        try {
            const cacheKey = `${CACHE_PREFIX}${categoryId}`;
            const cacheData: CachedData<T> = {
                data,
                timestamp: Date.now(),
                categoryId,
            };

            await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
            console.log(`[Cache] Stored data for ${categoryId}`);
        } catch (error) {
            console.error('[Cache] Error storing cache:', error);
        }
    },

    /**
     * Clear cache for a specific category
     */
    async clear(categoryId: string): Promise<void> {
        try {
            const cacheKey = `${CACHE_PREFIX}${categoryId}`;
            await AsyncStorage.removeItem(cacheKey);
            console.log(`[Cache] Cleared cache for ${categoryId}`);
        } catch (error) {
            console.error('[Cache] Error clearing cache:', error);
        }
    },

    /**
     * Clear all bestseller caches
     */
    async clearAll(): Promise<void> {
        try {
            const allKeys = await AsyncStorage.getAllKeys();
            const cacheKeys = allKeys.filter(key => key.startsWith(CACHE_PREFIX));

            if (cacheKeys.length > 0) {
                await AsyncStorage.multiRemove(cacheKeys);
                console.log(`[Cache] Cleared ${cacheKeys.length} cached categories`);
            }
        } catch (error) {
            console.error('[Cache] Error clearing all caches:', error);
        }
    },

    /**
     * Remove all expired cache entries (older than 24 hours)
     * This helps prevent storage bloat by cleaning up stale data
     */
    async cleanupExpired(): Promise<number> {
        try {
            const allKeys = await AsyncStorage.getAllKeys();
            const cacheKeys = allKeys.filter(key => key.startsWith(CACHE_PREFIX));
            const expiredKeys: string[] = [];
            const now = Date.now();

            for (const key of cacheKeys) {
                const cachedJson = await AsyncStorage.getItem(key);
                if (cachedJson) {
                    const cached = JSON.parse(cachedJson);
                    const age = now - cached.timestamp;

                    if (age > CACHE_DURATION_MS) {
                        expiredKeys.push(key);
                    }
                }
            }

            if (expiredKeys.length > 0) {
                await AsyncStorage.multiRemove(expiredKeys);
                console.log(`[Cache] Cleaned up ${expiredKeys.length} expired cache entries`);
            } else {
                console.log('[Cache] No expired entries to clean up');
            }

            return expiredKeys.length;
        } catch (error) {
            console.error('[Cache] Error during cleanup:', error);
            return 0;
        }
    },

    /**
     * Get cache info for debugging
     */
    async getInfo(): Promise<{ categoryId: string; age: string; size: number }[]> {
        try {
            const allKeys = await AsyncStorage.getAllKeys();
            const cacheKeys = allKeys.filter(key => key.startsWith(CACHE_PREFIX));
            const info: { categoryId: string; age: string; size: number }[] = [];

            for (const key of cacheKeys) {
                const cachedJson = await AsyncStorage.getItem(key);
                if (cachedJson) {
                    const cached = JSON.parse(cachedJson);
                    const ageMs = Date.now() - cached.timestamp;
                    const ageHours = Math.round(ageMs / 1000 / 60 / 60);
                    info.push({
                        categoryId: cached.categoryId,
                        age: `${ageHours}h`,
                        size: cachedJson.length,
                    });
                }
            }

            return info;
        } catch (error) {
            console.error('[Cache] Error getting info:', error);
            return [];
        }
    },
};
