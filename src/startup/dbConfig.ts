import config from "config";

export const dbConfig = {
  endpoint:
    process.env.NODE_ENV === "test"
      ? (config.get("endpointTest") as string)
      : (config.get("endpoint") as string),
};
