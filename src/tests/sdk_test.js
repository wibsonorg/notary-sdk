import request from "supertest";
import assert from "assert";
import app from "../app";
import Config from "../config";

describe("/sdk/api", function() {
  const baseURI = "/sdk/api";

  describe("#", function() {
    it("GET / should respond with 200", function(done) {
      request(app)
        .get(baseURI)
        .expect(200, done);
    });

    it("GET / should respond with a JSON", function(done) {
      request(app)
        .get(baseURI)
        .expect("Content-Type", /json/, done);
    });
  });
});
