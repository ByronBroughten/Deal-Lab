import { config } from "../../../client/src/App/Constants";
import Analyzer from "../../../client/src/App/sharedWithServer/Analyzer";
import {
  Req,
  Res,
} from "../../../client/src/App/sharedWithServer/User/crudTypes";
import { urlPlusParams } from "../../../client/src/App/utils/url";
import { sectionRoutes } from "../sectionRoutes";
import request from "supertest";
import { runApp } from "../../../runApp";
import { serverSideLogin } from "../userRoutes/shared/doLogin";
import { serverSideUser, UserModel } from "../shared/severSideUser";
import { DbStoreName } from "../../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSections/baseSectionTypes";

describe("section delete", () => {
  const sectionName = "property";
  let analyzer: Analyzer;
  let req: Req<"DeleteSection">;
  let server: ReturnType<typeof runApp>;
  let token: string;
  let userId: string;
  let indexStoreName: DbStoreName;
  let initialLength: number;

  const exec = async () => {
    const route = urlPlusParams(
      sectionRoutes.route,
      req.params,
      config.crud.routes.section.delete.paramArr
    );
    const res = await request(server)
      .delete(route)
      .set(config.tokenKey.apiUserAuth, token)
      .send();
    return res;
  };

  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
    return res;
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
    const { feInfo, indexStoreName: idxName } =
      analyzer.lastSection(sectionName);
    indexStoreName = idxName;

    const dbEntry = analyzer.dbEntry(feInfo, {
      newMainSectionName: indexStoreName,
    });
    userDoc[indexStoreName].push(dbEntry);
    initialLength = userDoc[indexStoreName].length;
    await userDoc.save();

    // ready the token and req
    userId = userDoc._id.toHexString();
    token = serverSideLogin.makeUserAuthToken(userId);
    req = analyzer.req.deleteSection(indexStoreName, dbEntry.dbId);
  });

  afterEach(async () => {
    await UserModel.deleteMany();
  });
  it("should produce status 200, dbId body, and delete a subDoc if everything is ok", async () => {
    const res = await testStatus(200);
    const resData: Res<"DeleteSection">["data"] = req.params.dbId;
    expect(res.text).toBe(resData);

    const userDoc = await UserModel.findById(userId);
    expect(userDoc && userDoc[indexStoreName].length).toBe(initialLength - 1);
  });
  it("should return 500 if the dbId isn't a dbId", async () => {
    req.params.dbId = "notValid";
    await testStatus(500);
  });
  it("should return 404 if no section in the queried sectionArr has the dbId", async () => {
    req.params.dbId = Analyzer.makeId();
    await testStatus(404);
  });
});
