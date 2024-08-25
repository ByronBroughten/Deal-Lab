import { Server } from "http";
import request from "supertest";
import { QueryReq } from "../../client/src/sharedWithServer/ApiQueries";
import {
  constant,
  constants,
} from "../../client/src/sharedWithServer/Constants";
import { PackBuilderSection } from "../../client/src/sharedWithServer/StateOperators/Packers/PackBuilderSection";
import { Arr } from "../../client/src/sharedWithServer/utils/Arr";
import { timeS } from "../../client/src/sharedWithServer/utils/timeS";
import { DbUserGetter } from "../../DbUserService/DbUserGetter";
import { getUserById } from "../../DbUserService/DbUserModel";
import { runApp } from "../../runApp";
import { SectionQueryTester } from "./apiQueriesTestTools/SectionQueryTester";
import {
  createAndGetDbUser,
  deleteUserTotally,
  makeSessionGetCookies,
} from "./apiQueriesTestTools/testUser";

jest.setTimeout(12000);

function makeAddSectionReq(): QueryReq<"addSection"> {
  const sectionName = "property";
  const tester = SectionQueryTester.init({ sectionName });
  return tester.makeSectionPackReq() as QueryReq<"addSection">;
}

const testedRoute = constant("pathRoutes").addSection;
describe(testedRoute, () => {
  let req: QueryReq<"addSection">;
  let server: Server;
  let dbUser: DbUserGetter;
  let cookies: string[];
  let token: string;

  beforeEach(async () => {
    server = runApp();
    req = makeAddSectionReq();
    dbUser = await createAndGetDbUser(testedRoute);
    token = dbUser.createUserJwt();
    cookies = await makeSessionGetCookies({ server, authId: dbUser.authId });
  });

  afterEach(async () => {
    if (dbUser) {
      await deleteUserTotally(dbUser);
    }
    server.close();
  });

  const exec = async () =>
    await request(server)
      .post(testedRoute)
      .set("Cookie", cookies)
      .set(constants.tokenKey.userAuthData, token)
      .send(req.body);

  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
    return res;
  }
  it("should return 200 and add the section if happy path", async () => {
    const preDoc = await getUserById(dbUser.userId);
    await testStatus(200);
    const postDoc = await getUserById(dbUser.userId);

    expect(postDoc.propertyMain.length).toBe(preDoc.propertyMain.length + 1);
    expect(Arr.lastOrThrow(postDoc.propertyMain).dbId).toBe(
      req.body.sectionPack.dbId
    );
  });
  it("should return 401 if client is not logged in", async () => {
    token = "" as any;
    await testStatus(401);
  });
  it("should return 500 if the payload isn't for a sectionQuery dbStoreName", async () => {
    const userInfo = PackBuilderSection.initAsOmniChild("userInfo");
    req = {
      body: {
        dbStoreName: "userInfo",
        sectionPack: userInfo.makeSectionPack(),
      } as any,
    };
    await testStatus(500);
    const authInfoPrivate =
      PackBuilderSection.initAsOmniChild("authInfoPrivate");
    req = {
      body: {
        dbStoreName: "authInfoPrivate",
        sectionPack: authInfoPrivate.makeSectionPack(),
      } as any,
    };
    await testStatus(500);
  });
  it("should return 500 if sectionPack is not an object", async () => {
    req.body.sectionPack = null as any;
    await testStatus(500);
  });
  it("should return 400 if there is an entry in the db with sectionPack's dbId", async () => {
    await exec();
    await testStatus(400);
  });
  // it("should return 400 if there are already two entries", async () => {
  // isBeta
  //   await exec();
  //   req = makeAddSectionReq();
  //   await exec();
  //   req = makeAddSectionReq();
  //   await testStatus(400);
  // });
  it("should return 200 if there are two entries and user is pro", async () => {
    await exec();
    req = makeAddSectionReq();
    await exec();
    req = makeAddSectionReq();
    token = dbUser.createUserJwt({
      labSubscription: "fullPlan",
      labSubscriptionExp: timeS.now() + timeS.thirtyDays,
    });
    await testStatus(200);
  });
});
