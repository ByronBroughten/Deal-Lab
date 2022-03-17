import { config } from "../../client/src/App/Constants";
import Analyzer from "../../client/src/App/sharedWithServer/Analyzer";
import {
  authTokenKey,
  Req,
} from "../../client/src/App/sharedWithServer/User/crudTypes";
import { runApp } from "../../runApp";
import { serverSideLogin } from "./userRoutes/shared/doLogin";
import request from "supertest";
import { serverSideUser, UserModel } from "./shared/severSideUser";

describe("post sectionArr", () => {
  const sectionName = "propertyDefault";
  let analyzer: Analyzer;
  let req: Req<"PostSectionArr">;
  let server: any;
  let token: string;

  let userId: string;

  beforeEach(async () => {
    analyzer = Analyzer.initAnalyzer();
    req = analyzer.req.postSectionArr(sectionName);
    token = serverSideLogin.dummyUserAuthToken();
    server = runApp();
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
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
