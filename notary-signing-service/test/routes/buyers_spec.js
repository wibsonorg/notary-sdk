import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app';

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
    .end((err) => {
      if (err) return done(err);
      return done();
    });
}

describe('#GET /buyers', () => {
  it('responds with status 403', (done) => {
    requestGet(
      done,
      '/buyers', (res) => {
        expect(res.status).to.be.equal(403);
      },
    );
  });
});

describe('#POST /buyers/audit/consent/', () => {
  const orderAddress = '0xd56359a66d8ef7329507e5dd1f40aef7cd3320e7';
  const responsesPercentage = 30;
  const notarizationFee = 2;
  const notarizationTermsOfService = 'The terms of service';

  context('when the orderAddress is missing', () => {
    it('responds with status 400', (done) => {
      requestPost(
        done,
        '/buyers/audit/consent', {
          responsesPercentage,
          notarizationFee,
          notarizationTermsOfService,
        }, (res) => {
          expect(res.status).to.be.equal(400);
        },
      );
    });
  });

  context('when the responsesPercentage is missing', () => {
    it('responds with status 400', (done) => {
      requestPost(
        done,
        '/buyers/audit/consent', {
          orderAddress,
          notarizationFee,
          notarizationTermsOfService,
        }, (res) => {
          expect(res.status).to.be.equal(400);
        },
      );
    });
  });

  context('when the notarizationFee is missing', () => {
    it('responds with status 400', (done) => {
      requestPost(
        done,
        '/buyers/audit/consent', {
          orderAddress,
          responsesPercentage,
          notarizationTermsOfService,
        }, (res) => {
          expect(res.status).to.be.equal(400);
        },
      );
    });
  });

  context('when the notarizationTermsOfService is missing', () => {
    it('responds with status 400', (done) => {
      requestPost(
        done,
        '/buyers/audit/consent', {
          orderAddress,
          responsesPercentage,
          notarizationFee,
        }, (res) => {
          expect(res.status).to.be.equal(400);
        },
      );
    });
  });

  context('when the all the parameters are present', () => {
    it('responds with a correct signature', (done) => {
      requestPost(
        done,
        '/buyers/audit/consent', {
          orderAddress,
          responsesPercentage,
          notarizationFee,
          notarizationTermsOfService,
        }, (res) => {
          expect(res.body.signature).to.be.equal('0xfa942dafaea045253f81d87a3954896792' +
          'c195479fa0fa26e078e408b3369c24198f7966d1c4fb9c66bc5a828284e93dc180073cf3362' +
          '97033aa3114280f18601c');
        },
      );
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
        done,
        '/buyers/audit/result',
        payloadWithOutOrderAddress,
        (res) => {
          expect(res.status).to.be.equal(400);
        },
      );
    });
  });

  context('when the sellerAddress is missing', () => {
    const { sellerAddress, ...payloadWithOutSellerAddress } = payload;

    it('responds with status 400', (done) => {
      requestPost(
        done,
        '/buyers/audit/result',
        payloadWithOutSellerAddress,
        (res) => {
          expect(res.status).to.be.equal(400);
        },
      );
    });
  });

  context('when the wasAudited is missing', () => {
    const { wasAudited, ...payloadWithOutWasAudited } = payload;

    it('responds with status 400', (done) => {
      requestPost(
        done,
        '/buyers/audit/result',
        payloadWithOutWasAudited,
        (res) => {
          expect(res.status).to.be.equal(400);
        },
      );
    });
  });

  context('when the wasAudited is missing', () => {
    const { isDataValid, ...payloadWithOutIsDataValid } = payload;

    it('responds with status 400', (done) => {
      requestPost(
        done,
        '/buyers/audit/result',
        payloadWithOutIsDataValid,
        (res) => {
          expect(res.status).to.be.equal(400);
        },
      );
    });
  });

  context('with all the payload', () => {
    const signature = '0x5feb8b38efcc9aaabd3eb61cb853f99030d6f3df9b260b05b8e42' +
    'db193979ffc3483818405ee40312da8912e3318077dbea70e2c6f8fd54b41928' +
    '50d3d33eed11c';

    it('responds with status 200 and the correct signature', (done) => {
      requestPost(
        done,
        '/buyers/audit/result',
        payload,
        (res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body.signature).to.be.equal(signature);
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
