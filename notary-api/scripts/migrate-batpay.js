const loadEnv = require('../src/utils/wibson-lib/loadEnv').default;

loadEnv();

const {
  // REMOVE
  //   dataValidationResults, // UNUSED
  // IGNORE (not related)
  //   dataOrders,
  //   eventBlocks,
  // KEEP
  //   notarizationResults, // will flush
  //   dataResponses, // will flush
  // CLEAR
  sellers, // new BatPay == new ids
  sellersByPayIndex, // payIndex is the key
} = require('../src/utils/stores');
const logger = require('../src/utils/logger');

const celarDB = async db => db.deleteList(await db.listKeys());
const isEmpty = async db => (await db.listKeys()).length === 0;

async function migrate() {
  logger.info('CLEAR DBS...');
  const dbsToClear = [
    sellers,
    sellersByPayIndex,
  ];
  await Promise.all(dbsToClear.map(celarDB));
  const clearCount = (await Promise.all(dbsToClear.map(isEmpty)))
    .filter(x => x).length;
  logger.info(`DBS CLEARED: ${clearCount}/${dbsToClear.length}`);
  logger.info('END.');
}

migrate().then(() => process.exit());
