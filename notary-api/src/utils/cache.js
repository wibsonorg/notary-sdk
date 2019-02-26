import apicache from 'apicache';
import redis from 'redis';
import config from '../../config';

const redisCache = () =>
  redis.createClient(config.redis.url, { prefix: 'cache' });

const defaultApiCache = apicache.options({
  enabled: config.cache === 'enabled',
  debug: config.env !== 'production',
  redisClient: config.cache === 'enabled' && redisCache(),
  statusCodes: {
    include: [200], // caches ONLY responses with a success/200 code)
  },
});

const cache = defaultApiCache.middleware;

export const cacheWithoutCacheControl = defaultApiCache.clone()
  .options({
    headers: {
      'cache-control': 'no-cache',
    },
  }).middleware;

export default cache;
