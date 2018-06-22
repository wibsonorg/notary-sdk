import request from "supertest";
import chai from "chai";
import app from "../app";
import Config from "../config";

chai.should();

describe("/sdk/api", function() {
  const baseURI = "/sdk/api";

  describe("#GET /", function() {
    it("shuld responds with status 200", function(done) {
      request(app)
        .get(baseURI)
        .end(function(err, res) {
          res.status.should.be.equal(200);
          done();
        });
    });

    it("should responds with a JSON", function(done) {
      request(app)
        .get(baseURI)
        .expect("Content-Type", /json/)
        .end(function(err, res) {
          done();
        });
      //.expect("Content-Type", /json/, done);
    });
  });
});
