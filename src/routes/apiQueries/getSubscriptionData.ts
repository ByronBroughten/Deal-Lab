import { Request, Response } from "express";
import { constants } from "../../client/src/App/Constants";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { getAuthWare } from "../../middleware/authWare";
import { LoadedDbUser } from "./apiQueriesShared/DbSections/LoadedDbUser";
import { Authed, validateAuthObj } from "./apiQueriesShared/ReqAugmenters";
import { sendSuccess } from "./apiQueriesShared/sendSuccess";

export const subscriptionDataWare = [getAuthWare(), getSubscriptionData];
async function getSubscriptionData(req: Request, res: Response) {
  const { auth } = validateSectionPackReq(req).body;
  const user = await LoadedDbUser.getBy("authId", auth.id);
  const { subscriptionValues } = user;
  sendSuccess(res, "getSubscriptionData", {
    data: subscriptionValues,
    headers: {
      [constants.tokenKey.apiUserAuth]:
        user.createUserInfoToken(subscriptionValues),
    },
  });
}

type Req = Authed<QueryReq<"getSubscriptionData">>;
export function validateSectionPackReq(req: Authed<any>): Req {
  const { auth } = (req as Req).body;
  return { body: { auth: validateAuthObj(auth) } };
}
