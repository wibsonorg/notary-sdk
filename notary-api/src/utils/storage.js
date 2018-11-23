import asyncRedis from 'async-redis';
import redis from 'redis';
import level from 'level';
import config from '../../config';

export const createRedisStore = ns =>
  asyncRedis.decorate(redis.createClient(config.redis.socket, {
    prefix: `notary-api:${ns}`,
  }));

export const createLevelStore = dir =>
  level(`${config.levelDirectory}/${dir}`, (err, db) => {
    if (err) throw new Error(err);
    return db;
  });
