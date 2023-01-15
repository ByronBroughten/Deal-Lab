import {
  DisplayName,
  displayVarb,
  DisplayVarbOptions,
} from "../displaySectionVarbs/displayVarb";

export const displayVarbOptionsS = {
  dollars: { startAdornment: "$", displayRound: 2 },
  monthly: { endAdornment: "/month" },
  yearly: { endAdornment: "/year" },
  percent: { endAdornment: "%", displayRound: 3 },
  decimal: { displayRound: 5 },
} as const;

export function displayVarbOptions(
  displayName: DisplayName,
  options?: DisplayVarbOptions
): DisplayVarbOptions {
  return {
    displayName,
    ...options,
  };
}

export const displayVarbS = {
  dollars(displayName: DisplayName, options?: DisplayVarbOptions) {
    return displayVarb(displayName, {
      ...displayVarbOptionsS.dollars,
      ...options,
    });
  },
  percent(displayName: DisplayName, options?: DisplayVarbOptions) {
    return displayVarb(displayName, {
      ...displayVarbOptionsS.percent,
      ...options,
    });
  },
  monthly(displayName: DisplayName, options?: DisplayVarbOptions) {
    return displayVarb(displayName, {
      ...displayVarbOptionsS.monthly,
      ...options,
    });
  },
  yearly(displayName: DisplayName, options?: DisplayVarbOptions) {
    return displayVarb(displayName, {
      ...displayVarbOptionsS.yearly,
      ...options,
    });
  },
  dollarsMonthly(displayName: DisplayName, options?: DisplayVarbOptions) {
    return displayVarb(displayName, {
      ...displayVarbOptionsS.dollars,
      ...displayVarbOptionsS.monthly,
      ...options,
    });
  },
  dollarsYearly(displayName: DisplayName, options?: DisplayVarbOptions) {
    return displayVarb(displayName, {
      ...displayVarbOptionsS.dollars,
      ...displayVarbOptionsS.yearly,
      ...options,
    });
  },
};
