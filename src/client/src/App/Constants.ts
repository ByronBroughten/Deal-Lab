const dev = {
  environment: "development",
  appName: "Ultimate Deal Analyzer — Development",
  apiUrlBase: "http://localhost:5000",
  clientUrlBase: "http://localhost:3000",
};
// do I need the front-end endpoint?

const prod = {
  environment: "production",
  appName: "Ultimate Deal Analyzer",
  apiUrlBase: "https://www.dealanalyzer.app",
  clientUrlBase: "https://www.dealanalyzer.app",
};

const env = process.env.NODE_ENV === "development" ? dev : prod;
const apiPathBit = "/api";
const apiPathFull = `${env.apiUrlBase}${apiPathBit}`;

export const config = {
  ...env,
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
  subscriptionSuccessUrlEnd: "/stripe-subscription-success",
  subscriptions: [
    {
      priceId: "price_1LOqZQBcSOBChcCBoh0Taacn",
      costInCents: 1000,
      billed: "monthly",
      product: "proPlan",
    },
  ],
  basicStorageLimit: 2,
  // before this will work...
  // I must create a user in the db on register.

  // actually, I can do that.

  apiQueryNames: [
    "register",
    "login",
    "addSection",
    "updateSection",
    "getSection",
    "deleteSection",
    "replaceSectionArr",
    "getProPaymentLink",
    "getUserData",
    // sends feGuestAccess sections and gets user data from the db
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
