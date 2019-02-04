import { serial as it } from 'ava';
import request from 'supertest';
import requestPromise from 'request-promise-native';
import sinon from 'sinon';
import app from '../../src/app';

it('responds with an OK status', (done) => {
  request(app)
    .get('/health')
    .expect(200, { status: 'OK' }, done);
});

it(
  'responds with an OK status when app and sub-systems are responding',
  (done) => {
    const response = { status: 'OK' };

    sinon.stub(requestPromise, 'get')
      .returns(Promise.resolve(JSON.stringify(response)));

    request(app)
      .get('/health/deep')
      .expect(200, response, done);
  },
);
