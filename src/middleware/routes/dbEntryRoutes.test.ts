import { dbEntryRoutePath } from "./dbEntryRoutes";
import { makeDummyUserToken } from "./userRoutes/login";
import request from "supertest";
import { runApp } from "../../runApp";
import { UserModel } from "./shared/makeDbUser";
import { authTokenKey } from "../sharedWithServer/User/crudTypes";

// for get and delete, return 404 if no entry with that dbId is found
// return 200 if valid request
// for post, the entry should be added
// for delete, the entry should be removed
// for put, the entry should be edited
// return user entries

describe(`${dbEntryRoutePath}.post`, () => {
  let payload: any;
  let server: any;
  let token: any;

  beforeEach(async () => {
    payload = {};
    server = runApp();
    token = makeDummyUserToken();
  });

  const exec = () =>
    request(server)
      .post(`${dbEntryRoutePath}`)
      .set(authTokenKey, token)
      .send({ payload });
  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
  }

  afterEach(async () => {
    await UserModel.deleteMany();
    // await server.close();
  });

  it("should return 401 if client is not logged in", async () => {
    token = null;
    await testStatus(401);
  });
  it("should return 400 if payload fails validation", async () => {
    payload = null;
    await testStatus(400);
  });

  // it("should return 200 if everything is ok", async () => {
  //   await exec();
  // });
});
