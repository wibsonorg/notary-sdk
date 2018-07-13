import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import app from '../../src/app';
import config from '../../config';


/*
function requestPost(uri, objectParam = {}, handler) {
  request(app)
    .post(uri)
    .send(objectParam)
    .set('Accept', 'application/json')
    .end(handler);
}
*/

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

describe('#GET /buyers/audit/consent/:orderAddress', () => {
  context('when the orderAddress is an invalid orderAddress', () => {
    it('responds with status 400', (done) => {
      requestGet(`/buyers/audit/consent/${invalidOrderAddress}`, (err, res) => {
        if (err) return done(err);
        expect(res.status).to.be.equal(400);
        done();
        return true;
      });
    });

    it('responds with TEXT', (done) => {
      requestGet(`/buyers/audit/consent/${invalidOrderAddress}`, (err, res) => {
        if (err) return done(err);
        expect(res.type).to.be.equal('text/plain');
        done();
        return true;
      });
    });
  });
});

describe('#GET /buyers/audit/consent/:orderAddress', () => {
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
      requestGet(`/buyers/audit/consent/${validOrderAddress}`, (err, res) => {
        if (err) return done(err);
        expect(res.status).to.be.equal(200);
        done();
        return true;
      });
    });

    it('responds with JSON', (done) => {
      requestGet(`/buyers/audit/consent/${validOrderAddress}`, (err, res) => {
        if (err) return done(err);
        expect(res.type).to.be.equal('application/json');
        done();
        return true;
      });
    });

    it('responds with an object with an orderAdress property', (done) => {
      requestGet(`/buyers/audit/consent/${validOrderAddress}`, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.haveOwnProperty('orderAddress');
        done();
        return true;
      });
    });

    it('responds the correct orderAdress', (done) => {
      requestGet(`/buyers/audit/consent/${validOrderAddress}`, (err, res) => {
        if (err) return done(err);
        expect(res.body.orderAddress).to.be.equal(orderAddress);
        done();
        return true;
      });
    });

    it(
      'responds with an object with an responsesPercentage property',
      (done) => {
        requestGet(`/buyers/audit/consent/${validOrderAddress}`, (err, res) => {
          if (err) return done(err);
          expect(res.body).to.haveOwnProperty('responsesPercentage');
          done();
          return true;
        });
      },
    );

    it('responds the correct responsesPercentage', (done) => {
      requestGet(`/buyers/audit/consent/${validOrderAddress}`, (err, res) => {
        if (err) return done(err);
        expect(res.body.responsesPercentage).to.be.equal(responsesPercentage);
        done();
        return true;
      });
    });

    it('responds with an object with an notarizationFee property', (done) => {
      requestGet(`/buyers/audit/consent/${validOrderAddress}`, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.haveOwnProperty('notarizationFee');
        done();
        return true;
      });
    });

    it('responds the correct notarizationFee', (done) => {
      requestGet(`/buyers/audit/consent/${validOrderAddress}`, (err, res) => {
        if (err) return done(err);
        expect(res.body.notarizationFee).to.be.equal(notarizationFee);
        done();
        return true;
      });
    });

    it(
      'responds with an object with an notarizationTermsOfService property',
      (done) => {
        requestGet(`/buyers/audit/consent/${validOrderAddress}`, (err, res) => {
          if (err) return done(err);
          expect(res.body).to.haveOwnProperty('notarizationTermsOfService');
          done();
          return true;
        });
      },
    );

    it('responds the correct notarizationTermsOfService', (done) => {
      requestGet(`/buyers/audit/consent/${validOrderAddress}`, (err, res) => {
        if (err) return done(err);
        expect(res.body.notarizationTermsOfService)
          .to.be.equal(notarizationTermsOfService);
        done();
        return true;
      });
    });

    it('responds with an object with a signature property', (done) => {
      requestGet(`/buyers/audit/consent/${validOrderAddress}`, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.haveOwnProperty('signature');
        done();
        return true;
      });
    });

    it('responds with a correct signature', (done) => {
      requestGet(`/buyers/audit/consent/${validOrderAddress}`, (err, res) => {
        if (err) return done(err);
        expect(res.body.signature).to.be.equal(signature);
        done();
        return true;
      });
    });
  });
});
