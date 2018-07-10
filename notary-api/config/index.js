require('dotenv').config();

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  log: {
    error: process.env.ERROR_LOG,
    combined: process.env.COMBINED_LOG,
  },
  privateKey: process.env.PRIVATE_KEY,
  orderAddress: process.env.ORDER_ADDRESS,
  responsesPercentage: process.env.RESPONSES_PERCENTAGE,
  notarizationFee: process.env.NOTARIZATION_FEE,
  notarizationTermsOfService: process.env.NOTARIZATION_TERMS_OF_SERVIE,
};

export default config;
