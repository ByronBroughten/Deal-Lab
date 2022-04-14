import request from "supertest";
import { config } from "../../client/src/App/Constants";
import Analyzer from "../../client/src/App/sharedWithServer/Analyzer";
import {
  apiEndpoints,
  NextReq,
} from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { RegisterReqPayloadNext } from "../../client/src/App/sharedWithServer/apiQueriesShared/Register";
import { runApp } from "../../runApp";
import { UserModelNext } from "../shared/UserModelNext";
import { userServerSideNext } from "../shared/userServerSideNext";
import { loginUtils } from "./nextLogin/loginUtils";

const testLoginFormData = {
  email: "testosis@gmail.com",
  password: "testpassword",
} as const;

const testRegisterFormData = {
  ...testLoginFormData,
  userName: "Testosis",
} as const;

function makeTestLoginReq() {
  let next = Analyzer.initAnalyzer();
  next = next.updateSectionValuesAndSolve("login", testLoginFormData);
  return next.req.nextLogin();
}

function makeTestRegisterReqPayload(): RegisterReqPayloadNext {
  let next = Analyzer.initAnalyzer();
  next = next.updateSectionValuesAndSolve("register", testRegisterFormData);
  return next.req.nextRegister().body.payload;
}

describe(apiEndpoints.nextLogin.pathRoute, () => {
  let server: ReturnType<typeof runApp>;
  let reqObj: NextReq<"nextLogin">;

  beforeEach(async () => {
    server = runApp();
    reqObj = makeTestLoginReq();

    const userDoc = await userServerSideNext.entireMakeUserProcess(
      makeTestRegisterReqPayload()
    );
    await userDoc.save();
  });

  const exec = async () =>
    await request(server)
      .post(apiEndpoints.nextLogin.pathRoute)
      .send(reqObj.body);

  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
  }

  afterEach(async () => {
    await UserModelNext.deleteMany();
    server.close();
  });
  it("should return 400 if payload fails validation", async () => {
    reqObj.body.payload.email = null as any;
    await testStatus(400);
  });
  it("should return 400 if an account with the email doesn't exist", async () => {
    reqObj.body.payload.email = "nonexistant@gmail.com";
    await testStatus(400);
  });
  it("should return 400 if an invalid password is used", async () => {
    reqObj.body.payload.password = "invalidP@ssword123";
    await testStatus(400);
  });
  it("should return 200 if the request is valid", async () => {
    await testStatus(200);
  });
  it("should return an auth token if the request is valid", async () => {
    const res = await exec();
    const token = res.headers[config.tokenKey.apiUserAuth];
    expect(token).not.toBeUndefined();

    const decoded = loginUtils.checkUserAuthToken(token);
    expect(decoded).not.toBeNull();
  });
});
