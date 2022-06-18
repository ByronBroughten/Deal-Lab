import { Server } from "http";
import request from "supertest";
import {
  apiQueriesShared,
  resValidators,
} from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { NextReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { RegisterReqMaker } from "../../client/src/App/sharedWithServer/ReqMakers/RegisterReqMaker";
import { runApp } from "../../runApp";
import { UserModel } from "../UserModel";
import { testRegisterId } from "./nextRegister";
import { userServerSide } from "./userServerSide";

const testedRoute = apiQueriesShared.nextRegister.pathRoute;
function makeTestRegisterReq(): NextReq<"nextRegister"> {
  const reqMaker = RegisterReqMaker.init({
    email: `${testedRoute}Test@gmail.com`,
    password: "testpassword",
    userName: "Testosis",
  });
  return reqMaker.makeReq();
}

describe(testedRoute, () => {
  // prep
  let server: Server;
  let reqObj: NextReq<"nextRegister">;

  beforeEach(async () => {
    reqObj = makeTestRegisterReq();
    server = runApp();
  });

  afterEach(async () => {
    await UserModel.deleteOne({ _id: testRegisterId });
    server.close();
  });

  const exec = async () => {
    const res = await request(server).post(testedRoute).send(reqObj.body);
    return res;
  };

  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
    return res;
  }
  it("should return status 200 and create a user if happy path", async () => {
    const res = await testStatus(200);
    (res as any).data = JSON.parse(res.text);
    expect(() => resValidators.nextRegister(res)).not.toThrow();

    const userDoc = await UserModel.findById(testRegisterId);
    expect(userDoc).toBeTruthy();
  });
  it("should return 400 if a user with that email already exists", async () => {
    const reqObj2 = makeTestRegisterReq();
    await userServerSide.entireMakeUserProcess({
      ...reqObj2.body,
      _id: testRegisterId,
    });
    await testStatus(400);
  });
  it("should return 400 if the register form data fails validation", async () => {
    (reqObj.body.registerFormData.email as any) = null;
    await testStatus(400);
  });
  it("should return 500 if guestAccessSections isn't right", async () => {
    (reqObj.body.guestAccessSections as any) = null;
    await testStatus(500);
  });
});
