import {
  baseCapExItem,
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
      dealNameFilter: baseVarb("string"),
      valueNameFilter: baseVarb("string"),
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
    singleTimeValueGroup: baseSectionVarbs({
      total: baseVarb("numObj", dollars),
    }),
    singleTimeValue: baseSectionVarbs({
      ...varbs.displayNameAndEditor,
      value: baseVarb("numObj", dollars),
      valueEditor: baseVarb("numObj"),
      valueSourceName: baseVarb("customValueSource"),
      isItemized: baseVarb("boolean"),
    }),
    singleTimeList: baseSectionVarbs({
      ...varbs.savableSection,
      total: baseVarb("numObj", dollars),
      itemValueSource: baseVarb("editorValueSource"),
    }),
    ongoingValueGroup: baseSectionVarbs({
      ...varbs.ongoingDollars("total"),
    }),
    ongoingValue: baseSectionVarbs({
      ...varbs.displayNameAndEditor,
      ...varbs.ongoingDollarsInput("value"),
      valueSourceName: baseVarb("customValueSource"),
    }),
    ongoingList: baseSectionVarbs({
      ...baseVarbsS.savableSection,
      ...baseVarbsS.ongoingDollars("total"),
      itemValueSource: baseVarb("editorValueSource"),
      itemOngoingSwitch: baseVarb("string"),
    }),
    capExList: baseSectionVarbs({
      ...baseVarbsS.savableSection,
      ...baseVarbsS.ongoingDollars("total"),
      itemOngoingSwitch: baseVarb("string"),
    }),
    capExItem: baseCapExItem,
    ongoingItem: baseOngoingItem,
    userVarbList: baseSectionVarbs({
      ...baseVarbsS.savableSection,
      itemValueSource: baseVarb("editorValueSource"),
    }),
    outputList: baseSectionVarbs({
      ...baseVarbsS.savableSection,
      itemValueSource: baseVarb("loadedVarbSource"),
    }),
    singleTimeItem: baseSectionVarbs({
      ...baseVarbsS.displayNameAndEditor,
      value: baseVarb("numObj"),
      valueEditor: baseVarb("numObj"),
      valueSourceName: baseVarb("customValueSource"),
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
    customVarb: baseSectionVarbs(baseVarbsS.loadableVarb),
    userVarbItem: baseSectionVarbs({
      value: baseVarb("numObj"),
      valueEditor: baseVarb("numObj"),
      valueSourceName: baseVarb("editorValueSource"),
      ...baseVarbsS.displayNameAndEditor,
      ...baseVarbsS.loadableVarb,
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
      valueSourceName: baseVarb("repairValueSource"),
      valueLumpSumEditor: baseVarb("numObj", dollars),
    }),
    utilityValue: baseSectionVarbs({
      ...baseVarbsS.ongoingDollars("value"),
      valueSourceName: baseVarb("utilityValueSource"),
    }),
    maintenanceValue: baseSectionVarbs({
      ...baseVarbsS.ongoingDollars("value"),
      valueSourceName: baseVarb("maintainanceValueSource"),
      valueLumpSumEditor: baseVarb("numObj", dollars),
    }),
    capExValue: baseSectionVarbs({
      ...baseVarbsS.ongoingDollars("value"),
      valueSourceName: baseVarb("capExValueSource"),
      valueLumpSumEditor: baseVarb("numObj", dollars),
    }),
    closingCostValue: baseSectionVarbs({
      value: baseVarb("numObj", dollars),
      valueSourceName: baseVarb("closingCostValueSource"),
      valueLumpSumEditor: baseVarb("numObj", dollars),
    }),
    loan: baseSectionVarbs({
      ...baseVarbsS.savableSection,
      loanPurpose: baseVarb("loanPurpose"),
      loanAmountInputMode: baseVarb("loanAmountInputMode"),
      loanPurchasedAssetValue: baseVarb("numObj", dollars),
      loanBaseDollars: baseVarb("numObj", dollars),

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
    loanBaseValue: baseSectionVarbs({
      valueSourceName: baseVarb("loanBaseValueSource"),
      valueDollars: baseVarb("numObj", dollars),
      valueDollarsEditor: baseVarb("numObj", dollars),
      valuePercentEditor: baseVarb("numObj", percent),
      valuePercent: baseVarb("numObj", percent),
      valueDecimal: baseVarb("numObj", decimal),
    }),
    downPaymentValue: baseSectionVarbs({
      valueSourceName: baseVarb("downPaymentValueSource"),
      valueDollars: baseVarb("numObj", dollars),
      valueDollarsEditor: baseVarb("numObj", dollars),
      valuePercentEditor: baseVarb("numObj", percent),
      valuePercent: baseVarb("numObj", percent),
      valueDecimal: baseVarb("numObj", decimal),
    }),

    mgmt: baseSectionVarbs({
      ...baseVarbsS.savableSection,
      useCustomCosts: baseVarb("boolean"),
      one: baseVarb("number"),
      ...baseVarbsS.ongoingDollars("basePayDollars"),
      basePayPercent: baseVarb("numObj", percent),
      ...baseVarbsS.ongoingDollars("vacancyLossDollars"),
      vacancyLossPercent: baseVarb("numObj", percent),
      upfrontExpenses: baseVarb("numObj", dollars),
      ...baseVarbsS.ongoingDollars("expenses"),
    } as const),
    mgmtBasePayValue: baseSectionVarbs({
      valueSourceName: baseVarb("mgmtBasePayValueSource"),
      ...baseVarbsS.ongoingDollarsInput("valueDollars"),
      valuePercentEditor: baseVarb("numObj", percent),
      valuePercent: baseVarb("numObj", percent),
      valueDecimal: baseVarb("numObj", decimal),
    }),
    vacancyLossValue: baseSectionVarbs({
      valueSourceName: baseVarb("vacancyLossValueSource"),
      ...baseVarbsS.ongoingDollarsInput("valueDollars"),
      valuePercentEditor: baseVarb("numObj", percent),
      valuePercent: baseVarb("numObj", percent),
      valueDecimal: baseVarb("numObj", decimal),
    }),

    dealPage: baseSectionVarbs({
      showOutputs: baseVarb("boolean"),
    }),
    deal: baseSectionVarbs({
      dealMode: baseVarb("dealMode"),
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
      financingMode: baseVarb("financingMode"),
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
          "tenPercentRentMonthly",
          "tenPercentRentYearly",
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
      ] as const),
      propertyCompletionStatus: baseVarb("completionStatus"),
      financingCompletionStatus: baseVarb("completionStatus"),
      mgmtCompletionStatus: baseVarb("completionStatus"),
      dealCompletionStatus: baseVarb("completionStatus"),
    }),
    feUser: baseSectionVarbs({
      authStatus: baseVarb("authStatus"),
      userDataStatus: baseVarb("userDataStatus"),
      labSubscription: baseVarb("labSubscription"),
      ...baseVarbs("string", ["email", "userName"] as const),
      labSubscriptionExp: baseVarb("number"),
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
