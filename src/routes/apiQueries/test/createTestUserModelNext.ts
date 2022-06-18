import { RegisterReqMaker } from "../../../client/src/App/sharedWithServer/ReqMakers/RegisterReqMaker";
import { userServerSide } from "../userServerSide";

export async function createTestUserModelNext(
  testSuiteName: string
): Promise<string> {
  const reqMaker = RegisterReqMaker.init({
    email: `${testSuiteName}Test@gmail.com`,
    password: "testPassword",
    userName: "Testosis",
  });
  const userDoc = await userServerSide.entireMakeUserProcess(reqMaker.reqBody);
  return userDoc._id.toHexString();
}
