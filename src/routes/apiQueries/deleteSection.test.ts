import { Server } from "http";
import request from "supertest";
import { config } from "../../client/src/App/Constants";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { NextReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { Id } from "../../client/src/App/sharedWithServer/SectionsMeta/baseSections/id";
import { runApp } from "../../runApp";
import { UserModel } from "../UserModel";
import { loginUtils } from "./nextLogin/loginUtils";
import { createTestUserModelNext } from "./test/createTestUserModelNext";
import { SectionQueryTester } from "./test/SectionQueryTester";

type TestReqs = {
  addSection: NextReq<"addSection">;
  deleteSection: NextReq<"deleteSection">;
};

function makeReqs(): TestReqs {
  const sectionName = "property";
  const tester = SectionQueryTester.init({
    sectionName,
    indexName: "property",
  });
  return {
    addSection: tester.makeSectionPackReq(),
    deleteSection: tester.makeDbInfoReq(),
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
    await UserModel.deleteOne({ _id: userId });
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
    reqs.deleteSection.body.dbId = Id.make().substring(1);
    await testStatus(500);
  });
  // it("should return 404 if no section in the queried sectionArr has the dbId", async () => {
  //   reqs.deleteSection.body.dbId = Id.makeId();
  //   await testStatus(404);
  // });
});
