import { Server } from "http";
import request from "supertest";
import { config } from "../../client/src/App/Constants";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { numObj } from "../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsUtils/baseValues/NumObj";
import { Id } from "../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsUtils/id";
import { runApp } from "../../runApp";
import { DbSectionsModel } from "../DbSectionsModel";
import { getUserByIdNoRes } from "./shared/getUserDbSectionsById";
import { createTestUserModel } from "./test/createTestUserModel";
import { SectionQueryTester } from "./test/SectionQueryTester";

const sectionName = "property";
const originalValues = {
  displayName: "Original displayName",
  price: numObj(100000),
} as const;

const updatedValues = {
  displayName: "Updated displayName",
  price: numObj(500000),
} as const;

type TestReqs = {
  addSection: QueryReq<"addSection">;
  updateSection: QueryReq<"updateSection">;
};
function makeReqs(): TestReqs {
  const tester = SectionQueryTester.init({ sectionName });
  const { updater } = tester;
  updater.updateValuesDirectly(originalValues);
  const originalSection = tester.makeSectionPackReq();

  updater.updateValuesDirectly(updatedValues);
  const updatedSection = tester.makeSectionPackReq();
  return {
    addSection: originalSection,
    updateSection: updatedSection,
  } as TestReqs;
}

const testedRoute = apiQueriesShared.updateSection.pathRoute;
describe(testedRoute, () => {
  let reqs: TestReqs;
  let server: Server;
  let userId: string;
  let token: string;

  beforeEach(async () => {
    reqs = makeReqs();
    server = runApp();
    const dbUser = await createTestUserModel(testedRoute);
    token = dbUser.createUserAuthToken();
    userId = dbUser.userId;
  });

  afterEach(async () => {
    await DbSectionsModel.deleteOne({ _id: userId });
    server.close();
  });

  const exec = async () => {
    await request(server)
      .post(apiQueriesShared.addSection.pathRoute)
      .set(config.tokenKey.apiUserAuth, token)
      .send(reqs.addSection.body);

    return await request(server)
      .post(testedRoute)
      .set(config.tokenKey.apiUserAuth, token)
      .send(reqs.updateSection.body);
  };

  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
  }
  it("should return 200 and update a section if happy path", async () => {
    await testStatus(200);
    const postDoc = await getUserByIdNoRes(userId);
    const updatedDoc = postDoc.propertyMain.find(
      ({ dbId }) => dbId === reqs.updateSection.body.sectionPack.dbId
    );
    const updatedSection = updatedDoc?.rawSections.property.find(
      ({ dbId }) => dbId === reqs.updateSection.body.sectionPack.dbId
    );

    expect(updatedSection?.dbVarbs.displayName).toBe(updatedValues.displayName);
    expect(updatedSection?.dbVarbs.price).toEqual(updatedValues.price);
  });
  it("should return 404 if there is not an entry in the db with the sectionPack's dbId", async () => {
    reqs.updateSection.body.sectionPack.dbId = Id.make();
    await testStatus(404);
  });
  it("should return 401 if client is not logged in", async () => {
    token = "" as any;
    await testStatus(401);
  });
  it("should return 500 if sectionPack is not an object", async () => {
    reqs.updateSection.body.sectionPack = null as any;
    await testStatus(500);
  });
});
