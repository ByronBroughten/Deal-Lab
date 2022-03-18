import { config } from "../../../client/src/App/Constants";
import Analyzer from "../../../client/src/App/sharedWithServer/Analyzer";
import {
  authTokenKey,
  Req,
} from "../../../client/src/App/sharedWithServer/User/crudTypes";
import { runApp } from "../../../runApp";
import { serverSideLogin } from "../userRoutes/shared/doLogin";
import request from "supertest";
import { serverSideUser, UserModel } from "../shared/severSideUser";

describe("post sectionArr", () => {
  const sectionName = "propertyDefault";
  let analyzer: Analyzer;
  let req: Req<"PostSectionArr">;
  let server: any;
  let token: string;

  beforeEach(async () => {
    analyzer = Analyzer.initAnalyzer();
    analyzer = analyzer.updateSectionValuesAndSolve("register", {
      email: "testosis@gmail.com",
      password: "testpassword",
      userName: "Testosis",
    });
    req = analyzer.req.postSectionArr(sectionName);
    server = runApp();
    const registerReq = analyzer.req.register();
    const userDoc = await serverSideUser.full(registerReq.body.payload);
    await userDoc.save();
    const userId = userDoc._id.toHexString();
    token = serverSideLogin.makeUserAuthToken(userId);
  });

  const exec = () =>
    request(server)
      .post(config.url.sectionArr.route)
      .set(authTokenKey, token)
      .send(req.body);

  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
  }

  afterEach(async () => {
    await UserModel.deleteMany();
  });

  it("should return 200 if everything is ok", async () => {
    testStatus(200);
  });
  it("should return 401 if the user isn't authorized", async () => {
    token = null as any;
    testStatus(401);
  });
});
