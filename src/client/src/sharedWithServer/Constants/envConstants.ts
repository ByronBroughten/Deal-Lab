import { getAppModeStuff } from "./appMode";

const envNames = ["development", "production"] as const;
type EnvName = (typeof envNames)[number];

function getEnvName(): EnvName {
  return ["development", "test"].includes(process.env.NODE_ENV as string)
    ? "development"
    : "production";
}

function getEnvConstants() {
  const envName = getEnvName();

  const { appName, devAppDisplayName, clientProdUrl } = getAppModeStuff();
  const clientDevUrl = "http://localhost:3000";
  const constants = {
    development: {
      environment: "development",
      appDisplayName: devAppDisplayName,
      apiUrlBase: "http://localhost:5000",
      clientUrlBase: clientDevUrl,
      stripeProPriceId: "price_1M8A2OBcSOBChcCBAqDD2TQn",
      paymentManagementLink:
        "https://billing.stripe.com/p/login/test_5kA16HgOu6k00nubII",
    },
    production: {
      environment: "production",
      appDisplayName: appName,
      apiUrlBase: clientProdUrl,
      clientUrlBase: clientProdUrl,
      stripeProPriceId: "price_1M8A4TBcSOBChcCBfz5K4buL",
      paymentManagementLink:
        "https://billing.stripe.com/p/login/cN24j771Yd5qc3C9AA",
    },
  } as const;
  return constants[envName];
}

export const envConstants = getEnvConstants();
type EnvConstants = typeof envConstants;
export function envConstant<K extends keyof EnvConstants>(
  key: K
): EnvConstants[K] {
  return envConstants[key];
}
