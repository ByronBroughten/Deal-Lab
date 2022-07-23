const dev = {
  appName: "Analyzer Client — Development",
  endpoint: "http://localhost:5000",
};

const prod = {
  appName: "Analyzer Client — Production",
  endpoint: "https://www.dealanalyzer.app",
};

const baseEnvStuff = process.env.NODE_ENV === "development" ? dev : prod;
const apiPathBit = "/api";

export const config = {
  name: baseEnvStuff.appName,
  apiPathBit: apiPathBit,
  apiPathFull: `${baseEnvStuff.endpoint}${apiPathBit}`,
  costInCents: {
    upgradeUserToPro: 1000,
  },
  basicStorageLimit: 2,
  apiQueryNames: [
    "register",
    "login",
    "addSection",
    "updateSection",
    "getSection",
    "deleteSection",
    "replaceSectionArr",
    "upgradeUserToPro",
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
