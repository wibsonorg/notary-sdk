const loadEnv = require('../src/utils/wibson-lib/loadEnv').default;

loadEnv();

const {
  // REMOVE
  //   dataValidationResults, // UNUSED
  // IGNORE (not related)
  //   dataOrders,
  //   eventBlocks,
  // KEEP
  //   dataResponses, // will flush
  // CLEAR
  sellers, // new BatPay == new ids
  sellersByPayIndex, // payIndex is the key
  // UPDATE
  notarizationResults, // ['accepted', 'validating'].includes(r.status) -> { status: 'responded' }
} = require('../src/utils/stores');
const logger = require('../src/utils/logger');

const celarDB = async db => db.deleteList(await db.listKeys());
const isEmpty = async db => (await db.listKeys()).length === 0;

async function migrate() {
  logger.info('UPDATE NOTARIZATION RESULTS...');
  await Promise.all((await notarizationResults.list())
    .filter(r => ['accepted', 'validating'].includes(r.status))
    .map(r => notarizationResults.update(r.id, {
      status: 'responded', statusReason: 'Status set in migration to BatPay v2.1',
    })));
  logger.info('VERIFYING NOTARIZATION RESULTS...');
  const results = await notarizationResults.list();
  const respondedResults = results.filter(a => a.status === 'responded').length;
  logger.info(`RESPONDED NOTARIZATION RESULTS: ${respondedResults}/${results.length}`);
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
