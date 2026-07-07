import NodeCache from 'node-cache';

// Default TTL of 10 minutes (600 seconds) and check period of 2 minutes
export const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

// Helper to generate a cache key from requests
export const getCacheKey = (req: { originalUrl: string; query?: any; method?: string }) => {
  return `${req.method || 'GET'}:${req.originalUrl}`;
};
