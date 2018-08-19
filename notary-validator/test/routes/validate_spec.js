import request from 'supertest';
import requestPromise from 'request-promise-native';
import sinon from 'sinon';
import { expect } from 'chai';
import { mockStorage, restoreMocks } from '../helpers';


const validMSISDN = '34689435912';

describe('/validate', () => {
  let app;

  beforeEach(function (done) { // eslint-disable-line func-names
    this.timeout(5000);
    mockStorage();
    app = require('../../src/app'); // eslint-disable-line global-require
    done();
  });

  afterEach(() => {
    restoreMocks();
  });

  describe('GET /validate', () => {
    it('responds with an OK status', (done) => {
      request(app)
        .get('/validate')
        .expect(200, { status: 'OK' }, done);
    });

    it('xxx', (done) => {
      request(app)
        .get(`validate/${validMSISDN}`)
        .expect((res) => {
          expect(res.status).to.be.equal(400);
        })
        .end(done);
    });
  });
});
