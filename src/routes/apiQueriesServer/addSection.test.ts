import { Server } from "http";
import request from "supertest";
import { config } from "../../client/src/App/Constants";
import Analyzer from "../../client/src/App/sharedWithServer/Analyzer";
import {
  apiEndpoints,
  NextReq,
} from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { runApp } from "../../runApp";
import { UserModelNext } from "../shared/UserModelNext";
import { serverSideLogin } from "../userRoutes/shared/doLogin";
import { loginUtils } from "./nextLogin/loginUtils";
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
  let token: string;

  beforeEach(async () => {
    req = makeAddSectionReq();
    server = runApp();
    token = loginUtils.dummyUserAuthToken();
  });

  afterEach(async () => {
    await UserModelNext.deleteMany();
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
  }

  it("should return 401 if client is not logged in", async () => {
    token = null as any;
    await testStatus(401);
  });
  it("should return 500 if payload is not an object", async () => {
    req.body.payload = null as any;
    await testStatus(500);
  });
  it("should return 200 if everything is ok", async () => {
    const userId = await createTestUserModelNext(apiRoute);
    token = serverSideLogin.makeUserAuthToken(userId);
    await testStatus(200);
  });
  it("should return 500 if there is already an entry in the db with the payload's dbId", async () => {
    const userId = await createTestUserModelNext(apiRoute);
    token = serverSideLogin.makeUserAuthToken(userId);
    await exec();
    await testStatus(500);
  });
});
