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
      if (err) done(err);
      expect(res.status).to.be.equal(403);
      done();
    });
  });
});


describe('#POST /buyers/audit/consent/', () => {
  const {
    orderAddress,
    responsesPercentage,
    notarizationFee,
    notarizationTermsOfService,
    signature,
  } = config;

  context('when the orderAddress is missing', () => {
    it('responds with status 400', (done) => {
      requestPost('/buyers/audit/consent', {
        responsesPercentage,
        notarizationFee,
        notarizationTermsOfService,
      }, (err, res) => {
        if (err) done(err);
        expect(res.status).to.be.equal(400);
        done();
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
        if (err) done(err);
        expect(res.status).to.be.equal(400);
        done();
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
        if (err) done(err);
        expect(res.status).to.be.equal(400);
        done();
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
        if (err) done(err);
        expect(res.status).to.be.equal(400);
        done();
      });
    });
  });

  context('when the all the parameters are present', () => {
    it('responds with a correct signature', (done) => {
      requestPost('/buyers/audit/consent', {
        orderAddress,
        responsesPercentage,
        notarizationFee,
        notarizationTermsOfService,
      }, (err, res) => {
        if (err) done(err);
        expect(res.body.signature).to.be.equal(signature);
        done();
      });
    });
  });
});

describe('#POST /buyers/audit/result', () => {
  const payload = {
    orderAddress: '0xd56359a66d8ef7329507e5dd1f40aef7cd3320e7',
    sellerAddress: '0xd56359a66d8ef7329507e5dd1f40aef7cd3320e7',
    wasAudited: true,
    isDataValid: true,
  };

  context('when the orderAddress is missing', () => {
    const { orderAddress, ...payloadWithOutOrderAddress } = payload;

    it('responds with status 400', (done) => {
      requestPost(
        '/buyers/audit/result',
        payloadWithOutOrderAddress,
        (err, res) => {
          if (err) done(err);
          expect(res.status).to.be.equal(400);
          done();
        },
      );
    });
  });

  context('when the sellerAddress is missing', () => {
    const { sellerAddress, ...payloadWithOutSellerAddress } = payload;

    it('responds with status 400', (done) => {
      requestPost(
        '/buyers/audit/result',
        payloadWithOutSellerAddress,
        (err, res) => {
          if (err) done(err);
          expect(res.status).to.be.equal(400);
          done();
        },
      );
    });
  });

  context('when the wasAudited is missing', () => {
    const { wasAudited, ...payloadWithOutWasAudited } = payload;

    it('responds with status 400', (done) => {
      requestPost(
        '/buyers/audit/result',
        payloadWithOutWasAudited,
        (err, res) => {
          if (err) done(err);
          expect(res.status).to.be.equal(400);
          done();
        },
      );
    });
  });

  context('when the wasAudited is missing', () => {
    const { isDataValid, ...payloadWithOutIsDataValid } = payload;

    it('responds with status 400', (done) => {
      requestPost(
        '/buyers/audit/result',
        payloadWithOutIsDataValid,
        (err, res) => {
          if (err) done(err);
          expect(res.status).to.be.equal(400);
          done();
        },
      );
    });
  });

  context('with all the payload', () => {
    const signature = '0x60450d197a21fdb0f6c8e290704674e54614bafeff47df1777cd38b87e4299905aecf671453de955cd9f4a90559d1696a2e09479866e213f919c9164db5174811b';

    it('responds with status 200 and the correct signature', (done) => {
      requestPost(
        '/buyers/audit/result',
        payload,
        (err, res) => {
          if (err) done(err);
          expect(res.status).to.be.equal(200);
          expect(res.body.signature).to.be.equal(signature);
          done();
        },
      );
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
