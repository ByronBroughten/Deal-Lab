import { serverSideLogin } from "../userRoutes/shared/doLogin";
import request from "supertest";
import { runApp } from "../../../runApp";
import { serverSideUser, UserModel } from "../shared/severSideUser";
import {
  authTokenKey,
  Req,
} from "../../../client/src/App/sharedWithServer/User/crudTypes";
import { config } from "../../../client/src/App/Constants";
import Analyzer from "../../../client/src/App/sharedWithServer/Analyzer";
import { queryOp } from "../utils/operator";
import { queryOptions } from "../shared/tryQueries";
import { SectionName } from "../../../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";

describe(`dbSection/post`, () => {
  const sectionName = "property";
  let analyzer: Analyzer;
  let req: Req<"PostEntry">;
  let server: any;
  let token: string;
  let userId: string;

  beforeEach(async () => {
    analyzer = Analyzer.initAnalyzer();

    const { feInfo } = analyzer.lastSection(sectionName);
    req = analyzer.req.postIndexEntry(feInfo);
    token = serverSideLogin.dummyUserAuthToken();
    server = runApp();
  });

  const exec = () =>
    request(server)
      .post(config.url.section.route)
      .set(authTokenKey, token)
      .send(req.body);
  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
  }

  afterEach(async () => {
    await UserModel.deleteMany();
    // await server.close();
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
    analyzer = analyzer.updateSectionValuesAndSolve("register", {
      email: "testosis@gmail.com",
      password: "testpassword",
      userName: "Testosis",
    });
    const registerReq = analyzer.req.register();
    const userDoc = await serverSideUser.full(registerReq.body.payload);
    await userDoc.save();
    userId = userDoc._id.toHexString();
    token = serverSideLogin.makeUserAuthToken(userId);
    const { indexStoreName } = analyzer.sectionMeta(sectionName);
    const pusher = queryOp.push.entry({ ...req.body.payload }, indexStoreName);
    await UserModel.findByIdAndUpdate(userId, pusher, queryOptions["post"]);
    await testStatus(500);
  });
  it("should return 200 if everything is ok", async () => {
    analyzer = analyzer.updateSectionValuesAndSolve("register", {
      email: "testosis@gmail.com",
      password: "testpassword",
      userName: "Testosis",
    });
    const registerReq = analyzer.req.register();
    const userDoc = await serverSideUser.full(registerReq.body.payload);
    await userDoc.save();
    userId = userDoc._id.toHexString();
    token = serverSideLogin.makeUserAuthToken(userId);
    await testStatus(200);
  });
});