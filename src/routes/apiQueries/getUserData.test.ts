import request from "supertest";
import { constants } from "../../client/src/App/Constants";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import {
  isLoginData,
  LoginData,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/getUserData";
import {
  guestAccessNames,
  GuestAccessSectionPackArrs,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { PackBuilderSection } from "../../client/src/App/sharedWithServer/StatePackers.ts/PackBuilderSection";
import { runApp } from "../../runApp";
import { LoadedDbUser } from "./shared/DbSections/LoadedDbUser";
import {
  createAndGetDbUser,
  deleteUserTotally,
  getStandardRes,
  makeSessionGetCookies,
} from "./test/testDbUser";

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
    reqObj = makeGetUserDataReqObj();
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
    expect(headers[constants.tokenKey.apiUserAuth]).not.toBeUndefined();
    isLoginData(data);
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

    const postFeStore = PackBuilderSection.initAsOmniChild("feUser");
    postFeStore.loadSelf((data as LoginData).feUser[0]);
    const postReqObj = makeReqObj(postFeStore);
    expect(reqObj).toEqual(postReqObj);
  });
  it("should not add guestAccessSections if they have already been added", async () => {
    const feUser = PackBuilderSection.initAsOmniChild("feUser");
    feUser.addChild("outputListMain");
    feUser.addChild("outputListMain");
    feUser.addChild("userVarbListMain");
    reqObj = makeReqObj(feUser);
    const res1 = await exec();

    feUser.addChild("singleTimeListMain");
    reqObj = makeReqObj(feUser);
    const res2 = await exec();

    expect(changedSection(res1.data)).toEqual(changedSection(res2.data));
  });
});

function changedSection(data: LoginData) {
  return data.feUser[0].rawSections.singleTimeList;
}

function makeGetUserDataReqObj(): QueryReq<"getUserData"> {
  const feUser = PackBuilderSection.initAsOmniChild("feUser");
  return makeReqObj(feUser);
}

function makeReqObj(
  feUser: PackBuilderSection<"feUser">
): QueryReq<"getUserData"> {
  const guestAccessSections = feUser.maker.makeChildTypePackArrs(
    guestAccessNames
  ) as GuestAccessSectionPackArrs;
  return { body: { guestAccessSections } };
}
