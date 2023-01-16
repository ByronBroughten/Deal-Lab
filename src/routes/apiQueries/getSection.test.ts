import { Server } from "http";
import request from "supertest";
import { constants } from "../../client/src/App/Constants";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { SectionPackRes } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { AutoSyncControl } from "../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsDerived/subValues";
import { numObj } from "../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsVarbs/baseValues/NumObj";
import { stringObj } from "../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsVarbs/baseValues/StringObj";
import { Id } from "../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsVarbs/id";
import { PackBuilderSection } from "../../client/src/App/sharedWithServer/StatePackers.ts/PackBuilderSection";
import { runApp } from "../../runApp";
import { SetterTesterSection } from "./../../client/src/App/sharedWithServer/StateSetters/TestUtils/SetterTesterSection";
import { LoadedDbUser } from "./apiQueriesShared/DbSections/LoadedDbUser";
import { SectionQueryTester } from "./apiQueriesTestTools/SectionQueryTester";
import {
  createAndGetDbUser,
  deleteUserTotally,
  getStandardRes,
  makeSessionGetCookies,
  validateStatus200Res,
} from "./apiQueriesTestTools/testDbUser";

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

const testedRoute = apiQueriesShared.getSection.pathRoute;
describe(testedRoute, () => {
  let reqs: TestReqs;
  let server: Server;
  let dbUser: LoadedDbUser;
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
      .post(apiQueriesShared.addSection.pathRoute)
      .set(constants.tokenKey.userAuthData, dbUser.createUserInfoToken())
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
    reqs.getSection.body.dbId = Id.make().substring(1);
    await testStatus(500);
  });
  it("should return 404 if no section in the queried sectionArr has the dbId", async () => {
    reqs.getSection.body.dbId = Id.make();
    await testStatus(404);
  });
  it("should load saved subsections if sync is turned on", async () => {
    const original = {
      price: numObj(100000),
      displayName: stringObj("Original"),
    };

    const deal = SetterTesterSection.init("deal").setter;
    const property = deal.onlyChild("property");
    property.varb("price").updateValue(original.price);
    property.varb("displayName").updateValue(original.displayName);
    property.updateValues({
      autoSyncControl: "autoSyncOn" as AutoSyncControl,
    });

    reqs.addSection.body = {
      dbStoreName: "dealMain",
      sectionPack: deal.packMaker.makeSectionPack(),
    } as any;
    await addSection();

    const updated = {
      price: numObj(200000),
      displayName: stringObj("Updated"),
    };
    property.varb("price").updateValue(updated.price);
    property.varb("displayName").updateValue(updated.displayName);
    reqs.addSection.body = {
      dbStoreName: "propertyMain",
      sectionPack: property.packMaker.makeSectionPack(),
    } as any;
    await addSection();

    reqs.getSection.body = {
      dbStoreName: "dealMain",
      dbId: deal.get.dbId,
    };

    const res = await getSection();
    const { sectionPack } = res.data as SectionPackRes<"dealMain">["data"];

    function testSectionPack() {
      const deal = SetterTesterSection.init("deal").setter;
      deal.loadSelfSectionPack(sectionPack);
      const property = deal.get.onlyChild("property");
      expect(property.value("price")).toEqual(updated.price);
      expect(property.value("displayName")).toEqual(updated.displayName);
    }

    testSectionPack();
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
});
