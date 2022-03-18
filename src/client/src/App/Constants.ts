import { configUrls, makeCrudConfig } from "./Constants/configUrls";

const dev = {
  name: "Analyzer Client — Development",
  endpoint: "http://localhost:5000/",
};

const prod = {
  name: "Analyzer Client — Production",
  endpoint: "https://ultimate-property-analyzer.herokuapp.com",
};

const constants = process.env.NODE_ENV === "development" ? dev : prod;

export const config = {
  name: constants.name,
  url: configUrls(constants.endpoint),
  crud: makeCrudConfig(constants.endpoint),
  tokenKey: {
    apiUserAuth: "x-auth-token",
    analyzerState: "analyzer-state",
    analyzerConfigHash: "analyzer-config-hash",
  },
} as const;
