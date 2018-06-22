import request from "supertest";
import chai from "chai";
import app from "../app";
import Config from "../config";

chai.should();

function get(uri, end) {
  request(app)
    .get(uri)
    .set("Accept", "application/json")
    .end(end);
}

describe("/sdk/api", function() {
  const baseURI = "/sdk/api";

  describe("#GET /", function() {
    it("should responds with status 200", function(done) {
      get(baseURI, function(err, res) {
        res.status.should.be.equal(200);
        done();
      });
    });

    it("should responds with JSON", function(done) {
      get(baseURI, function(err, res) {
        res.type.should.be.equal("application/json");
        done();
      });
    });
  });
});

describe("/sdk/api/sellers", function() {
  const baseURI = "/sdk/api/sellers";

  describe("#POST /auth", function() {
    context("when the parameters are empty", function() {
      it("should responds with status 400", function(done) {
        request(app)
          .post(baseURI + "/auth")
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
