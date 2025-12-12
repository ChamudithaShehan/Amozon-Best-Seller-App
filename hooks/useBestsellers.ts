import { cacheService } from '@/services/cacheService';
import { BestsellerProduct, rainforestApi } from '@/services/rainforestApi';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseBestsellersReturn {
  bestsellers: BestsellerProduct[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fromCache: boolean;
  lastUpdated: Date | null;
}

interface CachedBestsellersData {
  bestsellers: BestsellerProduct[];
  fetchedAt: number;
}

export function useBestsellers(
  options: {
    categoryId?: string;
    amazonDomain?: string;
    language?: string;
  } = {}
): UseBestsellersReturn {
  const [bestsellers, setBestsellers] = useState<BestsellerProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const cacheCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

  const categoryId = options.categoryId || 'bestsellers_fashion';

  const fetchBestsellers = useCallback(async (forceRefresh: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = await cacheService.get<CachedBestsellersData>(categoryId);

        if (cached && cached.bestsellers && cached.bestsellers.length > 0) {
          console.log(`[useBestsellers] Using cached data for ${categoryId}`);
          setBestsellers(cached.bestsellers);
          setFromCache(true);
          setLastUpdated(new Date(cached.fetchedAt));
          setLoading(false);
          return;
        }
      }

      // No cache or force refresh - fetch from API
      console.log(`[useBestsellers] Fetching fresh data for ${categoryId} from API...`);
      const data = await rainforestApi.getBestsellers(options);
      const products = data.bestsellers || [];

      setBestsellers(products);
      setFromCache(false);
      setLastUpdated(new Date());

      // Store in cache for future use
      if (products.length > 0) {
        const fetchedAt = Date.now();
        await cacheService.set<CachedBestsellersData>(categoryId, {
          bestsellers: products,
          fetchedAt,
        });
        console.log(`[useBestsellers] Cached ${products.length} products for ${categoryId}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bestsellers';
      setError(errorMessage);

      // On error, try to use stale cache as fallback
      try {
        const staleCache = await cacheService.get<CachedBestsellersData>(categoryId);
        if (staleCache && staleCache.bestsellers && staleCache.bestsellers.length > 0) {
          console.log(`[useBestsellers] Using stale cache as fallback for ${categoryId}`);
          setBestsellers(staleCache.bestsellers);
          setFromCache(true);
          setLastUpdated(new Date(staleCache.fetchedAt));
          setError(`${errorMessage} (showing cached data)`);
        } else {
          setBestsellers([]);
        }
      } catch {
        setBestsellers([]);
      }
    } finally {
      setLoading(false);
    }
  }, [categoryId, options.amazonDomain, options.language]);

  // Force refresh function (bypasses cache)
  const refetch = useCallback(async () => {
    await fetchBestsellers(true);
  }, [fetchBestsellers]);

  // Initial fetch
  useEffect(() => {
    fetchBestsellers(false);
  }, [fetchBestsellers]);

  // Periodically check if cache has expired and refresh if needed
  useEffect(() => {
    if (!lastUpdated || !fromCache) return;

    const checkAndRefreshIfExpired = () => {
      const age = Date.now() - lastUpdated.getTime();

      if (age > CACHE_DURATION_MS) {
        console.log(`[useBestsellers] Cache expired for ${categoryId}, auto-refreshing...`);
        fetchBestsellers(false); // This will delete expired cache and fetch fresh data
      }
    };

    // Check every hour if we're using cached data
    cacheCheckIntervalRef.current = setInterval(checkAndRefreshIfExpired, 60 * 60 * 1000); // Every hour
    // Also check immediately in case cache expired while component was mounted
    checkAndRefreshIfExpired();

    return () => {
      if (cacheCheckIntervalRef.current) {
        clearInterval(cacheCheckIntervalRef.current);
      }
    };
  }, [fromCache, lastUpdated, categoryId, fetchBestsellers]);

  return {
    bestsellers,
    loading,
    error,
    refetch,
    fromCache,
    lastUpdated,
  };
}
