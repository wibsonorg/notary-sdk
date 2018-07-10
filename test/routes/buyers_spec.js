import request from 'supertest';
import { expect } from 'chai';
import ethCrypto from 'eth-crypto';
import app from '../../src/app';
import config from '../../config';


function requestPost(uri, objectParam = {}, handler) {
  request(app)
    .post(uri)
    .send(objectParam)
    .set('Accept', 'application/json')
    .end(handler);
}

function requestGet(uri, handler) {
  request(app)
    .get(uri)
    .set('Accept', 'application/json')
    .end(handler);
}

const baseURI = '/buyers';

describe('#GET buyers/', () => {
  it('responds with status 200', (done) => {
    requestGet(baseURI, (err, res) => {
      expect(res.status).to.be.equal(200);
      done();
    });
  });
});

describe('#GET buyers/', () => {
  it('responds with JSON', (done) => {
    requestGet(baseURI, (err, res) => {
      expect(res.type).to.be.equal('application/json');
      done();
    });
  });
});

const realDataOrder = 'this-is-a-real-data-order';
const fakeDataOrder = 'this-is-a-fake-data-order';

const auditUri = `${baseURI}/audit`;
const auditUriWithDataOrder = `${auditUri}/${realDataOrder}`;

describe('#POST buyers/audit/:dataOrder', () => {
  context('when the object params is empty', () => {
    it('responds with status 400', (done) => {
      requestPost(auditUriWithDataOrder, {}, (err, res) => {
        if (err) return done(err);
        expect(res.status).to.be.equal(400);
        done();
        return true;
      });
    });
  });
});

describe('#POST /buyers/audit/consent/:dataOrder', () => {
  context('when the dataOrder is a fake dataOrder', () => {
    it('responds with status 400', (done) => {
      requestPost(`/buyers/audit/consent/${fakeDataOrder}`, {}, (err, res) => {
        if (err) return done(err);
        expect(res.status).to.be.equal(400);
        done();
        return true;
      });
    });

    it('responds with JSON', (done) => {
      requestGet(baseURI, (err, res) => {
        expect(res.type).to.be.equal('application/json');
        done();
      });
    });
  });
});

describe('#POST /buyers/audit/consent/:dataOrder', () => {
  it('responds with JSON', (done) => {
    requestGet(baseURI, (err, res) => {
      expect(res.type).to.be.equal('application/json');
      done();
    });
  });

  context('when the dataOrder is a real dataOrder', () => {
    it('responds with status 200', (done) => {
      requestPost(`/buyers/audit/consent/${realDataOrder}`, {}, (err, res) => {
        if (err) return done(err);
        expect(res.status).to.be.equal(200);
        done();
        return true;
      });
    });

    it('responds with an object with an orderAdress property', (done) => {
      requestPost(`/buyers/audit/consent/${realDataOrder}`, {}, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.haveOwnProperty('orderAddress');
        done();
        return true;
      });
    });

    it(
      'responds with an object with an responsesPercentage property',
      (done) => {
        requestPost(
          `/buyers/audit/consent/${realDataOrder}`,
          {}, (err, res) => {
            if (err) return done(err);
            expect(res.body).to.haveOwnProperty('responsesPercentage');
            done();
            return true;
          },
        );
      },
    );

    it('responds with an object with an notarizationFee property', (done) => {
      requestPost(`/buyers/audit/consent/${realDataOrder}`, {}, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.haveOwnProperty('notarizationFee');
        done();
        return true;
      });
    });

    it(
      'responds with an object with an notarizationTermsOfService property',
      (done) => {
        requestPost(
          `/buyers/audit/consent/${realDataOrder}`,
          {}, (err, res) => {
            if (err) return done(err);
            expect(res.body).to.haveOwnProperty('notarizationTermsOfService');
            done();
            return true;
          },
        );
      },
    );

    it('responds with an object with an signature property', (done) => {
      requestPost(`/buyers/audit/consent/${realDataOrder}`, {}, (err, res) => {
        if (err) return done(err);
        expect(res.body).to.haveOwnProperty('signature');
        done();
        return true;
      });
    });

    it('responds with a correct signature', (done) => {
      requestPost(`/buyers/audit/consent/${realDataOrder}`, {}, (err, res) => {
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

        if (err) return done(err);
        expect(res.body.signature).to.be.equal(signature);
        done();
        return true;
      });
    });
  });
});
