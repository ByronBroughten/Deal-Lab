import { Server } from "http";
import request from "supertest";
import { constants } from "../../client/src/App/Constants";
import { Id } from "../../client/src/App/sharedWithServer/SectionsMeta/IdS";
import { numObj } from "../../client/src/App/sharedWithServer/SectionsMeta/values/StateValue/NumObj";
import { stringObj } from "../../client/src/App/sharedWithServer/SectionsMeta/values/StateValue/StringObj";
import { PackBuilderSection } from "../../client/src/App/sharedWithServer/StatePackers/PackBuilderSection";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { runApp } from "../../runApp";
import { LoadedDbUser } from "./apiQueriesShared/DbSections/LoadedDbUser";

import { getUserById } from "../../mongoose/DbUserModel";
import { SectionQueryTester } from "./apiQueriesTestTools/SectionQueryTester";
import {
  createAndGetDbUser,
  deleteUserTotally,
  makeSessionGetCookies,
  validateStatus200Res,
} from "./apiQueriesTestTools/testDbUser";

const sectionName = "property";
const originalValues = {
  displayName: stringObj("Original displayName"),
  purchasePrice: numObj(100000),
} as const;

const updatedValues = {
  displayName: stringObj("Updated displayName"),
  purchasePrice: numObj(500000),
} as const;

type TestReqs = {
  addSection: QueryReq<"addSection">;
  updateSection: QueryReq<"updateSection">;
};
function makeReqs(): TestReqs {
  const tester = SectionQueryTester.init({ sectionName });
  const { updater } = tester;
  updater.updateValues(originalValues);
  const originalSection = tester.makeSectionPackReq();

  updater.updateValues(updatedValues);
  const updatedSection = tester.makeSectionPackReq();
  return {
    addSection: originalSection,
    updateSection: updatedSection,
  } as TestReqs;
}

const testedRoute = apiQueriesShared.updateSection.pathRoute;
describe(testedRoute, () => {
  let server: Server;
  let dbUser: LoadedDbUser;
  let cookies: string[];
  let reqs: TestReqs;

  let addSectionCookies: string[];

  beforeEach(async () => {
    server = runApp();
    dbUser = await createAndGetDbUser(testedRoute);
    cookies = await makeSessionGetCookies({ server, authId: dbUser.authId });
    reqs = makeReqs();

    addSectionCookies = cookies;
  });

  afterEach(async () => {
    await deleteUserTotally(dbUser);
    server.close();
  });

  const exec = async () => {
    const res = await request(server)
      .post(apiQueriesShared.addSection.pathRoute)
      .set(constants.tokenKey.userAuthData, dbUser.createUserInfoToken())
      .set("Cookie", addSectionCookies)
      .send(reqs.addSection.body);

    validateStatus200Res(res);

    return await request(server)
      .post(testedRoute)
      .set("Cookie", cookies)
      .send(reqs.updateSection.body);
  };

  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
  }
  it("should return 200 and update a section if happy path concurrent", async () => {
    await testStatus(200);
    const postDoc = await getUserById(dbUser.userId);
    const updatedDoc = postDoc.propertyMain.find(
      ({ dbId }) => dbId === reqs.updateSection.body.sectionPack.dbId
    );
    const updatedSection = updatedDoc?.rawSections.property.find(
      ({ dbId }) => dbId === reqs.updateSection.body.sectionPack.dbId
    );

    expect(updatedSection?.sectionValues.displayName).toEqual(
      updatedValues.displayName
    );
    expect(updatedSection?.sectionValues.purchasePrice).toEqual(
      updatedValues.purchasePrice
    );
  });
  it("should return 404 if there is not an entry in the db with the sectionPack's dbId concurrent", async () => {
    reqs.updateSection.body.sectionPack.dbId = Id.make();
    await testStatus(404);
  });
  it("should return 401 if client is not logged in", async () => {
    cookies = [];
    await testStatus(401);
  });
  it("should return 500 if sectionPack is not an object", async () => {
    reqs.updateSection.body.sectionPack = null as any;
    await testStatus(500);
  });
  it("should return 500 if the payload isn't for a sectionQuery dbStoreName", async () => {
    const testName = "authInfoPrivate";
    const authInfo = PackBuilderSection.initAsOmniChild(testName);
    reqs.updateSection = {
      body: {
        dbStoreName: testName,
        sectionPack: authInfo.makeSectionPack(),
      } as any,
    };
    await testStatus(500);
  });
});
