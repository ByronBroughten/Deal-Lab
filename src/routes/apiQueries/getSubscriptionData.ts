import { Request, Response } from "express";
import { constants } from "../../client/src/App/Constants";
import { getAuthWare } from "../../middleware/authWare";
import { LoadedDbUser } from "./apiQueriesShared/DbSections/LoadedDbUser";
import { sendSuccess } from "./apiQueriesShared/sendSuccess";
import { validateEmptyAuthReq } from "./apiQueriesShared/validateEmptyAuthReq";

export const subscriptionDataWare = [getAuthWare(), getSubscriptionData];
async function getSubscriptionData(req: Request, res: Response) {
  const { auth } = validateEmptyAuthReq(req).body;
  const user = await LoadedDbUser.getBy("authId", auth.id);
  const { subscriptionValues } = user;
  sendSuccess(res, "getSubscriptionData", {
    data: subscriptionValues,
    headers: {
      [constants.tokenKey.userAuthData]:
        user.createUserInfoToken(subscriptionValues),
    },
  });
}
