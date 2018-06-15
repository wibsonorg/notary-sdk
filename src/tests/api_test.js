import request from "supertest";
import app from "../app.js";
import Config from "../config";

describe("/api", function() {
  it("GET / should respond with 200 and json", function(done) {
    request(app)
      .get("/api")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});
