import { RegisterReqMaker } from "../../../client/src/App/sharedWithServer/ReqMakers/RegisterReqMaker";
import { DbUser } from "../shared/DbSections/DbUser";

export async function createTestUserModel(
  testSuiteName: string
): Promise<DbUser> {
  const reqMaker = RegisterReqMaker.init({
    email: `${testSuiteName}Test@gmail.com`,
    password: "testPassword",
    userName: "Testosis",
  });
  return await DbUser.createSaveGet(reqMaker.reqBody);
}
