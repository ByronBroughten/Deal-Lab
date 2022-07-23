import { Request, Response } from "express";
import Stripe from "stripe";
import { config } from "../../client/src/App/Constants";
import { ApiStorageAuth } from "../../client/src/App/sharedWithServer/SectionsMeta/baseSections";
import { userAuthWare } from "../../middleware/authWare";
import { ResStatusError } from "../../resErrorUtils";
import { findUserByIdAndUpdate } from "./shared/findAndUpdate";
import { sendSuccess } from "./shared/sendSuccess";
import { UserAuthedReq } from "./shared/UserAuthedReq";

const stripe = new Stripe(process.env.STRIPE_SECRET as string, {
  apiVersion: "2020-08-27",
});

export const upgradeUserToProWare = [
  userAuthWare,
  upgradeUserToProServerSide,
] as const;

async function upgradeUserToProServerSide(req: Request, res: Response) {
  const {
    paymentMethodId,
    userJwt: { userId },
  } = validateUpgradeUserToProReq(req).body;
  makePayment({ paymentMethodId, res });
  doUpgradeUserToPro({ userId, res });
  sendSuccess(res, "upgradeUserToPro", { data: { success: true } });
}

type DoUpgradeUserToProProps = { userId: string; res: Response };
async function doUpgradeUserToPro({ userId, res }: DoUpgradeUserToProProps) {
  const userDoc = await findUserByIdAndUpdate({
    userId,
    doWhat: "upgrade user to pro",
    queryParameters: makeUpdateUserToProQueryParameters(),
  });
  const isProUser =
    userDoc.user[0].rawSections.user[0].dbVarbs.apiStorageAuth ===
    ("fullStorage" as ApiStorageAuth);
  if (!isProUser) {
    throw new ResStatusError({
      resMessage:
        "Failed to upgrade to pro user. Please contact customer support.",
      errorMessage: "Upgrade to pro failed",
      status: 400,
    });
  }
}

function makeUpdateUserToProQueryParameters() {
  return {
    operation: {
      $set: { "user.0.apiStorageAuth": "proUser" },
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

function validateUpgradeUserToProReq(
  req: UserAuthedReq<any>
): UserAuthedReq<"upgradeUserToPro"> {
  const { userJwt, paymentMethodId } = (
    req as UserAuthedReq<"upgradeUserToPro">
  ).body;
  return {
    body: {
      paymentMethodId: validatePaymentMethodId(paymentMethodId),
      userJwt: userJwt,
    },
  };
}

function validatePaymentMethodId(value: any): string {
  if (typeof value === "string") return value;
  throw new Error("Failed to validate paymentMethodId.");
}
