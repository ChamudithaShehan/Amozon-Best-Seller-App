import { cacheService } from '@/services/cacheService';
import { BestsellerProduct, rainforestApi } from '@/services/rainforestApi';
import { useCallback, useEffect, useState } from 'react';

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

  const categoryId = options.categoryId || 'bestsellers_appliances';

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
        await cacheService.set<CachedBestsellersData>(categoryId, {
          bestsellers: products,
          fetchedAt: Date.now(),
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

  useEffect(() => {
    fetchBestsellers(false);
  }, [fetchBestsellers]);

  return {
    bestsellers,
    loading,
    error,
    refetch,
    fromCache,
    lastUpdated,
  };
}
