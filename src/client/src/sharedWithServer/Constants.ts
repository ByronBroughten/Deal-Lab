import { getAppModeStuff } from "./Constants/appMode";
import { envName } from "./Constants/envName";
import { feRoutes } from "./Constants/feRoutes";
import { stripePrices } from "./Constants/stripePrices";

const clientDevUrl = "http://localhost:3000";
const { devAppDisplayName, clientProdUrl, ...appNameStuff } = getAppModeStuff();

const envConstants = {
  development: {
    environment: "development",
    appDisplayName: devAppDisplayName,
    apiUrlBase: "http://localhost:5000",
    clientUrlBase: clientDevUrl,
    paymentManagementLink:
      "https://billing.stripe.com/p/login/test_5kA16HgOu6k00nubII",
  },
  production: {
    environment: "production",
    appDisplayName: appNameStuff.appName,
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
const maxSectionSaveLimit = 10000;
const basicSectionSaveLimit = 3;
const saveDelayInMs = 4000;
const solveDelayInMs = 500;
const editorValueUpdateDelayMs = 300;

export const config = {
  ...env,
  ...appNameStuff,
  compoundIdSpliter: ".",
  maxSectionSaveLimit,
  stripePrices,
  saveDelayInMs,
  solveDelayInMs,
  editorValueUpdateDelayMs,
  supportEmail: "support@deallab.com", // doesn't work with custom name server
  feedbackEmail: "feedback@deallab.com",
  discordLink: "https://discord.gg/W6pxEXT8EV",
  clientProdUrl,
  clientDevUrl,
  isBeta,
  apiPathBit,
  apiPathFull,
  basicStorageLimit: basicSectionSaveLimit,
  plans: {
    basicPlan: {
      sectionSaveLimit: basicSectionSaveLimit,
      canUseCompareTable: false,
    },
    fullPlan: {
      sectionSaveLimit: maxSectionSaveLimit,
      canUseCompareTable: true,
    },
  },
  superTokens: {
    appInfo: {
      // learn more about this on https://supertokens.com/docs/emailpassword/appinfo
      appName: env.appDisplayName,
      apiDomain: apiPathFull,
      websiteDomain: env.clientUrlBase,

      websiteBasePath: feRoutes.auth,
      apiBasePath: feRoutes.auth,
    },
  },
  feRoutes,
  auth: {
    get successUrl() {
      return `${env.clientUrlBase}${config.feRoutes.handleAuth}`;
    },
  },
  apiQueryNames: [
    "getArchivedDeals",
    "addSection",
    "updateSection",
    "updateSections",
    "getSection",
    "deleteSection",
    "replaceSectionArrs",
    "getProPaymentUrl",
    "getCustomerPortalUrl",
    "getUserData",
    "getSubscriptionData",
    "makeSession",
    "getNewDeal",
  ],
  get superTokensAppInfo() {
    return {
      // learn more about this on https://supertokens.com/docs/emailpassword/appinfo
      appName: this.appDisplayName,
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

type Config = typeof config;
type ConfigKey = keyof Config;

export const constants = config;

export function constant<K extends ConfigKey>(key: K): Config[K] {
  return config[key];
}
