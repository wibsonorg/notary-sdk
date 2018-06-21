import request from "supertest";
import assert from "assert";
import app from "../app";
import { shouldRespondWith200, shouldRespondWithAJSON } from "./commons";
import Config from "../config";

describe("/sdk/api", function() {
  it("GET /sdk/api should respond with 200", function(done) {
    shouldRespondWith200("/sdk/api", done);
  });

  it("GET /sdk/api should respond with a JSON", function(done) {
    shouldRespondWithAJSON("/sdk/api", done);
  });
});
