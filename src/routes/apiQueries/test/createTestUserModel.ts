import { RegisterReqMaker } from "../../../client/src/App/sharedWithServer/ReqMakers/RegisterReqMaker";
import { LoadedDbUser } from "../shared/DbSections/LoadedDbUser";

export async function createTestUserModel(
  testSuiteName: string
): Promise<LoadedDbUser> {
  const reqMaker = RegisterReqMaker.init({
    email: `${testSuiteName}Test@gmail.com`,
    password: "testPassword",
    userName: "Testosis",
  });
  return await LoadedDbUser.createSaveGet(reqMaker.reqBody);
}
