import request from "supertest";
import { expect } from "chai";
import app from "../src/app";
import Config from "../src/config";

//chai.should();
//chai.expect();

function requestPost(uri, objectParam = {}, handler) {
  request(app)
    .post(uri)
    .send(objectParam)
    .set("Accept", "application/json")
    .end(handler);
}

function requestGet(uri, handler) {
  request(app)
    .get(uri)
    .set("Accept", "application/json")
    .end(handler);
}

describe("/sdk/buyers-api", function() {
  const baseURI = "/sdk/buyers-api";

  describe("#GET /", function() {
    it("responds with status 200", function(done) {
      requestGet(baseURI, function(err, res) {
        expect(res.status).to.be.equal(200);
        done();
      });
    });

    it("responds with JSON", function(done) {
      requestGet(baseURI, function(err, res) {
        expect(res.type).to.be.equal("application/json");
        done();
      });
    });
  });

  const dataOrder = "this-is-a-data-order";
  const auditRequestUri = baseURI + "/audit-request";
  const auditRequestUriWithDataOrder = auditRequestUri + "/:" + dataOrder;

  describe("/sdk/buyers-api/audit-request", function() {
    describe("#POST /audit-request", function() {
      context("when there is no dataOrder on the URI", function() {
        it("responds with status 404", function(done) {
          requestPost(baseURI + "/audit-request", {}, function(err, res) {
            if (err) return done(err);
            expect(res.status).to.be.equal(404);
            done();
          });
        });
      });
    });

    describe("#POST /audit-request/:aDataOrder", function() {
      context("when the object params is empty", function() {
        it("responds with status 400", function(done) {
          requestPost(auditRequestUriWithDataOrder, {}, function(err, res) {
            if (err) return done(err);
            expect(res.status).to.be.equal(400);
            done();
          });
        });
      });
    });
  });
});
