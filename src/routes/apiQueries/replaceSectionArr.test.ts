import request from "supertest";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { SectionPackArrReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { SectionArrReqMaker } from "../../client/src/App/sharedWithServer/ReqMakers/SectionArrReqMaker";
import { PackBuilderSection } from "../../client/src/App/sharedWithServer/StatePackers.ts/PackBuilderSection";
import { runApp } from "../../runApp";
import { childToSectionName } from "./../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/ChildSectionName";
import { LoadedDbUser } from "./shared/DbSections/LoadedDbUser";
import {
  createAndGetDbUser,
  deleteUserTotally,
  makeSessionGetCookies,
} from "./test/testDbUser";

const storeName = "singleTimeListMain";
type StoreName = typeof storeName;
const sectionName = childToSectionName("dbStore", storeName);
function makeReq(): SectionPackArrReq<StoreName> {
  const reqMaker = SectionArrReqMaker.init(sectionName);
  return reqMaker.makeReq();
}

const testedRoute = apiQueriesShared.replaceSectionArr.pathRoute;
describe(testedRoute, () => {
  let req: SectionPackArrReq<StoreName>;
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
        dbStoreName: testName,
        sectionPackArr: [authInfo.makeSectionPack()],
      } as any,
    };
    await testStatus(500);

    const sectionQueryName = "propertyMain";
    const property = PackBuilderSection.initAsOmniChild("property");
    req = {
      body: {
        dbStoreName: sectionQueryName,
        sectionPackArr: [property.makeSectionPack()],
      } as any,
    };
    await testStatus(500);
  });
});
