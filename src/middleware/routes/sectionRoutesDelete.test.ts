import { config } from "../../client/src/App/Constants";
import Analyzer from "../../client/src/App/sharedWithServer/Analyzer";
import {
  authTokenKey,
  Req,
} from "../../client/src/App/sharedWithServer/User/crudTypes";
import { urlPlusParams } from "../../client/src/App/utils/url";
import { sectionRoutes } from "./sectionRoutes";
import request from "supertest";
import { runApp } from "../../runApp";
import { serverSideLogin } from "./userRoutes/shared/doLogin";
import { serverSideUser, UserModel } from "./shared/severSideUser";

describe("section delete", () => {
  const sectionName = "property";
  let analyzer: Analyzer;
  let req: Req<"GetSection">;
  let server: any;
  let token: string;

  const exec = () => {
    const route = urlPlusParams(
      sectionRoutes.route,
      req.params,
      config.url.section.params.get
    );
    return request(server).get(route).set(authTokenKey, token).send();
  };

  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
  }

  beforeEach(async () => {
    analyzer = Analyzer.initAnalyzer();
    analyzer = analyzer.updateSectionValuesAndSolve("register", {
      email: "testosis@gmail.com",
      password: "testpassword",
      userName: "Testosis",
    });

    // make a userDoc
    server = runApp();
    const registerReq = analyzer.req.register();
    const userDoc = await serverSideUser.full(registerReq.body.payload);

    // save a propertyIndex section
    const { feInfo, indexStoreName } = analyzer.lastSection(sectionName);
    const dbEntry = analyzer.dbEntry(feInfo, {
      newMainSectionName: indexStoreName,
    });
    userDoc.propertyIndex.push(dbEntry);
    await userDoc.save();

    // ready the token and req
    token = serverSideLogin.makeUserAuthToken(userDoc._id.toHexString());
    req = analyzer.req.deleteSection(indexStoreName, dbEntry.dbId);
  });

  afterEach(async () => {
    await UserModel.deleteMany();
  });

  it("should return 200 if everything is ok", () => {
    testStatus(200);
  });
});
