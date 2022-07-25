import { Request, Response } from "express";
import { config, constants } from "../../client/src/App/Constants";
import { ApiStorageAuth } from "../../client/src/App/sharedWithServer/SectionsMeta/baseSections";
import { userAuthWare } from "../../middleware/authWare";
import { ResStatusError } from "../../resErrorUtils";
import { queryParameters } from "../DbSectionsModel";
import { getStripe } from "../routeUtils/stripe";
import { DbUser } from "./shared/DbSections/DbUser";
import { findUserByIdAndUpdate } from "./shared/findAndUpdate";
import { sendSuccess } from "./shared/sendSuccess";
import { UserAuthedReq } from "./shared/UserAuthedReq";

export const upgradeUserToProWare = [userAuthWare, upgradeUserToPro] as const;
async function upgradeUserToPro(req: Request, res: Response) {
  const {
    userJwt: { userId },
    priceId,
  } = validateUpgradeUserToProReq(req).body;
  const dbUser = await DbUser.queryByUserId(userId);
  const { customerId, email } = dbUser;
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: constants.frontEndUrlBase,
    cancel_url: constants.frontEndUrlBase,
    customer_email: email,
    ...(customerId ? { customer: customerId } : {}),
  });

  const sessionUrl = validateSessionUrl(session.url);
  sendSuccess(res, "upgradeUserToPro", { data: { sessionUrl } });
  // checkIfAlreadySubscribed(userId);
  // makePayment({ paymentMethodId });
  // doUpgradeUserToPro({ userId });
}
function validateUpgradeUserToProReq(
  req: UserAuthedReq<any>
): UserAuthedReq<"upgradeUserToPro"> {
  const { userJwt, priceId } = (req as UserAuthedReq<"upgradeUserToPro">).body;
  if (typeof priceId !== "string") {
    throw new Error("Failed upgradeUserToPro validation.");
  }
  return {
    body: {
      priceId,
      userJwt,
    },
  };
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

async function checkIfAlreadySubscribed(userId: string) {
  const dbUser = await DbUser.queryByUserId(userId);
}

type DoUpgradeUserToProProps = { userId: string };
async function doUpgradeUserToPro({ userId }: DoUpgradeUserToProProps) {
  await findUserByIdAndUpdate({
    userId,
    doWhat: "upgrade user to pro",
    queryParameters: queryParameters.updateVarb({
      storeName: "user",
      sectionName: "user",
      varbName: "apiStorageAuth",
      value: "fullStorage",
    }),
  });
  const dbUser = await DbUser.queryByUserId(userId);
  const storageAuth = dbUser.get.value("apiStorageAuth");

  const isProUser = storageAuth === ("fullStorage" as ApiStorageAuth);
  if (!isProUser) {
    throw new ResStatusError({
      resMessage:
        "Failed to upgrade to pro user. Please contact customer support.",
      errorMessage: "Failed to update user storageAuth to fullStorage",
      status: 400,
    });
  }
}

type MakePaymentProps = { paymentMethodId: string };
async function makePayment({ paymentMethodId }: MakePaymentProps) {
  const stripe = getStripe();
  const payment = await stripe.paymentIntents.create({
    payment_method: paymentMethodId,
    amount: config.upgradeUserToPro.costInCents,
    currency: "USD",
    description: "Pro Subscription",
    confirm: true,
  });
}
