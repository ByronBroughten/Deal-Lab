import { dbEntryRoutePath } from "./dbEntryRoutes";
import { makeDummyUserToken } from "./userRoutes/shared/doLogin";
import request from "supertest";
import { runApp } from "../../runApp";
import { UserModel } from "./shared/makeDbUser";
import { authTokenKey } from "../../client/src/App/sharedWithServer/User/crudTypes";

describe(`dbEntry/post`, () => {
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
  it("should return 500 if payload is not an object", async () => {
    payload = null;
    await testStatus(500);
  });

  // it("should return 200 if everything is ok", async () => {
  //   await exec();
  // });
});
