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
  deleteSection: NextReq<"deleteSection">;
};

function makeReqs(): TestReqs {
  const sectionName = "property";
  let next = Analyzer.initAnalyzer();
  const { feInfo } = next.lastSection(sectionName);
  const addSectionReq = next.req.addIndexStoreSection(feInfo);
  const { sectionName: dbStoreName, dbId } = addSectionReq.body.payload;
  return {
    addSection: addSectionReq,
    deleteSection: {
      body: {
        dbStoreName,
        dbId,
      },
    },
  };
}

const testedApiRoute = apiQueriesShared.deleteSection.pathRoute;
describe(testedApiRoute, () => {
  let reqs: TestReqs;
  let server: Server;
  let userId: string;
  let token: string;

  beforeEach(async () => {
    server = runApp();
    userId = await createTestUserModelNext(testedApiRoute);
    token = loginUtils.makeUserAuthToken(userId);
    reqs = makeReqs();
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
      .send(reqs.deleteSection.body);
  };

  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
    return res;
  }

  it("should produce status 200 if everything is ok", async () => {
    await testStatus(200);
  });
  it("should return 500 if the dbId isn't a dbId", async () => {
    reqs.deleteSection.body.dbId = Analyzer.makeId().substring(1);
    await testStatus(500);
  });
  // it("should return 404 if no section in the queried sectionArr has the dbId", async () => {
  //   reqs.deleteSection.body.dbId = Analyzer.makeId();
  //   await testStatus(404);
  // });
});
