import { Server } from "http";
import request from "supertest";
import { userTokenS } from "../../client/src/App/modules/services/userTokenS";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { validateSubscriptionValues } from "../../client/src/App/sharedWithServer/apiQueriesShared/AnalyzerPlanValues";
import { LoadedDbUser } from "../../database/LoadedDbUser";
import { runApp } from "../../runApp";
import {
  createAndGetDbUser,
  deleteUserTotally,
  getStandardRes,
  makeSessionGetCookies,
} from "./apiQueriesTestTools/testUser";

const testedRoute = apiQueriesShared.getSubscriptionData.pathRoute;
describe(testedRoute, () => {
  let server: Server;
  let dbUser: LoadedDbUser;
  let cookies: string[];

  beforeEach(async () => {
    server = runApp();
    dbUser = await createAndGetDbUser(testedRoute);
    cookies = await makeSessionGetCookies({ server, authId: dbUser.authId });
  });

  afterEach(async () => {
    await deleteUserTotally(dbUser);
    server.close();
  });

  const exec = async () => {
    const res = await request(server)
      .post(testedRoute)
      .set("Cookie", cookies)
      .send({});
    return getStandardRes(res);
  };

  it("should return status 200, subscriptionValues as data, and userInfo header", async () => {
    const { data, headers, status } = await exec();
    expect(status).toBe(200);
    expect(() => validateSubscriptionValues(data)).not.toThrow();
    expect(() => userTokenS.validateHasUserTokenProp(headers)).not.toThrow();
  });
});
