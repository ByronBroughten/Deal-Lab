import { getAppModeStuff } from "./Constants/appMode";
import { envConstants } from "./Constants/envConstants";
import { feRoutes } from "./Constants/feRoutes";
import {
  apiPathBit,
  apiPathFull,
  apiQueryNames,
  makeQueryPaths,
} from "./Constants/queryPaths";
import { stripePrices } from "./Constants/stripePrices";

const clientDevUrl = "http://localhost:3000";
const { devAppDisplayName, clientProdUrl, ...appNameStuff } = getAppModeStuff();

const isBeta = false;
const maxSectionSaveLimit = 10000;
const basicSectionSaveLimit = 3;
const saveDelayInMs = 4000;
const solveDelayInMs = 500;
const editorValueUpdateDelayMs = 300;

export const constants = {
  ...envConstants,
  ...appNameStuff,
  ...makeQueryPaths(),
  apiQueryNames,
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
      appName: envConstants.appDisplayName,
      apiDomain: apiPathFull,
      websiteDomain: envConstants.clientUrlBase,

      websiteBasePath: feRoutes.auth,
      apiBasePath: feRoutes.auth,
    },
  },
  feRoutes,
  auth: {
    get successUrl() {
      return `${envConstants.clientUrlBase}${constants.feRoutes.handleAuth}`;
    },
  },
  apiPathFull,
  apiPathBit,
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

type Constants = typeof constants;
type ConstantsKey = keyof Constants;
export type Constant<K extends ConstantsKey> = Constants[K];

export function constant<K extends ConstantsKey>(key: K): Constants[K] {
  return constants[key];
}
