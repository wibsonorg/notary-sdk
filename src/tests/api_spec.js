import request from "supertest";
import chai from "chai";
import app from "../app";
import Config from "../config";

chai.should();

function requestPost(uri, objectParam = {}, handler) {
  request(app)
    .post(uri)
    .send(objectParam)
    .set("Accept", "application/json")
    .end(handler);
}

describe("/sdk/buyers-api", function() {
  const baseURI = "/sdk/buyers-api";

  describe("#GET /", function() {
    it("should responds with status 200", function(done) {
      request(app)
        .get(baseURI)
        .set("Accept", "application/json")
        .end(function(err, res) {
          res.status.should.be.equal(200);
          done();
        });
    });

    it("should responds with JSON", function(done) {
      request(app)
        .get(baseURI)
        .set("Accept", "application/json")
        .end(function(err, res) {
          res.type.should.be.equal("application/json");
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
        it("should responds with status 404", function(done) {
          requestPost(baseURI + "/audit-request", {}, function(err, res) {
            if (err) return done(err);
            res.status.should.be.equal(404);
            done();
          });
        });
      });
    });

    describe("#POST /audit-request/:aDataOrder", function() {
      context("when the object params are empty", function() {
        it("should responds with status 400", function(done) {
          requestPost(auditRequestUriWithDataOrder, {}, function(err, res) {
            if (err) return done(err);
            res.status.should.be.equal(400);
            done();
          });
        });
      });
    });
  });
});
