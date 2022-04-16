import { Server } from "http";
import request from "supertest";
import { config } from "../../client/src/App/Constants";
import Analyzer from "../../client/src/App/sharedWithServer/Analyzer";
import {
  apiEndpoints,
  NextReq,
} from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { runApp } from "../../runApp";
import { UserModel } from "../shared/userServerSide";
import { initTestUser } from "./test/initTestUser";

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

describe(apiEndpoints.getSection.pathRoute, () => {
  let reqs: TestReqs;
  let server: Server;
  let token: string;

  beforeEach(async () => {
    reqs = makeReqs();
    server = runApp();
    token = await initTestUser();
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
