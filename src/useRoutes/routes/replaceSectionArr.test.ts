import request from "supertest";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { SectionPackArrsReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { SectionArrReqMaker } from "../../client/src/App/sharedWithServer/ReqMakers/SectionArrReqMaker";
import { childToSectionName } from "../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { PackBuilderSection } from "../../client/src/App/sharedWithServer/StatePackers/PackBuilderSection";
import { runApp } from "../../runApp";
import { LoadedDbUser } from "./apiQueriesShared/DbSections/LoadedDbUser";
import {
  createAndGetDbUser,
  deleteUserTotally,
  makeSessionGetCookies,
} from "./apiQueriesTestTools/testDbUser";

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
  let dbUser: LoadedDbUser;
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
