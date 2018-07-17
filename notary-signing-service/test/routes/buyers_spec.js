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
          expect(res.body.signature).to.be.equal('0x011da84640d4861207270e' +
            '212cb619c2bcaf5' +
            'c3994f94417f74471d72a43135f4652ce3ab088' +
            '79787429a99209e82ff0f7a621d4253f06a297f6714c1ac977b51c');
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
    const signature = '0x03344d319275dfca74f241452910c75040' +
    'a45f54bd6fee4f5dae5061f65e9c4a1ee66f' +
    '911f40e1a2b16867e3cd03baac99fee4effa3fba1fa55c74e13aea1f6c1b';

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
