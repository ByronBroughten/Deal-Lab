import {
  displayVarbOptions,
  displayVarbOptionsS,
  displayVarbS,
} from "./allDisplaySectionVarbs/displayVarb";
import { displayVarbsS } from "./allDisplaySectionVarbs/displayVarbs";
import { VarbName } from "./baseSectionsDerived/baseSectionsVarbsTypes";
import {
  displaySectionVarbs,
  DisplaySectionVarbs,
  displaySectionVarbsProp,
} from "./displaySectionVarbs/displaySectionVarbs";
import {
  DisplayName,
  DisplayVarb,
  displayVarb,
} from "./displaySectionVarbs/displayVarb";
import { relVarbInfoS } from "./SectionInfo/RelVarbInfo";
import { SectionName, sectionNames } from "./SectionName";

// Ok. What is the optimal way to do this?

// class DisplaySectionVarbs
// - allBaseSectionVarbs
// - sectionName
// *options (generic)

type AllDisplaySectionVarbsGeneric = {
  [SN in SectionName]: DisplaySectionVarbs<SN>;
};

function allDefaultDisplaySectionVarbs(): AllDisplaySectionVarbsGeneric {
  return sectionNames.reduce((defaults, sectionName) => {
    (defaults as any)[sectionName] = displaySectionVarbs(sectionName);
    return defaults;
  }, {} as AllDisplaySectionVarbsGeneric);
}

const dollars = displayVarbS.dollars;
const ongoingDollars = <BN extends string>(
  baseName: BN,
  displayName: DisplayName
) => displayVarbsS.ongoingDollars(baseName, displayName);
const ongoingInputDollars = <BN extends string>(
  baseName: BN,
  displayName: DisplayName
) => displayVarbsS.ongoingInputDollars(baseName, displayName);

const display = displayVarbOptions;
export const allDisplaySectionVarbs = {
  ...allDefaultDisplaySectionVarbs(),
  ...displaySectionVarbsProp("property", {
    price: display("Purchase price"),
    sqft: display("Square feet"),
    arv: display("ARV"),
    sellingCosts: display("Selling costs"),
    numUnits: display("Unit count"),
    numBedrooms: display("Bedrooms"),
    upfrontExpenses: display("Upfront expenses"),
    upfrontRevenue: display("Upfront revenues"),
    ...displayVarbsS.monthsYears("holdingPeriod", "Holding period"),
    ...ongoingInputDollars("taxes", "Taxes"),
    ...ongoingInputDollars("homeIns", "Home Insurance"),
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
      { targets: displayVarbOptionsS.decimal }
    ),
    ...displayVarbsS.switch("interestRatePercent", "ongoing", "Interest rate", {
      targets: displayVarbOptionsS.percent,
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
      targets: displayVarbOptionsS.decimal,
    }),
    ...displayVarbsS.switch("cocRoi", "ongoing", "CoC ROI", {
      targets: displayVarbOptionsS.percent,
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

export function getDisplayVarb<SN extends SectionName, VN extends VarbName<SN>>(
  sectionName: SN,
  varbName: VN
): DisplayVarb {
  const sectionVarbs = allDisplaySectionVarbs[sectionName];
  return (sectionVarbs as any)[varbName] as DisplayVarb;
}

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
