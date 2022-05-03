const dev = {
  name: "Analyzer Client — Development",
  endpoint: "http://localhost:5000",
};

const prod = {
  name: "Analyzer Client — Production",
  endpoint: "https://www.dealanalyzer.app",
};

const baseEnvStuff = process.env.NODE_ENV === "development" ? dev : prod;
const apiPathBit = "/api";

export const config = {
  name: baseEnvStuff.name,
  apiPathBit: apiPathBit,
  apiPathFull: `${baseEnvStuff.endpoint}${apiPathBit}`,
  costInCents: {
    upgradeUserToPro: 1000,
  },
  apiQueryNames: [
    "nextRegister",
    "nextLogin",
    "addSection",
    "updateSection",
    "getSection",
    "deleteSection",
    "replaceSectionArr",
    "upgradeUserToPro",
  ],
  tokenKey: {
    apiUserAuth: "x-auth-token",
    analyzerState: "analyzer-state",
    analyzerConfigHash: "analyzer-config-hash",
  },
} as const;

export const constants = config;
