import request from "supertest";
import { QueryReq } from "../../client/src/sharedWithServer/ApiQueries";
import { makeReq } from "../../client/src/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { validateUserData } from "../../client/src/sharedWithServer/apiQueriesShared/UserData";
import {
  constant,
  constants,
} from "../../client/src/sharedWithServer/Constants";
import { DbUserGetter } from "../../DbUserService/DbUserGetter";
import { runApp } from "../../runApp";
import {
  createAndGetDbUser,
  deleteUserTotally,
  getStandardRes,
  makeSessionGetCookies,
} from "./apiQueriesTestTools/testUser";

const testedRoute = constant("pathRoutes").getUserData;
describe(testedRoute, () => {
  let server: ReturnType<typeof runApp>;
  let dbUser: DbUserGetter;
  let reqObj: QueryReq<"getUserData">;
  let cookies: string[];

  beforeEach(async () => {
    server = runApp();
    dbUser = await createAndGetDbUser(testedRoute);
    cookies = await makeSessionGetCookies({ server, authId: dbUser.authId });
    reqObj = makeReq();
  });

  async function exec() {
    const res = await request(server)
      .post(testedRoute)
      .set("Cookie", cookies)
      .send(reqObj.body);
    return getStandardRes(res);
  }

  afterEach(async () => {
    await deleteUserTotally(dbUser);
    server.close();
  });

  it("should return status 200 and loginData", async () => {
    const { status, data, headers } = await exec();
    expect(status).toBe(200);
    expect(headers[constants.tokenKey.userAuthData]).not.toBeUndefined();
    expect(() => validateUserData(data)).not.toThrow();
  });
  it("should return a header with the correct subscription info", async () => {
    // here, how would I insert the right subscription into the db?
    // I can use the webhook route and borrow code from there.
    //
  });
});
