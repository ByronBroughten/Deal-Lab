import { MakeReq } from "../../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { Authed, validateAuthObj } from "./ReqAugmenters";

type Req = Authed<MakeReq<{}>>;
export function validateEmptyAuthReq(req: Authed<any>): Req {
  const { auth } = (req as Req).body;
  return { body: { auth: validateAuthObj(auth) } };
}
