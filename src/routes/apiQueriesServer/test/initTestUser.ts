import Analyzer from "../../../client/src/App/sharedWithServer/Analyzer";
import { RegisterReqPayloadNext } from "../../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { userServerSideNext } from "../../shared/userServerSideNext";
import { loginUtils } from "../nextLogin/loginUtils";

export async function initTestUser(): Promise<string> {
  const userDoc = await userServerSideNext.entireMakeUserProcess(
    makeRegisterPayload()
  );
  await userDoc.save();
  return loginUtils.makeUserAuthToken(userDoc._id.toHexString());
}

function makeRegisterPayload(): RegisterReqPayloadNext {
  let next = Analyzer.initAnalyzer();
  next = next.updateSectionValuesAndSolve("register", {
    email: "testosis@gmail.com",
    password: "testPassword",
    userName: "Testosis",
  });
  return next.req.nextRegister().body.payload;
}
