import { omit } from "lodash";
import {
  baseCapExItem,
  baseOngoingCheckmarkItem,
  baseOngoingItem,
} from "./allBaseSectionVarbs/baseOngoingItem";
import {
  BaseSectionVarbs,
  baseSectionVarbs,
  GeneralBaseSectionVarbs,
} from "./allBaseSectionVarbs/baseSectionVarbs";
import { baseOptions } from "./allBaseSectionVarbs/baseUnits";
import {
  baseVarb,
  baseVarbs,
  baseVarbsS,
} from "./allBaseSectionVarbs/baseVarbs";
import { SectionName, sectionNames } from "./SectionName";

const checkAllBaseSectionVarbs = <BSV extends GeneralAllBaseSectionVarbs>(
  bsv: BSV
) => bsv;

type GeneralAllBaseSectionVarbs = {
  [SN in SectionName]: GeneralBaseSectionVarbs;
};

type DefaultSectionsVarbs = {
  [SN in SectionName]: BaseSectionVarbs;
};

const defaults = sectionNames.reduce((defaults, sectionName) => {
  defaults[sectionName] = baseSectionVarbs();
  return defaults;
}, {} as DefaultSectionsVarbs);

const dollars = baseOptions.dollars;
const percent = baseOptions.percent;
const decimal = baseOptions.decimal;
const varbs = baseVarbsS;
export function makeAllBaseSectionVarbs() {
  return checkAllBaseSectionVarbs({
    ...defaults,
    compareSection: baseSectionVarbs({
      nameFilter: baseVarb("string"),
    }),
    compareOption: baseSectionVarbs({
      dbId: baseVarb("string"),
    }),
    compareValue: baseSectionVarbs({
      valueEntityInfo: baseVarb("inEntityValue"),
    }),
    variablesMenu: baseSectionVarbs({
      nameFilter: baseVarb("string"),
    }),
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
      varbInfo: baseVarb("varbInfo"),
    }),
    cell: baseSectionVarbs({
      columnFeId: baseVarb("string"),
      valueEntityInfo: baseVarb("inEntityValue"),
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
      total: baseVarb("numObj", dollars),
      itemValueSwitch: baseVarb("string"),
    }),
    singleTimeValueGroup: baseSectionVarbs({
      total: baseVarb("numObj", dollars),
      itemValueSwitch: baseVarb("string"),
    }),
    singleTimeValue: baseSectionVarbs({
      displayName: baseVarb("stringObj"),
      displayNameEditor: baseVarb("stringObj"),
      value: baseVarb("numObj", dollars),
      valueEditor: baseVarb("numObj"),
      valueSourceSwitch: baseVarb("string"),
      isItemized: baseVarb("boolean"),
      itemValueSwitch: baseVarb("string"),
    }),
    singleTimeList: baseSectionVarbs({
      ...varbs.savableSection,
      total: baseVarb("numObj", dollars),
      itemValueSwitch: baseVarb("string"),
    }),
    ongoingValueGroup: baseSectionVarbs({
      ...varbs.ongoingDollars("total"),
      itemValueSwitch: baseVarb("string"),
      itemOngoingSwitch: baseVarb("string"),
    }),
    loadedNumObjVarb: baseSectionVarbs({
      ...varbs.singleValueVirtualVarb,
      ...varbs.loadableVarb,
    }),
    ongoingValue: baseSectionVarbs({
      ...varbs.ongoingDollars("value"),
      displayName: baseVarb("stringObj"),
      displayNameEditor: baseVarb("stringObj"),
      valueEditor: baseVarb("numObj"),
      valueSourceSwitch: baseVarb("string"),
      itemValueSwitch: baseVarb("string"),
      itemOngoingSwitch: baseVarb("string"),
      isItemized: baseVarb("boolean"),
    }),
    ongoingListGroup: baseSectionVarbs({
      ...baseVarbsS.ongoingDollars("total"),
      itemValueSwitch: baseVarb("string"),
      itemOngoingSwitch: baseVarb("string"),
    }),
    ongoingList: baseSectionVarbs({
      ...baseVarbsS.savableSection,
      ...baseVarbsS.ongoingDollars("total"),
      itemValueSwitch: baseVarb("string"),
      itemOngoingSwitch: baseVarb("string"),
    }),
    capExList: baseSectionVarbs({
      ...baseVarbsS.savableSection,
      ...baseVarbsS.ongoingDollars("total"),
      itemOngoingSwitch: baseVarb("string"),
    }),
    capExItem: baseCapExItem,
    ongoingItem: baseOngoingItem,
    ongoingCheckmarkItem: baseOngoingCheckmarkItem,
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
    outputItem: baseSectionVarbs({
      valueEntityInfo: baseVarb("inEntityValue"),
    }),
    virtualVarb: baseSectionVarbs({
      valueEntityInfo: baseVarb("inEntityValue"),
      value: baseVarb("numObj"),
      ...baseVarbs("stringObj", [
        "displayName",
        "startAdornment",
        "endAdornment",
      ] as const),
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
      ...baseVarbs(
        "numObj",
        [
          "purchasePrice",
          "upfrontExpenses",
          "upfrontRevenue",
          "afterRepairValue",
          "sellingCosts",
        ] as const,
        dollars
      ),
      one: baseVarb("number"),
      numUnits: baseVarb("numObj"),
      ...baseVarbs("numObj", ["sqft", "numBedrooms"] as const),
      ...baseVarbsS.ongoingDollarsInput("taxes"),
      ...baseVarbsS.ongoingDollarsInput("homeIns"),
      ...baseVarbsS.ongoingDollars("targetRent"),
      ...baseVarbsS.ongoingDollars("expenses"),
      ...baseVarbsS.ongoingDollars("miscRevenue"),
      ...baseVarbsS.ongoingDollars("revenue"),
      ...baseVarbsS.monthsYearsInput("holdingPeriod"),
      useCustomCosts: baseVarb("boolean"),
    }),
    unit: baseSectionVarbs({
      one: baseVarb("number"),
      numBedrooms: baseVarb("numObj"),
      ...baseVarbsS.ongoingDollarsInput("targetRent"),
    }),
    repairValue: baseSectionVarbs({
      value: baseVarb("numObj", dollars),
      valueMode: baseVarb("string"),
      valueLumpSumEditor: baseVarb("numObj", dollars),
    }),
    utilityValue: baseSectionVarbs({
      ...baseVarbsS.ongoingDollars("value"),
      valueMode: baseVarb("string"),
    }),
    maintenanceValue: baseSectionVarbs({
      ...baseVarbsS.ongoingDollars("value"),
      valueMode: baseVarb("string"),
      valueLumpSumEditor: baseVarb("numObj", dollars),
    }),
    capExValue: baseSectionVarbs({
      ...baseVarbsS.ongoingDollars("value"),
      valueMode: baseVarb("string"),
      valueLumpSumEditor: baseVarb("numObj", dollars),
    }),
    closingCostValue: baseSectionVarbs({
      value: baseVarb("numObj", dollars),
      valueMode: baseVarb("string"),
      valueLumpSumEditor: baseVarb("numObj", dollars),
    }),
    loan: baseSectionVarbs({
      ...baseVarbsS.savableSection,
      loanBasePercentEditor: baseVarb("numObj", percent),
      loanBaseDollarsEditor: baseVarb("numObj", dollars),
      ...varbs.dollarsPercentDecimal("loanBase"),

      ...varbs.ongoingPercentInput("interestRatePercent"),
      ...baseVarbsS.ongoingDecimal("interestRateDecimal"),

      ...varbs.monthsYearsInput("loanTerm"),

      isInterestOnly: baseVarb("boolean"),
      ...baseVarbsS.ongoingDollars("interestOnlySimple"),
      ...baseVarbsS.ongoingDollars("piFixedStandard"),
      ...baseVarbsS.ongoingDollars("loanPayment"),
      ...baseVarbsS.ongoingDollars("expenses"),

      piCalculationName: baseVarb("string"), // depreciated

      hasMortgageIns: baseVarb("boolean"),
      mortgageInsUpfront: baseVarb("numObj", dollars),
      mortgageInsUpfrontEditor: baseVarb("numObj", dollars),
      ...baseVarbsS.ongoingDollarsInput("mortgageIns"),
      ...baseVarbs(
        "numObj",
        [
          "loanTotalDollars",
          "closingCosts",
          "wrappedInLoan",
          "fivePercentBaseLoan",
        ] as const,
        dollars
      ),
    } as const),
    mgmt: baseSectionVarbs({
      ...baseVarbsS.savableSection,
      one: baseVarb("number"),
      basePayDollarsEditor: baseVarb("numObj", dollars),
      basePayPercentEditor: baseVarb("numObj", percent),
      ...baseVarbsS.ongoingDollars("basePayDollars"),
      ...omit(varbs.dollarsPercentDecimal("basePay"), [
        "basePayDollars",
      ] as const),

      vacancyLossDollarsEditor: baseVarb("numObj", dollars),
      vacancyLossPercentEditor: baseVarb("numObj", percent),
      ...baseVarbsS.ongoingDollars("vacancyLossDollars"),
      ...omit(varbs.dollarsPercentDecimal("vacancyLoss"), [
        "vacancyLossDollars",
      ] as const),

      upfrontExpenses: baseVarb("numObj", dollars),
      ...baseVarbsS.ongoingDollars("expenses"),
      useCustomCosts: baseVarb("boolean"),
    } as const),
    deal: baseSectionVarbs({
      dealMode: baseVarb("string"), // buyAndHold, fixAndFlip, brrrrr
      ...baseVarbsS.savableSection,
      ...baseVarbsS.ongoingDollars("piti"),
      ...baseVarbsS.ongoingDollars("expenses"),
      ...baseVarbsS.ongoingDollars("revenue"),
      ...baseVarbsS.ongoingDollars("cashFlow"),
      ...baseVarbsS.ongoingDecimal("cocRoiDecimal"),
      ...baseVarbsS.ongoingPercent("cocRoi"),
      ...baseVarbs(
        "numObj",
        [
          "upfrontRevenue",
          "upfrontExpenses",
          "outOfPocketExpenses",
          "totalInvestment",
        ] as const,
        dollars
      ),
      downPaymentDollars: baseVarb("numObj", dollars),
      downPaymentPercent: baseVarb("numObj", percent),
      downPaymentDecimal: baseVarb("numObj", decimal),
    }),
    financing: baseSectionVarbs({
      financingMode: baseVarb("string"), // "cashOnly", "useLoan", ""
      ...baseVarbs(
        "numObj",
        [
          "loanTotalDollars",
          "closingCosts",
          "mortgageInsUpfront",
          "loanBaseDollars",
          "loanUpfrontExpenses",
        ] as const,
        dollars
      ),
      one: baseVarb("number"),
      ...baseVarbsS.ongoingDollars("loanExpenses"),
      ...baseVarbsS.ongoingDollars("mortgageIns"),
      ...baseVarbsS.ongoingDollars("loanPayment"),
    }),
    calculatedVarbs: baseSectionVarbs({
      ...baseVarbs(
        "numObj",
        [
          "fivePercentDecimal",
          "two",
          "onePercentPrice",
          "twoPercentPrice",
          "fivePercentRentMonthly",
          "fivePercentRentYearly",
          "onePercentSqftAverage",
          "onePercentPricePlusSqft",
          "onePercentPriceSqftAverage",
        ] as const,
        percent
      ),
      ...baseVarbs("boolean", [
        "propertyExists",
        "financingExists",
        "mgmtExists",
      ]),
      propertyCompletionStatus: baseVarb("string"),
      financingCompletionStatus: baseVarb("string"),
      mgmtCompletionStatus: baseVarb("string"),
      dealCompletionStatus: baseVarb("string"),
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

export type AllBaseSectionVarbs = typeof allBaseSectionVarbs;
export const allBaseSectionVarbs = makeAllBaseSectionVarbs();
