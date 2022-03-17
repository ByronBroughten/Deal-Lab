// I can have most of the crud logic in one place
// I like having reqs on Analyzer

import { config } from "../../client/src/App/Constants";
import Analyzer from "../../client/src/App/sharedWithServer/Analyzer";
import { SectionName } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";
import { Req } from "../../client/src/App/sharedWithServer/User/crudTypes";
import { runApp } from "../../runApp";
import { serverSideLogin } from "./userRoutes/shared/doLogin";

// What about the stuff to create the user?
// What about the stuff to
describe("dbEntry/post/all", () => {
  const sectionName = "property";
  let analyzer: Analyzer;
  let req: Req<"PostEntry">;
  let server: any;
  let token: string;
  let indexStoreName: SectionName<"savable">;
  let userId: string;

  beforeEach(async () => {
    analyzer = Analyzer.initAnalyzer();

    ({ indexStoreName } = analyzer.sectionMeta(sectionName));

    const { feInfo } = analyzer.lastSection(sectionName);
    req = analyzer.req.postIndexEntry(feInfo);
    token = serverSideLogin.dummyUserAuthToken();
    server = runApp();
  });

  // const exec = () =>
  //   request(server)
  //     .post(config.url.sectionArr.)
  //     .set(authTokenKey, token)
  //     .send(req.body);
  async function testStatus(statusNumber: number) {
    // const res = await exec();
    // expect(res.status).toBe(statusNumber);
  }
});
