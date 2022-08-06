import request from "supertest";
import { createNewSession } from "supertokens-node/recipe/session";
import { constants } from "../../client/src/App/Constants";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { isLoginData } from "../../client/src/App/sharedWithServer/apiQueriesShared/login";
import {
  guestAccessNames,
  GuestAccessSectionPackArrs,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { PackBuilderSection } from "../../client/src/App/sharedWithServer/StatePackers.ts/PackBuilderSection";
import { runApp } from "../../runApp";
import { LoadedDbUser } from "./shared/DbSections/LoadedDbUser";
import {
  createTestDbUserAndLoad,
  deleteDbUser,
  getStandardRes,
} from "./test/testDbUser";

const testedRoute = apiQueriesShared.getUserData.pathRoute;
function makeGetUserDataReqObj(): QueryReq<"getUserData"> {
  const next = PackBuilderSection.initAsOmniChild("feStore");
  const guestAccessSections = next.maker.makeChildTypePackArrs(
    guestAccessNames
  ) as GuestAccessSectionPackArrs;
  return { body: { guestAccessSections } };
}

describe(testedRoute, () => {
  let server: ReturnType<typeof runApp>;
  let dbUser: LoadedDbUser;
  let reqObj: QueryReq<"getUserData">;
  let accessToken: string;

  beforeEach(async () => {
    server = runApp();
    dbUser = await createTestDbUserAndLoad(testedRoute);
    reqObj = makeGetUserDataReqObj();
    const session = await createNewSession({}, dbUser.authId);
    accessToken = session.getAccessToken();
  });

  const exec = async () => {
    const res = await request(server)
      .post(testedRoute)
      // .set("Cookie", [`sAccessToken=${accessToken}`])
      .send(reqObj.body);
    return getStandardRes(res);
  };

  afterEach(async () => {
    deleteDbUser(dbUser);
    server.close();
  });

  it("should return status 200 and userData", async () => {
    const { status, data, headers } = await exec();
    expect(status).toBe(200);
    expect(headers[constants.tokenKey.apiUserAuth]).not.toBeUndefined();
    isLoginData(data);
  });
  // it("should add guestAccessSections if they have not yet been added", () => {});
  // it("should not add guestAccessSections if they have already been added", () => {});
});
