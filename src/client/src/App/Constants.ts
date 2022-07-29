const dev = {
  appName: "Analyzer Client — Development",
  endpoint: "http://localhost:5000",
  frontEndUrlBase: "http://localhost:3000",
};
// do I need the front-end endpoint?

const prod = {
  appName: "Analyzer Client — Production",
  endpoint: "https://www.dealanalyzer.app",
  frontEndUrlBase: "https://www.dealanalyzer.app",
};

const baseEnvStuff = process.env.NODE_ENV === "development" ? dev : prod;
const apiPathBit = "/api";

export const config = {
  appName: baseEnvStuff.appName,
  frontEndUrlBase: baseEnvStuff.frontEndUrlBase,
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
  tokenKey: {
    sectionsState: "sections-state",
    sectionsConfigHash: "sections-config-hash",
    apiUserAuth: "x-auth-token",
    analyzerState: "analyzer-state",
    analyzerConfigHash: "analyzer-config-hash",
  },
} as const;

export const constants = config;
