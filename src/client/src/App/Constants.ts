import { envName } from "./Constants/envName";
import { feRoutes } from "./Constants/feRoutes";
import { stripePrices } from "./Constants/stripePrices";

const clientProdUrl = "https://the.deallab.app";
const clientDevUrl = "http://localhost:3000";

const envConstants = {
  development: {
    environment: "development",
    appName: "Deal Lab — Development",
    apiUrlBase: "http://localhost:5000",
    clientUrlBase: clientDevUrl,
    paymentManagementLink:
      "https://billing.stripe.com/p/login/test_5kA16HgOu6k00nubII",
  },
  production: {
    environment: "production",
    appName: "Deal Lab",
    apiUrlBase: clientProdUrl,
    clientUrlBase: clientProdUrl,
    paymentManagementLink:
      "https://billing.stripe.com/p/login/cN24j771Yd5qc3C9AA",
  },
} as const;

const env = envConstants[envName];
const apiPathBit = "/api";
const apiPathFull = `${env.apiUrlBase}${apiPathBit}`;

const isBeta = false;
const maxSectionSaveLimit = 1000;
const basicSectionSaveLimit = 5;
export const config = {
  ...env,
  stripePrices,
  supportEmail: "support@deallab.com",
  feedbackEmail: "feedback@deallab.com",
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

      websiteBasePath: feRoutes.auth,
      apiBasePath: feRoutes.auth,
    },
  },
  feRoutes,
  auth: {
    get successUrl() {
      return `${env.clientUrlBase}${config.feRoutes.authSuccess}`;
    },
  },
  basicStorageLimit: 5,
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
