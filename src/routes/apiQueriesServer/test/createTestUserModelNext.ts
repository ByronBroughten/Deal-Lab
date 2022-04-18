import Analyzer from "../../../client/src/App/sharedWithServer/Analyzer";
import { apiQueriesShared } from "../../../client/src/App/sharedWithServer/apiQueriesShared";
import { RegisterReqBody } from "../../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { userServerSide } from "../userServerSide";

export async function createTestUserModelNext(
  testSuiteName: string
): Promise<string> {
  const userDoc = await userServerSide.entireMakeUserProcess(
    makeTestRegisterPayload(testSuiteName)
  );
  return userDoc._id.toHexString();
}

function makeTestRegisterPayload(testSuiteName: string): RegisterReqBody {
  let next = Analyzer.initAnalyzer();
  next = next.updateSectionValuesAndSolve("register", {
    email: `${testSuiteName}Test@gmail.com`,
    password: "testPassword",
    userName: "Testosis",
  });
  return apiQueriesShared.nextRegister.makeReq(next).body;
}
