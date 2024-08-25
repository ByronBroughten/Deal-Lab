import { envConstant } from "./envConstants";

type StripePrice = {
  priceId: string;
  costInCents: number;
  billed: "monthly" | "yearly";
  product: "proPlan" | "trial";
};

export const stripePrices: StripePrice[] = [
  {
    priceId: envConstant("stripeProPriceId"),
    costInCents: 800,
    billed: "monthly",
    product: "proPlan",
  },
];
