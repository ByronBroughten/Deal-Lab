import { Server } from "http";
import request from "supertest";
import { config } from "../../client/src/App/Constants";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { Id } from "../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsUtils/id";
import { runApp } from "../../runApp";
import { DbSectionsModel } from "../DbSectionsModel";
import { DbUser } from "./shared/DbSections/DbUser";
import { createTestUserModelNext } from "./test/createTestUserModelNext";
import { SectionQueryTester } from "./test/SectionQueryTester";

type TestReqs = {
  addSection: QueryReq<"addSection">;
  getSection: QueryReq<"getSection">;
};

function makeReqs(): TestReqs {
  const sectionName = "property";
  const tester = SectionQueryTester.init({ sectionName });
  return {
    addSection: tester.makeSectionPackReq() as QueryReq<"addSection">,
    getSection: tester.makeDbInfoReq(),
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
    token = DbUser.makeUserAuthToken(userId);
  });

  afterEach(async () => {
    await DbSectionsModel.deleteOne({ _id: userId });
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
    reqs.getSection.body.dbId = Id.make().substring(1);
    await testStatus(500);
  });
  it("should return 404 if no section in the queried sectionArr has the dbId", async () => {
    reqs.getSection.body.dbId = Id.make();
    await testStatus(404);
  });
});
