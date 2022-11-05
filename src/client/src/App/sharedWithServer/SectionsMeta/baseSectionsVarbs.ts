import { omit } from "lodash";
import {
  BaseSection,
  baseSectionVarbs,
  GeneralBaseSectionVarbs,
} from "./baseSectionsVarbs/baseSectionVarbs";
import { baseVarbs, baseVarbsS } from "./baseSectionsVarbs/baseVarbs";
import {
  loanVarbsNotInFinancing,
  savableSectionVarbNames,
} from "./baseSectionsVarbs/specialVarbNames";
import { SectionName, sectionNames } from "./SectionName";

const checkBaseSectionsVarbs = <BSV extends GeneralBaseSectionsVarbs>(
  bsv: BSV
) => bsv;

type GeneralBaseSectionsVarbs = {
  [SN in SectionName]: GeneralBaseSectionVarbs;
};

type DefaultSectionsVarbs = {
  [SN in SectionName]: BaseSection;
};

const defaults = sectionNames.reduce((defaults, sectionName) => {
  defaults[sectionName] = baseSectionVarbs();
  return defaults;
}, {} as DefaultSectionsVarbs);

export type BaseSectionsVarbs = typeof baseSectionsVarbs;
export const baseSectionsVarbs = checkBaseSectionsVarbs({
  ...defaults,
  proxyStoreItem: baseSectionVarbs({
    dbId: "string",
  }),
  hasDummyDisplayStore: baseSectionVarbs({
    ...baseVarbsS.savableSection,
  }),
  displayNameItem: baseSectionVarbs({
    displayName: "string",
  }),
  displayNameList: baseSectionVarbs({
    searchFilter: "string",
  }),
  compareTable: baseSectionVarbs({ titleFilter: "string" } as const),
  tableRow: baseSectionVarbs({
    displayName: "string",
    compareToggle: "boolean",
  }),
  column: baseSectionVarbs({
    valueEntityInfo: "inEntityInfo",
  }),
  cell: baseSectionVarbs({
    columnFeId: "string",
    valueEntityInfo: "inEntityInfo",
    displayVarb: "string",
  }),
  conditionalRow: baseSectionVarbs({
    level: "number",
    type: "string",
    // if
    left: "numObj",
    operator: "string",
    rightList: "stringArray",
    rightValue: "numObj",
    // then
    then: "numObj",
  }),
  singleTimeListGroup: baseSectionVarbs({
    total: "numObj",
    defaultValueSwitch: "string",
  }),
  singleTimeList: baseSectionVarbs({
    ...baseVarbsS.savableSection,
    total: "numObj",
    defaultValueSwitch: "string",
  }),
  ongoingListGroup: baseSectionVarbs({
    ...baseVarbsS.ongoing("total"),
    defaultValueSwitch: "string",
    defaultOngoingSwitch: "string",
  }),
  ongoingList: baseSectionVarbs({
    ...baseVarbsS.savableSection,
    ...baseVarbsS.ongoing("total"),
    defaultValueSwitch: "string",
    defaultOngoingSwitch: "string",
  }),
  userVarbList: baseSectionVarbs({
    ...baseVarbsS.savableSection,
    defaultValueSwitch: "string",
  }),
  outputList: baseSectionVarbs({
    ...baseVarbsS.savableSection,
    defaultValueSwitch: "string",
  }),
  singleTimeItem: baseSectionVarbs({
    ...baseVarbsS.singleValueVirtualVarb,
    ...baseVarbsS.loadableVarb,
    ...baseVarbsS.switchableEquationEditor,
  }),
  ongoingItem: baseSectionVarbs({
    ...baseVarbsS.virtualVarb,
    ...baseVarbsS.loadableVarb,
    ...baseVarbsS.switchableEquationEditor,
    ...baseVarbsS.ongoing("value"),
    ...baseVarbsS.switch("lifespan", "monthsYears"),
    costToReplace: "numObj",
  }),
  outputItem: baseSectionVarbs({
    ...baseVarbsS.singleValueVirtualVarb,
    ...baseVarbsS.loadableVarb,
    ...baseVarbsS.switchableEquationEditor,
  }),
  customVarb: baseSectionVarbs({
    ...baseVarbsS.singleValueVirtualVarb,
    ...baseVarbsS.loadableVarb,
  }),
  userVarbItem: baseSectionVarbs({
    ...baseVarbsS.singleValueVirtualVarb,
    ...baseVarbsS.loadableVarb,
    ...baseVarbsS.switchableEquationEditor,
  }),
  conditionalRowList: baseSectionVarbs({
    value: "numObj",
  }),
  property: baseSectionVarbs({
    ...baseVarbsS.savableSection,
    ...baseVarbs("numObj", [
      "price",
      "sqft",
      "numUnits",
      "numBedrooms",
      "upfrontExpenses",
      "upfrontRevenue",
      // "zipcode",
    ] as const),
    ...baseVarbsS.ongoing("taxes"),
    ...baseVarbsS.ongoing("homeIns"),
    ...baseVarbsS.ongoing("targetRent"),
    ...baseVarbsS.ongoing("expenses"),
    ...baseVarbsS.ongoing("miscRevenue"),
    ...baseVarbsS.ongoing("revenue"),
  }),
  unit: baseSectionVarbs({
    one: "numObj",
    numBedrooms: "numObj",
    ...baseVarbsS.ongoing("targetRent"),
  }),
  get propertyGeneral() {
    return baseSectionVarbs(omit(this.property, savableSectionVarbNames));
  },
  loan: baseSectionVarbs({
    ...baseVarbsS.savableSection,
    ...baseVarbs("numObj", [
      "loanTotalDollars",
      "mortgageInsUpfront",
      "closingCosts",
      "wrappedInLoan",
      "loanBaseDollarsEditor",
      "loanBasePercentEditor",
    ] as const),
    ...baseVarbsS.switch("loanBase", "dollarsPercentDecimal"),
    ...baseVarbsS.ongoing("interestRateDecimal"),
    ...baseVarbsS.ongoing("interestRatePercent"),
    ...baseVarbsS.ongoing("piFixedStandard"),
    ...baseVarbsS.ongoing("interestOnlySimple"),
    ...baseVarbsS.ongoing("expenses"),
    ...baseVarbsS.switch("loanTerm", "monthsYears"),
    piCalculationName: "string",
    ...baseVarbsS.ongoing("loanPayment"),
    ...baseVarbsS.ongoing("mortgageIns"),
  } as const),
  get financing() {
    return baseSectionVarbs({
      ...omit(this.loan, loanVarbsNotInFinancing),
    });
  },
  mgmt: baseSectionVarbs({
    ...baseVarbsS.savableSection,
    ...baseVarbs("numObj", [
      "vacancyRatePercent",
      "vacancyRateDecimal",
      "upfrontExpenses",
      "rentCutDollarsEditor",
      "rentCutPercentEditor",
    ] as const),
    ...baseVarbsS.ongoing("expenses"),
    ...baseVarbsS.ongoing("vacancyLossDollars"),
    ...omit(baseVarbsS.switch("rentCut", "dollarsPercentDecimal"), [
      "rentCutDollars",
    ] as const),
    ...baseVarbsS.ongoing("rentCutDollars"),
  } as const),
  get mgmtGeneral() {
    return baseSectionVarbs(omit(this.mgmt, savableSectionVarbNames));
  },
  deal: baseSectionVarbs({
    ...baseVarbsS.savableSection,
    ...baseVarbs("numObj", [
      "upfrontExpenses",
      "outOfPocketExpenses",
      "upfrontRevenue",
      "totalInvestment",
      "downPaymentDollars",
      "downPaymentPercent",
      "downPaymentDecimal",
    ] as const),
    showCalculationsStatus: "string",
    ...baseVarbsS.ongoing("piti"),
    ...baseVarbsS.ongoing("expenses"),
    ...baseVarbsS.ongoing("revenue"),
    ...baseVarbsS.ongoing("cashFlow"),
    ...baseVarbsS.ongoing("roiDecimal"),
    ...baseVarbsS.ongoing("roi"),
  }),
  feUser: baseSectionVarbs({
    ...baseVarbs("string", [
      "authStatus",
      "userDataStatus",
      "analyzerPlan",
      "email",
      "userName",
    ] as const),
    analyzerPlanExp: "number",
  }),
  userInfo: baseSectionVarbs({
    ...baseVarbs("string", ["email", "userName"] as const),
    timeJoined: "number",
  }),
  stripeSubscription: baseSectionVarbs({
    subId: "string",
    status: "string",
    priceIds: "stringArray",
    currentPeriodEnd: "number",
  }),
  authInfoPrivate: baseSectionVarbs({
    authId: "string",
  }),
  stripeInfoPrivate: baseSectionVarbs({
    customerId: "string",
  } as const),
  userInfoPrivate: baseSectionVarbs({
    ...baseVarbs("string", ["encryptedPassword", "emailAsSubmitted"] as const),
    guestSectionsAreLoaded: "boolean",
  }),
});

const userPlans = ["basicPlan", "fullPlan"] as const;
export type AnalyzerPlan = typeof userPlans[number];
export function isUserPlan(value: any): value is AnalyzerPlan {
  return userPlans.includes(value);
}

const authStatuses = ["guest", "user"] as const;
export type AuthStatus = typeof authStatuses[number];

const userDataStatuses = [
  "notLoaded",
  "loading",
  "loaded",
  "unloading",
] as const;
export type UserDataStatus = typeof userDataStatuses[number];
