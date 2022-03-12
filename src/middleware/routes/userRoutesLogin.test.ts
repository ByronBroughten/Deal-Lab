import {
  authTokenKey,
  Req,
} from "../../client/src/App/sharedWithServer/User/crudTypes";
import { makeDbUser, prepNewUserData, UserModel } from "./shared/makeDbUser";
import { decodeAndCheckUserToken } from "./userRoutes/shared/doLogin";
import request from "supertest";
import { config } from "../../client/src/App/Constants";
import { runApp } from "../../runApp";
import { omit } from "lodash";
import { SectionNam } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";

const registerFormData: Req<"Register">["body"]["payload"]["registerFormData"] =
  {
    email: "testosis@gmail.com",
    password: "testpassword",
    userName: "Testosis",
  };

function makeTestLoginReq(): Req<"Login"> {
  return {
    body: {
      payload: omit(registerFormData, ["userName"]),
    },
  };
}
function makeTestRegisterReq(): Req<"Register"> {
  const sections: any = {};
  SectionNam.arr.feGuestAccessStore;
  for (const sectionName of SectionNam.arr.feGuestAccessStore) {
    sections[sectionName] = [];
  }
  return {
    body: {
      payload: {
        registerFormData,
        guestAccessSections: sections,
      },
    },
  };
}

const userPathBit = config.url.bit.user;
describe(`/login`, () => {
  let server: ReturnType<typeof runApp>;
  let req: Req<"Login"> | any;

  beforeEach(async () => {
    req = makeTestLoginReq();
    server = runApp();
    const reqObj = makeTestRegisterReq();
    const { payload } = reqObj.body;
    const newUserData = await prepNewUserData(payload);

    const userDoc = new UserModel(makeDbUser(newUserData));
    await userDoc.save();
  });

  const exec = () => request(server).post(`${userPathBit}/login`).send(req);
  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
  }

  afterEach(async () => {
    await UserModel.deleteMany();
    // await server.close();
  });

  it("should return 400 if payload fails validation", async () => {
    req.body.payload.email = null;
    await testStatus(400);
  });
  it("should return 400 if an account with the email doesn't exist", async () => {
    req.body.payload.email = "nonexistant@gmail.com";
    await testStatus(400);
  });
  it("should return 400 if an invalid password is used", async () => {
    req.body.payload.password = "invalidP@ssword123";
    await testStatus(400);
  });
  it("should return 200 if the request is valid", async () => {
    await testStatus(200);
  });
  it("should return an auth token if the request is valid", async () => {
    const res = await exec();
    const token = res.headers[authTokenKey];
    expect(token).not.toBeUndefined();

    const decoded = decodeAndCheckUserToken(token);
    expect(decoded).not.toBeNull();
  });
  // it("should return a logged in user if the request is valid", async () => {
  // });
});
