import request from "supertest";
import { config } from "../../client/src/App/Constants";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { makeReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { RegisterReqMaker } from "../../client/src/App/sharedWithServer/ReqMakers/RegisterReqMaker";
import { runApp } from "../../runApp";
import { DbSectionsModel } from "../DbSectionsModel";
import { DbUser } from "./shared/DbSections/DbUser";

const testedRoute = apiQueriesShared.login.pathRoute;
function makeReqStuff() {
  const testLoginFormData = {
    email: `${testedRoute}Test@gmail.com`,
    password: "testpassword",
  } as const;

  const reqMaker = RegisterReqMaker.init({
    ...testLoginFormData,
    userName: "Testosis",
  });
  return {
    loginReq: makeReq(testLoginFormData),
    registerBody: reqMaker.reqBody,
  };
}

describe(testedRoute, () => {
  let server: ReturnType<typeof runApp>;
  let reqObj: QueryReq<"login">;
  let userId: string;

  beforeEach(async () => {
    server = runApp();
    const { loginReq, registerBody } = makeReqStuff();
    userId = await DbUser.createAndSaveNew(registerBody);
    reqObj = loginReq;
  });

  afterEach(async () => {
    await DbSectionsModel.deleteOne({ _id: userId });
    server.close();
  });

  const exec = async () =>
    await request(server).post(testedRoute).send(reqObj.body);

  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
  }

  it("should return 400 if payload fails validation", async () => {
    reqObj.body.email = null as any;
    await testStatus(400);
  });
  it("should return 400 if an account with the email doesn't exist", async () => {
    reqObj.body.email = "nonexistant@gmail.com";
    await testStatus(400);
  });
  it("should return 400 if an invalid password is used", async () => {
    reqObj.body.password = "invalidP@ssword123";
    await testStatus(400);
  });
  it("should return 200 if the request is valid", async () => {
    await testStatus(200);
  });
  it("should return an auth token if the request is valid", async () => {
    const res = await exec();
    const token = res.headers[config.tokenKey.apiUserAuth];
    expect(token).not.toBeUndefined();
    expect(() => DbUser.checkUserAuthToken(token)).not.toThrow();
  });
});
