import { Server } from "http";
import request from "supertest";
import { config } from "../../client/src/App/Constants";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { Id } from "../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsUtils/id";
import { runApp } from "../../runApp";
import { DbSectionsModel } from "../DbSectionsModel";
import { createTestUserModelNext } from "./test/createTestUserModelNext";
import { SectionQueryTester } from "./test/SectionQueryTester";

type TestReqs = {
  addSection: QueryReq<"addSection">;
  deleteSection: QueryReq<"deleteSection">;
};

function makeReqs(): TestReqs {
  const sectionName = "property";
  const tester = SectionQueryTester.init({ sectionName });
  return {
    addSection: tester.makeSectionPackReq() as QueryReq<"addSection">,
    deleteSection: tester.makeDbInfoReq(),
  };
}

const testedRoute = apiQueriesShared.deleteSection.pathRoute;
describe(testedRoute, () => {
  let reqs: TestReqs;
  let server: Server;
  let userId: string;
  let token: string;

  beforeEach(async () => {
    server = runApp();
    const dbUser = await createTestUserModelNext(testedRoute);
    token = dbUser.createTestUserModel();
    reqs = makeReqs();
    userId = dbUser.userId;
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
      .post(testedRoute)
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
    reqs.deleteSection.body.dbId = Id.make().substring(1);
    await testStatus(500);
  });
  // it("should return 404 if no section in the queried sectionArr has the dbId", async () => {
  //   reqs.deleteSection.body.dbId = Id.makeId();
  //   await testStatus(404);
  // });
});
