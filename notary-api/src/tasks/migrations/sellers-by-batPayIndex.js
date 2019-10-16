import { sellersByPayIndex } from '../../utils/stores';
import logger from '../../utils/logger';

/*
 Change the storage structure for the sellers_ByPay_Index
 FROM:
  {
    '2': [ '0x026ced01cf64036572f974e610bdfdf4d48d6c00',
            '0x031c9d45d7340ce7b0ceaced880981d7bf31592d' ],
    id: '60'
  }
 TO:
  { '2': { completed: [ '0x026ced01cf64036572f974e610bdfdf4d48d6c00',
          '0x031c9d45d7340ce7b0ceaced880981d7bf31592d' ],
          rejected: []
         },
    id: '64' }
*/

export default async () => {
  logger.info('UPDATE SELLERS_BY_PAY_INDEX STORAGE...');
  const sellersByBatPayIndexOldFormat = (await sellersByPayIndex.list())
    .filter(obj => Array.isArray(obj[Object.keys(obj)[0]]));
  if (sellersByBatPayIndexOldFormat.length === 0) {
    logger.info('NOTHING FOR UPDATE');
    return;
  }
  // Array to save the registers with more than one batPay Id
  const olderFormat = [];
  logger.info('CHANGE TO THE NEW FORMAT...');
  const sellersByBatPayIndexNewFormat = sellersByBatPayIndexOldFormat.map((item) => {
    if (Object.keys(item).length > 2) {
      olderFormat.push(item.id);
    }
    return Object.assign({}, {
      [Object.keys(item)[0]]: Object.keys(item).length > 2
        ?
        ({
          completed: Object.values(item).reduce((acc, val) =>
            (Array.isArray(val) ? acc.concat(val) : acc), []),
          rejected: [],
        })
        :
        Object.values(item)[0].reduce((acc, address) => (
          {
            completed: acc.completed ? [...acc.completed, address] : [address],
            rejected: [],
          }), {}),
      id: item.id,
    });
  });
  logger.info('DELETE REGISTERS WITH MORE THAN ONE BATPAY ID...');
  Promise.all(olderFormat.map(id => sellersByPayIndex.delete(id)));
  logger.info('UPDATING STORE...');
  await Promise.all(sellersByBatPayIndexNewFormat.map(obj =>
    sellersByPayIndex.update(obj.id, obj)));
  logger.info('UPDATE COMPLETED');
};
