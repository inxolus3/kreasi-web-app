import NodeCache from 'node-cache';

export const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

export const getCacheKey = (req: { originalUrl: string; query?: unknown; method?: string }) => {
  return `${req.method || 'GET'}:${req.originalUrl}`;
};

export const cacheAsync = async <T>(key: string, fetcher: () => Promise<T>, ttlSeconds = 600): Promise<T> => {
  const cached = cache.get<T>(key);
  if (cached !== undefined) {
    return cached;
  }

  const value = await fetcher();
  cache.set(key, value, ttlSeconds);
  return value;
};

export const invalidateCache = (key: string) => {
  cache.del(key);
};
