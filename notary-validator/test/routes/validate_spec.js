import request from 'supertest';
import requestPromise from 'request-promise-native';
import sinon from 'sinon';
import { mockStorage, restoreMocks } from '../helpers';

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

  describe('GET /', () => {
    it('responds with an OK status', (done) => {
      request(app)
        .get('/validate')
        .expect(200, { status: 'OK' }, done);
    });
  });
});
