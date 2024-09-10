import { Server } from "http";
import request from "supertest";
import { userTokenS } from "../../client/src/modules/services/userTokenS";
import { validateSubscriptionValues } from "../../client/src/sharedWithServer/apiQueriesShared/EstimatorPlanValues";
import { constant } from "../../client/src/sharedWithServer/Constants";
import { DbUserGetter } from "../../DbUserService/DbUserGetter";
import { runApp } from "../../runApp";
import {
  createAndGetDbUser,
  deleteUserTotally,
  getStandardRes,
  makeSessionGetCookies,
} from "./apiQueriesTestTools/testUser";

const testedRoute = constant("pathRoutes").getSubscriptionData;
describe(testedRoute, () => {
  let server: Server;
  let dbUser: DbUserGetter;
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
