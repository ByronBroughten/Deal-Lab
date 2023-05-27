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
  ...displaySectionVarbsProp("utilityValue", {
    ...group("periodic", "valueDollars", "Utilities", {
      monthly: { displayNameWithVariant: "Utilities monthly" },
      yearly: { displayNameWithVariant: "Utilities yearly" },
    }),
  }),
  ...displaySectionVarbsProp("taxesOngoing", {
    ...editorDisplayGroup("periodicInput", "valueDollars", "Taxes", {
      monthly: { displayNameWithVariant: "Taxes monthly" },
      yearly: { displayNameWithVariant: "Taxes yearly" },
    }),
  }),
  ...displaySectionVarbsProp("homeInsOngoing", {
    ...editorDisplayGroup("periodicInput", "valueDollars", "Home insurance", {
      monthly: { displayNameWithVariant: "Home insurance monthly" },
      yearly: { displayNameWithVariant: "Home insurance yearly" },
    }),
  }),
  ...displaySectionVarbsProp("property", {
    purchasePrice: varb("Purchase price"),
    afterRepairValue: varb("After repair value"),
    sellingCosts: varb("Selling costs"),
    sqft: varb("Square feet"),
    rehabCost: varb("Rehab cost"),
    rehabCostBase: varb("Rehab cost base"),
    numUnits: varb("Unit count"),
    numBedroomsEditor: varb("Bedroom count"),
    ...editorDisplayGroup(
      "monthsYearsInput",
      "holdingPeriod",
      "Holding period",
      {
        months: { displayNameWithVariant: "Holding period months" },
        years: { displayNameWithVariant: "Holding period years" },
      }
    ),

    numUnitsEditor: varb("Unit count"),
    numBedrooms: varb("Bedrooms"),
    upfrontExpenses: varb("Upfront expenses"),
    ...editorDisplayGroup("periodicInput", "taxesOngoing", "Taxes", {
      monthly: { displayNameWithVariant: "Taxes monthly" },
      yearly: { displayNameWithVariant: "Taxes yearly" },
    }),
    ...editorDisplayGroup("periodicInput", "taxesHolding", "Taxes", {
      monthly: { displayNameWithVariant: "Taxes monthly" },
      yearly: { displayNameWithVariant: "Taxes yearly" },
    }),
    ...editorDisplayGroup("periodicInput", "homeInsOngoing", "Home insurance", {
      monthly: { displayNameWithVariant: "Home insurance monthly" },
      yearly: { displayNameWithVariant: "Home insurance yearly" },
    }),
    ...editorDisplayGroup("periodicInput", "homeInsHolding", "Home insurance", {
      monthly: { displayNameWithVariant: "Home insurance monthly" },
      yearly: { displayNameWithVariant: "Home insurance yearly" },
    }),
    ...editorDisplayGroup("periodicInput", "utilitiesOngoing", "Utilities", {
      monthly: { displayNameWithVariant: "Utilities monthly" },
      yearly: { displayNameWithVariant: "Utilities yearly" },
    }),
    ...editorDisplayGroup("periodicInput", "targetRent", "Rental income", {
      monthly: { displayNameWithVariant: "Rental income monthly" },
      yearly: { displayNameWithVariant: "Rental income yearly" },
    }),
    ...ongoingDollars("expenses", "Ongoing expenses"),
    ...ongoingDollars("miscRevenue", "Misc revenue"),
    ...ongoingDollars("revenue", "Revenue"),
  }),
  ...displaySectionVarbsProp("repairValue", {
    valueDollarsEditor: varb("Repair cost"),
    valueDollars: varb("Repair cost"),
  }),
  ...displaySectionVarbsProp("unit", {
    numBedrooms: varb("Bedrooms"),
    ...ongoingInputDollars("targetRent", "Rent"),
  }),
  ...displaySectionVarbsProp("financing", {
    ...group("periodic", "loanPayment", "Loan payments", {
      monthly: { displayNameWithVariant: "Monthly loan payments" },
      yearly: { displayNameWithVariant: "Yearly loan payments" },
    }),
    ...group("periodic", "loanExpenses", "Ongoing expenses", {
      monthly: { displayNameWithSection: "Ongoing loan expenses" },
      yearly: { displayNameWithSection: "Ongoing loan expenses" },
    }),
    loanUpfrontExpenses: varb("Upfront expenses", {
      displayNameWithSection: "Upfront loaneExpenses",
    }),
    loanTotalDollars: varb("Loan total"),
  }),
  ...displaySectionVarbsProp("calculatedVarbs", {
    onePercentPrice: varb("1% Purchase price"),
    twoPercentPrice: varb("2% Purchase price"),
    ...group("periodic", "fivePercentRent", "5% Rent", {
      monthly: { displayNameWithVariant: "5% Rent monthly" },
      yearly: { displayNameWithVariant: "5% Rent yearly" },
    }),
  }),
  ...displaySectionVarbsProp("loanBaseValue", {
    valueDollars: varb("Base loan amount"),
    valueDollarsEditor: varb("Base loan amount"),
  }),
  ...displaySectionVarbsProp("loan", {
    ...editorDisplayGroup("monthsYearsInput", "loanTerm", "Loan term"),
    ...editorDisplayGroup(
      "periodicInput",
      "interestRatePercent",
      "Interest rate"
    ),
    ...group("periodic", "interestRateDecimal", "Interest rate decimal"),
    ...group("periodic", "piFixedStandard", "Principal and interest"),
    ...ongoingDollars("interestOnlySimple", "Interest"),
    ...ongoingDollars("expenses", "Expenses"),
    ...ongoingDollars("loanPayment", "Loan payment"),

    loanTotalDollars: varb("Total loan amount"),
    closingCosts: varb("Closing Costs"),
    wrappedInLoan: varb("Extras wrapped in loan"),

    mortgageInsUpfront: varb("Upfront mortgage insurance"),
    mortgageInsUpfrontEditor: varb("Upfront mortgage insurance"),
    ...editorDisplayGroup("periodicInput", "mortgageIns", "Mortgage insurance"),
  }),
  ...displaySectionVarbsProp("mgmtBasePayValue", {
    valuePercentEditor: varb("Base pay percent of rent"),
    ...editorDisplayGroup("periodicInput", "valueDollars", "Base pay"),
  }),
  ...displaySectionVarbsProp("vacancyLossValue", {
    valuePercentEditor: varb("Vacancy loss percent of rent"),
    ...editorDisplayGroup("periodicInput", "valueDollars", "Vacancy loss"),
  }),
  ...displaySectionVarbsProp("mgmt", {
    ...group("periodic", "basePayDollars", "Base pay", {
      targets: { displayNameWithSection: "Mgmt base pay" },
      monthly: {
        displayNameWithVariant: "Base pay monthly",
        displayNameFullContext: "Mgmt base pay monthly",
      },
      yearly: {
        displayNameWithVariant: "Base pay yearly",
        displayNameFullContext: "Mgmt base pay yearly",
      },
    }),
    vacancyLossPercent: varb("Vacancy loss percent of rent"),
    ...group("periodic", "expenses", "Ongoing expenses", {
      targets: { displayNameWithSection: "Mgmt expenses" },
      monthly: {
        displayNameWithVariant: "Expenses monthly",
        displayNameFullContext: "Monthly mgmt expenses",
      },
      yearly: {
        displayNameWithVariant: "Expenses yearly",
        displayNameFullContext: "Yearly mgmt expenses",
      },
    }),
  }),
  ...displaySectionVarbsProp("purchaseLoanValue", {
    offPercent: varb("Down payment"),
    offDollars: varb("Down payment"),
    amountPercent: varb("Loan to value ratio"),
    amountDollars: varb("Loan amount"),
  }),
  ...displaySectionVarbsProp("repairLoanValue", {
    offPercent: varb("Down payment"),
    offDollars: varb("Down payment"),
    amountPercent: varb("Loan to value ratio"),
    amountDollars: varb("Loan amount"),
  }),
  ...displaySectionVarbsProp("arvLoanValue", {
    offPercent: varb("Down payment"),
    offDollars: varb("Down payment"),
    amountPercent: varb("Loan to value ratio"),
    amountDollars: varb("Loan amount"),
  }),
  ...displaySectionVarbsProp("numVarbItem", {
    value: varb(relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("deal", {
    totalProfit: varb("Total profit"),
    roiPercent: varb("ROI"),
    roiPercentAnnualized: varb("ROI Annualized"),
    totalInvestment: varb("Total investment"),
    ...group("periodic", "ongoingPiti", "PITI payment", {
      monthly: { displayNameWithVariant: "Monthly PITI payment" },
      yearly: { displayNameWithVariant: "Yearly PITI payment" },
    }),
    ...group("periodic", "ongoingLoanPayment", "Loan payment", {
      monthly: { displayNameWithVariant: "Monthly loan payment" },
      yearly: { displayNameWithVariant: "Yearly loan payment" },
    }),
    ...group("periodic", "cashFlow", "Cash flow", {
      monthly: { displayNameWithVariant: "Cash flow monthly" },
      yearly: { displayNameWithVariant: "Cash flow yearly" },
    }),
    ...group("periodic", "cocRoi", "CoC ROI", {
      monthly: { displayNameWithVariant: "CoC ROI monthly" },
      yearly: { displayNameWithVariant: "CoC ROI yearly" },
    }),
    ...group("periodic", "cocRoiDecimal", "CoC ROI as decimal", {
      monthly: { displayNameWithVariant: "Monthly CoC ROI as decimal" },
      yearly: { displayNameWithVariant: "Yearly CoC ROI as decimal" },
    }),
    ...group("periodic", "expenses", "Expenses", {
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
    ...group("periodic", "revenue", "Revenue", {
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
  ...displaySectionVarbsProp("singleTimeValue", {
    value: varb(relVarbInfoS.local("displayName")),
    valueEditor: varb(relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("onetimeList", {
    total: varb(relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp(
    "ongoingValue",
    editorDisplayGroup(
      "periodicInput",
      "value",
      relVarbInfoS.local("displayName")
    )
  ),
  ...displaySectionVarbsProp("ongoingList", {
    ...group("periodic", "total", relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("singleTimeItem", {
    value: varb(relVarbInfoS.local("displayName")),
    valueEditor: varb(relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp(
    "ongoingItem",
    editorDisplayGroup(
      "periodicInput",
      "value",
      relVarbInfoS.local("displayName")
    )
  ),
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
