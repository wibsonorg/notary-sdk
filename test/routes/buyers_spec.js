import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app';
// import Config from '../../config';

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

describe('/buyers', () => {
  const baseURI = '/buyers';

  describe('#GET /', () => {
    it(`-responds with status 200
        -responds with JSON`, (done) => {
      requestGet(baseURI, (err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.type).to.be.equal('application/json');
        done();
      });
    });
  });

  const dataOrder = 'this-is-a-data-order';
  const auditUri = `${baseURI}/audit`;
  const auditUriWithDataOrder = `${auditUri}/${dataOrder}`;

  describe('/buyers/audit', () => {
    describe('#POST /audit', () => {
      context('when there is no dataOrder on the URI', () => {
        it('responds with status 404', (done) => {
          requestPost(auditUri, {}, (err, res) => {
            if (err) return done(err);
            expect(res.status).to.be.equal(404);
            return done();
          });
        });
      });
    });

    describe('#POST /audit/:dataOrder', () => {
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
  });
});
