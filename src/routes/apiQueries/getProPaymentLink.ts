import { Request, Response } from "express";
import { constants } from "../../client/src/App/Constants";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { getAuthWare } from "../../middleware/authWare";
import { ResStatusError } from "../../utils/resError";
import { getStripe } from "../routeUtils/stripe";
import { LoadedDbUser } from "./shared/DbSections/LoadedDbUser";
import { Authed, validateAuthObj } from "./shared/ReqAugmenters";
import { sendSuccess } from "./shared/sendSuccess";

export const upgradeUserToProWare = [getAuthWare(), getProPaymentLink] as const;
async function getProPaymentLink(req: Request, res: Response) {
  const { auth, priceId } = validateUpgradeUserToProReq(req).body;

  const dbUser = await LoadedDbUser.getBy("authId", auth.id);
  const { customerId, email } = dbUser;

  // should this be implemented?: checkIfAlreadySubscribed(userId);

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: constants.clientUrlBase + constants.subscriptionSuccessUrlEnd,
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
  sendSuccess(res, "getProPaymentLink", { data: { sessionUrl } });
}
type Req = Authed<QueryReq<"getProPaymentLink">>;
function validateUpgradeUserToProReq(req: Authed<any>): Req {
  const { auth, priceId } = (req as Req).body;
  if (typeof priceId === "string") {
    return {
      body: {
        priceId,
        auth: validateAuthObj(auth),
      },
    };
  } else throw new Error("Failed getProPaymentLink validation.");
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
