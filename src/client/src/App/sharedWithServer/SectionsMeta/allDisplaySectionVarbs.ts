import {
  sectionVarbNames,
  VarbName,
} from "./baseSectionsDerived/baseSectionsVarbsTypes";
import {
  getSwitchVarbName,
  switchKeys,
  SwitchName,
  SwitchOptionName,
  switchOptionNames,
  SwitchVarbName,
} from "./baseSectionsVarbs/baseSwitchNames";
import { RelLocalVarbInfo, relVarbInfoS } from "./SectionInfo/RelVarbInfo";
import { SectionName, sectionNames } from "./SectionName";

export type DisplayName = string | RelLocalVarbInfo;
export type DisplayOverrideSwitches = readonly DisplayOverrideSwitch[];
export interface DisplayOverrideSwitch {
  switchInfo: RelLocalVarbInfo;
  switchValue: string;
  sourceInfo: RelLocalVarbInfo;
}
export type DisplaySourceFinder =
  | null
  | RelLocalVarbInfo
  | DisplayOverrideSwitches;
type DisplaySectionVarbGeneric = {
  displayName: DisplayName;
  displayNameStart: string;
  displayNameEnd: string;
  startAdornment: string;
  endAdornment: string;
  displayRound: number;
  displaySourceFinder: DisplaySourceFinder;
};

const displayVarbCheck = <DS extends DisplaySectionVarbGeneric>(
  value: DS
): DS => value;

function defaultDisplayVarb(displayName: DisplayName) {
  return displayVarbCheck({
    displayName,
    displayNameStart: "",
    displayNameEnd: "",
    startAdornment: "",
    endAdornment: "",
    displayRound: 0,
    displaySourceFinder: null,
  });
}

type Options = Partial<Omit<DisplaySectionVarbGeneric, "displayName">>;
function displayVarb<DN extends DisplayName>(
  displayName: DN,
  partial: Options = {}
): DisplaySectionVarbGeneric {
  return {
    ...defaultDisplayVarb(displayName),
    ...partial,
  };
}

type SectionVarbsOptions<SN extends SectionName> = Partial<{
  [VN in VarbName<SN>]: Partial<DisplaySectionVarbGeneric>;
}>;

function optionsToFull<SN extends SectionName>(
  sectionName: SN,
  options: SectionVarbsOptions<SN>
): DisplaySectionVarbsGeneric<SN> {
  const varbNames = sectionVarbNames(sectionName);
  return varbNames.reduce((full, varbName) => {
    const varbOptions = options[varbName] ?? {};
    full[varbName] = displayVarb("", varbOptions);
    return full;
  }, {} as DisplaySectionVarbsGeneric<SN>);
}

function displaySectionVarbsProp<SN extends SectionName>(
  sectionName: SN,
  options: Partial<DisplaySectionVarbsGeneric<SN>> = {}
): DisplaySectionVarbsProp<SN> {
  return {
    [sectionName]: optionsToFull(sectionName, options),
  } as DisplaySectionVarbsProp<SN>;
}

type DisplaySectionVarbsProp<SN extends SectionName> = {
  [S in SN]: DisplaySectionVarbsGeneric<SN>;
};

type DisplaySectionVarbsGeneric<SN extends SectionName> = {
  [VN in VarbName<SN>]: DisplaySectionVarbGeneric;
};

function defaultDisplaySectionVarbs<SN extends SectionName>(
  sectionName: SN
): DisplaySectionVarbsGeneric<SN> {
  const varbNames = sectionVarbNames(sectionName);
  return varbNames.reduce((defaults, varbName) => {
    // const valueName = sectionVarbValueName(sectionName, varbName);
    // const options = valueName === "numObj" ? optionsS.dollars : {}
    // this commented out modification is interesting, but numObjs should
    // generally have manually entered displayNames anyways
    defaults[varbName] = defaultDisplayVarb("");
    return defaults;
  }, {} as DisplaySectionVarbsGeneric<SN>);
}

type AllDisplaySectionVarbsGeneric = {
  [SN in SectionName]: DisplaySectionVarbsGeneric<SN>;
};

function allDefaultDisplaySectionVarbs(): AllDisplaySectionVarbsGeneric {
  return sectionNames.reduce((defaults, sectionName) => {
    (defaults as any)[sectionName] = defaultDisplaySectionVarbs(sectionName);
    return defaults;
  }, {} as AllDisplaySectionVarbsGeneric);
}

const optionsS = {
  dollars: { startAdornment: "$", displayRound: 2 },
  monthly: { endAdornment: "/month" },
  yearly: { endAdornment: "/year" },
  percent: { endAdornment: "%", displayRound: 3 },
  decimal: { displayRound: 5 },
} as const;

const displayVarbS = {
  dollars(displayName: DisplayName, options?: Options) {
    return displayVarb(displayName, {
      ...optionsS.dollars,
      ...options,
    });
  },
  percent(displayName: DisplayName, options?: Options) {
    return displayVarb(displayName, {
      ...optionsS.percent,
      ...options,
    });
  },
  monthly(displayName: DisplayName, options?: Options) {
    return displayVarb(displayName, {
      ...optionsS.monthly,
      ...options,
    });
  },
  yearly(displayName: DisplayName, options?: Options) {
    return displayVarb(displayName, {
      ...optionsS.yearly,
      ...options,
    });
  },
  dollarsMonthly(displayName: DisplayName, options?: Options) {
    return displayVarb(displayName, {
      ...optionsS.dollars,
      ...optionsS.monthly,
      ...options,
    });
  },
  dollarsYearly(displayName: DisplayName, options?: Options) {
    return displayVarb(displayName, {
      ...optionsS.dollars,
      ...optionsS.yearly,
      ...options,
    });
  },
};

const checkSwitchDisplayVarbProps = <T extends Record<SwitchName, any>>(
  props: T
): T => props;
const switchDisplayVarbProps = checkSwitchDisplayVarbProps({
  ongoing: {
    monthly: optionsS.monthly,
    yearly: optionsS.yearly,
  },
  get ongoingInput() {
    // this is going to change.
    return {
      monthly: optionsS.monthly,
      yearly: optionsS.yearly,
    };
  },
  monthsYears: {
    months: { endAdornment: "months" },
    years: { endAdornment: "years" },
  },
  percent: { percent: optionsS.percent },
  get dollarsPercent() {
    return {
      percent: optionsS.percent,
      dollars: optionsS.dollars,
    } as const;
  },
  get dollarsPercentDecimal() {
    return {
      percent: optionsS.percent,
      dollars: optionsS.dollars,
      decimal: optionsS.decimal,
    };
  },
} as const);

type SwitchDisplayVarb<BN extends string, SN extends SwitchName> = Record<
  SwitchVarbName<BN, SN>,
  DisplaySectionVarbGeneric
>;

type SwitchOptionsFull<SN extends SwitchName> = Record<
  SwitchOptionName<SN>,
  Options
>;

type SwitchOptions<SN extends SwitchName> = Partial<SwitchOptionsFull<SN>>;

function switchOptionsToFull<SN extends SwitchName>(
  switchName: SN,
  options: SwitchOptions<SN>
): SwitchOptionsFull<SN> {
  const names = switchOptionNames(switchName);
  const displayProps = switchDisplayVarbProps[switchName];
  return names.reduce((fullOptions, name) => {
    const displayOptions = {
      ...((name as string) in displayProps ? (displayProps as any)[name] : {}),
    };
    const inputOptions = options[name] ?? {};
    fullOptions[name] = {
      ...displayOptions,
      ...inputOptions,
    };
    return fullOptions;
  }, {} as SwitchOptionsFull<SN>);
}

const displayVarbsS = {
  switch<BN extends string, SN extends SwitchName>(
    baseName: BN,
    switchName: SN,
    displayName: DisplayName,
    options: SwitchOptions<SN> = {}
  ): SwitchDisplayVarb<BN, SN> {
    const keys = switchKeys(switchName);
    return keys.reduce((varbs, key) => {
      const name = getSwitchVarbName(baseName, switchName, key);
      const fullOptions = switchOptionsToFull(switchName, options);
      varbs[name] = {
        ...defaultDisplayVarb(displayName),
        ...fullOptions.all,
        ...(key === "switch" ? {} : fullOptions.targets),
        ...fullOptions[key],
      };
      return varbs;
    }, {} as SwitchDisplayVarb<BN, SN>);
  },
  ongoingDollars<BN extends string>(
    baseName: BN,
    displayName: DisplayName,
    options: SwitchOptions<"ongoing"> = {}
  ): SwitchDisplayVarb<BN, "ongoing"> {
    return this.switch(baseName, "ongoing", displayName, {
      ...options,
      targets: {
        ...optionsS.dollars,
        ...options!.targets,
      },
    });
  },
  monthsYears<BN extends string>(
    baseName: BN,
    displayName: DisplayName
  ): SwitchDisplayVarb<BN, "monthsYears"> {
    return this.switch(baseName, "monthsYears", displayName);
  },
};

const dollars = displayVarbS.dollars;
const ongoingDollars = <BN extends string>(
  baseName: BN,
  displayName: DisplayName
) => displayVarbsS.ongoingDollars(baseName, displayName);

type DisplayVarb<
  SN extends SectionName,
  VN extends VarbName<SN>
> = AllDisplaySectionVarbs[SN][VN & keyof AllDisplaySectionVarbs[SN]];
export function getDisplayVarb<SN extends SectionName, VN extends VarbName<SN>>(
  sectionName: SN,
  varbName: VN
): DisplaySectionVarbGeneric {
  const sectionVarbs = allDisplaySectionVarbs[sectionName];
  return (sectionVarbs as any)[varbName] as DisplaySectionVarbGeneric;
}

type AllDisplaySectionVarbs = typeof allDisplaySectionVarbs;
export const allDisplaySectionVarbs = {
  ...allDefaultDisplaySectionVarbs(),
  ...displaySectionVarbsProp("property", {
    price: dollars("Purchase price"),
    sqft: displayVarb("Square feet"),
    arv: dollars("ARV"),
    sellingCosts: dollars("Selling costs"),
    numUnits: displayVarb("Unit count"),
    numBedrooms: displayVarb("Bedrooms"),
    upfrontExpenses: dollars("Upfront expenses"),
    upfrontRevenue: dollars("Upfront revenues"),
    ...displayVarbsS.monthsYears("holdingPeriod", "Holding period"),
    ...ongoingDollars("taxes", "Taxes"),
    ...ongoingDollars("homeIns", "Home Insurance"),
    ...ongoingDollars("targetRent", "Rent"),
    ...ongoingDollars("expenses", "Expenses"),
    ...ongoingDollars("miscRevenue", "Misc revenue"),
    ...ongoingDollars("revenue", "Revenue"),
  }),
  ...displaySectionVarbsProp("unit", {
    numBedrooms: displayVarb("Bedrooms"),
    ...ongoingDollars("targetRent", "Rent"),
  }),
  ...displaySectionVarbsProp("calculatedVarbs", {
    onePercentPrice: displayVarb("1% Purchase Price"),
  }),
  ...displaySectionVarbsProp("loan", {
    loanTotalDollars: dollars("Total loan amount"),
    closingCosts: dollars("Closing Costs"),
    wrappedInLoan: dollars("Extras wrapped in loan"),
    loanBaseDollarsEditor: dollars("Base loan amount"),
    mortgageInsUpfront: dollars("Upfront mortgage insurance"),
    mortgageInsOngoingEditor: displayVarbS.dollarsMonthly("Mortgage insurance"),
    mortgageInsUpfrontEditor: dollars("Upfront mortgage insurance"),
    ...displayVarbsS.switch(
      "loanBase",
      "dollarsPercentDecimal",
      "Base loan amount"
    ),
    ...displayVarbsS.switch(
      "interestRateDecimal",
      "ongoing",
      "Interest rate decimal",
      { targets: optionsS.decimal }
    ),
    ...displayVarbsS.switch("interestRatePercent", "ongoing", "Interest rate", {
      targets: optionsS.percent,
    }),
    ...ongoingDollars("piFixedStandard", "Principal and interest"),
    ...ongoingDollars("interestOnlySimple", "Interest"),
    ...ongoingDollars("expenses", "Expenses"),
    ...displayVarbsS.monthsYears("loanTerm", "Loan term"),
    ...ongoingDollars("loanPayment", "Loan payment"),
    ...ongoingDollars("mortgageIns", "Mortgage insurance"),
  }),
  ...displaySectionVarbsProp("mgmt", {
    ...ongoingDollars("basePayDollars", "Base pay"),
    basePayDollarsEditor: displayVarbS.dollarsMonthly("Base pay"),
    basePayPercentEditor: displayVarbS.percent("Base pay percent of rent"),

    ...displayVarbsS.switch(
      "vacancyLossDollars",
      "dollarsPercentDecimal",
      "vacancyLoss"
    ),
    vacancyLossDollarsEditor: displayVarbS.dollarsMonthly("Vacancy loss"),
    vacancyLossPercentEditor: displayVarbS.percent("Vacancy rate"),

    upfrontExpenses: dollars("Upfront expenses"),
    ...ongoingDollars("expenses", "Expenses"),
  }),
  ...displaySectionVarbsProp("deal", {
    upfrontExpenses: dollars("Upfront expenses"),
    outOfPocketExpenses: dollars("Out of pocket expenses"),
    upfrontRevenue: dollars("Upfront revenue"),
    totalInvestment: dollars("Total investment"),
    downPaymentDollars: dollars("Down payment"),
    downPaymentPercent: displayVarbS.percent("Down payment"),
    downPaymentDecimal: displayVarb("Down payment as decimal"),
    ...ongoingDollars("piti", "PITI payment"),
    ...ongoingDollars("expenses", "Expenses"),
    ...ongoingDollars("revenue", "Revenue"),
    ...ongoingDollars("cashFlow", "Cash Flow"),
    ...displayVarbsS.switch("cocRoiDecimal", "ongoing", "CoC ROI as decimal", {
      targets: optionsS.decimal,
    }),
    ...displayVarbsS.switch("cocRoi", "ongoing", "CoC ROI", {
      targets: optionsS.percent,
    }),
  }),

  ...displaySectionVarbsProp("singleTimeListGroup", {
    total: displayVarbS.dollars("Total"),
  }),
  ...displaySectionVarbsProp("singleTimeValueGroup", {
    total: displayVarbS.dollars("Total"),
  }),
  ...displaySectionVarbsProp("singleTimeValue", {
    value: displayVarbS.dollars(relVarbInfoS.local("displayName")),
    valueEditor: displayVarbS.dollars(relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("singleTimeList", {
    total: displayVarbS.dollars(relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("ongoingValueGroup", {
    ...ongoingDollars("total", relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("ongoingValue", {
    ...ongoingDollars("value", relVarbInfoS.local("displayName")),
    valueEditor: displayVarbS.dollars(relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("ongoingListGroup", {
    ...ongoingDollars("total", relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("ongoingList", {
    ...ongoingDollars("total", relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("singleTimeItem", {
    value: displayVarbS.dollars(relVarbInfoS.local("displayName")),
    valueEditor: displayVarbS.dollars(relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("ongoingItem", {
    ...ongoingDollars("value", relVarbInfoS.local("displayName")),
    ...displayVarbsS.monthsYears("lifespan", "Lifespan"),
    costToReplace: displayVarbS.dollars("Cost to replace"),
    valueEditor: displayVarbS.dollars("Item cost"),
  }),
};

// export const relSwitchVarbs = {
//   ongoing: ongoingVarb,
//   dollarsPercentDecimal: new RelSwitchVarb({
//     targets: {
//       dollars: targetCore({
//         startAdornment: "$",
//         varbNameEnding: "Dollars",
//         displayNameEnd: " dollars",
//       }),
//       percent: targetCore({
//         endAdornment: "%",
//         varbNameEnding: "Percent",
//         displayNameEnd: " percent",
//       } as const),
//       decimal: targetCore({
//         varbNameEnding: "Decimal",
//         displayNameEnd: " decimal",
//       } as const),
//     },
//     switch: {
//       varbNameEnding: "UnitSwitch",
//     },
//   }),
//   dollarsPercent: new RelSwitchVarb({
//     targets: {
//       percent: targetCore({
//         endAdornment: "%",
//         varbNameEnding: "Percent",
//         displayNameEnd: " percent",
//       } as const),
//       dollars: targetCore({
//         startAdornment: "$",
//         varbNameEnding: "Dollars",
//         displayNameEnd: " dollars",
//       }),
//     },
//     switch: {
//       varbNameEnding: "UnitSwitch",
//     },
//   }),
//   percent: new RelSwitchVarb({
//     targets: {
//       percent: targetCore({
//         endAdornment: "%",
//         varbNameEnding: "Percent",
//         displayNameEnd: " percent",
//       } as const),
//     },
//     switch: {
//       varbNameEnding: "UnitSwitch",
//     },
//   }),
//   monthsYears: new RelSwitchVarb({
//     targets: {
//       months: targetCore({
//         endAdornment: "months",
//         varbNameEnding: "Months",
//         displayNameEnd: " months",
//       }),
//       years: targetCore({
//         endAdornment: "years",
//         varbNameEnding: "Years",
//         displayNameEnd: " years",
//       }),
//     },
//     switch: {
//       varbNameEnding: "SpanSwitch",
//     },
//   }),
// };
