import request from "supertest";
import { config } from "../../client/src/App/Constants";
import Analyzer from "../../client/src/App/sharedWithServer/Analyzer";
import {
  apiEndpoints,
  NextReq,
} from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { RegisterReqPayloadNext } from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { runApp } from "../../runApp";
import { UserModelNext } from "../shared/UserModelNext";
import { userServerSideNext } from "../shared/userServerSideNext";
import { serverSideLogin } from "../userRoutes/shared/doLogin";
import { loginUtils } from "./nextLogin/loginUtils";

const sectionName = "property";
function makeAddSectionReq() {
  const analyzer = Analyzer.initAnalyzer();
  const { feInfo } = analyzer.lastSection(sectionName);
  return analyzer.req.addIndexStoreSection(feInfo);
}

function makeRegisterPayload(): RegisterReqPayloadNext {
  let next = Analyzer.initAnalyzer();
  next = next.updateSectionValuesAndSolve("register", {
    email: "testosis@gmail.com",
    password: "testpassword",
    userName: "Testosis",
  });
  return next.req.nextRegister().body.payload;
}

describe(apiEndpoints.addSection.pathRoute, () => {
  const sectionName = "property";
  let req: NextReq<"addSection">;
  let server: any;
  let token: string;

  beforeEach(async () => {
    req = makeAddSectionReq();
    server = runApp();
    token = loginUtils.dummyUserAuthToken();
  });

  const exec = async () =>
    await request(server)
      .post(apiEndpoints.addSection.pathRoute)
      .set(config.tokenKey.apiUserAuth, token)
      .send(req.body);

  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
  }

  afterEach(async () => {
    await UserModelNext.deleteMany();
    server.close();
  });

  it("should return 401 if client is not logged in", async () => {
    token = null as any;
    await testStatus(401);
  });
  it("should return 500 if payload is not an object", async () => {
    req.body.payload = null as any;
    await testStatus(500);
  });
  it("should return 200 if everything is ok", async () => {
    const userDoc = await userServerSideNext.entireMakeUserProcess(
      makeRegisterPayload()
    );
    await userDoc.save();
    token = serverSideLogin.makeUserAuthToken(userDoc._id.toHexString());
    await testStatus(200);
  });
  it("should return 500 if there is already an entry in the db with the payload's dbId", async () => {
    const userDoc = await userServerSideNext.entireMakeUserProcess(
      makeRegisterPayload()
    );
    await userDoc.save();
    token = serverSideLogin.makeUserAuthToken(userDoc._id.toHexString());
    await exec();
    await testStatus(500);
    // const { indexStoreName } = analyzer.meta.section(sectionName).core;
    // const pusher = queryOp.push.entry({ ...req.body.payload }, indexStoreName);
    // await UserModel.findByIdAndUpdate(userId, pusher, queryOptions["post"]);
  });
});
