import { Request, Response, NextFunction } from 'express';
import { cache, getCacheKey } from '../utils/cache';
import { logger } from '../utils/logger';

/**
 * Cache middleware generator.
 * @param resourceType Unique string identifying the resource group (e.g., 'billboards', 'pages', 'settings')
 * @param ttlSeconds Optional custom TTL for this endpoint in seconds (defaults to standard cache TTL)
 */
export const cacheMiddleware = (resourceType: string, ttlSeconds?: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = getCacheKey(req);
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      logger.info({ key }, `Cache hit for ${resourceType}`);
      res.json(cachedResponse);
      return;
    }

    logger.info({ key }, `Cache miss for ${resourceType}`);

    // Override res.json to capture response body and store it in cache
    const originalJson = res.json;
    res.json = function (body: any): Response {
      res.json = originalJson;
      
      // Store in cache if status code is successful (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        if (ttlSeconds !== undefined) {
          cache.set(key, body, ttlSeconds);
        } else {
          cache.set(key, body);
        }
        
        // Track the key under resourceType tag to allow smart invalidation
        const keysForResource = (cache.get<string[]>(`tags:${resourceType}`) || []);
        if (!keysForResource.includes(key)) {
          keysForResource.push(key);
          cache.set(`tags:${resourceType}`, keysForResource);
        }
      }
      
      return originalJson.call(this, body);
    };

    next();
  };
};

/**
 * Middleware to invalidate cache on state-changing requests (POST, PUT, PATCH, DELETE)
 */
export const invalidateCacheMiddleware = (resourceType: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const isWrite = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
    if (!isWrite) {
      return next();
    }

    const originalJson = res.json;
    res.json = function (body: any): Response {
      res.json = originalJson;

      if (res.statusCode >= 200 && res.statusCode < 300) {
        logger.info(`Invalidating cache for resource: ${resourceType}`);
        const keysForResource = cache.get<string[]>(`tags:${resourceType}`) || [];
        keysForResource.forEach((key) => {
          cache.del(key);
        });
        cache.del(`tags:${resourceType}`);
      }

      return originalJson.call(this, body);
    };

    next();
  };
};
