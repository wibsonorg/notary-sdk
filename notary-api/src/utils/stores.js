import { createLevelStore } from './storage';

export const eventBlocks = createLevelStore('event_blocks');
export const notarizationResults = createLevelStore('notarization_results');
export const dataValidationResults = createLevelStore('data_validation_results');
export const sellers = createLevelStore('sellers');
