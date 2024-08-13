import { Arr } from "../utils/Arr";

type AppMode = "homeBuyer" | "investor";

export function getAppModeStuff() {
  const appModes: AppMode[] = ["homeBuyer", "investor"];

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

  const appMode = process.env.REACT_APP_MODE;
  if (!Arr.includes(appModes, appMode)) {
    throw new Error(`appMode "${appMode}" is not accounted for.`);
  }
  return appModeObj[appMode];
}
