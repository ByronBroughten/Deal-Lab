import { Server } from "http";
import request from "supertest";
import { config } from "../../client/src/App/Constants";
import Analyzer from "../../client/src/App/sharedWithServer/Analyzer";
import { NumObj } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSections/baseSections/baseValues/NumObj";
import { Id } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSections/baseSections/id";
import {
  apiEndpoints,
  NextReq,
} from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { runApp } from "../../runApp";
import { UserModelNext } from "../shared/UserModelNext";
import { loginUtils } from "./nextLogin/loginUtils";
import { getUserByIdNoRes } from "./shared/getUserById";
import { createTestUserModelNext } from "./test/createTestUserModelNext";

const sectionName = "property";
const originalValues = {
  title: "Original title",
  price: NumObj.init(100000),
} as const;

const updatedValues = {
  title: "Updated title",
  price: NumObj.init(500000),
} as const;

type TestReqs = {
  addSection: NextReq<"addSection">;
  updateSection: NextReq<"updateSection">;
};
function makeReqs(): TestReqs {
  let next = Analyzer.initAnalyzer();
  const { feInfo } = next.lastSection(sectionName);
  next = next.updateSectionValuesAndSolve(feInfo, originalValues);
  const addSectionReq = next.req.addIndexStoreSection(feInfo);
  next = next.updateSectionValuesAndSolve(feInfo, updatedValues);
  return {
    addSection: addSectionReq,
    updateSection: next.req.addIndexStoreSection(feInfo),
  };
}

const testedApiRoute = apiEndpoints.addSection.pathRoute;
describe(testedApiRoute, () => {
  let reqs: TestReqs;
  let server: Server;
  let userId: string;
  let token: string;

  beforeEach(async () => {
    reqs = makeReqs();
    server = runApp();
    userId = await createTestUserModelNext(testedApiRoute);
    token = loginUtils.makeUserAuthToken(userId);
  });

  afterEach(async () => {
    await UserModelNext.deleteOne({ _id: userId });
    server.close();
  });

  const exec = async () => {
    await request(server)
      .post(apiEndpoints.addSection.pathRoute)
      .set(config.tokenKey.apiUserAuth, token)
      .send(reqs.addSection.body);

    return await request(server)
      .post(apiEndpoints.updateSection.pathRoute)
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
    const updatedDoc = postDoc.propertyIndex.find(
      ({ dbId }) => dbId === reqs.updateSection.body.payload.dbId
    );
    const updatedSection = updatedDoc?.rawSections.propertyIndex.find(
      ({ dbId }) => dbId === reqs.updateSection.body.payload.dbId
    );
    expect(updatedSection?.dbVarbs.title).toBe(updatedValues.title);
    expect(updatedSection?.dbVarbs.price).toEqual(updatedValues.price.dbNumObj);
  });
  it("should return 404 if there is not an entry in the db with the payload's dbId", async () => {
    reqs.updateSection.body.payload.dbId = Id.make();
    await testStatus(404);
  });
  it("should return 401 if client is not logged in", async () => {
    token = null as any;
    await testStatus(401);
  });
  it("should return 500 if payload is not an object", async () => {
    reqs.updateSection.body.payload = null as any;
    await testStatus(500);
  });
});
