import request from "supertest";
import { DbUserGetter } from "../../DbUserService/DbUserGetter";

import { SectionPackArrsReq } from "../../client/src/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { SectionArrReqMaker } from "./apiQueriesTestTools/SectionArrReqMaker";

import { PackBuilderSection } from "../../client/src/sharedWithServer/StateClasses/Packers/PackBuilderSection";
import { apiQueriesShared } from "../../client/src/sharedWithServer/apiQueriesShared";
import { childToSectionName } from "../../client/src/sharedWithServer/sectionVarbsConfigDerived/sectionChildrenDerived/ChildSectionName";
import { runApp } from "../../runApp";
import {
  createAndGetDbUser,
  deleteUserTotally,
  makeSessionGetCookies,
} from "./apiQueriesTestTools/testUser";

const storeName = "onetimeListMain";
const sectionName = childToSectionName("dbStore", storeName);
function makeReq(): SectionPackArrsReq {
  const reqMaker = SectionArrReqMaker.init(sectionName);
  return reqMaker.makeReq();
}

const testedRoute = apiQueriesShared.replaceSectionArrs.pathRoute;
describe(testedRoute, () => {
  let req: SectionPackArrsReq;
  let server: any;
  let dbUser: DbUserGetter;
  let cookies: string[];

  beforeEach(async () => {
    server = runApp();
    dbUser = await createAndGetDbUser(testedRoute);
    cookies = await makeSessionGetCookies({ server, authId: dbUser.authId });
    req = makeReq();
  });

  afterEach(async () => {
    await deleteUserTotally(dbUser);
    server.close();
  });

  const exec = async () =>
    await request(server)
      .post(testedRoute)
      .set("Cookie", cookies)
      .send(req.body);

  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
  }

  it("should return 200 if everything is ok", async () => {
    await testStatus(200);
  });
  it("should return 401 if client is not logged in", async () => {
    cookies = [];
    await testStatus(401);
  });
  it("should return 500 if the payload isn't for a valid dbStoreName", async () => {
    const testName = "authInfoPrivate";
    const authInfo = PackBuilderSection.initAsOmniChild(testName);
    req = {
      body: {
        sectionPackArrs: {
          [testName]: [authInfo.makeSectionPack()],
        },
      } as any,
    };
    await testStatus(500);

    const sectionQueryName = "property";
    const property = PackBuilderSection.initAsOmniChild("property");
    req = {
      body: {
        sectionPackArrs: {
          [sectionQueryName]: [property.makeSectionPack()],
        },
      } as any,
    };
    await testStatus(500);
  });
});
