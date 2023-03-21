import { envName } from "./envName";

type StripePrice = {
  priceId: string;
  costInCents: number;
  billed: "monthly" | "yearly";
  product: "proPlan" | "trial";
};

const stripeProPlanPriceIds = {
  development: "price_1M8A2OBcSOBChcCBAqDD2TQn",
  production: "price_1M8A4TBcSOBChcCBfz5K4buL",
};

export const stripePrices: StripePrice[] = [
  {
    priceId: stripeProPlanPriceIds[envName],
    costInCents: 800,
    billed: "monthly",
    product: "proPlan",
  },
];
