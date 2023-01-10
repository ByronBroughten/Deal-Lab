import { omit } from "lodash";
import {
  BaseSection,
  baseSectionVarbs,
} from "./baseSectionsVarbs/baseSectionVarbs";
import {
  baseVarb,
  baseVarbs,
  baseVarbsS,
  GeneralBaseSectionVarbs,
} from "./baseSectionsVarbs/baseVarbs";
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

export function makeAllBaseSectionVarbs() {
  return checkBaseSectionsVarbs({
    ...defaults,
    proxyStoreItem: baseSectionVarbs({
      dbId: baseVarb("string"),
    }),
    displayNameItem: baseSectionVarbs({
      displayName: baseVarb("string"),
    }),
    displayNameList: baseSectionVarbs({
      searchFilter: baseVarb("string"),
    }),
    compareTable: baseSectionVarbs({
      titleFilter: baseVarb("string"),
    } as const),
    tableRow: baseSectionVarbs({
      displayName: baseVarb("string"),
      compareToggle: baseVarb("boolean"),
    }),
    column: baseSectionVarbs({
      valueEntityInfo: baseVarb("inEntityInfo"),
    }),
    cell: baseSectionVarbs({
      columnFeId: baseVarb("string"),
      valueEntityInfo: baseVarb("inEntityInfo"),
      displayVarb: baseVarb("string"),
    }),
    conditionalRow: baseSectionVarbs({
      level: baseVarb("number"),
      type: baseVarb("string"),
      // if
      left: baseVarb("numObj"),
      operator: baseVarb("string"),
      rightList: baseVarb("stringArray"),
      rightValue: baseVarb("numObj"),
      // then
      then: baseVarb("numObj"),
    }),
    singleTimeListGroup: baseSectionVarbs({
      total: baseVarb("numObj"),
      itemValueSwitch: baseVarb("string"),
    }),
    singleTimeValueGroup: baseSectionVarbs({
      total: baseVarb("numObj"),
      itemValueSwitch: baseVarb("string"),
    }),
    singleTimeValue: baseSectionVarbs({
      displayName: baseVarb("stringObj"),
      displayNameEditor: baseVarb("stringObj"),
      value: baseVarb("numObj"),
      valueEditor: baseVarb("numObj"),
      valueSourceSwitch: baseVarb("string"),
      isItemized: baseVarb("boolean"),
      itemValueSwitch: baseVarb("string"),
    }),
    singleTimeList: baseSectionVarbs({
      ...baseVarbsS.savableSection,
      total: baseVarb("numObj"),
      itemValueSwitch: baseVarb("string"),
    }),
    ongoingValueGroup: baseSectionVarbs({
      ...baseVarbsS.ongoing("total"),
      itemValueSwitch: baseVarb("string"),
      itemOngoingSwitch: baseVarb("string"),
    }),
    ongoingValue: baseSectionVarbs({
      ...baseVarbsS.ongoing("value"),
      displayName: baseVarb("stringObj"),
      displayNameEditor: baseVarb("stringObj"),
      valueEditor: baseVarb("numObj"),
      valueSourceSwitch: baseVarb("string"),
      itemValueSwitch: baseVarb("string"),
      itemOngoingSwitch: baseVarb("string"),
      isItemized: baseVarb("boolean"),
    }),
    ongoingListGroup: baseSectionVarbs({
      ...baseVarbsS.ongoing("total"),
      itemValueSwitch: baseVarb("string"),
      itemOngoingSwitch: baseVarb("string"),
    }),
    ongoingList: baseSectionVarbs({
      ...baseVarbsS.savableSection,
      ...baseVarbsS.ongoing("value"),
      ...baseVarbsS.ongoing("total"),
      valueEditor: baseVarb("numObj"),
      valueSourceSwitch: baseVarb("string"),
      itemValueSwitch: baseVarb("string"),
      itemOngoingSwitch: baseVarb("string"),
    }),
    userVarbList: baseSectionVarbs({
      ...baseVarbsS.savableSection,
      itemValueSwitch: baseVarb("string"),
    }),
    outputList: baseSectionVarbs({
      ...baseVarbsS.savableSection,
      itemValueSwitch: baseVarb("string"),
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
      costToReplace: baseVarb("numObj"),
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
      value: baseVarb("numObj"),
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
        "arv",
        "sellingCosts",
      ] as const),
      ...baseVarbsS.switch("holdingPeriod", "monthsYears"),
      ...baseVarbsS.ongoing("taxes"),
      ...baseVarbsS.ongoing("homeIns"),
      ...baseVarbsS.ongoing("targetRent"),
      ...baseVarbsS.ongoing("expenses"),
      ...baseVarbsS.ongoing("miscRevenue"),
      ...baseVarbsS.ongoing("revenue"),
    }),
    unit: baseSectionVarbs({
      one: baseVarb("numObj"),
      numBedrooms: baseVarb("numObj"),
      ...baseVarbsS.ongoing("targetRent"),
    }),
    get propertyGeneral() {
      return baseSectionVarbs(omit(this.property, savableSectionVarbNames));
    },
    calculatedVarbs: baseSectionVarbs({
      ...baseVarbs("numObj", ["onePercentPrice"]),
    }),
    loan: baseSectionVarbs({
      ...baseVarbsS.savableSection,
      ...baseVarbs("numObj", [
        "loanTotalDollars",
        "closingCosts",
        "wrappedInLoan",
        "loanBaseDollarsEditor",
        "loanBasePercentEditor",
        "mortgageInsUpfront",
        "mortgageInsOngoingEditor",
        "mortgageInsUpfrontEditor",
      ] as const),
      ...baseVarbsS.switch("loanBase", "dollarsPercentDecimal"),
      ...baseVarbsS.ongoing("interestRateDecimal"),
      ...baseVarbsS.ongoing("interestRatePercent"),
      ...baseVarbsS.ongoing("piFixedStandard"),
      ...baseVarbsS.ongoing("interestOnlySimple"),
      ...baseVarbsS.ongoing("expenses"),
      ...baseVarbsS.switch("loanTerm", "monthsYears"),
      ...baseVarbsS.ongoing("loanPayment"),
      ...baseVarbsS.ongoing("mortgageIns"),

      piCalculationName: baseVarb("string"),
      hasMortgageIns: baseVarb("boolean"),
      isInterestOnly: baseVarb("boolean"),
    } as const),
    get financing() {
      return baseSectionVarbs({
        ...omit(this.loan, loanVarbsNotInFinancing),
      });
    },
    mgmt: baseSectionVarbs({
      ...baseVarbsS.savableSection,
      ...baseVarbs("numObj", [
        "vacancyLossDollarsEditor",
        "vacancyLossPercentEditor",
        "basePayDollarsEditor",
        "basePayPercentEditor",
        "upfrontExpenses",
      ] as const),
      ...baseVarbsS.ongoing("expenses"),
      ...baseVarbsS.ongoing("basePayDollars"),
      ...omit(baseVarbsS.switch("basePay", "dollarsPercentDecimal"), [
        "basePayDollars",
      ] as const),
      ...baseVarbsS.ongoing("vacancyLossDollars"),
      ...omit(baseVarbsS.switch("vacancyLoss", "dollarsPercentDecimal"), [
        "vacancyLossDollars",
      ] as const),
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
      mode: baseVarb("string"),
      showCalculationsStatus: baseVarb("string"),
      ...baseVarbsS.ongoing("piti"),
      ...baseVarbsS.ongoing("expenses"),
      ...baseVarbsS.ongoing("revenue"),
      ...baseVarbsS.ongoing("cashFlow"),
      ...baseVarbsS.ongoing("cocRoiDecimal"),
      ...baseVarbsS.ongoing("cocRoi"),
    }),
    feUser: baseSectionVarbs({
      ...baseVarbs("string", [
        "authStatus",
        "userDataStatus",
        "analyzerPlan",
        "email",
        "userName",
      ] as const),
      analyzerPlanExp: baseVarb("number"),
    }),
    userInfo: baseSectionVarbs({
      ...baseVarbs("string", ["email", "userName"] as const),
      timeJoined: baseVarb("number"),
    }),
    stripeSubscription: baseSectionVarbs({
      subId: baseVarb("string"),
      status: baseVarb("string"),
      priceIds: baseVarb("stringArray"),
      currentPeriodEnd: baseVarb("number"),
    }),
    authInfoPrivate: baseSectionVarbs({
      authId: baseVarb("string"),
    }),
    stripeInfoPrivate: baseSectionVarbs({
      customerId: baseVarb("string"),
    } as const),
    userInfoPrivate: baseSectionVarbs({
      ...baseVarbs("string", [
        "encryptedPassword",
        "emailAsSubmitted",
      ] as const),
      guestSectionsAreLoaded: baseVarb("boolean"),
    }),
  });
}

export type BaseSectionsVarbs = typeof baseSectionsVarbs;
export const baseSectionsVarbs = makeAllBaseSectionVarbs();

const userPlans = ["basicPlan", "fullPlan"] as const;
export type AnalyzerPlan = typeof userPlans[number];
export function isUserPlan(value: any): value is AnalyzerPlan {
  return userPlans.includes(value);
}

const userDataStatuses = [
  "notLoaded",
  "loading",
  "loaded",
  "unloading",
] as const;
export type UserDataStatus = typeof userDataStatuses[number];
