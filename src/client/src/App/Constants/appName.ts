export function getAppNameStuff() {
  const appName = process.env.REACT_APP_NAME;
  if (appName === "HomeEstimator") {
    return {
      appName,
      devAppDisplayName: "HomeEstimator — Development",
      appUnit: "Home",
      appUnitPlural: "Homes",
    };
  } else if (appName === "Deal Lab") {
    return {
      appName,
      devAppDisplayName: "Deal Lab — Development",
      appUnit: "Deal",
      appUnitPlural: "Deals",
    };
  } else {
    throw new Error(`appName "${appName}" is not accounted for.`);
  }
}
