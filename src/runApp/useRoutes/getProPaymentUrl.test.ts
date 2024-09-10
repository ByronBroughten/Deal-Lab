import { Server } from "http";
import request from "supertest";
import {
  QueryReq,
  QueryRes,
} from "../../client/src/sharedWithServer/ApiQueries";
import { constant } from "../../client/src/sharedWithServer/Constants";
import { DbUserGetter } from "../../DbUserService/DbUserGetter";
import { runApp } from "../../runApp";
import {
  createAndGetDbUser,
  deleteUserTotally,
  getStandardRes,
  makeSessionGetCookies,
} from "./apiQueriesTestTools/testUser";

const testedRoute = constant("pathRoutes").getProPaymentUrl;
describe(testedRoute, () => {
  let server: Server;
  let dbUser: DbUserGetter;
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
      .set(constant("tokenKey").userAuthData, dbUser.createUserJwt())
      .set("Cookie", cookies)
      .send(req.body);
    return getStandardRes(res);
  }
  it("should return status 200 and a url", async () => {
    const res = await exec();
    if (constant("isBeta")) {
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
  const priceId = constant("stripePrices")[0].priceId;
  return {
    body: { priceId },
  };
}
