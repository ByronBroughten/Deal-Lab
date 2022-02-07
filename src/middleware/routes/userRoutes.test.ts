import request from "supertest";
import mongoose from "mongoose";
import { userRoutesPath } from "./userRoutes";
import { decodeAndCheckUserToken } from "./userRoutes/login";
import { makeDbUser, prepNewUserData, UserModel } from "./shared/makeDbUser";
import {
  authTokenKey,
  LoginFormData,
  RegisterReqPayload,
} from "../../client/src/App/sharedWithServer/User/crudTypes";
import { runApp } from "../../runApp";
import { SectionNam } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";

const testPayload = {
  login(): LoginFormData {
    return {
      email: "testosis@gmail.com",
      password: "testpassword",
    };
  },
  register(): RegisterReqPayload {
    const sections: Partial<RegisterReqPayload["guestAccessSections"]> = {};
    SectionNam.arr.feGuestAccessStore;
    for (const sectionName of SectionNam.arr.feGuestAccessStore) {
      sections[sectionName] = [];
    }

    return {
      registerFormData: {
        ...this.login(),
        userName: "Testosis",
      },
      guestAccessSections:
        sections as RegisterReqPayload["guestAccessSections"],
    };
  },
};

describe(`${userRoutesPath}/register`, () => {
  // prep
  let payload: any;
  let server: any;

  beforeEach(async () => {
    payload = testPayload.register();
    server = runApp();
  });
  const exec = () =>
    request(server).post(`${userRoutesPath}/register`).send({ payload });
  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
  }
  afterEach(async () => {
    await UserModel.deleteMany();
    // await server.close();
  });

  it("should return 400 if the payload fails validation", async () => {
    payload.email = null;
    await testStatus(400);
  });
  it("should return 400 if a user with that email already exists", async () => {
    const userId = new mongoose.Types.ObjectId();
    const user = new UserModel({
      _id: userId,
      ...makeDbUser(await prepNewUserData(testPayload.register())),
    });
    await user.save();
    await testStatus(400);
  });
  it("should return 200 if the request is valid", async () => {
    await testStatus(200);
  });
});

describe(`${userRoutesPath}/login`, () => {
  let payload: any;
  let server: any;

  beforeEach(async () => {
    payload = testPayload.login();
    server = runApp();
    const testRegisterData = testPayload.register();
    const newUserData = await prepNewUserData(testRegisterData);
    const user = new UserModel(makeDbUser(newUserData));
    await user.save();
  });

  const exec = () =>
    request(server).post(`${userRoutesPath}/login`).send({ payload });
  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
  }

  afterEach(async () => {
    await UserModel.deleteMany();
    // await server.close();
  });

  it("should return 400 if payload fails validation", async () => {
    payload.email = null;
    await testStatus(400);
  });
  it("should return 400 if an account with the email doesn't exist", async () => {
    payload.email = "nonexistant@gmail.com";
    await testStatus(400);
  });
  it("should return 400 if an invalid password is used", async () => {
    payload.password = "invalidP@ssword123";
    await testStatus(400);
  });
  it("should return 200 if the request is valid", async () => {
    await testStatus(200);
  });
  it("should return an auth token if the request is valid", async () => {
    const res = await exec();
    const token = res.header[authTokenKey];
    const decoded = decodeAndCheckUserToken(token);
    expect(decoded).not.toBeNull();
  });
  it("should return a logged in user if the request is valid", async () => {
    // waiting on zodSchemas for user types
    // const res = await exec();
    // expect(res.body.data).toBe();
  });
});
