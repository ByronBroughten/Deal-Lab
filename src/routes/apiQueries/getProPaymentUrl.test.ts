import { Server } from "http";
import request from "supertest";
import { constants } from "../../client/src/App/Constants";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import {
  QueryReq,
  QueryRes,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { runApp } from "../../runApp";
import { LoadedDbUser } from "./apiQueriesShared/DbSections/LoadedDbUser";
import {
  createAndGetDbUser,
  deleteUserTotally,
  getStandardRes,
  makeSessionGetCookies,
} from "./apiQueriesTestTools/testDbUser";

const testedRoute = apiQueriesShared.getProPaymentUrl.pathRoute;
describe(testedRoute, () => {
  let server: Server;
  let dbUser: LoadedDbUser;
  let cookies: string[];
  let req: QueryReq<"getProPaymentUrl">;

  beforeEach(async () => {
    server = runApp();
    dbUser = await createAndGetDbUser(testedRoute);
    cookies = await makeSessionGetCookies({ server, authId: dbUser.authId });
    req = makeReq();
  });

  afterEach(async () => {
    await deleteUserTotally(dbUser);
    server.close();
  });

  async function exec() {
    const res = await request(server)
      .post(testedRoute)
      .set(constants.tokenKey.apiUserAuth, dbUser.createUserInfoToken())
      .set("Cookie", cookies)
      .send(req.body);
    return getStandardRes(res);
  }
  it("should return status 200 and a url", async () => {
    const res = await exec();
    if (constants.isBeta) {
      expect(res.status).toBe(400);
    } else {
      expect(res.status).toBe(200);
      const { sessionUrl } = res.data as QueryRes<"getProPaymentUrl">["data"];
      expect(typeof sessionUrl === "string").toBeTruthy();
    }
  });
  it("should return 401 if client is not logged in", async () => {
    cookies = [];
    const res = await exec();
    expect(res.status).toBe(401);
  });
});

function makeReq(): QueryReq<"getProPaymentUrl"> {
  const priceId = constants.stripePrices[0].priceId;
  return {
    body: { priceId },
  };
}
