import { Request, Response } from "express";
import { QueryReq } from "../../client/src/sharedWithServer/ApiQueries";
import { makeRes } from "../../client/src/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { constants } from "../../client/src/sharedWithServer/Constants";
import { DbUserService } from "../../DbUserService";
import {
  Authed,
  getAuthWare,
  validateAuthData,
} from "../../middleware/authWare";
import { ResStatusError } from "../../useErrorHandling";
import { sendSuccess } from "./routesShared/sendSuccess";
import { getStripe } from "./routesShared/stripe";

export async function getCustomerPortalUrl(req: Request, res: Response) {
  const { auth } = validateUpgradeUserToProReq(req).body;
  const dbUser = await DbUserService.initBy("authId", auth.id);
  const customerId = await dbUser.customerId();

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

export const getProPaymentUrlWare = [getAuthWare(), getProPaymentUrl] as const;
async function getProPaymentUrl(req: Request, res: Response) {
  if (constants.isBeta) {
    throw new ResStatusError({
      errorMessage:
        "Attempted to upgrade to pro while prohibited during Beta testing",
      resMessage: "Upgrading to pro is not allowed at this point in Beta",
      status: 400,
    });
  }

  const { auth, priceId } = validateUpgradeUserToProReq(req).body;

  const dbUser = await DbUserService.initBy("authId", auth.id);
  const { customerId, email } = await dbUser.userInfo();

  // should this be implemented?: checkIfAlreadySubscribed(userId);

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    subscription_data: {
      trial_period_days: 7,
    },
    success_url: constants.clientUrlBase + constants.feRoutes.subscribeSuccess,
    cancel_url: constants.clientUrlBase,
    customer_email: email,
    ...(customerId ? { customer: customerId } : {}),

    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
  });

  const sessionUrl = validateSessionUrl(session.url);
  sendSuccess(res, "getProPaymentUrl", { data: { sessionUrl } });
}
type Req = Authed<QueryReq<"getProPaymentUrl">>;
function validateUpgradeUserToProReq(req: Authed<any>): Req {
  const { auth, priceId } = (req as Req).body;
  if (typeof priceId === "string") {
    return {
      body: {
        priceId,
        auth: validateAuthData(auth),
      },
    };
  } else {
    throw new ResStatusError({
      status: 400,
      errorMessage: "Failed getProPaymentUrl validation.",
      resMessage: "Server payload validation failed.",
    });
  }
}

function validateSessionUrl(url: any): string {
  if (typeof url === "string") {
    return url;
  } else {
    throw new ResStatusError({
      errorMessage: "Failed to connect to Stripe session.",
      resMessage:
        "There was an error connecting to the payment provider. Please try again later, or contact the support email at the bottom of the screen.",
      status: 404,
    });
  }
}
