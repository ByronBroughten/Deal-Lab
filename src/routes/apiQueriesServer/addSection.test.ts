import { Server } from "http";
import request from "supertest";
import { config } from "../../client/src/App/Constants";
import Analyzer from "../../client/src/App/sharedWithServer/Analyzer";
import {
  apiEndpoints,
  NextReq,
} from "../../client/src/App/sharedWithServer/apiQueriesShared";
import Arr from "../../client/src/App/sharedWithServer/utils/Arr";
import { runApp } from "../../runApp";
import { UserModelNext } from "../shared/UserModelNext";
import { loginUtils } from "./nextLogin/loginUtils";
import { getUserByIdNoRes } from "./shared/getUserById";
import { createTestUserModelNext } from "./test/createTestUserModelNext";

const sectionName = "property";
function makeAddSectionReq(): NextReq<"addSection"> {
  const analyzer = Analyzer.initAnalyzer();
  const { feInfo } = analyzer.lastSection(sectionName);
  return analyzer.req.addIndexStoreSection(feInfo);
}

const apiRoute = apiEndpoints.addSection.pathRoute;
describe(apiRoute, () => {
  let req: NextReq<"addSection">;
  let server: Server;
  let userId: string;
  let token: string;

  beforeEach(async () => {
    server = runApp();
    userId = await createTestUserModelNext(apiRoute);
    token = loginUtils.makeUserAuthToken(userId);
    req = makeAddSectionReq();
  });

  afterEach(async () => {
    await UserModelNext.deleteOne({ _id: userId });
    server.close();
  });

  const exec = async () =>
    await request(server)
      .post(apiRoute)
      .set(config.tokenKey.apiUserAuth, token)
      .send(req.body);

  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
    return res;
  }
  it("should return 200 and add the section if happy path", async () => {
    const preDoc = await getUserByIdNoRes(userId);
    await testStatus(200);
    const postDoc = await getUserByIdNoRes(userId);

    expect(postDoc.propertyIndex.length).toBe(preDoc.propertyIndex.length + 1);
    expect(Arr.lastVal(postDoc.propertyIndex).dbId).toBe(req.body.payload.dbId);
  });
  it("should return 401 if client is not logged in", async () => {
    token = null as any;
    await testStatus(401);
  });
  it("should return 500 if payload is not an object", async () => {
    req.body.payload = null as any;
    await testStatus(500);
  });
  it("should return 500 if there is already an entry in the db with the payload's dbId", async () => {
    await exec();
    await testStatus(500);
  });
});
