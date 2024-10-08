import { Server } from "http";
import request from "supertest";
import { QueryReq } from "../../client/src/sharedWithServer/ApiQueries";
import {
  constant,
  constants,
} from "../../client/src/sharedWithServer/Constants";
import { PackBuilderSection } from "../../client/src/sharedWithServer/StateOperators/Packers/PackBuilderSection";
import { IdS } from "../../client/src/sharedWithServer/utils/IdS";
import { DbUserGetter } from "../../DbUserService/DbUserGetter";
import { runApp } from "../../runApp";
import { SectionQueryTester } from "./apiQueriesTestTools/SectionQueryTester";
import {
  createAndGetDbUser,
  deleteUserTotally,
  getStandardRes,
  makeSessionGetCookies,
  validateStatus200Res,
} from "./apiQueriesTestTools/testUser";

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

const testedRoute = constant("pathRoutes").getSection;
describe(testedRoute, () => {
  let reqs: TestReqs;
  let server: Server;
  let dbUser: DbUserGetter;
  let cookies: string[];

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

  const addSection = async () => {
    const res = await request(server)
      .post(constant("pathRoutes").addSection)
      .set(constants.tokenKey.userAuthData, dbUser.createUserJwt())
      .set("Cookie", cookies)
      .send(reqs.addSection.body);
    validateStatus200Res(res);
  };

  const getSection = async () => {
    const res = await request(server)
      .post(testedRoute)
      .set("Cookie", cookies)
      .send(reqs.getSection.body);
    return getStandardRes(res);
  };

  const exec = async () => {
    await addSection();
    return await getSection();
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
    reqs.getSection.body.dbId = IdS.make().substring(1);
    await testStatus(500);
  });
  it("should return 404 if no section in the queried sectionArr has the dbId", async () => {
    reqs.getSection.body.dbId = IdS.make();
    await testStatus(404);
  });
  it("should return 500 if the payload isn't for a sectionQuery dbStoreName", async () => {
    const testName = "authInfoPrivate";
    const authInfo = PackBuilderSection.initAsOmniChild(testName);
    reqs.getSection = {
      body: {
        dbStoreName: testName,
        dbId: authInfo.get.dbId,
      } as any,
    };
    await testStatus(500);
  });
  // it("should load saved subsections if sync is turned on", async () => {
  //   const original = {
  //     purchasePrice: numObj(100000),
  //     displayName: stringObj("Original"),
  //   };

  //   const deal = SetterTesterSection.initActiveDeal().setter;
  //   const property = deal.onlyChild("property");
  //   property.varb("purchasePrice").updateValue(original.purchasePrice);
  //   property.varb("displayName").updateValue(original.displayName);
  //   property.updateValues({ autoSyncControl: "autoSyncOn" });

  //   reqs.addSection.body = {
  //     dbStoreName: "dealMain",
  //     sectionPack: deal.packMaker.makeSectionPack(),
  //   } as any;
  //   await addSection();

  //   const updated = {
  //     purchasePrice: numObj(200000),
  //     displayName: stringObj("Updated"),
  //   };
  //   property.varb("purchasePrice").updateValue(updated.purchasePrice);
  //   property.varb("displayName").updateValue(updated.displayName);
  //   reqs.addSection.body = {
  //     dbStoreName: "propertyMain",
  //     sectionPack: property.packMaker.makeSectionPack(),
  //   } as any;
  //   await addSection();

  //   reqs.getSection.body = {
  //     dbStoreName: "dealMain",
  //     dbId: deal.get.dbId,
  //   };

  //   const res = await getSection();
  //   const { sectionPack } = res.data as SectionPackRes<"dealMain">["data"];

  //   function testSectionPack() {
  //     const deal = SetterTesterSection.initActiveDeal().setter;
  //     deal.loadSelfSectionPack(sectionPack);
  //     const property = deal.get.onlyChild("property");
  //     expect(property.valueNext("purchasePrice")).toEqual(
  //       updated.purchasePrice
  //     );
  //     expect(property.valueNext("displayName")).toEqual(updated.displayName);
  //   }

  //   testSectionPack();
  // });
});
