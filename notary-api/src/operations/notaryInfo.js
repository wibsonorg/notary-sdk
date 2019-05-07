import config from '../../config';
import signingService from '../services/signingService';

export const getSignedNotaryInfo = async () => {
  try {
    const { notaryName, notaryPublicBaseUrl } = config;
    const info = {
      name: notaryName,
      notarizationUrl: `${notaryPublicBaseUrl}/buyers/notarization-request`,
      dataResponsesUrl: `${notaryPublicBaseUrl}/data-responses`,
      headsUpUrl: `${notaryPublicBaseUrl}/sellers/heads-up`,
    };

    const response = await signingService.signNotaryInfo(info);
    return response;
  } catch (error) {
    return { error };
  }
};
