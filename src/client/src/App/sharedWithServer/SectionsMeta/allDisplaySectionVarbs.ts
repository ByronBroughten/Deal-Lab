import { Obj } from "../utils/Obj";
import {
  sectionVarbNames,
  VarbName,
} from "./baseSectionsDerived/baseSectionsVarbsTypes";
import {
  SwitchName,
  SwitchVarbName,
} from "./baseSectionsVarbs/baseSwitchNames";
import { switchNames } from "./baseSectionsVarbs/RelSwitchVarb";
import { RelLocalVarbInfo, relVarbInfoS } from "./SectionInfo/RelVarbInfo";
import { SectionName, sectionNames } from "./SectionName";

export type DisplayName = string | RelLocalVarbInfo;

type DisplaySectionVarbGeneric = {
  displayName: DisplayName;
  displayNameStart: string;
  displayNameEnd: string;
  startAdornment: string;
  endAdornment: string;
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
  dollars: { startAdornment: "$" },
  monthly: { endAdornment: "/month" },
  yearly: { endAdornment: "/year" },
  percent: { endAdornment: "%" },
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
      endAdornment: "/year",
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
    monthly: {
      ...optionsS.monthly,
      ...optionsS.dollars,
    },
    yearly: {
      ...optionsS.yearly,
      ...optionsS.dollars,
    },
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
    };
  },
} as const);

type Ongoing<BN extends string> = Record<
  SwitchVarbName<BN, "ongoing">,
  DisplaySectionVarbGeneric
>;

type SwitchDisplayVarb<BN extends string, SN extends SwitchName> = Record<
  SwitchVarbName<BN, SN>,
  DisplaySectionVarbGeneric
>;

const displayVarbsS = {
  switch<BN extends string, SN extends SwitchName>(
    baseName: BN,
    switchName: SN,
    displayName: DisplayName
  ): SwitchDisplayVarb<BN, SN> {
    const names = switchNames(baseName, switchName);
    const displayProps = switchDisplayVarbProps[switchName];
    const switchKeys = Obj.keys(names);
    return switchKeys.reduce((varbs, key) => {
      const options = key in displayProps ? (displayProps as any)[key] : {};
      (varbs as any)[names[key]] = {
        ...defaultDisplayVarb(displayName),
        ...options,
      };
      return varbs;
    }, {} as SwitchDisplayVarb<BN, SN>);
  },
  ongoing<BN extends string>(
    baseName: BN,
    displayName: DisplayName
  ): SwitchDisplayVarb<BN, "ongoing"> {
    return this.switch(baseName, "ongoing", displayName);
  },
  monthsYears<BN extends string>(
    baseName: BN,
    displayName: DisplayName
  ): SwitchDisplayVarb<BN, "monthsYears"> {
    return this.switch(baseName, "monthsYears", displayName);
  },
};

const dollars = displayVarbS.dollars;
const ongoing = <BN extends string>(baseName: BN, displayName: DisplayName) =>
  displayVarbsS.ongoing(baseName, displayName);

export const displaySectionVarbs = {
  ...allDefaultDisplaySectionVarbs,
  ...displaySectionVarbsProp("property", {
    price: dollars("Purchase price"),
    sqft: displayVarb("Square feet"),
    arv: dollars("ARV"),
    sellingCosts: dollars("Selling costs"),
    numUnits: displayVarb("Unit count"),
    numBedrooms: displayVarb("Bedroom count"),
    upfrontExpenses: dollars("Upfront expenses"),
    upfrontRevenue: dollars("Upfront revenues"),
    ...displayVarbsS.monthsYears("holdingPeriod", "Holding period"),
    ...ongoing("taxes", "Taxes"),
    ...ongoing("homeIns", "Home Insurance"),
    ...ongoing("targetRent", "Rent"),
    ...ongoing("expenses", "Expenses"),
    ...ongoing("miscRevenue", "Misc revenue"),
    ...ongoing("revenue", "Revenue"),
  }),
  ...displaySectionVarbsProp("unit", {
    numBedrooms: displayVarb("Bedroom count"),
    ...ongoing("targetRent", "Rent"),
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
    ...ongoing("interestRateDecimal", "Interest rate as decimal"),
    ...ongoing("interestRatePercent", "Interest rate"),
    ...ongoing("piFixedStandard", "Principal and interest"),
    ...ongoing("interestOnlySimple", "Interest"),
    ...ongoing("expenses", "Expenses"),
    ...displayVarbsS.monthsYears("loanTerm", "Loan term"),
    ...ongoing("loanPayment", "Loan payment"),
    ...ongoing("mortgageIns", "Mortgage insurance"),
  }),
  ...displaySectionVarbsProp("mgmt", {
    ...ongoing("basePayDollars", "Base pay"),
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
    ...ongoing("expenses", "Expenses"),
  }),
  ...displaySectionVarbsProp("deal", {
    upfrontExpenses: dollars("Upfront expenses"),
    outOfPocketExpenses: dollars("Out of pocket expenses"),
    upfrontRevenue: dollars("Upfront revenue"),
    totalInvestment: dollars("Total investment"),
    downPaymentDollars: dollars("Down payment"),
    downPaymentPercent: displayVarbS.percent("Down payment"),
    downPaymentDecimal: displayVarb("Down payment as decimal"),
    ...ongoing("piti", "PITI payment"),
    ...ongoing("expenses", "Expenses"),
    ...ongoing("revenue", "Revenue"),
    ...ongoing("cashFlow", "Cash Flow"),
    ...ongoing("cocRoiDecimal", "CoC ROI as decimal"),
    ...ongoing("cocRoi", "CoC ROI"),
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
    ...displayVarbsS.ongoing("total", relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("ongoingValue", {
    ...displayVarbsS.ongoing("value", relVarbInfoS.local("displayName")),
    valueEditor: displayVarbS.dollars(relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("ongoingListGroup", {
    ...displayVarbsS.ongoing("total", relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("ongoingList", {
    ...displayVarbsS.ongoing("total", relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("singleTimeItem", {
    value: displayVarbS.dollars(relVarbInfoS.local("displayName")),
    valueEditor: displayVarbS.dollars(relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("ongoingItem", {
    ...displayVarbsS.ongoing("value", relVarbInfoS.local("displayName")),
    ...displayVarbsS.monthsYears("lifespan", "Lifespan"),
    costToReplace: displayVarbS.dollars("Cost to replace"),
    valueEditor: displayVarbS.dollars("Item cost"),
  }),
};
