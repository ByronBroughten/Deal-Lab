import request from "supertest";
import { config } from "../../client/src/App/Constants";
import Analyzer from "../../client/src/App/sharedWithServer/Analyzer";
import { NumObj } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSections/baseSections/baseValues/NumObj";
import { makeApiReq } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import {
  apiEndpoints,
  NextReq,
} from "../../client/src/App/sharedWithServer/apiQueriesSharedTypes";
import { runApp } from "../../runApp";
import { UserModelNext } from "../shared/UserModelNext";
import { loginUtils } from "./nextLogin/loginUtils";
import { createTestUserModelNext } from "./test/createTestUserModelNext";

const sectionName = "loan";
const loanValues = {
  title: "Test Loan",
  loanAmountDollarsTotal: NumObj.init(153265),
} as const;

function makeReq(): NextReq<"replaceSectionArr"> {
  let next = Analyzer.initAnalyzer();
  next = next.addSectionAndSolve(sectionName, "financing", {
    values: loanValues,
  });
  next = next.addSectionAndSolve(sectionName, "financing", {
    values: loanValues,
  });
  return makeApiReq.replaceSectionArr({
    analyzer: next,
    sectionName: sectionName,
    dbStoreName: sectionName,
  });
}

const testedApiRoute = apiEndpoints.replaceSectionArr.pathRoute;
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
    await UserModelNext.deleteOne({ _id: userId });
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
    token = null as any;
    await testStatus(401);
  });
});
