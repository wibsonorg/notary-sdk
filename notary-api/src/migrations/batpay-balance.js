const loadEnv = require('../utils/wibson-lib/loadEnv').default;

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
} = require('../utils/stores');
const logger = require('../utils/logger');

async function migrate() {
  logger.info('UPDATE NOTARIZATION RESULTS...');
  const updatedNotarizationResults = (await Promise.all((await notarizationResults.list())
    .filter(r => ['accepted', 'validating', 'validated'].includes(r.status))
    .map(r => notarizationResults.update(r.id, {
      status: 'responded', statusReason: 'Status set in migration to BatPay v2.1',
    })))).length;
  logger.info(`UPDATED NOTARIZATION RESULTS ${updatedNotarizationResults}`);
  logger.info('VERIFYING NOTARIZATION RESULTS...');
  const results = await notarizationResults.list();
  const respondedResults = results.filter(a => a.status === 'responded').length;
  logger.info(`RESPONDED NOTARIZATION RESULTS: ${respondedResults}/${results.length}`);
  logger.info('CLEAR DBS...');
  const dbsToClear = [
    sellers,
    sellersByPayIndex,
  ];
  const clearDB = async db => db.deleteList(await db.listKeys());
  await Promise.all(dbsToClear.map(clearDB));
  const isEmpty = async db => (await db.listKeys()).length === 0;
  const clearCount = (await Promise.all(dbsToClear.map(isEmpty))).filter(x => x).length;
  logger.info(`DBS CLEARED: ${clearCount}/${dbsToClear.length}`);
  logger.info('END.');
}

migrate().then(() => process.exit());
