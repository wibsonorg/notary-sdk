import request from "supertest";
import assert from "assert";
import app from "../app";
import { shouldRespondWithCode200, shouldRespondWithAJSON } from "./commons";
import Config from "../config";

describe("/sdk/api", function() {
  const baseURI = "/sdk/api";

  describe("#", function() {
    it("GET / should respond with 200", function(done) {
      shouldRespondWithCode200(baseURI, done);
    });

    it("GET / should respond with a JSON", function(done) {
      shouldRespondWithAJSON(baseURI, done);
    });

    it("GET / should respond with the welcome text", function(done) {
      shouldRespondWithAJSON(baseURI, done);
    });
  });
});
