import {
  DisplayName,
  displayVarb,
  DisplayVarbOptions,
} from "../displaySectionVarbs/displayVarb";

export const displayVarbOptions = {
  dollars: { startAdornment: "$", displayRound: 2 },
  monthly: { endAdornment: "/month" },
  yearly: { endAdornment: "/year" },
  percent: { endAdornment: "%", displayRound: 3 },
  decimal: { displayRound: 5 },
} as const;

export const displayVarbS = {
  dollars(displayName: DisplayName, options?: DisplayVarbOptions) {
    return displayVarb(displayName, {
      ...displayVarbOptions.dollars,
      ...options,
    });
  },
  percent(displayName: DisplayName, options?: DisplayVarbOptions) {
    return displayVarb(displayName, {
      ...displayVarbOptions.percent,
      ...options,
    });
  },
  monthly(displayName: DisplayName, options?: DisplayVarbOptions) {
    return displayVarb(displayName, {
      ...displayVarbOptions.monthly,
      ...options,
    });
  },
  yearly(displayName: DisplayName, options?: DisplayVarbOptions) {
    return displayVarb(displayName, {
      ...displayVarbOptions.yearly,
      ...options,
    });
  },
  dollarsMonthly(displayName: DisplayName, options?: DisplayVarbOptions) {
    return displayVarb(displayName, {
      ...displayVarbOptions.dollars,
      ...displayVarbOptions.monthly,
      ...options,
    });
  },
  dollarsYearly(displayName: DisplayName, options?: DisplayVarbOptions) {
    return displayVarb(displayName, {
      ...displayVarbOptions.dollars,
      ...displayVarbOptions.yearly,
      ...options,
    });
  },
};
