import { Request, Response, NextFunction } from 'express';
import { createLogger } from '../lib/logger';
import { cacheService, CacheOptions } from '../services/cache.service';

export interface CacheMiddlewareOptions extends CacheOptions {
  keyFn: (req: Request) => string;
}

const logger = createLogger({ component: 'cache-middleware' });

/**
 * Express middleware implementing stale-while-revalidate for public API endpoints.
 *   - Fresh hit  → serve from cache (X-Cache: HIT)
 *   - Stale hit  → serve stale data to client (X-Cache: STALE), then run the
 *                   route handler to refresh the cache in the background
 *   - Cache miss → fall through to route handler, cache the response (X-Cache: MISS)
 */
export function cacheMiddleware(options: CacheMiddlewareOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = options.keyFn(req);
    let servedStale = false;

    try {
      const entry = await cacheService.get(key);

      if (entry) {
        const stale = cacheService.isStale(entry, options.ttl);

        if (!stale) {
          // Fresh cache hit — serve and return
          res.set('X-Cache', 'HIT');
          res.set('X-Cache-Key', key);
          res.set('Cache-Control', `public, max-age=${options.ttl}`);
          return res.json(entry.data);
        }

        // Stale — serve stale data to client immediately
        res.set('X-Cache', 'STALE');
        res.set('X-Cache-Key', key);
        res.set('Cache-Control', `public, max-age=${options.ttl}`);
        res.json(entry.data);
        servedStale = true;
        // Fall through to run handler for background revalidation
      }
    } catch (err) {
      logger.warn({ err, key }, 'Failed to read cache entry; falling back to origin');
      // Redis error — fall through to origin
    }

    if (!servedStale) {
      // Cache miss
      res.set('X-Cache', 'MISS');
      res.set('X-Cache-Key', key);
    }

    // When stale data was already sent, prevent the route handler from touching
    // the committed response (res.set/setHeader throw ERR_HTTP_HEADERS_SENT).
    if (servedStale) {
      const noop = () => res;
      res.setHeader = noop as typeof res.setHeader;
      res.set = noop as typeof res.set;
    }

    // Intercept res.json to cache the handler's response
    const originalJson = res.json.bind(res);
    res.json = (body: unknown) => {
      // Only cache successful (2xx) responses — never cache errors
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheService
          .set(key, body, options)
          .catch((err) => logger.warn({ err, key }, 'Failed to write cache entry'));
      }

      if (servedStale) {
        // Already sent stale response to client — just update cache, don't send again
        return res;
      }
      return originalJson(body);
    };

    next();
  };
}
