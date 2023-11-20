import {
  BaseSectionVarbs,
  baseSectionVarbs,
  GeneralBaseSectionVarbs,
} from "./allBaseSectionVarbs/baseSectionVarbs";
import { baseOptions } from "./allBaseSectionVarbs/baseUnits";
import { baseVarbs, baseVarbsS, bv } from "./allBaseSectionVarbs/baseVarbs";
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

const varbs = baseSectionVarbs;

const defaults = sectionNames.reduce((defaults, sectionName) => {
  defaults[sectionName] = varbs();
  return defaults;
}, {} as DefaultSectionsVarbs);

const dollars = baseOptions.dollars;
const percent = baseOptions.percent;
const decimal = baseOptions.decimal;
const varbsS = baseVarbsS;
export function makeAllBaseSectionVarbs() {
  return checkAllBaseSectionVarbs({
    ...defaults,
    editorControls: varbs({
      editedDealDbId: bv("string"),
    }),
    sessionSection: varbs({
      dateTimeCreated: bv("dateTime"),
      displayName: bv("string"),
    }),
    sessionDeal: varbs({
      dateTimeCreated: bv("dateTime"),
      displayName: bv("string"),
      dealMode: bv("dealMode"),
    }),
    sessionVarb: varbs({
      varbName: bv("string"),
      label: bv("string"),
      value: bv("string"),
    }),
    sessionStore: varbs({
      compareDealStatus: bv("compareDealStatus"),
      compareDealTimeReady: bv("dateTime"),
      archivedAreLoaded: bv("boolean"),
      showArchivedDeals: bv("boolean"),
      CreateDealOfMode: bv("dealMode"),
      isCreatingDeal: bv("boolean"),
      dealDbIdToEdit: bv("string"),
    }),
    timespanEditor: varbs({
      valueSourceName: bv("timespan"),
      valueEditor: bv("numObj"),
      ...baseVarbsS.timespan("value"),
    }),
    periodicEditor: varbs({
      valueSourceName: bv("periodic"),
      valueEditor: bv("numObj"),
      ...baseVarbsS.periodicNext("value"),
    }),
    newDealMenu: varbs({ dealMode: bv("dealMode") }),
    mainDealMenu: varbs({
      dealNameFilter: bv("string"),
      dealModeFilter: bv("dealMode"),
      dealSort: bv("dealSort"),
    }),
    dealCompareDealSelectMenu: varbs({
      dealNameFilter: bv("string"),
    }),
    dealCompareMenu: varbs({
      ...baseVarbsS.savableSection,
      dealMode: bv("dealModePlusMixed"),
    }),
    variablesMenu: varbs({
      nameFilter: bv("string"),
      defaultViewEditor: bv("string"),
    }),
    proxyStoreItem: varbs({
      dbId: bv("string"),
    }),
    column: varbs({
      varbInfo: bv("inEntityValue"),
    }),
    cell: varbs({
      columnFeId: bv("string"),
      valueEntityInfo: bv("inEntityValue"),
      displayVarb: bv("string"),
    }),
    conditionalRow: varbs({
      level: bv("number"),
      type: bv("string"),
      // if
      left: bv("numObj"),
      operator: bv("string"),
      rightList: bv("stringArray"),
      rightValue: bv("numObj"),
      // then
      then: bv("numObj"),
    }),
    sellingCostValue: varbs({
      valueSourceName: bv("sellingCostSource"),
      valueDollars: bv("numObj", dollars),
      valueDollarsEditor: bv("numObj", dollars),
      valuePercent: bv("numObj", percent),
      valuePercentEditor: bv("numObj", percent),
      valueDecimal: bv("numObj", decimal),
    }),
    onetimeList: varbs({
      ...varbsS.savableSection,
      total: bv("numObj", dollars),
      itemValueSource: bv("valueDollarsEditor"),
    }),

    onetimeItem: varbs({
      ...baseVarbsS.displayNameAndEditor,
      valueDollars: bv("numObj", dollars),
      valueDollarsEditor: bv("numObj", dollars),
      valueSourceName: bv("valueDollarsEditor"),
    }),
    periodicList: varbs({
      ...baseVarbsS.savableSection,
      ...baseVarbsS.periodicDollars("total"),
      itemValueSource: bv("valueDollarsPeriodicEditor"),
      itemPeriodicSwitch: bv("periodic"),
    }),
    periodicItem: baseSectionVarbs({
      valueSourceName: bv("valueDollarsPeriodicEditor"),
      ...baseVarbsS.periodicDollarsInput("valueDollars"),
      ...baseVarbsS.displayNameAndEditor,
    }),
    capExList: varbs({
      ...baseVarbsS.savableSection,
      ...baseVarbsS.periodicDollars("total"),
      itemPeriodicSwitch: bv("periodic"),
    }),
    capExItem: baseSectionVarbs({
      ...baseVarbsS.displayNameAndEditor,
      ...baseVarbsS.periodicDollars("valueDollars"),
      ...baseVarbsS.monthsYearsInput("lifespan"),
      costToReplace: bv("numObj", baseOptions.dollars),
    }),
    numVarbList: varbs({
      ...baseVarbsS.savableSection,
      itemValueSource: bv("editorValueSource"),
    }),
    boolVarbList: varbs({
      ...baseVarbsS.savableSection,
      itemValueSource: bv("editorValueSource"),
    }),
    outputList: varbs(baseVarbsS.savableSection),
    outputItem: baseVarbsS.loadableVarb,
    virtualVarb: varbs({
      valueEntityInfo: bv("inEntityValue"),
      value: bv("numObj"),
      ...baseVarbs("stringObj", [
        "displayName",
        "startAdornment",
        "endAdornment",
      ] as const),
    }),
    customVarb: varbs(baseVarbsS.loadableVarb),
    boolVarbItem: varbs({
      ...baseVarbsS.displayNameAndEditor,
      value: bv("boolean"),
      leftOperandi: bv("numObj"),
      rightOperandi: bv("numObj"),
      operator: bv("string"),
    }),
    numVarbItem: varbs({
      value: bv("numObj"),
      valueEditor: bv("numObj"),
      valueSourceName: bv("editorValueSource"),
      ...baseVarbsS.displayNameAndEditor,
      ...baseVarbsS.loadableVarb,
    }),
    conditionalRowList: varbs({
      value: bv("numObj"),
    }),
    property: varbs({
      ...baseVarbsS.savableSection,
      propertyMode: bv("dealMode"),
      completionStatus: bv("completionStatus"),
      streetAddress: bv("string"),
      city: bv("string"),
      state: bv("string"),
      zipCode: bv("string"),
      one: bv("number"),
      likability: bv("numObj"),
      yearBuilt: bv("numObj"),

      isMultifamily: bv("boolean"),
      isRenting: bv("boolean"),
      singleMultiBrCount: bv("numObj"),
      singleMultiNumUnits: bv("numObj"),
      ...baseVarbsS.periodicDollars("homebuyerRent"),
      ...baseVarbs(
        "numObj",
        [
          "purchasePrice",
          "pricePerLikability",
          "afterRepairValue",
          "afterRepairValueEditor",

          "sellingCosts",
          "miscOnetimeCosts",
          "rehabCostBase",
          "holdingCostTotal",

          "rehabCost",
          "upfrontExpenses",
        ] as const,
        dollars
      ),
      ...baseVarbs("numObj", [
        "sqft",
        "numBedrooms",
        "numUnits",
        "numUnitsEditor",
      ] as const),

      ...baseVarbsS.periodicDollars("taxesHolding"),
      ...baseVarbsS.periodicDollars("homeInsHolding"),
      ...baseVarbsS.periodicDollars("utilitiesHolding"),

      ...baseVarbsS.periodicDollars("taxesOngoing"),
      ...baseVarbsS.periodicDollars("homeInsOngoing"),
      ...baseVarbsS.periodicDollars("utilitiesOngoing"),

      ...baseVarbsS.monthsYearsInput("holdingPeriod"),

      ...baseVarbsS.periodicDollars("targetRent"),
      ...baseVarbsS.periodicDollars("miscOngoingRevenue"),
      ...baseVarbsS.periodicDollars("miscOngoingCosts"),
      ...baseVarbsS.periodicDollars("holdingCost"),
      ...baseVarbsS.periodicDollars("revenueOngoing"),
      ...baseVarbsS.periodicDollars("expensesOngoing"),
    }),
    unit: varbs({
      one: bv("number"),
      numBedrooms: bv("numObj"),
      ...baseVarbsS.periodicDollarsInput("targetRent"),
    }),
    miscOnetimeValue: varbs({
      valueSourceName: bv("dollarsOrList"),
      valueDollarsEditor: bv("numObj", dollars),
      valueDollars: bv("numObj", dollars),
    }),
    miscPeriodicValue: varbs({
      valueSourceName: bv("dollarsOrListOngoing"),
      ...baseVarbsS.periodicDollarsInput("valueDollars"),
    }),
    mortgageInsUpfrontValue: varbs({
      valueSourceName: bv("mortgageInsUpfrontSource"),
      valueDollarsEditor: bv("numObj", dollars),
      percentLoanEditor: bv("numObj", percent),
      decimalOfLoan: bv("numObj", decimal),
    }),
    mortgageInsPeriodicValue: varbs({
      valueSourceName: bv("mortgageInsperiodic"),
      ...baseVarbsS.periodicDollarsInput("valueDollars"),
      ...baseVarbsS.periodicPercentInput("percentLoan"),
      ...baseVarbsS.periodicDecimal("decimalOfLoan"),
    }),
    costOverrunValue: varbs({
      valueDollars: bv("numObj", dollars),
      valuePercent: bv("numObj", percent),
      valueDecimal: bv("numObj", decimal),
      valueSourceName: bv("overrunValueSource"),
      valueDollarsEditor: bv("numObj", dollars),
      valuePercentEditor: bv("numObj", percent),
    }),
    repairValue: varbs({
      valueDollars: bv("numObj", dollars),
      valueSourceName: bv("repairValueSource"),
      valueDollarsEditor: bv("numObj", dollars),
    }),
    delayedCostValue: varbs({
      valueDollars: bv("numObj", dollars),
      valueSourceName: bv("repairValueSource"),
      valueDollarsEditor: bv("numObj", dollars),
    }),
    taxesValue: varbs({
      ...baseVarbsS.periodicDollarsInput("valueDollars"),
      valueSourceName: bv("taxesAndHomeInsSource"),
    }),
    homeInsValue: varbs({
      ...baseVarbsS.periodicDollarsInput("valueDollars"),
      valueSourceName: bv("taxesAndHomeInsSource"),
    }),
    utilityValue: varbs({
      ...baseVarbsS.periodicDollarsInput("valueDollars"),
      valueSourceName: bv("utilityValueSource"),
    }),
    maintenanceValue: varbs({
      ...baseVarbsS.periodicDollarsInput("valueDollars"),
      valueSourceName: bv("maintainanceValueSource"),
    }),
    capExValue: varbs({
      ...baseVarbsS.periodicDollarsInput("valueDollars"),
      valueSourceName: bv("capExValueSource"),
    }),
    closingCostValue: varbs({
      valueDollars: bv("numObj", dollars),
      valueDollarsEditor: bv("numObj", dollars),
      valueSourceName: bv("closingCostValueSource"),
    }),
    loan: varbs({
      ...baseVarbsS.savableSection,
      completionStatus: bv("completionStatus"),
      financingMode: bv("financingMode"),
      loanBaseDollars: bv("numObj", dollars),
      firstInterestPayment: bv("numObj", dollars),
      firstInterestPaymentOneDay: bv("numObj", dollars),
      ...varbsS.periodicPercentInput("interestRatePercent"),
      ...baseVarbsS.periodicDecimal("interestRateDecimal"),
      ...varbsS.monthsYearsInput("loanTerm"),

      isInterestOnly: bv("boolean"),
      ...baseVarbsS.periodicDollars("interestOnlySimple"),
      ...baseVarbsS.periodicDollars("piFixedStandard"),
      ...baseVarbsS.periodicDollars("loanPayment"),
      ...baseVarbsS.periodicDollars("averagePrincipal"),
      ...baseVarbsS.periodicDollars("averageInterest"),
      ...baseVarbsS.periodicDollars("expenses"),

      piCalculationName: bv("string"), // depreciated
      hasMortgageIns: bv("boolean"),
      mortgageInsUpfront: bv("numObj", dollars),
      ...baseVarbsS.periodicDollars("mortgageIns"),
      ...baseVarbs(
        "numObj",
        ["loanTotalDollars", "closingCosts", "fivePercentBaseLoan"] as const,
        dollars
      ),
    } as const),
    loanBaseValue: varbs({
      financingMode: bv("financingMode"),
      completionStatus: bv("completionStatus"),
      valueSourceName: bv("loanBaseValueSource"),
      valueDollars: bv("numObj", dollars),
    }),
    loanBaseExtra: varbs({
      hasLoanExtra: bv("boolean"),
      valueSourceName: bv("dollarsListOrZero"),
      valueDollars: bv("numObj", dollars),
      valueDollarsEditor: bv("numObj", dollars),
    }),
    customLoanBase: varbs({
      valueSourceName: bv("dollarsOrList"),
      valueDollars: bv("numObj", dollars),
      valueDollarsEditor: bv("numObj", dollars),
    }),
    purchaseLoanValue: baseVarbsS.loanValue,
    repairLoanValue: baseVarbsS.loanValue,
    arvLoanValue: baseVarbsS.loanValue,
    prepaidTaxes: varbs({
      valueSourceName: bv("spanOrDollars"),
      valueDollarsEditor: bv("numObj"),
      valueDollars: bv("numObj"),
      ...baseVarbsS.monthsYearsInput("value"),
    }),
    prepaidHomeIns: varbs({
      valueSourceName: bv("spanOrDollars"),
      valueDollarsEditor: bv("numObj"),
      valueDollars: bv("numObj"),
      ...baseVarbsS.monthsYearsInput("value"),
    }),
    prepaidInterest: varbs({
      valueSourceName: bv("spanOrDollars"),
      valueDollarsEditor: bv("numObj"),
      valueSpanEditor: bv("numObj"),
      valueSpanSwitch: bv("days"),
    }),
    mgmt: varbs({
      ...baseVarbsS.savableSection,
      completionStatus: bv("completionStatus"),
      ...baseVarbsS.periodicDollars("basePayDollars"),
      ...baseVarbsS.periodicDollars("vacancyLossDollars"),
      ...baseVarbsS.periodicDollars("miscCosts"),
      miscOnetimeCosts: bv("numObj", dollars),
      one: bv("number"),
      basePayPercent: bv("numObj", percent),
      vacancyLossPercent: bv("numObj", percent),
      ...baseVarbsS.periodicDollars("expenses"),
    } as const),
    mgmtBasePayValue: varbs({
      valueSourceName: bv("mgmtBasePayValueSource"),
      ...baseVarbsS.periodicDollarsInput("valueDollars"),
      valuePercentEditor: bv("numObj", percent),
      valuePercent: bv("numObj", percent),
      valueDecimal: bv("numObj", decimal),
    }),
    vacancyLossValue: varbs({
      valueSourceName: bv("vacancyLossValueSource"),
      ...baseVarbsS.periodicDollarsInput("valueDollars"),
      valuePercentEditor: bv("numObj", percent),
      valuePercent: bv("numObj", percent),
      valueDecimal: bv("numObj", decimal),
    }),
    outputSection: varbs({
      ...baseVarbsS.savableSection,
      showOutputs: bv("boolean"),
    }),
    deal: varbs({
      isArchived: bv("boolean"),
      dealMode: bv("dealMode"),
      ...baseVarbsS.savableSection,
      ...baseVarbsS.displayNameEditor,
      completionStatus: bv("completionStatus"),
      displayNameSource: bv("dealDisplayNameSource"),
      ...baseVarbsS.monthsYears("timeTillValueAddProfit"),
      ...baseVarbsS.periodicDollars("ongoingPiti"),
      ...baseVarbsS.periodicDollars("ongoingLoanPayment"),
      ...baseVarbsS.periodicDollars("expensesOngoing"),
      ...baseVarbsS.periodicDollars("averageNonPrincipalOngoing"),
      ...baseVarbsS.periodicDollars("cashFlow"),
      ...baseVarbsS.periodicDollars("netNonPrincipalOngoing"),
      ...baseVarbsS.periodicDollars("netExpensesOngoing"),
      ...baseVarbsS.periodicDecimal("cocRoiDecimal"),
      ...baseVarbsS.periodicPercent("cocRoi"),

      ...baseVarbsS.monthsYears("refiLoanHolding"),
      ...baseVarbsS.monthsYears("purchaseLoanHolding"),

      totalInvestment: bv("numObj", dollars),
      holdingCostTotal: bv("numObj", dollars),
      preFinanceOneTimeExpenses: bv("numObj", dollars),
      cashCostsPlusPurchaseLoanRepay: bv("numObj", dollars),

      valueAddProfit: bv("numObj", dollars),
      valueAddRoiDecimal: bv("numObj", decimal),
      valueAddRoiPercent: bv("numObj", percent),
      valueAddRoiPercentPerMonth: bv("numObj", percent),
      valueAddRoiPercentAnnualized: bv("numObj", percent),

      vaProfitOnSale: bv("numObj", dollars),
      valueAddRoiOnSaleDecimal: bv("numObj", decimal),
      vaRoiOnSalePercent: bv("numObj", percent),
      valueAddRoiOnSalePercentPerMonth: bv("numObj", percent),
      vaRoiOnSalePercentAnnualized: bv("numObj", percent),

      refiLoanHoldingCost: bv("numObj", dollars),
      purchaseLoanHoldingCost: bv("numObj", dollars),
    }),
    financing: varbs({
      displayName: bv("stringObj"),
      completionStatus: bv("completionStatus"),
      financingMethod: bv("financingMethod"),
      financingMode: bv("financingMode"),
      ...baseVarbsS.periodicDollars("mortgageIns"),
      ...baseVarbsS.periodicDollars("loanExpenses"),
      ...baseVarbsS.periodicDollars("loanPayment"),
      ...baseVarbsS.monthsYearsInput("timeTillRefinance"),
      ...baseVarbsS.periodicDollars("averagePrincipal"),
      ...baseVarbsS.periodicDollars("averageInterest"),
      ...baseVarbs(
        "numObj",
        [
          "loanBaseDollars",
          "loanTotalDollars",
          "closingCosts",
          "mortgageInsUpfront",
          "loanUpfrontExpenses",
        ] as const,
        dollars
      ),
      one: bv("number"),
    }),
    calculatedVarbs: varbs({
      ...baseVarbs(
        "numObj",
        [
          "currentYear",
          "propertyAge",
          "pricePerUnit",
          "pricePerSqft",
          "arvPerSqft",
          "rehabPerSqft",
          "onePercentPrice",
          "twoPercentPrice",
          "fivePercentRentMonthly",
          "fivePercentRentYearly",
          "tenPercentRentMonthly",
          "tenPercentRentYearly",
          "onePercentPricePlusSqft",
          "onePercentPriceSqftAverage",
          "onePercentArv",
          "twoPercentArv",
          "onePercentArvPlusSqft",
          "onePercentArvSqftAverage",
          "threeHundred",
          "threeHundredPerUnit",
          "threeHundredPerUnitTimesTwelve",
        ] as const,
        dollars
      ),
      ...baseVarbs("numObj", ["two", "twelve", "thirty"] as const),
      ...baseVarbs("boolean", ["propertyExists", "mgmtExists"] as const),
    }),
    feStore: varbs({
      dealCountOnLogin: bv("number"),
      changesToSave: bv("changesToSave"),
      changesSaving: bv("changesSaving"),

      timeOfFailedSave: bv("number"),
      timeOfChangeIdle: bv("number"),
      timeOfLastChange: bv("number"),
      timeOfSave: bv("number"),

      ...baseVarbs("string", ["email", "userName"] as const),
      authStatus: bv("authStatus"),
      userDataStatus: bv("userDataStatus"),
      userDataFetchTryCount: bv("number"),
      labSubscription: bv("labSubscription"),
      labSubscriptionExp: bv("number"),
    }),
    userInfo: varbs({
      ...baseVarbs("string", ["email", "userName"] as const),
      timeJoined: bv("dateTime"),
    }),
    stripeSubscription: varbs({
      subId: bv("string"),
      status: bv("string"),
      priceIds: bv("stringArray"),
      currentPeriodEnd: bv("dateTime"),
    }),
    authInfoPrivate: varbs({
      authId: bv("string"),
    }),
    stripeInfoPrivate: varbs({
      customerId: bv("string"),
    } as const),
    userInfoPrivate: varbs({
      ...baseVarbs("string", [
        "encryptedPassword",
        "emailAsSubmitted",
      ] as const),
      guestSectionsAreLoaded: bv("boolean"),
    }),
  });
}

export type AllBaseSectionVarbs = typeof allBaseSectionVarbs;
export const allBaseSectionVarbs = makeAllBaseSectionVarbs();
