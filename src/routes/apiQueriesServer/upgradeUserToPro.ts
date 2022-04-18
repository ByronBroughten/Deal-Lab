import { Request, Response } from "express";
import Stripe from "stripe";
import { config } from "../../client/src/App/Constants";
import authWare from "../../middleware/authWare";
import { resHandledError } from "../../middleware/error";
import { sendSuccess } from "../shared/crudValidators";
import { findUserByIdAndUpdate } from "./shared/findAndUpdate";
import {
  UserAuthedReq,
  validateLoggedInUser,
} from "./shared/validateLoggedInUser";

const stripe = new Stripe(process.env.STRIPE_SECRET as string, {
  apiVersion: "2020-08-27",
});

export const upgradeUserToProWare = [
  authWare,
  upgradeUserToProServerSide,
] as const;

async function upgradeUserToProServerSide(req: Request, res: Response) {
  const { paymentMethodId, user } = validateUpgradeUserToProReq(req, res).body;
  makePayment({ paymentMethodId, res });
  doUpgradeUserToPro({ userId: user._id, res });
  sendSuccess(res, "upgradeUserToPro", { data: { success: true } });
}

type DoUpgradeUserToProProps = { userId: string; res: Response };
async function doUpgradeUserToPro({ userId, res }: DoUpgradeUserToProProps) {
  const userDoc = await findUserByIdAndUpdate({
    res,
    userId,
    doWhat: "upgrade user to pro",
    queryParameters: makeUpdateUserToProQueryParameters(),
  });
  const isProUser =
    userDoc.user[0].rawSections.user[0].dbVarbs.apiAccessStatus === "proUser";
  if (!isProUser)
    throw resHandledError(
      res,
      400,
      "Failed to upgrade to pro user. Please contact customer support."
    );
}

function makeUpdateUserToProQueryParameters() {
  return {
    operation: {
      $set: { "user.0.apiAccessStatus": "proUser" },
    },
    options: {
      new: true,
      lean: true,
      useFindAndModify: false,
      // runValidators: true,
      strict: false,
    },
  };
}

type MakePaymentProps = { paymentMethodId: string; res: Response };
async function makePayment({ paymentMethodId, res }: MakePaymentProps) {
  const payment = await stripe.paymentIntents.create({
    payment_method: paymentMethodId,
    amount: config.costInCents.upgradeUserToPro,
    currency: "USD",
    description: "Pro Subscription",
    confirm: true,
  });
}

// do I put a "pro" boolean on user?
// No. Well, maybe.
// What would be the most flexible?
// And do I put this on userProtected?
// It probably doesn't really matter if I don't
// plan to make the payment scheme any more complicated
// than pro or not pro
// I can use a boolean
// I can use a string that says "basic" or "pro"

// 1.
// apiAccessStatus: "guest" | "freeUser" | "proUser"

// 2.
// isGuest: true
// isPro: true

// guest will never be a freeUser, by definition
// proUser will never be freeUser, right?
// I'll just do it this way.

// userProtected will have the apiAccessStatus, right?

function validateUpgradeUserToProReq(
  req: Request,
  res: Response
): UserAuthedReq<"upgradeUserToPro"> {
  const { user, paymentMethodId } = req.body;
  return {
    body: {
      paymentMethodId: validatePaymentMethodId(paymentMethodId, res),
      user: validateLoggedInUser(user, res),
    },
  };
}

function validatePaymentMethodId(value: any, res: Response): string {
  if (typeof value === "string") return value;
  throw resHandledError(res, 500, "Failed to validate paymentMethodId.");
}
