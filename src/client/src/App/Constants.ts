type StripePrice = {
  priceId: string;
  costInCents: 1000;
  billed: "monthly" | "yearly";
  product: "proPlan";
};

const clientProdUrl = "https://www.ultimatepropertyanalyzer.com";
const clientDevUrl = "http://localhost:3000";

const envConstants = {
  development: {
    environment: "development",
    appName: "Ultimate Property Analyzer — Development",
    apiUrlBase: "http://localhost:5000",
    clientUrlBase: clientDevUrl,
    stripePrices: [
      {
        priceId: "price_1LTuD1BcSOBChcCBWNRJdonV",
        costInCents: 1000,
        billed: "monthly",
        product: "proPlan",
      } as StripePrice,
    ],
  },
  production: {
    environment: "production",
    appName: "Ultimate Property Analyzer",
    apiUrlBase: clientProdUrl,
    clientUrlBase: clientProdUrl,
    stripePrices: [
      {
        priceId: "price_1LTuDKBcSOBChcCBqPTRlPCI",
        costInCents: 1000,
        billed: "monthly",
        product: "proPlan",
      } as StripePrice,
    ],
  },
} as const;

const envName = ["development", "test"].includes(process.env.NODE_ENV as string)
  ? "development"
  : "production";
const env = envConstants[envName];
const apiPathBit = "/api";
const apiPathFull = `${env.apiUrlBase}${apiPathBit}`;

const isBeta = true;
export const config = {
  ...env,
  supportEmail: "support@ultimatepropertyanalyzer.com",
  discordLink: "https://discord.gg/W6pxEXT8EV",
  clientProdUrl,
  clientDevUrl,
  isBeta,
  apiPathBit,
  apiPathFull,
  plans: {
    basic: {
      sectionSaveLimit: isBeta ? 1000 : 2,
      canUseCompareTable: false,
    },
    pro: {
      sectionSaveLimit: 1000,
      canUseCompareTable: true,
    },
  },
  superTokens: {
    appInfo: {
      // learn more about this on https://supertokens.com/docs/emailpassword/appinfo
      appName: env.appName,
      apiDomain: apiPathFull,
      websiteDomain: env.clientUrlBase,
    },
  },
  auth: {
    successUrlEnd: "/login-success",
    get successUrl() {
      return `${env.clientUrlBase}${this.successUrlEnd}`;
    },
  },
  subscriptionSuccessUrlEnd: "/subscription-success",
  basicStorageLimit: 2,
  apiQueryNames: [
    "addSection",
    "updateSection",
    "getSection",
    "deleteSection",
    "replaceSectionArr",
    "getProPaymentUrl",
    "getUserData",
    "getSubscriptionData",
    "makeSession",
    // delete all users
  ],
  get superTokensAppInfo() {
    return {
      // learn more about this on https://supertokens.com/docs/emailpassword/appinfo
      appName: this.appName,
      apiDomain: this.apiPathFull,
      websiteDomain: this.clientUrlBase,
    } as const;
  },
  tokenKey: {
    sectionsState: "sections-state",
    sectionsConfigHash: "sections-config-hash",
    apiUserAuth: "x-auth-token",
    analyzerState: "analyzer-state",
    analyzerConfigHash: "analyzer-config-hash",
  },
} as const;

export const constants = config;
