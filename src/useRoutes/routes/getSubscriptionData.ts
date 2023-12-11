import { Request, Response } from "express";
import { constants } from "../../client/src/App/Constants";
import { LoadedDbUser } from "../../database/LoadedDbUser";
import { getAuthWare, validateEmptyAuthReq } from "../../middleware/authWare";
import { sendSuccess } from "./routesShared/sendSuccess";

export const subscriptionDataWare = [getAuthWare(), getSubscriptionData];
async function getSubscriptionData(req: Request, res: Response) {
  const { auth } = validateEmptyAuthReq(req).body;
  const user = await LoadedDbUser.getBy("authId", auth.id);
  const { subscriptionValues } = user;
  sendSuccess(res, "getSubscriptionData", {
    data: subscriptionValues,
    headers: {
      [constants.tokenKey.userAuthData]: user.createUserJwt(subscriptionValues),
    },
  });
}
