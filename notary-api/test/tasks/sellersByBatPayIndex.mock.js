import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const sellersByPayIndexOldFacade = [
  {
    2: ['0x026ced01cf64036572f974e610bdfdf4d48d6c00', '0x031c9d45d7340ce7b0ceaced880981d7bf31592d'],
    id: '60',
  },
  { 2: ['0x05b09bd3cadca1426a1666deeca984c6a4da2f1f'], id: '61' },
  { 2: ['0x0366d07c1b76dda76a01fd1a1938fbb3615fdf8c'], id: '62' },
  {
    2: ['0x036933d5df3c361a14d01055a83ced8a40f5dd5c', '0x03ab9d7756148b0d0ad5c591319b95d3166ea2b8', '0x044f8e4a52f81e2282a9c25871c304df1086b82e', '0x0471299ca1595318e155047600135bdbb9b7b36b', '0x07197cfc0e1853b2cd82c2c8804deb8fc6fabfc1'],
    id: '63',
  }];

export const { sellersByPayIndex } = td.replace('../../src/utils/stores', {
  sellersByPayIndex: {
    list: sinon.stub().resolves(sellersByPayIndexOldFacade),
    update: sinon.stub(),
  },
});

export const logger = td.replace('../../src/utils/logger', { info: sinon.stub() });
