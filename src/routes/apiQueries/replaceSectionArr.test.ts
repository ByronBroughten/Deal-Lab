import request from "supertest";
import { config } from "../../client/src/App/Constants";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { SectionPackArrReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { SectionArrReqMaker } from "../../client/src/App/sharedWithServer/ReqMakers/SectionArrReqMaker";
import { runApp } from "../../runApp";
import { DbSectionsModel } from "../DbSectionsModel";
import { createTestUserModel } from "./test/createTestUserModel";

const sectionName = "user";
function makeReq(): SectionPackArrReq<typeof sectionName> {
  const reqMaker = SectionArrReqMaker.init(sectionName);
  return reqMaker.makeReq();
}

const testedRoute = apiQueriesShared.replaceSectionArr.pathRoute;
describe(testedRoute, () => {
  let req: SectionPackArrReq<typeof sectionName>;
  let server: any;
  let userId: string;
  let token: string;

  beforeEach(async () => {
    server = runApp();
    const dbUser = await createTestUserModel(testedRoute);
    token = dbUser.createUserAuthToken();
    req = makeReq();
    userId = dbUser.userId;
  });

  afterEach(async () => {
    await DbSectionsModel.deleteOne({ _id: userId });
    server.close();
  });

  const exec = async () =>
    await request(server)
      .post(testedRoute)
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
