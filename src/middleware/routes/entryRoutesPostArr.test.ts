import { config } from "../../client/src/App/Constants";
import Analyzer from "../../client/src/App/sharedWithServer/Analyzer";
import { SectionName } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";
import {
  authTokenKey,
  Req,
} from "../../client/src/App/sharedWithServer/User/crudTypes";
import { runApp } from "../../runApp";
import { serverSideLogin } from "./userRoutes/shared/doLogin";
import request from "supertest";

describe("post sectionArr", () => {
  const sectionName = "propertyDefault";
  let analyzer: Analyzer;
  let req: Req<"PostSectionArr">;
  let server: any;
  let token: string;

  let userId: string;

  beforeEach(async () => {
    analyzer = Analyzer.initAnalyzer();
    req = analyzer.req.postEntryArr(sectionName);
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

  it("should return 200 if everything is ok", async () => {
    await exec();
  });
});
