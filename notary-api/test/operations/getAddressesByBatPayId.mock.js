import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const { BatPay } = td.replace('../../src/blockchain/contracts', {
  BatPay: {
    methods: {
      accounts: () => ({
        call: sinon.stub().resolves(['0x051027180c70923729e8f090bba0d378bc949ce5']),
      }),
    },
  },
});

export const { hashMessage, decryptSignedMessage } = td.replace(
  '../../src/utils/wibson-lib/cryptography',
  {
    hashMessage: sinon.stub().returns('someMessage'),
    decryptSignedMessage: sinon.stub().resolves('someMessage'),
  },
);

export const { sellersByPayIndex } = td.replace('../../src/utils/stores', {
  sellersByPayIndex: {
    safeFetch: sinon
      .stub()
      .resolves([
        '0x075a22bc34b55322cabb0aa87d9e590e01b942c4',
        '0x075a22bc34b55322cabb0aa87d9e590e01b942c5',
        '0x075a22bc34b55322cabb0aa87d9e590e01b942c6',
      ]),
  },
});

test.afterEach(sinon.reset);
