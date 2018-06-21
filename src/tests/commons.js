import request from "supertest";
import app from "../app";

function shouldRespondWithCode200(uri, done) {
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

export { shouldRespondWithCode200, shouldRespondWithAJSON };
