import {
  displayVarbOptions,
  displayVarbOptionsS,
  displayVarbS,
} from "./allDisplaySectionVarbs/displayVarb";
import {
  displayGroup,
  displayVarbsS,
  editorDisplayGroup,
} from "./allDisplaySectionVarbs/displayVarbs";
import { VarbName } from "./baseSectionsDerived/baseSectionsVarbsTypes";
import {
  displaySectionVarbs,
  DisplaySectionVarbs,
  displaySectionVarbsProp,
} from "./displaySectionVarbs/displaySectionVarbs";
import { DisplayName, DisplayVarb } from "./displaySectionVarbs/displayVarb";
import { relVarbInfoS } from "./SectionInfo/RelVarbInfo";
import { SectionName, sectionNames } from "./SectionName";

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
    ...displayGroup("monthsYears", "holdingPeriod", "Holding period"),
    ...ongoingInputDollars("taxes", "Taxes"),
    ...ongoingInputDollars("homeIns", "Home Insurance"),
    ...ongoingDollars("targetRent", "Rent"),
    ...ongoingDollars("expenses", "Expenses"),
    ...ongoingDollars("miscRevenue", "Misc revenue"),
    ...ongoingDollars("revenue", "Revenue"),
  }),
  ...displaySectionVarbsProp("unit", {
    numBedrooms: display("Bedrooms"),
    ...ongoingInputDollars("targetRent", "Rent"),
  }),
  ...displaySectionVarbsProp("calculatedVarbs", {
    onePercentPrice: display("1% Purchase Price"),
    twoPercentPrice: display("2% Purchase Price"),
  }),
  ...displaySectionVarbsProp("financing", {
    ...displayGroup("ongoing", "loanPayment", "Loan Payments"),
    loanTotalDollars: display("Loan total"),
  }),
  ...displaySectionVarbsProp("loan", {
    ...editorDisplayGroup("monthsYearsInput", "loanTerm", "Loan term"),
    ...displayGroup("dollarsPercentDecimal", "loanBase", "Base loan amount"),
    loanBaseDollarsEditor: display("Base loan amount"),
    loanBasePercentEditor: display("base loan amount"),
    ...editorDisplayGroup(
      "ongoingInput",
      "interestRatePercent",
      "Interest rate"
    ),
    ...displayGroup("ongoing", "interestRateDecimal", "Interest rate decimal"),

    ...displayGroup("ongoing", "piFixedStandard", "Principal and interest"),
    ...ongoingDollars("interestOnlySimple", "Interest"),
    ...ongoingDollars("expenses", "Expenses"),
    ...ongoingDollars("loanPayment", "Loan payment"),

    loanTotalDollars: dollars("Total loan amount"),
    closingCosts: dollars("Closing Costs"),
    wrappedInLoan: dollars("Extras wrapped in loan"),

    mortgageInsUpfront: dollars("Upfront mortgage insurance"),
    mortgageInsUpfrontEditor: dollars("Upfront mortgage insurance"),
    ...editorDisplayGroup("ongoingInput", "mortgageIns", "Mortgage insurance"),
  }),
  ...displaySectionVarbsProp("mgmt", {
    ...ongoingDollars("basePayDollars", "Base pay"),
    basePayDollarsEditor: displayVarbS.dollarsMonthly("Base pay"),
    basePayPercentEditor: displayVarbS.percent("Base pay percent of rent"),
    ...displayGroup(
      "dollarsPercentDecimal",
      "vacancyLossDollars",
      "vacancyLoss"
    ),
    vacancyLossDollarsEditor: displayVarbS.dollarsMonthly("Vacancy loss"),
    vacancyLossPercentEditor: displayVarbS.percent("Vacancy rate"),

    upfrontExpenses: dollars("Upfront expenses"),
    ...ongoingDollars("expenses", "Expenses"),
  }),
  ...displaySectionVarbsProp("deal", {
    upfrontExpenses: display("Upfront expenses"),
    outOfPocketExpenses: display("Out of pocket expenses"),
    upfrontRevenue: display("Upfront revenue"),
    totalInvestment: display("Total investment"),
    downPaymentDollars: display("Down payment"),
    downPaymentPercent: display("Down payment"),
    downPaymentDecimal: display("Down payment as decimal"),

    ...ongoingDollars("piti", "PITI payment"),
    ...ongoingDollars("expenses", "Expenses"),
    ...ongoingDollars("revenue", "Revenue"),
    ...ongoingDollars("cashFlow", "Cash Flow"),
    ...displayGroup("ongoing", "cocRoiDecimal", "CoC ROI as decimal", {
      targets: displayVarbOptionsS.decimal,
    }),
    ...displayGroup("ongoing", "cocRoi", "CoC ROI", {
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
  ...displaySectionVarbsProp(
    "ongoingValue",
    displayGroup("ongoingInput", "value", relVarbInfoS.local("displayName"))
  ),
  ...displaySectionVarbsProp("ongoingListGroup", {
    ...displayGroup("ongoing", "total", relVarbInfoS.local("displayName")),
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
    ...displayGroup("monthsYearsInput", "lifespan", "Lifespan"),
    costToReplace: dollars("Cost to replace"),
    valueEditor: dollars("Item cost"), // That's not great
  }),
};

export function getDisplayVarb<SN extends SectionName, VN extends VarbName<SN>>(
  sectionName: SN,
  varbName: VN
): DisplayVarb {
  const sectionVarbs = allDisplaySectionVarbs[sectionName];
  return (sectionVarbs as any)[varbName] as DisplayVarb;
}

export function fullDisplayNameString<
  SN extends SectionName,
  VN extends VarbName<SN>
>(sectionName: SN, varbName: VN): string {
  const { displayNameFullContext } = getDisplayVarb(sectionName, varbName);

  if (typeof displayNameFullContext === "string") {
    return displayNameFullContext;
  } else {
    throw new Error(
      "Varbs that can be used here should have a string displayName"
    );
  }
}
