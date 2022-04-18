import request from "supertest";
import { config } from "../../client/src/App/Constants";
import Analyzer from "../../client/src/App/sharedWithServer/Analyzer";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { RegisterReqBody } from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { NextReq } from "../../client/src/App/sharedWithServer/apiQueriesSharedTypes";
import { runApp } from "../../runApp";
import { UserModelNext } from "../shared/UserModelNext";
import { loginUtils } from "./nextLogin/loginUtils";
import { userServerSide } from "./userServerSide";

const testedRoute = apiQueriesShared.nextLogin.pathRoute;
const testLoginFormData = {
  email: `${testedRoute}Test@gmail.com`,
  password: "testpassword",
} as const;

const testRegisterFormData = {
  ...testLoginFormData,
  userName: "Testosis",
} as const;

function makeTestLoginReq() {
  let next = Analyzer.initAnalyzer();
  next = next.updateSectionValuesAndSolve("login", testLoginFormData);
  return apiQueriesShared.nextLogin.makeReq(next);
}

function makeTestRegisterReqBody(): RegisterReqBody {
  let next = Analyzer.initAnalyzer();
  next = next.updateSectionValuesAndSolve("register", testRegisterFormData);
  return apiQueriesShared.nextRegister.makeReq(next).body;
}

describe(testedRoute, () => {
  let server: ReturnType<typeof runApp>;
  let reqObj: NextReq<"nextLogin">;
  let userId: string;

  beforeEach(async () => {
    server = runApp();
    reqObj = makeTestLoginReq();
    const userDoc = await userServerSide.entireMakeUserProcess(
      makeTestRegisterReqBody()
    );
    userId = userDoc._id.toHexString();
  });

  afterEach(async () => {
    await UserModelNext.deleteOne({ _id: userId });
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

    const decoded = loginUtils.decodeUserAuthToken(token);
    expect(decoded).not.toBeNull();
  });
});
