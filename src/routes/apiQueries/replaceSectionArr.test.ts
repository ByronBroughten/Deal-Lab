import request from "supertest";
import { config } from "../../client/src/App/Constants";
import Analyzer from "../../client/src/App/sharedWithServer/Analyzer";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { NextReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { runApp } from "../../runApp";
import { UserModel } from "../UserModel";
import { loginUtils } from "./nextLogin/loginUtils";
import { createTestUserModelNext } from "./test/createTestUserModelNext";

const sectionName = "loanTable";
function makeReq(): NextReq<"replaceSectionArr"> {
  let next = Analyzer.initAnalyzer();
  next = next.addSectionAndSolve(sectionName, "main", {});
  return apiQueriesShared.replaceSectionArr.makeReq({
    analyzer: next,
    sectionName: sectionName,
    dbStoreName: sectionName,
  });
}

const testedApiRoute = apiQueriesShared.replaceSectionArr.pathRoute;
describe(testedApiRoute, () => {
  let req: NextReq<"replaceSectionArr">;
  let server: any;
  let userId: string;
  let token: string;

  beforeEach(async () => {
    server = runApp();
    userId = await createTestUserModelNext(testedApiRoute);
    token = loginUtils.makeUserAuthToken(userId);
    req = makeReq();
  });

  afterEach(async () => {
    await UserModel.deleteOne({ _id: userId });
    server.close();
  });

  const exec = async () =>
    await request(server)
      .post(testedApiRoute)
      .set(config.tokenKey.apiUserAuth, token)
      .send(req.body);

  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
  }

  it("should return 200 if everything is ok", async () => {
    await testStatus(200);
  });
  it("should return 401 if client is not logged in", async () => {
    token = "" as any;
    await testStatus(401);
  });
});
