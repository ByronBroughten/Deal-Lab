import request from "supertest";
import { config } from "../../client/src/App/Constants";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { SectionPackArrReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { SectionArrReqMaker } from "../../client/src/App/sharedWithServer/ReqMakers/SectionArrReqMaker";
import { runApp } from "../../runApp";
import { UserModel } from "../UserModel";
import { DbUser } from "./shared/DbSections/DbUser";
import { createTestUserModelNext } from "./test/createTestUserModelNext";

const sectionName = "deal";
function makeReq(): SectionPackArrReq<typeof sectionName> {
  const reqMaker = SectionArrReqMaker.init(sectionName);
  return reqMaker.makeReq();
}

const testedApiRoute = apiQueriesShared.replaceSectionArr.pathRoute;
describe(testedApiRoute, () => {
  let req: SectionPackArrReq<typeof sectionName>;
  let server: any;
  let userId: string;
  let token: string;

  beforeEach(async () => {
    server = runApp();
    userId = await createTestUserModelNext(testedApiRoute);
    token = DbUser.makeUserAuthToken(userId);
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
