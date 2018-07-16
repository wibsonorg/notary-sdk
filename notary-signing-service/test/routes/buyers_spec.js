import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app';
import config from '../../config';

function requestPost(done, uri, payload = {}, fn) {
  request(app)
    .post(uri)
    .send(payload)
    .set('Accept', 'application/json')
    .expect(fn)
    .end((err) => {
      if (err) return done(err);
      return done();
    });
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

describe('#GET buyers/', () => {
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
  const {
    orderAddress,
    responsesPercentage,
    notarizationFee,
    notarizationTermsOfService,
    signature,
  } = config;

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
          expect(res.body.signature).to.be.equal(signature);
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
    const signature = '0x60450d197a21fdb0f6c8e290704674e'
    + '54614bafeff47df1777cd38b87e4299905aecf671453de955cd'
    + '9f4a90559d1696a2e09479866e213f919c9164db5174811b';

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
