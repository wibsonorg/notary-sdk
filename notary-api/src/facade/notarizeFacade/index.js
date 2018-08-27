export {
  notarize,
  updateNotarizationResultFromValidation,
  fetchNotarizationResultOrNotarize,
} from './notarize';
export {
  fetchNotarizationResult,
  storeNotarizationResult,
  deleteNotarizationResult, // TODO: remove before merging
} from './notarizationResultRepository';
export { fetchAndRemoveValidationResult } from './validateData';
