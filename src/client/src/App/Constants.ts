type StripePrice = {
  priceId: string;
  costInCents: 1000;
  billed: "monthly" | "yearly";
  product: "proPlan";
};

const envConstants = {
  development: {
    environment: "development",
    appName: "Ultimate Property Analyzer — Development",
    apiUrlBase: "http://localhost:5000",
    clientUrlBase: "http://localhost:3000",
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
    apiUrlBase: "https://www.propertyanalyzer.app",
    clientUrlBase: "https://www.propertyanalyzer.app",
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

export const config = {
  ...env,
  isBeta: false,
  apiPathBit,
  apiPathFull,
  plans: {
    basic: {
      sectionSaveLimit: 2,
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
    "getProPaymentLink",
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
