import { Server } from "http";
import request from "supertest";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { RegisterReqMaker } from "../../client/src/App/sharedWithServer/ReqMakers/RegisterReqMaker";
import { runApp } from "../../runApp";
import { DbSectionsModel } from "../DbSectionsModel";
import { registerTestId } from "./register";
import { LoadedDbUser } from "./shared/DbSections/LoadedDbUser";

const testedRoute = apiQueriesShared.register.pathRoute;
function makeTestRegisterReq(): QueryReq<"register"> {
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
  let reqObj: QueryReq<"register">;

  beforeEach(async () => {
    reqObj = makeTestRegisterReq();
    server = runApp();
  });

  afterEach(async () => {
    await DbSectionsModel.deleteOne({ _id: registerTestId });
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
    const res = await exec();
    const userDoc = await DbSectionsModel.findById(registerTestId);
    expect(userDoc).toBeTruthy();

    // (res as any).data = JSON.parse(res.text);
    // expect(() => resValidators.register(res)).not.toThrow();
    expect(res.status).toBe(200);
  });
  it("should return 400 if a user with that email already exists", async () => {
    const reqObj2 = makeTestRegisterReq();
    await LoadedDbUser.createAndSaveNew({
      ...reqObj2.body,
      _id: registerTestId,
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
