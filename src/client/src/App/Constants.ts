type StripePrice = {
  priceId: string;
  costInCents: number;
  billed: "monthly" | "yearly";
  product: "proPlan" | "trial";
};

const proPlanStripePrice: StripePrice = {
  priceId: "price_1M8A2OBcSOBChcCBAqDD2TQn",
  costInCents: 800,
  billed: "monthly",
  product: "proPlan",
};

const clientProdUrl = "https://www.ultimatepropertyanalyzer.comc";
const clientDevUrl = "http://localhost:3000";

const envConstants = {
  development: {
    environment: "development",
    appName: "Deal Lab — Development",
    apiUrlBase: "http://localhost:5000",
    clientUrlBase: clientDevUrl,
    stripePrices: [proPlanStripePrice],
    paymentManagementLink:
      "https://billing.stripe.com/p/login/test_5kA16HgOu6k00nubII",
  },
  production: {
    environment: "production",
    appName: "Deal Lab",
    apiUrlBase: clientProdUrl,
    clientUrlBase: clientProdUrl,
    stripePrices: [proPlanStripePrice],
    paymentManagementLink:
      "https://billing.stripe.com/p/login/cN24j771Yd5qc3C9AA",
  },
} as const;

const envName = ["development", "test"].includes(process.env.NODE_ENV as string)
  ? "development"
  : "production";
const env = envConstants[envName];
const apiPathBit = "/api";
const apiPathFull = `${env.apiUrlBase}${apiPathBit}`;

const isBeta = false;
const maxSectionSaveLimit = 1000;
const basicSectionSaveLimit = 3;
export const config = {
  ...env,
  supportEmail: "support@ultimatepropertyanalyzer.com",
  feedbackEmail: "feedback@ultimatepropertyanalyzer.com",
  discordLink: "https://discord.gg/W6pxEXT8EV",
  clientProdUrl,
  clientDevUrl,
  isBeta,
  apiPathBit,
  apiPathFull,
  plans: {
    basic: {
      sectionSaveLimit: isBeta ? maxSectionSaveLimit : basicSectionSaveLimit,
      canUseCompareTable: false,
    },
    pro: {
      sectionSaveLimit: maxSectionSaveLimit,
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
  feRoutes: {
    mainTables: {
      property: "/property-compare",
      loan: "/loan-compare",
      mgmt: "/mgmt-compare",
      deal: "/deal-compare",
    },
    paymentManagement: env.paymentManagementLink,
    privacyPolicy: "/privacy-policy",
    termsOfService: "/terms-of-service",
    compare: "/compare",
    analyzer: "/analyzer",
    userVariables: "/variables",
    userLists: "/lists",
    userOutputs: "/outputs",
    authSuccess: "/login-success",
    subscribeSuccess: "/subscription-success",
  },
  auth: {
    get successUrl() {
      return `${env.clientUrlBase}${config.feRoutes.authSuccess}`;
    },
  },
  basicStorageLimit: 2,
  apiQueryNames: [
    "addSection",
    "updateSection",
    "getSection",
    "deleteSection",
    "replaceSectionArrs",
    "getProPaymentUrl",
    "getCustomerPortalUrl",
    "getUserData",
    "getSubscriptionData",
    "makeSession",
    "getTableRows",
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
    userAuthData: "user-auth-data-token",
    analyzerState: "analyzer-state",
    analyzerConfigHash: "analyzer-config-hash",
  },
} as const;

export const constants = config;
