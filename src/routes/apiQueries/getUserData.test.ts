import request from "supertest";
import { constants } from "../../client/src/App/Constants";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import {
  isLoginData,
  LoginData,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/login";
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
    const feStore = PackBuilderSection.initAsOmniChild("feStore");
    feStore.addChild("outputListMain");
    feStore.addChild("outputListMain");
    feStore.addChild("userVarbListMain");
    reqObj = makeReqObj(feStore);
    const { data } = await exec();

    const postFeStore = PackBuilderSection.initAsOmniChild("feStore");
    postFeStore.loadSelf((data as LoginData).feStore[0]);
    const postReqObj = makeReqObj(postFeStore);
    expect(reqObj).toEqual(postReqObj);
  });
  it("should not add guestAccessSections if they have already been added", async () => {
    const feStore = PackBuilderSection.initAsOmniChild("feStore");
    feStore.addChild("outputListMain");
    feStore.addChild("outputListMain");
    feStore.addChild("userVarbListMain");
    reqObj = makeReqObj(feStore);
    const res1 = await exec();

    feStore.addChild("singleTimeListMain");
    reqObj = makeReqObj(feStore);
    const res2 = await exec();

    expect(changedSection(res1.data)).toEqual(changedSection(res2.data));
  });
});

function changedSection(data: LoginData) {
  return data.feStore[0].rawSections.singleTimeList;
}

function makeGetUserDataReqObj(): QueryReq<"getUserData"> {
  const feStore = PackBuilderSection.initAsOmniChild("feStore");
  return makeReqObj(feStore);
}

function makeReqObj(
  feStore: PackBuilderSection<"feStore">
): QueryReq<"getUserData"> {
  const guestAccessSections = feStore.maker.makeChildTypePackArrs(
    guestAccessNames
  ) as GuestAccessSectionPackArrs;
  return { body: { guestAccessSections } };
}
