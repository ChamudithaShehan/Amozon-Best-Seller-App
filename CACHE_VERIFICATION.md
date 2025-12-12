# Quick Reference: Cache System Verification

## ✅ What Was Implemented

1. **Automatic Cache Cleanup** - Removes expired data (>24 hours) on app startup
2. **24-Hour Cache Duration** - Data automatically refreshes daily
3. **Smart Fallback** - Uses stale cache if API fails

## 🔍 Verify It's Working

### After Hot Reload

Look for this in your Expo console when the app reloads:

```
[Cache] No expired entries to clean up
```
OR (if you had old cache):
```
[Cache] Cleaned up X expired cache entries
```

### Navigate to Any Category

You should see:
```
[Cache] Using cached data for [category] (valid for X more hours)
[useBestsellers] Using cached data for [category]
```

This confirms the cache is working! 🎉

## 📊 Monitor Cache Usage

To see all cached data, add this temporarily to any component:

```typescript
import { cacheService } from '@/services/cacheService';

// In useEffect:
cacheService.getInfo().then(info => console.log('[Cache Info]', info));
```

## ⚙️ Cache Settings

| Setting | Value | File |
|---------|-------|------|
| Duration | 24 hours | `services/cacheService.ts` |
| Cleanup | On app startup | `app/_layout.tsx` |
| Prefix | `bestsellers_cache_` | `services/cacheService.ts` |

## 🧪 Test Cache Expiry

To test without waiting 24 hours:

1. In `services/cacheService.ts`, temporarily change:
   ```typescript
   const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes
   ```
2. Launch app → wait 5 mins → restart app
3. Should see: `[Cache] Cleaned up X expired cache entries`
4. Change back to 24 hours when done testing

## 🎯 Expected Behavior

- **First launch**: Fetch from API → Store in cache
- **Within 24h**: Use cache → Fast load, no API calls  
- **After 24h**: Fetch fresh → Update cache
- **App startup**: Remove expired entries → Clean storage
