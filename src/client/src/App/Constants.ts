import {
  configUrls,
  makeConfigApiEndpoints,
  makeCrudConfig,
} from "./Constants/configUrls";

const dev = {
  name: "Analyzer Client — Development",
  endpoint: "http://localhost:5000/",
};

const prod = {
  name: "Analyzer Client — Production",
  endpoint: "https://www.dealanalyzer.app",
};

// https://ultimate-property-analyzer.herokuapp.com

const constants = process.env.NODE_ENV === "development" ? dev : prod;

export const config = {
  name: constants.name,
  apiEndpointBase: constants.endpoint,
  url: configUrls(constants.endpoint),
  crud: makeCrudConfig(constants.endpoint),
  apiEndpoints: makeConfigApiEndpoints(constants.endpoint),
  apiQueryNames: [
    "nextRegister",
    "nextLogin",
    "addSection",
    "updateSection",
    "getSection",
    "deleteSection",
    "replaceSectionArr",
  ],
  tokenKey: {
    apiUserAuth: "x-auth-token",
    analyzerState: "analyzer-state",
    analyzerConfigHash: "analyzer-config-hash",
  },
} as const;
