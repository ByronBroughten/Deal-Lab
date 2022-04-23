import { Server } from "http";
import request from "supertest";
import { config } from "../../client/src/App/Constants";
import Analyzer from "../../client/src/App/sharedWithServer/Analyzer";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { NextReq } from "../../client/src/App/sharedWithServer/apiQueriesSharedTypes";
import { runApp } from "../../runApp";
import { UserModelNext } from "../shared/UserModelNext";
import { loginUtils } from "./nextLogin/loginUtils";
import { createTestUserModelNext } from "./test/createTestUserModelNext";

type TestReqs = {
  addSection: NextReq<"addSection">;
  getSection: NextReq<"getSection">;
};

function makeReqs(): TestReqs {
  const sectionName = "property";
  let next = Analyzer.initAnalyzer();
  const { feInfo } = next.lastSection(sectionName);
  const addSectionReq = next.req.addIndexStoreSection(feInfo);
  const { sectionName: dbStoreName, dbId } = addSectionReq.body.sectionPack;
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

const testedApiRoute = apiQueriesShared.getSection.pathRoute;
describe(testedApiRoute, () => {
  let reqs: TestReqs;
  let server: Server;
  let userId: string;
  let token: string;

  beforeEach(async () => {
    reqs = makeReqs();
    server = runApp();
    userId = await createTestUserModelNext(testedApiRoute);
    token = loginUtils.makeUserAuthToken(userId);
  });

  afterEach(async () => {
    await UserModelNext.deleteOne({ _id: userId });
    server.close();
  });

  const exec = async () => {
    await request(server)
      .post(apiQueriesShared.addSection.pathRoute)
      .set(config.tokenKey.apiUserAuth, token)
      .send(reqs.addSection.body);

    return await request(server)
      .post(testedApiRoute)
      .set(config.tokenKey.apiUserAuth, token)
      .send(reqs.getSection.body);
  };

  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
    return res;
  }

  it("should return 200 if the request is valid", async () => {
    await testStatus(200);
    // See if JSON.parse(res.text) has a dbId that matches.
  });
  it("should return 500 if the dbId isn't a valid dbId", async () => {
    reqs.getSection.body.dbId = Analyzer.makeId().substring(1);
    await testStatus(500);
  });
  it("should return 404 if no section in the queried sectionArr has the dbId", async () => {
    reqs.getSection.body.dbId = Analyzer.makeId();
    await testStatus(404);
  });
});
