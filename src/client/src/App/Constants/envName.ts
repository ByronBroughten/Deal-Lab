const envNames = ["development", "production"] as const;
export type EnvName = typeof envNames[number];

function getEnvName(): EnvName {
  return ["development", "test"].includes(process.env.NODE_ENV as string)
    ? "development"
    : "production";
}

export const envName = getEnvName();
