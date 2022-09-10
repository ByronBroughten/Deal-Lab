import { Server } from "http";
import request from "supertest";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { isUserInfoHeaders } from "../../client/src/App/sharedWithServer/apiQueriesShared/getUserData";
import { validateSubscriptionValues } from "../../client/src/App/sharedWithServer/apiQueriesShared/SubscriptionValues";
import { runApp } from "../../runApp";
import { LoadedDbUser } from "./apiQueriesShared/DbSections/LoadedDbUser";
import {
  createAndGetDbUser,
  deleteUserTotally,
  getStandardRes,
  makeSessionGetCookies,
} from "./apiQueriesTestTools/testDbUser";

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
    expect(isUserInfoHeaders(headers)).toBe(true);
  });
});
