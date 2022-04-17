import { Server } from "http";
import request from "supertest";
import Analyzer from "../../client/src/App/sharedWithServer/Analyzer";
import {
  apiEndpoints,
  NextReq,
} from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { runApp } from "../../runApp";
import { UserModelNext } from "../shared/UserModelNext";
import { userServerSideNext } from "../shared/userServerSideNext";
import { testRegisterId } from "./nextRegister";

const apiTestRoute = apiEndpoints.nextRegister.pathRoute;
function makeTestRegisterReq(): NextReq<"nextRegister"> {
  let next = Analyzer.initAnalyzer();
  next = next.updateSectionValuesAndSolve("register", {
    email: `${apiTestRoute}Test@gmail.com`,
    password: "testpassword",
    userName: "Testosis",
  });
  return next.req.nextRegister();
}

describe(apiTestRoute, () => {
  // prep
  let server: Server;
  let reqObj: NextReq<"nextRegister">;

  beforeEach(async () => {
    reqObj = makeTestRegisterReq();
    server = runApp();
  });

  afterEach(async () => {
    await UserModelNext.deleteOne({ _id: testRegisterId });
    server.close();
  });

  const exec = async () =>
    await request(server)
      .post(apiEndpoints.nextRegister.pathRoute)
      .send(reqObj.body);

  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
    return res;
  }
  it("should return status 200 and create a user if happy path", async () => {
    await testStatus(200);
    const userDoc = await UserModelNext.findById(testRegisterId);
    expect(userDoc).toBeTruthy();
  });
  it("should return 400 if a user with that email already exists", async () => {
    const reqObj2 = makeTestRegisterReq();
    await userServerSideNext.entireMakeUserProcess({
      ...reqObj2.body.payload,
      _id: testRegisterId,
    });
    await testStatus(400);
  });
  it("should return 500 if the payload is not an object", async () => {
    (reqObj.body.payload as any) = null;
    await testStatus(500);
  });
  it("should return 400 if the payload fails validation", async () => {
    (reqObj.body.payload.registerFormData.email as any) = null;
    await testStatus(400);
  });
  it("should return 500 if guestAccessSections isn't right", async () => {
    (reqObj.body.payload.guestAccessSections as any) = null;
    await testStatus(500);
  });
});
