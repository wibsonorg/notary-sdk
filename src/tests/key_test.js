import request from "supertest";
import assert from "assert";
import app from "../app";
import { shouldRespondWithCode200, shouldRespondWithAJSON } from "./commons";
import Config from "../config";

describe("/key/api", function() {
  const baseURI = "/key/api";

  describe("#", function() {
    it("GET / should respond with 200", function(done) {
      shouldRespondWithCode200(baseURI, done);
    });

    it("GET / should respond with a JSON", function(done) {
      shouldRespondWithAJSON(baseURI, done);
    });
  });
});
