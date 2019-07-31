import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

const fakeCall = {
  call: sinon.stub(),
};

export const { BatPay } = td.replace('../../src/blockchain/contracts', {
  BatPay: {
    methods: {
      accounts: sinon.stub().returns(fakeCall),
    },
  },
});

export const { hashMessage, decryptSignedMessage, packMessage } = td.replace(
  '../../src/utils/wibson-lib/cryptography',
  {
    hashMessage: sinon.stub().returns('someMessage'),
    decryptSignedMessage: sinon.stub().resolves('someMessage'),
    packMessage: sinon.stub(),
  },
);

export const { sellersByPayIndex } = td.replace('../../src/utils/stores', {
  sellersByPayIndex: {
    safeFetch: sinon
      .stub()
      .resolves({
        8: ['0x075a22bc34b55322cabb0aa87d9e590e01b942c4'],
        9: ['0x075a22bc34b55322cabb0aa87d9e590e01b942c5'],
        10: ['0x075a22bc34b55322cabb0aa87d9e590e01b942c6'],
      }),
  },
});

test.beforeEach(() => {
  BatPay.methods.accounts().call.resolves(['0x051027180c70923729e8f090bba0d378bc949ce5']);
});

test.afterEach(sinon.resetHistory);
