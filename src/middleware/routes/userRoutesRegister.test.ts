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

describe(`/register`, () => {
  // prep
  let server: ReturnType<typeof runApp>;
  let req: Req<"Register"> | any; // any to allow for an invalid payload

  beforeEach(async () => {
    req = makeTestRegisterReq();
    server = runApp();
  });

  const exec = (req: any) =>
    request(server).post(`${config.url.bit.user}/register`).send(req);
  async function testStatus(statusNumber: number, req: any) {
    const res = await exec(req);
    expect(res.status).toBe(statusNumber);
  }

  afterEach(async () => {
    await UserModel.deleteMany();
    // await server.close();
  });
  it("should return 500 if the payload is not an object", async () => {
    req.body.payload = null;
    await testStatus(500, req);
  });
  it("should return 400 if the payload fails validation", async () => {
    req.body.payload.registerFormData.email = null;
    await testStatus(400, req);
  });
  it("should return 400 if a user with that email already exists", async () => {
    const userId = new mongoose.Types.ObjectId();
    const reqObj = makeTestRegisterReq();
    const { payload } = reqObj.body;
    const user = new UserModel({
      _id: userId,
      ...makeDbUser(await prepNewUserData(payload)),
    });
    await user.save();
    await testStatus(400, req);
  });
  it("should return 200 if the request is valid", async () => {
    await testStatus(200, req);
  });
});
