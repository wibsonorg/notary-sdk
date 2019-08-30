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

export const { packMessage } = td.replace(
  '../../src/utils/wibson-lib/cryptography',
  {
    packMessage: sinon.stub().returns('someMessage'),
  },
);

export const { decryptData } = td.replace('../../src/services/signingService', {
  decryptData: sinon.stub().resolves('someMessage'),
});

export const { sellersByPayIndex } = td.replace('../../src/utils/stores', {
  sellersByPayIndex: {
    safeFetch: sinon
      .stub()
      .resolves({
        8: { completed: ['0x075a22bc34b55322cabb0aa87d9e590e01b942c4'] },
        9: { completed: ['0x075a22bc34b55322cabb0aa87d9e590e01b942c5'] },
        10: { completed: ['0x075a22bc34b55322cabb0aa87d9e590e01b942c6'] },
      }),
  },
});

test.beforeEach(() => {
  BatPay.methods.accounts().call.resolves({ owner: '0x051027180c70923729e8f090bba0d378bc949ce5' });
});

test.afterEach(sinon.resetHistory);
