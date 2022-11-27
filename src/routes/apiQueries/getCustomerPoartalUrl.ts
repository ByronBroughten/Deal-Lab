import { Request, Response } from "express";
import { constants } from "../../client/src/App/Constants";
import { makeRes } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { getAuthWare } from "../../middleware/authWare";
import { getStripe } from "../routeUtils/stripe";
import { LoadedDbUser } from "./apiQueriesShared/DbSections/LoadedDbUser";
import { Authed, validateAuthObj } from "./apiQueriesShared/ReqAugmenters";
import { sendSuccess } from "./apiQueriesShared/sendSuccess";

export const getCustomerPortalUrlWare = [
  getAuthWare(),
  getCustomerPortalUrl,
] as const;
async function getCustomerPortalUrl(req: Request, res: Response) {
  const { auth } = validateAuthReq(req).body;
  const dbUser = await LoadedDbUser.getBy("authId", auth.id);
  const { customerId } = dbUser;

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

function validateAuthReq(req: Authed<any>): Authed<any> {
  const { auth } = req.body;
  return {
    body: {
      auth: validateAuthObj(auth),
    },
  };
}
