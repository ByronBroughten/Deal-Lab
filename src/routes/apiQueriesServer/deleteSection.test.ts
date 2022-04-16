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

describe(apiEndpoints.deleteSection.pathRoute, () => {
  let reqs: TestReqs;
  let server: Server;
  let token: string;

  beforeEach(async () => {
    reqs = makeReqs();
    server = runApp();
    token = await initTestUser();
  });

  const exec = async () => {
    await request(server)
      .post(apiEndpoints.addSection.pathRoute)
      .set(config.tokenKey.apiUserAuth, token)
      .send(reqs.addSection.body);
    return await request(server)
      .post(apiEndpoints.deleteSection.pathRoute)
      .set(config.tokenKey.apiUserAuth, token)
      .send(reqs.deleteSection.body);
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
