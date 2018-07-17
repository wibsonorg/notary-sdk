import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import app from '../../src/app';
import config from '../../config';

const {
  orderAddress,
  responsesPercentage,
  notarizationFee,
  notarizationTermsOfService,
  signature,
} = config;

function requestPost(done, uri, payload = {}, fn) {
  request(app)
    .post(uri)
    .send(payload)
    .set('Accept', 'application/json')
    .expect(fn)
    .end(done);
}

function requestGet(done, uri, fn) {
  request(app)
    .get(uri)
    .set('Accept', 'application/json')
    .expect(fn)
    .end(done);
}

describe('#GET /buyers', () => {
  it('responds with status 200', (done) => {
    requestGet(done, '/buyers', (res) => {
      expect(res.status).to.be.equal(200);
    });
  });
});

describe('#GET /buyers', () => {
  it('responds with JSON', (done) => {
    requestGet(done, '/buyers', (res) => {
      expect(res.type).to.be.equal('application/json');
    });
  });
});

const validOrderAddress = 'this-is-a-valid-data-order';
const invalidOrderAddress = 'this-is-an-invalid-dataorder';
const validBuyerAddress = 'this-is-a-valid-buyer-address';

describe('#GET /buyers/audit/consent/:buyerAddress/:orderAddress', () => {
  context('when the orderAddress is an invalid orderAddress', () => {
    it('responds with status 400', (done) => {
      requestGet(
        done,
        `/buyers/audit/consent/${validBuyerAddress}/${invalidOrderAddress}`,
        (res) => {
          expect(res.status).to.be.equal(400);
        },
      );
    });

    it('responds with TEXT', (done) => {
      requestGet(
        done,
        `/buyers/audit/consent/${validBuyerAddress}/${invalidOrderAddress}`,
        (res) => {
          expect(res.type).to.be.equal('application/json');
        },
      );
    });
  });
});

describe('#GET /buyers/audit/consent/:buyerAddress/:orderAddress', () => {
  beforeEach(() => {
    sinon.stub(axios, 'post')
      .returns(Promise.resolve({ data: { signature } }));
  });

  afterEach(() => {
    axios.post.restore();
  });

  context('when the orderAddress is a valid orderAddress', () => {
    it('responds with status 200', (done) => {
      requestGet(
        done,
        `/buyers/audit/consent/${validBuyerAddress}/${orderAddress}`,
        (res) => {
          expect(res.status).to.be.equal(200);
        },
      );
    });

    it('responds with JSON', (done) => {
      requestGet(
        done,
        `/buyers/audit/consent/${validBuyerAddress}/${orderAddress}`,
        (res) => {
          expect(res.type).to.be.equal('application/json');
        },
      );
    });

    it('responds with an object with an orderAdress property', (done) => {
      requestGet(
        done,
        `/buyers/audit/consent/${validBuyerAddress}/${orderAddress}`,
        (res) => {
          expect(res.body).to.haveOwnProperty('orderAddress');
        },
      );
    });

    it('responds the correct orderAdress', (done) => {
      requestGet(
        done,
        `/buyers/audit/consent/${validBuyerAddress}/${orderAddress}`,
        (res) => {
          expect(res.body.orderAddress).to.be.equal(orderAddress);
        },
      );
    });

    it(
      'responds with an object with an responsesPercentage property',
      (done) => {
        requestGet(
          done,
          `/buyers/audit/consent/${validBuyerAddress}/${orderAddress}`,
          (res) => {
            expect(res.body).to.haveOwnProperty('responsesPercentage');
          },
        );
      },
    );

    it('responds the correct responsesPercentage', (done) => {
      requestGet(
        done,
        `/buyers/audit/consent/${validBuyerAddress}/${orderAddress}`,
        (res) => {
          expect(res.body.responsesPercentage).to.be.equal(responsesPercentage);
        },
      );
    });

    it('responds with an object with an notarizationFee property', (done) => {
      requestGet(
        done,
        `/buyers/audit/consent/${validBuyerAddress}/${orderAddress}`,
        (res) => {
          expect(res.body).to.haveOwnProperty('notarizationFee');
        },
      );
    });

    it('responds the correct notarizationFee', (done) => {
      requestGet(
        done,
        `/buyers/audit/consent/${validBuyerAddress}/${orderAddress}`,
        (res) => {
          expect(res.body.notarizationFee).to.be.equal(notarizationFee);
        },
      );
    });

    it(
      'responds with an object with an notarizationTermsOfService property',
      (done) => {
        requestGet(
          done,
          `/buyers/audit/consent/${validBuyerAddress}/${orderAddress}`,
          (res) => {
            expect(res.body).to.haveOwnProperty('notarizationTermsOfService');
          },
        );
      },
    );

    it('responds the correct notarizationTermsOfService', (done) => {
      requestGet(
        done,
        `/buyers/audit/consent/${validBuyerAddress}/${orderAddress}`,
        (res) => {
          expect(res.body.notarizationTermsOfService)
            .to.be.equal(notarizationTermsOfService);
        },
      );
    });

    it('responds with an object with a signature property', (done) => {
      requestGet(
        done,
        `/buyers/audit/consent/${validBuyerAddress}/${orderAddress}`,
        (res) => {
          expect(res.body).to.haveOwnProperty('signature');
        },
      );
    });

    it('responds with a correct signature', (done) => {
      requestGet(
        done,
        `/buyers/audit/consent/${validBuyerAddress}/${orderAddress}`,
        (res) => {
          expect(res.body.signature).to.be.equal(signature);
        },
      );
    });
  });
});

describe('#POST /buyers/audit/result/:buyerAddress/:orderAddress', () => {
  context('when the payload its empty', () => {
    it('responds with 400', (done) => {
      requestPost(
        done,
        `/buyers/audit/result/${validBuyerAddress}/${validOrderAddress}`,
        {},
        (res) => {
          expect(res.type).to.be.equal('application/json');
          expect(res.status).to.be.equal(400);
        },
      );
    });
  });

  context('when the list of data-responses its empty', () => {
    it('responds with an empty list of data-responses', (done) => {
      requestPost(
        done,
        `/buyers/audit/result/${validBuyerAddress}/${orderAddress}`,
        { dataResponses: [] },
        (res) => {
          expect(res.status).to.be.equal(200);
          expect(res.type).to.be.equal('application/json');
          expect(res.body).to.ownProperty('dataResponses');
          expect(res.body.dataResponses).to.have.a.lengthOf(0);
        },
      );
    });
  });

  const sellerAddress1 = 'this-is-a-seller-address-1';
  const sellerAddress2 = 'this-is-a-seller-address-2';
  const sellerAddress3 = 'this-is-a-seller-address-3';

  context('when the list of dataResponses have a length of 1', () => {
    it('responds with a list of dataResponses with a length of 1', (done) => {
      requestPost(
        done,
        `/buyers/audit/result/${validBuyerAddress}/${orderAddress}`,
        { dataResponses: [{ seller: sellerAddress1 }] },
        (res) => {
          expect(res.status).to.be.equal(200);
          expect(res.type).to.be.equal('application/json');
          expect(res.body).to.ownProperty('dataResponses');
          expect(res.body.dataResponses).to.have.a.lengthOf(1);
        },
      );
    });

    it('responds with the same seller', (done) => {
      requestPost(
        done,
        `/buyers/audit/result/${validBuyerAddress}/${orderAddress}`,
        { dataResponses: [{ seller: sellerAddress1 }] },
        (res) => {
          expect(res.body.dataResponses[0]).to.have.ownProperty('seller');
          expect(res.body.dataResponses[0].seller).to.be.equal(sellerAddress1);
        },
      );
    });

    it('responds with the a result', (done) => {
      requestPost(
        done,
        `/buyers/audit/result/${validBuyerAddress}/${orderAddress}`,
        { dataResponses: [{ seller: sellerAddress1 }] },
        (res) => {
          expect(res.body.dataResponses[0]).to.have.ownProperty('result');
        },
      );
    });

    it('responds with the a succes or na result', (done) => {
      requestPost(
        done,
        `/buyers/audit/result/${validBuyerAddress}/${orderAddress}`,
        { dataResponses: [{ seller: sellerAddress1 }] },
        (res) => {
          expect(res.body.dataResponses[0].result)
            .to.satisfy(result => result === 'success' || result === 'na');
        },
      );
    });

    it('responds with the a signature', (done) => {
      requestPost(
        done,
        `/buyers/audit/result/${validBuyerAddress}/${orderAddress}`,
        { dataResponses: [{ seller: sellerAddress1 }] },
        (res) => {
          expect(res.body.dataResponses[0]).to.have.ownProperty('signature');
        },
      );
    });

    it('responds with the a correct signature', (done) => {
      requestPost(
        done,
        `/buyers/audit/result/${validBuyerAddress}/${orderAddress}`,
        { dataResponses: [{ seller: sellerAddress1 }] },
        (res) => {
          expect(res.body.dataResponses[0]).to.have.ownProperty('signature');
        },
      );
    });
  });

  context('when the list of dataResponses have a length of 2', () => {
    it('responds with a list of dataResponses with a length of 2', (done) => {
      requestPost(
        done,
        `/buyers/audit/result/${validBuyerAddress}/${orderAddress}`,
        {
          dataResponses: [
            { seller: sellerAddress1 },
            { seller: sellerAddress2 }],
        },
        (res) => {
          expect(res.body.dataResponses).to.have.a.lengthOf(2);
        },
      );
    });

    it('responds with the same 2 sellers', (done) => {
      requestPost(
        done,
        `/buyers/audit/result/${validBuyerAddress}/${orderAddress}`,
        {
          dataResponses: [
            { seller: sellerAddress1 },
            { seller: sellerAddress2 }],
        },
        (res) => {
          expect(res.body.dataResponses.includes({ seller: sellerAddress1 }));
          expect(res.body.dataResponses.includes({ seller: sellerAddress3 }));
        },
      );
    });
  });

  context('when the list of dataResponses have a length of 3', () => {
    it('responds with a list of dataResponses with a length of 3', (done) => {
      requestPost(
        done,
        `/buyers/audit/result/${validBuyerAddress}/${orderAddress}`,
        {
          dataResponses: [
            { seller: sellerAddress1 },
            { seller: sellerAddress2 },
            { seller: sellerAddress3 },
          ],
        },
        (res) => {
          expect(res.body.dataResponses).to.have.a.lengthOf(3);
        },
      );
    });

    it('responds with the same 3 sellers', (done) => {
      requestPost(
        done,
        `/buyers/audit/result/${validBuyerAddress}/${orderAddress}`,
        {
          dataResponses: [
            { seller: sellerAddress1 },
            { seller: sellerAddress2 },
            { seller: sellerAddress3 }],
        },
        (res) => {
          expect(res.body.dataResponses.includes({ seller: sellerAddress1 }));
          expect(res.body.dataResponses.includes({ seller: sellerAddress2 }));
          expect(res.body.dataResponses.includes({ seller: sellerAddress3 }));
          expect(res.body.dataResponses[0]).to.have.ownProperty('result');
          expect(res.body.dataResponses[0]).to.have.ownProperty('signature');
          expect(res.body.dataResponses[1]).to.have.ownProperty('result');
          expect(res.body.dataResponses[1]).to.have.ownProperty('signature');
          expect(res.body.dataResponses[2]).to.have.ownProperty('result');
          expect(res.body.dataResponses[2]).to.have.ownProperty('signature');
          expect(res.body.dataResponses[0].result)
            .to.satisfy(result => result === 'success' || result === 'na');
          expect(res.body.dataResponses[1].result)
            .to.satisfy(result => result === 'success' || result === 'na');
          expect(res.body.dataResponses[2].result)
            .to.satisfy(result => result === 'success' || result === 'na');
        },
      );
    });
  });
});

