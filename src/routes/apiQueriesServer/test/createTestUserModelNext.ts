import Analyzer from "../../../client/src/App/sharedWithServer/Analyzer";
import { RegisterReqPayloadNext } from "../../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { userServerSideNext } from "../../shared/userServerSideNext";

export async function createTestUserModelNext(
  testSuiteName: string
): Promise<string> {
  const userDoc = await userServerSideNext.entireMakeUserProcess(
    makeTestRegisterPayload(testSuiteName)
  );
  await userDoc.save();
  return userDoc._id.toHexString();
}

function makeTestRegisterPayload(
  testSuiteName: string
): RegisterReqPayloadNext {
  let next = Analyzer.initAnalyzer();
  next = next.updateSectionValuesAndSolve("register", {
    email: `${testSuiteName}Test@gmail.com`,
    password: "testPassword",
    userName: "Testosis",
  });
  return next.req.nextRegister().body.payload;
}
