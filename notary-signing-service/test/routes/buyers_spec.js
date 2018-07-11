import request from 'supertest';
import { expect } from 'chai';
import ethCrypto from 'eth-crypto';
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

describe('#GET buyers/', () => {
  it('responds with status 403', (done) => {
    requestGet('/buyers', (err, res) => {
      expect(res.status).to.be.equal(403);
      done();
    });
  });
});

const realDataOrder = 'this-is-a-real-data-order';
const fakeDataOrder = 'this-is-a-fake-data-order';

describe('#GET /buyers/audit/consent/:dataOrder', () => {
  context('when the dataOrder is a fake dataOrder', () => {
    it('responds with status 400', (done) => {
      requestGet(`/buyers/audit/consent/${fakeDataOrder}`, (err, res) => {
        if (err) return done(err);
        expect(res.status).to.be.equal(400);
        done();
        return true;
      });
    });

    it('responds with TEXT', (done) => {
      requestGet(`/buyers/audit/consent/${fakeDataOrder}`, (err, res) => {
        if (err) return done(err);
        expect(res.type).to.be.equal('text/plain');
        done();
        return true;
      });
    });
  });
});

describe('#GET /buyers/audit/consent/:dataOrder', () => {
  context('when the dataOrder is a real dataOrder', () => {
    it('responds with status 200', (done) => {
      requestGet(`/buyers/audit/consent/${realDataOrder}`, (err, res) => {
        if (err) return done(err);
        expect(res.status).to.be.equal(200);
        done();
        return true;
      });
    });

    it('responds with JSON', (done) => {
      requestGet(`/buyers/audit/consent/${realDataOrder}`, (err, res) => {
        if (err) return done(err);
        expect(res.type).to.be.equal('application/json');
        done();
        return true;
      });
    });

    it('responds with an object with an orderAdress property', (done) => {
      requestGet(`/buyers/audit/consent/${realDataOrder}`, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.haveOwnProperty('orderAddress');
        done();
        return true;
      });
    });

    it(
      'responds with an object with an responsesPercentage property',
      (done) => {
        requestGet(`/buyers/audit/consent/${realDataOrder}`, (err, res) => {
          if (err) return done(err);
          expect(res.body).to.haveOwnProperty('responsesPercentage');
          done();
          return true;
        });
      },
    );

    it('responds with an object with an notarizationFee property', (done) => {
      requestGet(`/buyers/audit/consent/${realDataOrder}`, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.haveOwnProperty('notarizationFee');
        done();
        return true;
      });
    });

    it(
      'responds with an object with an notarizationTermsOfService property',
      (done) => {
        requestGet(`/buyers/audit/consent/${realDataOrder}`, (err, res) => {
          if (err) return done(err);
          expect(res.body).to.haveOwnProperty('notarizationTermsOfService');
          done();
          return true;
        });
      },
    );

    it('responds with an object with a signature property', (done) => {
      requestGet(`/buyers/audit/consent/${realDataOrder}`, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.haveOwnProperty('signature');
        done();
        return true;
      });
    });

    it('responds with a correct signature', (done) => {
      const {
        privateKey,
        orderAddress,
        responsesPercentage,
        notarizationFee,
        notarizationTermsOfService,
      } = config;

      const message = [
        orderAddress,
        responsesPercentage,
        notarizationFee,
        notarizationTermsOfService];
      const messageHash = ethCrypto.hash.keccak256(message);
      const signature = ethCrypto.sign(privateKey, messageHash);

      requestGet(`/buyers/audit/consent/${realDataOrder}`, (err, res) => {
        if (err) return done(err);
        expect(res.body.signature).to.be.equal(signature);
        done();
        return true;
      });
    });
  });
});
