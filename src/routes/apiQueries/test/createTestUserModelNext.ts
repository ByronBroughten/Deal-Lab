import { RegisterReqMaker } from "../../../client/src/App/sharedWithServer/ReqMakers/RegisterReqMaker";
import { DbUser } from "../shared/DbSections/DbUser";

export async function createTestUserModelNext(
  testSuiteName: string
): Promise<string> {
  const reqMaker = RegisterReqMaker.init({
    email: `${testSuiteName}Test@gmail.com`,
    password: "testPassword",
    userName: "Testosis",
  });
  return await DbUser.createAndSaveNew(reqMaker.reqBody);
}
