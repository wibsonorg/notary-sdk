import request from "supertest";
import app from "../app";

function shouldRespondWith200(uri, done) {
  request(app)
    .get(uri)
    .set("Accept", "application/json")
    .expect(200, done);
}

function shouldRespondWithAJSON(uri, done) {
  request(app)
    .get(uri)
    .set("Accept", "application/json")
    .expect("Content-Type", /json/, done);
}

export { shouldRespondWith200, shouldRespondWithAJSON };
