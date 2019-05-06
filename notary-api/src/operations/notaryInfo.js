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

    return signingService.signNotaryInfo(info);
  } catch (error) {
    return { error };
  }
};
