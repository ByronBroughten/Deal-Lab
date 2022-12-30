import request from "supertest";
import { constants } from "../../client/src/App/Constants";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import {
  guestAccessNames,
  GuestAccessSectionPackArrs,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import {
  UserData,
  validateUserData,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/validateUserData";
import { PackBuilderSection } from "../../client/src/App/sharedWithServer/StatePackers.ts/PackBuilderSection";
import { runApp } from "../../runApp";
import { LoadedDbUser } from "./apiQueriesShared/DbSections/LoadedDbUser";
import {
  createAndGetDbUser,
  deleteUserTotally,
  getStandardRes,
  makeSessionGetCookies,
} from "./apiQueriesTestTools/testDbUser";

const testedRoute = apiQueriesShared.getUserData.pathRoute;
describe(testedRoute, () => {
  let server: ReturnType<typeof runApp>;
  let dbUser: LoadedDbUser;
  let reqObj: QueryReq<"getUserData">;
  let cookies: string[];

  beforeEach(async () => {
    server = runApp();
    dbUser = await createAndGetDbUser(testedRoute);
    cookies = await makeSessionGetCookies({ server, authId: dbUser.authId });
    reqObj = makeReqObj();
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
  it("should add guestAccessSections if they have not yet been added", async () => {
    const feUser = PackBuilderSection.initAsOmniChild("feUser");
    feUser.addChild("outputListMain");
    feUser.addChild("outputListMain");
    feUser.addChild("userVarbListMain");
    reqObj = makeReqObj(feUser);
    const { data } = await exec();

    const postFeUser = PackBuilderSection.initAsOmniChild("feUser");
    postFeUser.loadSelf(data.feUser);
    const postReqObj = makeReqObj(postFeUser);
    expect(reqObj.body.guestAccessSections).toEqual(
      postReqObj.body.guestAccessSections
    );
  });
  it("should not add guestAccessSections if they have already been added", async () => {
    const feUser = PackBuilderSection.initAsOmniChild("feUser");
    feUser.addChild("outputListMain");
    feUser.addChild("outputListMain");
    feUser.addChild("userVarbListMain");

    reqObj = makeReqObj(feUser);
    await exec();

    const childName = "singleTimeListMain";
    const { dbId } = feUser.addAndGetChild(childName).get;
    reqObj = makeReqObj(feUser);

    const res2 = await exec();
    const data: UserData = res2.data;
    const feUser2 = PackBuilderSection.loadAsOmniChild(data.feUser);
    const hasList = feUser2.get.hasChildByDbInfo({ childName, dbId });
    expect(hasList).toBe(false);
  });
});

function makeReqObj(
  feUser = PackBuilderSection.initAsOmniChild("feUser")
): QueryReq<"getUserData"> {
  const guestAccessSections = feUser.maker.makeChildPackArrs(
    guestAccessNames
  ) as GuestAccessSectionPackArrs;
  return {
    body: {
      guestAccessSections,
    },
  };
}
