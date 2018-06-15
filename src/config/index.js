import defaultConf from "../../configuration/default.json";
import developmentConf from "../../configuration/development.json";
import productionConf from "../../configuration/production.json";
import stagingConf from "../../configuration/staging.json";
import localConf from "../../configuration/local.json";

let defaultConfig = Object.assign({}, defaultConf);

let newConf = {};

if (process.env.DEPLOY_ENVIRONMENT === "development") {
  newConf = { ...defaultConfig, ...developmentConf };
} else if (process.env.DEPLOY_ENVIRONMENT === "staging") {
  newConf = { ...defaultConfig, ...stagingConf };
} else if (process.env.DEPLOY_ENVIRONMENT === "production") {
  newConf = { ...defaultConfig, ...productionConf };
} else if (
  process.env.DEPLOY_ENVIRONMENT === "local" ||
  process.env.NODE_ENV === "test"
) {
  newConf = { ...defaultConfig, ...localConf };
}

const config = newConf;
export default config;
