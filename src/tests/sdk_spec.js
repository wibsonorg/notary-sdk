import request from "supertest";
import chai from "chai";
import app from "../app";
import Config from "../config";

chai.should();

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
});

describe("/sdk/buyers-api", function() {
  const baseURI = "/sdk/buyers-api";

  describe("#POST /audit-request", function() {
    context("when the parameters are empty", function() {
      it("should responds with status 400", function(done) {
        request(app)
          .post(baseURI + "/audit-request")
          .send({})
          .set("Accept", "application/json")
          .end(function(err, res) {
            if (err) return done(err);
            res.status.should.be.equal(400);
            done();
          });
      });
    });
  });
});
