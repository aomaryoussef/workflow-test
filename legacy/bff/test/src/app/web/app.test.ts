import assert from "assert";
import request from "supertest";
import app from "../../../../src/app/web/server";

describe("Unit testing the / route", function () {
  it("should return OK status", function () {
    return request(app)
      .get("/")
      .then(function (response) {
        assert.equal(response.status, 200);
      });
  });
});
