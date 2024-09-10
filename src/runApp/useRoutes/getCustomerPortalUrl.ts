import { Request, Response } from "express";
import { makeRes } from "../../client/src/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { constants } from "../../client/src/sharedWithServer/Constants";
import { DbUserService } from "../../DbUserService";
import { getAuthWare, validateEmptyAuthReq } from "./middleware/authWare";
import { sendSuccess } from "./routesShared/sendSuccess";
import { getStripe } from "./routesShared/stripe";

export const getCustomerPortalUrlWare = [
  getAuthWare(),
  getCustomerPortalUrl,
] as const;
async function getCustomerPortalUrl(req: Request, res: Response) {
  const { auth } = validateEmptyAuthReq(req).body;
  const dbUser = await DbUserService.initBy("authId", auth.id);
  const customerId = await dbUser.customerId();
  if (!customerId) {
    throw new Error(`"customerId" hasn't been set yet for this user`);
  }
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: constants.clientUrlBase,
  });
  sendSuccess(
    res,
    "getCustomerPortalUrl",
    makeRes({ sessionUrl: session.url })
  );
}
