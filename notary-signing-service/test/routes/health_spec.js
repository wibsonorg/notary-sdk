import app from '../../src/app';

const request = require('supertest');

describe('/health', () => {
  it('GET / should respond with an OK status', (done) => {
    request(app)
      .get('/health')
      .expect(200, { status: 'OK' }, done);
  });
  /*
  it('GET /client_error should respond with a 400 error', (done) => {
    request(app)
      .get('/health/client_error')
      .expect(
        400,
        {
          statusCode: 400,
          error: 'Bad Request',
          message: 'this should fail',
        },
        done,
      );
  });

  it('GET /server_error should respond with a 500 error', (done) => {
    request(app)
      .get('/health/server_error')
      .expect(500, {}, done);
  });
  */

  it('GET /async_ok should return 200 and the result', (done) => {
    request(app)
      .get('/health/async_ok')
      .expect(200, { result: 42 }, done);
  });

  it('GET /async_error should respond with a 500 error', (done) => {
    request(app)
      .get('/health/async_error')
      .expect(500, {}, done);
  });
});
