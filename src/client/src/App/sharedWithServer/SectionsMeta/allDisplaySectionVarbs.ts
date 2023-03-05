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
import {
  DisplayName,
  DisplayVarb,
  displayVarbOptions,
} from "./displaySectionVarbs/displayVarb";
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

const ongoingDollars = <BN extends string>(
  baseName: BN,
  displayName: DisplayName
) => displayVarbsS.ongoingDollars(baseName, displayName);
const ongoingInputDollars = <BN extends string>(
  baseName: BN,
  displayName: DisplayName
) => displayVarbsS.ongoingInputDollars(baseName, displayName);

const varb = displayVarbOptions;
const group = displayGroup;
export const allDisplaySectionVarbs = {
  ...allDefaultDisplaySectionVarbs(),
  ...displaySectionVarbsProp("property", {
    purchasePrice: varb("Purchase price"),
    sqft: varb("Square feet"),
    afterRepairValue: varb("ARV"),
    sellingCosts: varb("Selling costs"),
    numUnits: varb("Unit count"),
    numBedrooms: varb("Bedrooms"),
    upfrontExpenses: varb("Upfront expenses"),
    upfrontRevenue: varb("Upfront revenues"),
    ...group("monthsYears", "holdingPeriod", "Holding period"),
    ...group("ongoingInput", "taxes", "Taxes", {
      monthly: { displayNameWithVariant: "Taxes monthly" },
      yearly: { displayNameWithVariant: "Taxes yearly" },
    }),
    ...group("ongoingInput", "homeIns", "Home insurance", {
      monthly: { displayNameWithVariant: "Home insurance monthly" },
      yearly: { displayNameWithVariant: "Home insurance yearly" },
    }),
    ...group("ongoing", "targetRent", "Rent", {
      monthly: { displayNameWithVariant: "Rent monthly" },
      yearly: { displayNameWithVariant: "Rent yearly" },
    }),
    ...ongoingDollars("expenses", "Expenses"),
    ...ongoingDollars("miscRevenue", "Misc revenue"),
    ...ongoingDollars("revenue", "Revenue"),
  }),
  ...displaySectionVarbsProp("unit", {
    numBedrooms: varb("Bedrooms"),
    ...ongoingInputDollars("targetRent", "Rent"),
  }),
  ...displaySectionVarbsProp("calculatedVarbs", {
    onePercentPrice: varb("1% Purchase Price"),
    twoPercentPrice: varb("2% Purchase Price"),
    ...group("ongoing", "fivePercentRent", "5% Rent", {
      monthly: { displayNameWithVariant: "5% Rent monthly" },
      yearly: { displayNameWithVariant: "5% Rent yearly" },
    }),
  }),
  ...displaySectionVarbsProp("financing", {
    ...group("ongoing", "loanPayment", "Loan Payments", {
      monthly: { displayNameWithVariant: "Monthly loan payments" },
      yearly: { displayNameWithVariant: "Yearly loan payments" },
    }),
    loanTotalDollars: varb("Loan total"),
  }),
  ...displaySectionVarbsProp("loan", {
    ...editorDisplayGroup("monthsYearsInput", "loanTerm", "Loan term"),
    ...group("dollarsPercentDecimal", "loanBase", "Base loan amount"),
    loanBaseDollarsEditor: varb("Base loan amount"),
    loanBasePercentEditor: varb("base loan amount"),
    ...editorDisplayGroup(
      "ongoingInput",
      "interestRatePercent",
      "Interest rate"
    ),
    ...group("ongoing", "interestRateDecimal", "Interest rate decimal"),

    ...group("ongoing", "piFixedStandard", "Principal and interest"),
    ...ongoingDollars("interestOnlySimple", "Interest"),
    ...ongoingDollars("expenses", "Expenses"),
    ...ongoingDollars("loanPayment", "Loan payment"),

    loanTotalDollars: varb("Total loan amount"),
    closingCosts: varb("Closing Costs"),
    wrappedInLoan: varb("Extras wrapped in loan"),

    mortgageInsUpfront: varb("Upfront mortgage insurance"),
    mortgageInsUpfrontEditor: varb("Upfront mortgage insurance"),
    ...editorDisplayGroup("ongoingInput", "mortgageIns", "Mortgage insurance"),
  }),
  ...displaySectionVarbsProp("mgmt", {
    basePayDollarsEditor: varb("Base pay"),
    ...group("ongoing", "basePayDollars", "Base pay", {
      targets: { displayNameWithSection: "Management base pay" },
      monthly: {
        displayNameWithVariant: "Base pay monthly",
        displayNameFullContext: "Management base pay monthly",
      },
      yearly: {
        displayNameWithVariant: "Base pay yearly",
        displayNameFullContext: "Management base pay yearly",
      },
    }),
    basePayPercentEditor: varb("Base pay percent of rent"),
    ...group("dollarsPercentDecimal", "vacancyLoss", "Vacancy loss", {
      dollars: { displayNameWithVariant: "Base pay dollars" },
      percent: { displayNameWithVariant: "Base pay percent" },
    }),
    vacancyLossDollarsEditor: varb("Vacancy loss"),
    vacancyLossPercentEditor: varb("Vacancy rate"),
    upfrontExpenses: varb("Upfront expenses"),
    ...group("ongoing", "expenses", "Expenses", {
      targets: { displayNameWithSection: "Management expenses" },
      monthly: {
        displayNameWithVariant: "Expenses monthly",
        displayNameFullContext: "Monthly management expenses",
      },
      yearly: {
        displayNameWithVariant: "Expenses yearly",
        displayNameFullContext: "Yearly management expenses",
      },
    }),
  }),
  ...displaySectionVarbsProp("userVarbItem", {
    value: varb(relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("deal", {
    upfrontExpenses: varb("Upfront expenses"),
    outOfPocketExpenses: varb("Out of pocket expenses"),
    upfrontRevenue: varb("Upfront revenue"),
    totalInvestment: varb("Total investment"),
    ...group("dollarsPercentDecimal", "downPayment", "Down payment", {
      dollars: { displayNameWithVariant: "Down payment" },
      percent: { displayNameWithVariant: "Down payment percent" },
      decimal: { displayNameWithVariant: "Down payment as decimal" },
    }),
    ...group("ongoing", "piti", "PITI payment", {
      monthly: { displayNameWithVariant: "Monthly PITI payment" },
      yearly: { displayNameWithVariant: "Yearly PITI payment" },
    }),
    ...group("ongoing", "cashFlow", "Cash flow", {
      monthly: { displayNameWithVariant: "Cash flow monthly" },
      yearly: { displayNameWithVariant: "Cash flow yearly" },
    }),
    ...group("ongoing", "cocRoi", "CoC ROI", {
      monthly: { displayNameWithVariant: "CoC ROI monthly" },
      yearly: { displayNameWithVariant: "CoC ROI yearly" },
    }),
    ...group("ongoing", "cocRoiDecimal", "CoC ROI as decimal", {
      monthly: { displayNameWithVariant: "Monthly CoC ROI as decimal" },
      yearly: { displayNameWithVariant: "Yearly CoC ROI as decimal" },
    }),
    ...group("ongoing", "expenses", "Expenses", {
      targets: { displayNameWithSection: "Deal expenses" },
      monthly: {
        displayNameWithVariant: "Expenses monthly",
        displayNameFullContext: "Monthly deal expenses",
      },
      yearly: {
        displayNameWithVariant: "Expenses yearly",
        displayNameFullContext: "Yearly deal expenses",
      },
    }),
    ...group("ongoing", "revenue", "Revenue", {
      targets: { displayNameWithSection: "Deal revenue" },
      monthly: {
        displayNameWithVariant: "Revenue monthly",
        displayNameFullContext: "Monthly deal revenue",
      },
      yearly: {
        displayNameWithVariant: "Revenue yearly",
        displayNameFullContext: "Yearly deal revenue",
      },
    }),
  }),

  ...displaySectionVarbsProp("singleTimeListGroup", {
    total: varb("Total"),
  }),
  ...displaySectionVarbsProp("singleTimeValueGroup", {
    total: varb("Total"),
  }),
  ...displaySectionVarbsProp("singleTimeValue", {
    value: varb(relVarbInfoS.local("displayName")),
    valueEditor: varb(relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("singleTimeList", {
    total: varb(relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("ongoingValueGroup", {
    ...ongoingDollars("total", relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp(
    "ongoingValue",
    group("ongoingInput", "value", relVarbInfoS.local("displayName"))
  ),
  ...displaySectionVarbsProp("ongoingListGroup", {
    ...group("ongoing", "total", relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("ongoingList", {
    ...ongoingDollars("total", relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("singleTimeItem", {
    // Why isn't this working?
    value: varb(relVarbInfoS.local("displayName")),
    valueEditor: varb(relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("ongoingItem", {
    ...group("ongoing", "value", relVarbInfoS.local("displayName")),
    valueEditor: varb("Item cost"), // That's not great
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
