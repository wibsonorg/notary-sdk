import { createLevelStore, createRedisStore } from './storage';
/**
 * @typedef {import('./storage').LevelStore<K,V>} LevelStore
 * @template K
 * @template V
 */

export const dataOrders = createRedisStore('data_orders:');
export const eventBlocks = createLevelStore('event_blocks');
export const notarizationResults = createLevelStore('notarization_results');
export const dataValidationResults = createLevelStore('data_validation_results');
/** @type {LevelStore<string, number>} */
export const sellers = createLevelStore('sellers');
export const notarizationsKeys = createLevelStore('notarizations_keys');
