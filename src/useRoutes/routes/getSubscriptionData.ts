import { Request, Response } from "express";
import { DbUserService } from "../../DbUserService";
import { constants } from "../../client/src/sharedWithServer/Constants";
import { getAuthWare, validateEmptyAuthReq } from "../../middleware/authWare";
import { sendSuccess } from "./routesShared/sendSuccess";

export const subscriptionDataWare = [getAuthWare(), getSubscriptionData];
async function getSubscriptionData(req: Request, res: Response) {
  const { auth } = validateEmptyAuthReq(req).body;
  const user = await DbUserService.initBy("authId", auth.id);
  const getter = await user.dbUserGetter();
  const { subscriptionValues } = getter;
  sendSuccess(res, "getSubscriptionData", {
    data: subscriptionValues,
    headers: {
      [constants.tokenKey.userAuthData]:
        getter.createUserJwt(subscriptionValues),
    },
  });
}
