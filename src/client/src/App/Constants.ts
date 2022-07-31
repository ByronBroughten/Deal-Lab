const dev = {
  appName: "Ultimate Deal Analyzer — Development",
  endpoint: "http://localhost:5000",
  clientUrlBase: "http://localhost:3000",
};
// do I need the front-end endpoint?

const prod = {
  appName: "Ultimate Deal Analyzer",
  endpoint: "https://www.dealanalyzer.app",
  clientUrlBase: "https://www.dealanalyzer.app",
};

const baseEnvStuff = process.env.NODE_ENV === "development" ? dev : prod;
const apiPathBit = "/api";

export const config = {
  appName: baseEnvStuff.appName,
  clientUrlBase: baseEnvStuff.clientUrlBase,
  apiPathBit: apiPathBit,
  apiPathFull: `${baseEnvStuff.endpoint}${apiPathBit}`,
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
  apiQueryNames: [
    // "updateLogin",
    "register",
    "login",
    "addSection",
    "updateSection",
    "getSection",
    "deleteSection",
    "replaceSectionArr",
    "getProPaymentLink",
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
