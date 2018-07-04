require('dotenv').config();

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  log: {
    error: process.env.ERROR_LOG,
    combined: process.env.COMBINED_LOG,
  },
};

export default config;
