import { Server } from "http";
import request from "supertest";
import { config } from "../../client/src/App/Constants";
import Analyzer from "../../client/src/App/sharedWithServer/Analyzer";
import {
  apiEndpoints,
  NextReq,
} from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { RegisterReqPayloadNext } from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { runApp } from "../../runApp";
import { UserModel } from "../shared/userServerSide";
import { userServerSideNext } from "../shared/userServerSideNext";
import { serverSideLogin } from "../userRoutes/shared/doLogin";

type TestReqs = {
  addSection: NextReq<"addSection">;
  getSection: NextReq<"getSection">;
};

function makeReqs(): TestReqs {
  const sectionName = "property";
  let next = Analyzer.initAnalyzer();
  const { feInfo } = next.lastSection(sectionName);
  const addSectionReq = next.req.addIndexStoreSection(feInfo);
  const { sectionName: dbStoreName, dbId } = addSectionReq.body.payload;
  return {
    addSection: addSectionReq,
    getSection: {
      body: {
        dbStoreName,
        dbId,
      },
    },
  };
}

function makeRegisterPayload(): RegisterReqPayloadNext {
  let next = Analyzer.initAnalyzer();
  next = next.updateSectionValuesAndSolve("register", {
    email: "testosis@gmail.com",
    password: "testPassword",
    userName: "Testosis",
  });
  return next.req.nextRegister().body.payload;
}

async function initUser(): Promise<string> {
  const userDoc = await userServerSideNext.entireMakeUserProcess(
    makeRegisterPayload()
  );
  await userDoc.save();
  return serverSideLogin.makeUserAuthToken(userDoc._id.toHexString());
}

describe(apiEndpoints.getSection.pathRoute, () => {
  const sectionName = "propertyDefault";
  let reqs: TestReqs;
  let server: Server;
  let token: string;

  beforeEach(async () => {
    reqs = makeReqs();
    server = runApp();
    token = await initUser();
    // token = loginUtils.dummyUserAuthToken();
  });

  const exec = async () => {
    await request(server)
      .post(apiEndpoints.addSection.pathRoute)
      .set(config.tokenKey.apiUserAuth, token)
      .send(reqs.addSection.body);
    return await request(server)
      .post(apiEndpoints.getSection.pathRoute)
      .set(config.tokenKey.apiUserAuth, token)
      .send(reqs.getSection.body);
  };

  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
    return res;
  }

  afterEach(async () => {
    await UserModel.deleteMany();
    server.close();
  });
  it("should return 500 if the dbId isn't a valid dbId", async () => {
    reqs.getSection.body.dbId = Analyzer.makeId().substring(1);
    await testStatus(500);
  });
  it("should return 404 if no section in the queried sectionArr has the dbId", async () => {
    reqs.getSection.body.dbId = Analyzer.makeId();
    await testStatus(404);
  });
  it("should return 200 if the request is valid", async () => {
    const res = await testStatus(200);
    // See if JSON.parse(res.text) has a dbId that matches.
  });
});
