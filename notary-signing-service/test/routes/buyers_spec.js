import request from 'supertest';
import { expect } from 'chai';
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

describe('#GET buyers/', () => {
  it('responds with status 403', (done) => {
    requestGet('/buyers', (err, res) => {
      expect(res.status).to.be.equal(403);
      done();
    });
  });
});

const {
  orderAddress,
  responsesPercentage,
  notarizationFee,
  notarizationTermsOfService,
  signature,
} = config;

describe('#POST /buyers/audit/consent/', () => {
  context('when the orderAddress is missing', () => {
    it('responds with status 400', (done) => {
      requestPost('/buyers/audit/consent', {
        responsesPercentage,
        notarizationFee,
        notarizationTermsOfService,
      }, (err, res) => {
        if (err) return done(err);
        expect(res.status).to.be.equal(400);
        done();
        return true;
      });
    });
  });

  context('when the responsesPercentage is missing', () => {
    it('responds with status 400', (done) => {
      requestPost('/buyers/audit/consent', {
        orderAddress,
        notarizationFee,
        notarizationTermsOfService,
      }, (err, res) => {
        if (err) return done(err);
        expect(res.status).to.be.equal(400);
        done();
        return true;
      });
    });
  });

  context('when the notarizationFee is missing', () => {
    it('responds with status 400', (done) => {
      requestPost('/buyers/audit/consent', {
        orderAddress,
        responsesPercentage,
        notarizationTermsOfService,
      }, (err, res) => {
        if (err) return done(err);
        expect(res.status).to.be.equal(400);
        done();
        return true;
      });
    });
  });

  context('when the notarizationTermsOfService is missing', () => {
    it('responds with status 400', (done) => {
      requestPost('/buyers/audit/consent', {
        orderAddress,
        responsesPercentage,
        notarizationFee,
      }, (err, res) => {
        if (err) return done(err);
        expect(res.status).to.be.equal(400);
        done();
        return true;
      });
    });
  });

  context('when the all the parameters are present', () => {
    it('responds with a correct signature', (done) => {
      requestPost('/buyers/audit/consent/', {
        orderAddress,
        responsesPercentage,
        notarizationFee,
        notarizationTermsOfService,
      }, (err, res) => {
        if (err) return done(err);
        expect(res.body.signature).to.be.equal(signature);
        done();
        return true;
      });
    });
  });
});


/*

    it('responds with JSON', (done) => {
      requestPost('/buyers/audit/consent', payload, (err, res) => {
        if (err) return done(err);
        expect(res.type).to.be.equal('application/json');
        done();
        return true;
      });
    });
  });
}); */
