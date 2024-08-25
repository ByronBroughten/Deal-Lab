import { relVarbInfoS } from "../StateGetters/Identifiers/RelVarbInfo";
import {
  DisplaySectionVarbs,
  displaySectionVarbs,
  displaySectionVarbsProp,
} from "./allDisplaySectionVarbs/displaySectionVarbs";
import {
  DisplayName,
  DisplayVarb,
  displayVarbOptions,
} from "./allDisplaySectionVarbs/displayVarb";
import {
  displayGroup,
  displayVarbsS,
  editorDisplayGroup,
} from "./allDisplaySectionVarbs/displayVarbs";
import { VarbName } from "./derivedFromBaseSchemas/baseSectionsVarbsTypes";
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

const periodicDollars = <BN extends string>(
  baseName: BN,
  displayName: DisplayName
) => displayVarbsS.periodicDollars(baseName, displayName);
const ongoingInputDollars = <BN extends string>(
  baseName: BN,
  displayName: DisplayName
) => displayVarbsS.ongoingInputDollars(baseName, displayName);

const varb = displayVarbOptions;
const group = displayGroup;
export const allDisplaySectionVarbs = {
  ...allDefaultDisplaySectionVarbs(),
  ...displaySectionVarbsProp(
    "utilityValue",
    group("periodic", "valueDollars", "Utilities")
  ),
  ...displaySectionVarbsProp(
    "taxesValue",
    editorDisplayGroup("periodicInput", "valueDollars", "Taxes")
  ),
  ...displaySectionVarbsProp(
    "homeInsValue",
    editorDisplayGroup("periodicInput", "valueDollars", "Home insurance")
  ),
  ...displaySectionVarbsProp("property", {
    likability: varb("Likability", { endAdornment: "/10" }),
    ...editorDisplayGroup(
      "monthsYearsInput",
      "holdingPeriod",
      "Holding period"
    ),
    ...editorDisplayGroup("periodicInput", "taxesOngoing", "Taxes"),
    ...editorDisplayGroup("periodicInput", "taxesHolding", "Taxes"),
    ...editorDisplayGroup("periodicInput", "homeInsOngoing", "Home insurance"),
    ...editorDisplayGroup("periodicInput", "homeInsHolding", "Home insurance"),
    ...editorDisplayGroup("periodicInput", "utilitiesOngoing", "Utilities"),
    ...editorDisplayGroup("periodicInput", "targetRent", "Rental income"),
    ...periodicDollars("expensesOngoing", "Average expenses"),
    ...periodicDollars("miscOngoingRevenue", "Misc revenue"),
    ...periodicDollars("revenueOngoing", "Revenue"),
  }),
  ...displaySectionVarbsProp("repairValue"),
  ...displaySectionVarbsProp("unit", {
    ...ongoingInputDollars("targetRent", "Rent"),
  }),
  ...displaySectionVarbsProp("financing", {
    ...editorDisplayGroup(
      "monthsYearsInput",
      "timeTillRefinance",
      "Time till refinance"
    ),
    ...group("periodic", "loanPayment", "Loan payments"),
    ...group("periodic", "loanExpenses", "Ongoing expenses"),
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
    ...periodicDollars("interestOnlySimple", "Interest"),
    ...periodicDollars("expenses", "Expenses"),
    ...periodicDollars("loanPayment", "Loan payment"),

    loanTotalDollars: varb("Total loan amount"),
    closingCosts: varb("Closing Costs"),

    mortgageInsUpfront: varb("Upfront mortgage insurance"),
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
  ...displaySectionVarbsProp("numVarbItem", {
    value: varb(relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("deal", {
    valueAddProfit: varb("Value add profit"),
    valueAddRoiPercent: varb("Value add ROI"),
    valueAddRoiPercentAnnualized: varb("Value add ROI Annualized"),
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
    ...group("periodic", "expensesOngoing", "Average deal costs", {
      targets: { displayNameWithSection: "Average deal costs" },
      monthly: {
        displayNameWithVariant: "Average costs monthly",
        displayNameFullContext: "Average deal costs monthly",
      },
      yearly: {
        displayNameWithVariant: "Average costs yearly",
        displayNameFullContext: "Average deal costs Yearly",
      },
    }),
  }),
  ...displaySectionVarbsProp("onetimeList", {
    total: varb(relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("periodicList", {
    ...group("periodic", "total", relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("onetimeItem", {
    valueDollars: varb(relVarbInfoS.local("displayName")),
    valueDollarsEditor: varb(relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("miscPeriodicValue", {
    ...editorDisplayGroup("periodicInput", "valueDollars", "Misc"),
  }),
  ...displaySectionVarbsProp("capExValue", {
    ...editorDisplayGroup("periodicInput", "valueDollars", "CapEx"),
  }),
  ...displaySectionVarbsProp("capExItem", {
    ...editorDisplayGroup("periodicInput", "valueDollars", "CapEx Item"),
    ...editorDisplayGroup("monthsYearsInput", "lifespan", "CapEx Item"),
  }),
  ...displaySectionVarbsProp("maintenanceValue", {
    ...editorDisplayGroup("periodicInput", "valueDollars", "Maintenance"),
  }),
  ...displaySectionVarbsProp("utilityValue", {
    ...editorDisplayGroup("periodicInput", "valueDollars", "Utilities"),
  }),
  ...displaySectionVarbsProp(
    "periodicItem",
    editorDisplayGroup(
      "periodicInput",
      "valueDollars",
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
