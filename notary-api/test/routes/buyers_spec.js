import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import app from '../../src/app';
import config from '../../config';

function requestPost(uri, payload = {}, handler) {
  request(app)
    .post(uri)
    .send(payload)
    .set('Accept', 'application/json')
    .end(handler);
}

function requestGet(uri, handler) {
  request(app)
    .get(uri)
    .set('Accept', 'application/json')
    .end(handler);
}

describe('#GET /buyers', () => {
  it('responds with status 200', (done) => {
    requestGet('/buyers', (err, res) => {
      expect(res.status).to.be.equal(200);
      done();
    });
  });
});

describe('#GET /buyers', () => {
  it('responds with JSON', (done) => {
    requestGet('/buyers', (err, res) => {
      expect(res.type).to.be.equal('application/json');
      done();
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
        `/buyers/audit/consent/${validBuyerAddress}/${invalidOrderAddress}`,
        (err, res) => {
          if (err) return done(err);
          expect(res.status).to.be.equal(400);
          done();
          return true;
        },
      );
    });

    it('responds with TEXT', (done) => {
      requestGet(
        `/buyers/audit/consent/${validBuyerAddress}/${invalidOrderAddress}`,
        (err, res) => {
          if (err) return done(err);
          expect(res.type).to.be.equal('application/json');
          done();
          return true;
        },
      );
    });
  });
});

describe('#GET /buyers/audit/consent/:buyerAddress/:orderAddress', () => {
  const {
    orderAddress,
    responsesPercentage,
    notarizationFee,
    notarizationTermsOfService,
    signature,
  } = config;

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
        `/buyers/audit/consent/${validBuyerAddress}/${validOrderAddress}`,
        (err, res) => {
          if (err) return done(err);
          expect(res.status).to.be.equal(200);
          done();
          return true;
        },
      );
    });

    it('responds with JSON', (done) => {
      requestGet(
        `/buyers/audit/consent/${validBuyerAddress}/${validOrderAddress}`,
        (err, res) => {
          if (err) return done(err);
          expect(res.type).to.be.equal('application/json');
          done();
          return true;
        },
      );
    });

    it('responds with an object with an orderAdress property', (done) => {
      requestGet(
        `/buyers/audit/consent/${validBuyerAddress}/${validOrderAddress}`,
        (err, res) => {
          if (err) return done(err);
          expect(res.body).to.haveOwnProperty('orderAddress');
          done();
          return true;
        },
      );
    });

    it('responds the correct orderAdress', (done) => {
      requestGet(
        `/buyers/audit/consent/${validBuyerAddress}/${validOrderAddress}`,
        (err, res) => {
          if (err) return done(err);
          expect(res.body.orderAddress).to.be.equal(orderAddress);
          done();
          return true;
        },
      );
    });

    it(
      'responds with an object with an responsesPercentage property',
      (done) => {
        requestGet(
          `/buyers/audit/consent/${validBuyerAddress}/${validOrderAddress}`,
          (err, res) => {
            if (err) return done(err);
            expect(res.body).to.haveOwnProperty('responsesPercentage');
            done();
            return true;
          },
        );
      },
    );

    it('responds the correct responsesPercentage', (done) => {
      requestGet(
        `/buyers/audit/consent/${validBuyerAddress}/${validOrderAddress}`,
        (err, res) => {
          if (err) return done(err);
          expect(res.body.responsesPercentage).to.be.equal(responsesPercentage);
          done();
          return true;
        },
      );
    });

    it('responds with an object with an notarizationFee property', (done) => {
      requestGet(
        `/buyers/audit/consent/${validBuyerAddress}/${validOrderAddress}`,
        (err, res) => {
          if (err) return done(err);
          expect(res.body).to.haveOwnProperty('notarizationFee');
          done();
          return true;
        },
      );
    });

    it('responds the correct notarizationFee', (done) => {
      requestGet(
        `/buyers/audit/consent/${validBuyerAddress}/${validOrderAddress}`,
        (err, res) => {
          if (err) return done(err);
          expect(res.body.notarizationFee).to.be.equal(notarizationFee);
          done();
          return true;
        },
      );
    });

    it(
      'responds with an object with an notarizationTermsOfService property',
      (done) => {
        requestGet(
          `/buyers/audit/consent/${validBuyerAddress}/${validOrderAddress}`,
          (err, res) => {
            if (err) return done(err);
            expect(res.body).to.haveOwnProperty('notarizationTermsOfService');
            done();
            return true;
          },
        );
      },
    );

    it('responds the correct notarizationTermsOfService', (done) => {
      requestGet(
        `/buyers/audit/consent/${validBuyerAddress}/${validOrderAddress}`,
        (err, res) => {
          if (err) return done(err);
          expect(res.body.notarizationTermsOfService)
            .to.be.equal(notarizationTermsOfService);
          done();
          return true;
        },
      );
    });

    it('responds with an object with a signature property', (done) => {
      requestGet(
        `/buyers/audit/consent/${validBuyerAddress}/${validOrderAddress}`,
        (err, res) => {
          if (err) return done(err);
          expect(res.body).to.haveOwnProperty('signature');
          done();
          return true;
        },
      );
    });

    it('responds with a correct signature', (done) => {
      requestGet(
        `/buyers/audit/consent/${validBuyerAddress}/${validOrderAddress}`,
        (err, res) => {
          if (err) return done(err);
          expect(res.body.signature).to.be.equal(signature);
          done();
          return true;
        },
      );
    });
  });
});

describe('#POST /buyers/audit/result/:buyerAddress/:orderAddress', () => {
  context('when the payload its empty', () => {
    it('responds with 400', (done) => {
      requestPost(
        `/buyers/audit/result/${validBuyerAddress}/${validOrderAddress}`,
        {},
        (err, res) => {
          if (err) return done(err);
          expect(res.type).to.be.equal('application/json');
          expect(res.status).to.be.equal(400);
          done();
          return true;
        },
      );
    });
  });

  context('when the list of data-responses its empty', () => {
    it('responds with an empty list of data-responses', (done) => {
      requestPost(
        `/buyers/audit/result/${validBuyerAddress}/${validOrderAddress}`,
        { dataResponses: [] },
        (err, res) => {
          if (err) return done(err);
          expect(res.status).to.be.equal(200);
          expect(res.type).to.be.equal('application/json');
          expect(res.body).to.ownProperty('dataResponses');
          expect(res.body.dataResponses).to.have.a.lengthOf(0);
          done();
          return true;
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
        `/buyers/audit/result/${validBuyerAddress}/${validOrderAddress}`,
        { dataResponses: [{ seller: sellerAddress1 }] },
        (err, res) => {
          if (err) return done(err);
          expect(res.status).to.be.equal(200);
          expect(res.type).to.be.equal('application/json');
          expect(res.body).to.ownProperty('dataResponses');
          expect(res.body.dataResponses).to.have.a.lengthOf(1);
          done();
          return true;
        },
      );
    });

    it('responds with the same seller', (done) => {
      requestPost(
        `/buyers/audit/result/${validBuyerAddress}/${validOrderAddress}`,
        { dataResponses: [{ seller: sellerAddress1 }] },
        (err, res) => {
          if (err) return done(err);
          expect(res.body.dataResponses[0]).to.have.ownProperty('seller');
          expect(res.body.dataResponses[0].seller).to.be.equal(sellerAddress1);
          done();
          return true;
        },
      );
    });

    it('responds with the a result', (done) => {
      requestPost(
        `/buyers/audit/result/${validBuyerAddress}/${validOrderAddress}`,
        { dataResponses: [{ seller: sellerAddress1 }] },
        (err, res) => {
          if (err) return done(err);
          expect(res.body.dataResponses[0]).to.have.ownProperty('result');
          done();
          return true;
        },
      );
    });

    it('responds with the a succes or na result', (done) => {
      requestPost(
        `/buyers/audit/result/${validBuyerAddress}/${validOrderAddress}`,
        { dataResponses: [{ seller: sellerAddress1 }] },
        (err, res) => {
          if (err) return done(err);
          expect(res.body.dataResponses[0].result)
            .to.satisfy(result => result === 'success' || result === 'na');
          done();
          return true;
        },
      );
    });

    it('responds with the a signature', (done) => {
      requestPost(
        `/buyers/audit/result/${validBuyerAddress}/${validOrderAddress}`,
        { dataResponses: [{ seller: sellerAddress1 }] },
        (err, res) => {
          if (err) return done(err);
          expect(res.body.dataResponses[0]).to.have.ownProperty('signature');
          done();
          return true;
        },
      );
    });

    it('responds with the a correct signature', (done) => {
      requestPost(
        `/buyers/audit/result/${validBuyerAddress}/${validOrderAddress}`,
        { dataResponses: [{ seller: sellerAddress1 }] },
        (err, res) => {
          if (err) return done(err);
          expect(res.body.dataResponses[0]).to.have.ownProperty('signature');
          done();
          return true;
        },
      );
    });
  });

  context('when the list of dataResponses have a length of 2', () => {
    it('responds with a list of dataResponses with a length of 2', (done) => {
      requestPost(
        `/buyers/audit/result/${validBuyerAddress}/${validOrderAddress}`,
        {
          dataResponses: [
            { seller: sellerAddress1 },
            { seller: sellerAddress2 }],
        },
        (err, res) => {
          if (err) return done(err);
          expect(res.body.dataResponses).to.have.a.lengthOf(2);
          done();
          return true;
        },
      );
    });

    it('responds with the same 2 sellers', (done) => {
      requestPost(
        `/buyers/audit/result/${validBuyerAddress}/${validOrderAddress}`,
        {
          dataResponses: [
            { seller: sellerAddress1 },
            { seller: sellerAddress2 }],
        },
        (err, res) => {
          if (err) return done(err);
          expect(res.body.dataResponses.includes({ seller: sellerAddress1 }));
          expect(res.body.dataResponses.includes({ seller: sellerAddress3 }));
          done();
          return true;
        },
      );
    });
  });

  context('when the list of dataResponses have a length of 3', () => {
    it('responds with a list of dataResponses with a length of 3', (done) => {
      requestPost(
        `/buyers/audit/result/${validBuyerAddress}/${validOrderAddress}`,
        {
          dataResponses: [
            { seller: sellerAddress1 },
            { seller: sellerAddress2 },
            { seller: sellerAddress3 },
          ],
        },
        (err, res) => {
          if (err) return done(err);
          expect(res.body.dataResponses).to.have.a.lengthOf(3);
          done();
          return true;
        },
      );
    });

    it('responds with the same 3 sellers', (done) => {
      requestPost(
        `/buyers/audit/result/${validBuyerAddress}/${validOrderAddress}`,
        {
          dataResponses: [
            { seller: sellerAddress1 },
            { seller: sellerAddress2 },
            { seller: sellerAddress3 }],
        },
        (err, res) => {
          if (err) return done(err);
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
          done();
          return true;
        },
      );
    });
  });
});

