import request from "supertest";
import { config } from "../../client/src/App/Constants";
import Analyzer from "../../client/src/App/sharedWithServer/Analyzer";
import { Req } from "../../client/src/App/sharedWithServer/Crud";
import { runApp } from "../../runApp";
import { serverSideUser, UserModel } from "../shared/userServerSide";

function makeTestRegisterReq(): Req<"Register"> {
  let next = Analyzer.initAnalyzer();
  next = next.updateSectionValuesAndSolve("register", {
    email: "testosis@gmail.com",
    password: "testpassword",
    userName: "Testosis",
  });
  return next.req.register();
}

describe(config.url.register.route, () => {
  // prep
  let server: ReturnType<typeof runApp> | any;
  let reqObj: Req<"Register"> | any; // any to allow for an invalid payload

  beforeEach(async () => {
    reqObj = makeTestRegisterReq();
    server = runApp();
  });

  // register route: "/api/user/register"
  const exec = async () =>
    await request(server).post(config.url.register.route).send(reqObj.body);
  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
  }

  afterEach(async () => {
    await UserModel.deleteMany();
    server.close();
  });
  it("should return 500 if the payload is not an object", async () => {
    reqObj.body.payload = null;
    await testStatus(500);
  });
  it("should return 400 if the payload fails validation", async () => {
    reqObj.body.payload.registerFormData.email = null;
    await testStatus(400);
  });
  it("should return 500 if guestAccessSections isn't right", async () => {
    reqObj.body.payload.guestAccessSections = null;
    await testStatus(500);
  });
  it("should return 400 if a user with that email already exists", async () => {
    const reqObj2 = makeTestRegisterReq();
    const userDoc = await serverSideUser.full(reqObj2.body.payload);
    await userDoc.save();
    await testStatus(400);
  });
  it("should return 200 if the request is valid", async () => {
    await testStatus(200);
  });
});
