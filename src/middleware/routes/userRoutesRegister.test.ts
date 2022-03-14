import request from "supertest";
import mongoose from "mongoose";
import { makeDbUser, prepNewUserData, UserModel } from "./shared/makeDbUser";
import { Req } from "../../client/src/App/sharedWithServer/User/crudTypes";
import { runApp } from "../../runApp";
import { SectionNam } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";
import { config } from "../../client/src/App/Constants";

function makeTestRegisterReq(): Req<"Register"> {
  const sections: any = {};
  SectionNam.arr.feGuestAccessStore;
  for (const sectionName of SectionNam.arr.feGuestAccessStore) {
    sections[sectionName] = [];
  }
  return {
    body: {
      payload: {
        registerFormData: {
          email: "testosis@gmail.com",
          password: "testpassword",
          userName: "Testosis",
        },
        guestAccessSections: sections,
      },
    },
  };
}

describe(config.url.register.route, () => {
  // prep
  let server: ReturnType<typeof runApp> | any;
  let reqObj: Req<"Register"> | any; // any to allow for an invalid payload

  beforeEach(async () => {
    reqObj = makeTestRegisterReq();
    server = runApp();
  });

  // register route: "/api/user/register"
  const exec = () =>
    request(server).post(config.url.register.route).send(reqObj.body);
  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
  }

  afterEach(async () => {
    await UserModel.deleteMany();
    // await server.close();
  });
  it("should return 500 if the payload is not an object", async () => {
    reqObj.body.payload = null;
    await testStatus(500);
  });
  it("should return 400 if the payload fails validation", async () => {
    reqObj.body.payload.registerFormData.email = null;
    await testStatus(400);
  });
  it("should return 500 if guestAccessSections isn't right", async () => {
    reqObj.body.payload.guestAccessSections = null;
    await testStatus(500);
  });
  it("should return 400 if a user with that email already exists", async () => {
    const reqObj2 = makeTestRegisterReq();
    const { payload } = reqObj2.body;
    const newUserData = await prepNewUserData(payload);
    const user = new UserModel({
      _id: new mongoose.Types.ObjectId(),
      ...makeDbUser(newUserData),
    });
    await user.save();
    await testStatus(400);
  });
  // it("should return 200 if the request is valid", async () => {
  //   await testStatus(200);
  // });
});