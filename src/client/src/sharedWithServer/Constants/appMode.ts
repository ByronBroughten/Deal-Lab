import { Arr } from "../utils/Arr";
import { Obj } from "../utils/Obj";

const appModes = ["homeBuyer", "investor"] as const;
type AppMode = (typeof appModes)[number];

const appModeObj = {
  homeBuyer: {
    appMode: "homeBuyer",
    appName: "HomeEstimator",
    clientProdUrl: "https://app.homeestimator.net",
    devAppDisplayName: "HomeEstimator — Development",
    appUnit: "Home",
    appUnitPlural: "Homes",
  },
  investor: {
    appMode: "investor",
    appName: "DealLab",
    clientProdUrl: "https://the.deallab.app",
    devAppDisplayName: "DealLab — Development",
    appUnit: "Deal",
    appUnitPlural: "Deals",
  },
} as const;

type AppModeObj = typeof appModeObj;
type AppModeStuff = AppModeObj[AppMode];

export function getAppModeStuff(): AppModeStuff {
  const appModes = Obj.keys(appModeObj);
  const appMode = process.env.REACT_APP_MODE;
  if (!Arr.includes(appModes, appMode)) {
    throw new Error(`appMode "${appMode}" is not accounted for.`);
  }
  return appModeObj[appMode];
}
