import { Server } from "http";
import request from "supertest";
import { QueryReq } from "../../client/src/sharedWithServer/ApiQueries";
import {
  constant,
  constants,
} from "../../client/src/sharedWithServer/Constants";
import { Id } from "../../client/src/sharedWithServer/Ids/IdS";
import { PackBuilderSection } from "../../client/src/sharedWithServer/StateClasses/Packers/PackBuilderSection";
import { DbUserGetter } from "../../DbUserService/DbUserGetter";
import { runApp } from "../../runApp";
import { SectionQueryTester } from "./apiQueriesTestTools/SectionQueryTester";
import {
  createAndGetDbUser,
  deleteUserTotally,
  makeSessionGetCookies,
  validateStatus200Res,
} from "./apiQueriesTestTools/testUser";

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

const testedRoute = constant("pathRoutes").deleteSection;
describe(testedRoute, () => {
  let server: Server;
  let dbUser: DbUserGetter;
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
      .post(constant("pathRoutes").addSection)
      .set(constants.tokenKey.userAuthData, dbUser.createUserJwt())
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
