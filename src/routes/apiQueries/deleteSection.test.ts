import { Server } from "http";
import request from "supertest";
import { constants } from "../../client/src/App/Constants";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { Id } from "../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsUtils/id";
import { PackBuilderSection } from "../../client/src/App/sharedWithServer/StatePackers.ts/PackBuilderSection";
import { runApp } from "../../runApp";
import { LoadedDbUser } from "./apiQueriesShared/DbSections/LoadedDbUser";
import { SectionQueryTester } from "./apiQueriesTestTools/SectionQueryTester";
import {
  createAndGetDbUser,
  deleteUserTotally,
  makeSessionGetCookies,
  validateStatus200Res,
} from "./apiQueriesTestTools/testDbUser";

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
  let server: Server;
  let dbUser: LoadedDbUser;
  let cookies: string[];
  let reqs: TestReqs;

  beforeEach(async () => {
    server = runApp();
    dbUser = await createAndGetDbUser(testedRoute);
    cookies = await makeSessionGetCookies({ server, authId: dbUser.authId });
    reqs = makeReqs();
  });

  afterEach(async () => {
    await deleteUserTotally(dbUser);
    server.close();
  });

  const exec = async () => {
    const res = await request(server)
      .post(apiQueriesShared.addSection.pathRoute)
      .set(constants.tokenKey.apiUserAuth, dbUser.createUserInfoToken())
      .set("Cookie", cookies)
      .send(reqs.addSection.body);

    validateStatus200Res(res);

    return await request(server)
      .post(testedRoute)
      .set("Cookie", cookies)
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
  it("should return 500 if the payload isn't for a sectionQuery dbStoreName", async () => {
    const testName = "authInfoPrivate";
    const authInfo = PackBuilderSection.initAsOmniChild(testName);
    reqs.deleteSection = {
      body: {
        dbStoreName: testName,
        dbId: authInfo.get.dbId,
      } as any,
    };
    await testStatus(500);
  });
});
