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
      editedDealDbId: baseVarb("string"),
    }),
    sessionSection: varbs({
      dateTimeCreated: baseVarb("dateTime"),
      displayName: baseVarb("string"),
    }),
    sessionDeal: varbs({
      dateTimeCreated: baseVarb("dateTime"),
      displayName: baseVarb("string"),
      dealMode: baseVarb("dealMode"),
    }),
    sessionVarb: varbs({
      varbName: baseVarb("string"),
      label: baseVarb("string"),
      value: baseVarb("string"),
    }),
    sessionStore: varbs({
      compareDealStatus: baseVarb("compareDealStatus"),
      archivedAreLoaded: baseVarb("boolean"),
      showArchivedDeals: baseVarb("boolean"),
      creatingDealOfMode: baseVarb("dealMode"),
      isCreatingDeal: baseVarb("boolean"),
      dealDbIdToEdit: baseVarb("string"),
    }),
    newDealMenu: varbs({ dealMode: baseVarb("dealMode") }),
    mainDealMenu: varbs({
      dealNameFilter: baseVarb("string"),
      dealModeFilter: baseVarb("dealMode"),
      dealSort: baseVarb("dealSort"),
    }),
    dealCompareDealSelectMenu: varbs({
      dealNameFilter: baseVarb("string"),
    }),
    dealCompareMenu: varbs({
      ...baseVarbsS.savableSection,
      dealMode: baseVarb("dealModePlusMixed"),
    }),
    variablesMenu: varbs({
      nameFilter: baseVarb("string"),
      defaultViewEditor: baseVarb("string"),
    }),
    proxyStoreItem: varbs({
      dbId: baseVarb("string"),
    }),
    column: varbs({
      varbInfo: baseVarb("inEntityValue"),
    }),
    cell: varbs({
      columnFeId: baseVarb("string"),
      valueEntityInfo: baseVarb("inEntityValue"),
      displayVarb: baseVarb("string"),
    }),
    conditionalRow: varbs({
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
    sellingCostValue: varbs({
      valueSourceName: baseVarb("sellingCostSource"),
      valueDollars: baseVarb("numObj", dollars),
      valueDollarsEditor: baseVarb("numObj", dollars),
      valuePercent: baseVarb("numObj", percent),
      valuePercentEditor: baseVarb("numObj", percent),
      valueDecimal: baseVarb("numObj", decimal),
    }),
    onetimeList: varbs({
      ...varbsS.savableSection,
      total: baseVarb("numObj", dollars),
      itemValueSource: baseVarb("valueDollarsEditor"),
    }),

    onetimeItem: varbs({
      ...baseVarbsS.displayNameAndEditor,
      valueDollars: baseVarb("numObj", dollars),
      valueDollarsEditor: baseVarb("numObj", dollars),
      valueSourceName: baseVarb("valueDollarsEditor"),
    }),
    periodicList: varbs({
      ...baseVarbsS.savableSection,
      ...baseVarbsS.periodicDollars("total"),
      itemValueSource: baseVarb("valueDollarsPeriodicEditor"),
      itemPeriodicSwitch: baseVarb("ongoingSwitch"),
    }),
    periodicItem: baseSectionVarbs({
      valueSourceName: baseVarb("valueDollarsPeriodicEditor"),
      ...baseVarbsS.periodicDollarsInput("valueDollars"),
      ...baseVarbsS.displayNameAndEditor,
    }),
    capExList: varbs({
      ...baseVarbsS.savableSection,
      ...baseVarbsS.periodicDollars("total"),
      itemPeriodicSwitch: baseVarb("ongoingSwitch"),
    }),
    capExItem: baseSectionVarbs({
      ...baseVarbsS.displayNameAndEditor,
      ...baseVarbsS.periodicDollars("valueDollars"),
      ...baseVarbsS.monthsYearsInput("lifespan"),
      costToReplace: baseVarb("numObj", baseOptions.dollars),
    }),
    numVarbList: varbs({
      ...baseVarbsS.savableSection,
      itemValueSource: baseVarb("editorValueSource"),
    }),
    boolVarbList: varbs({
      ...baseVarbsS.savableSection,
      itemValueSource: baseVarb("editorValueSource"),
    }),
    outputList: varbs(baseVarbsS.savableSection),
    outputItem: baseVarbsS.loadableVarb,
    virtualVarb: varbs({
      valueEntityInfo: baseVarb("inEntityValue"),
      value: baseVarb("numObj"),
      ...baseVarbs("stringObj", [
        "displayName",
        "startAdornment",
        "endAdornment",
      ] as const),
    }),
    customVarb: varbs(baseVarbsS.loadableVarb),
    boolVarbItem: varbs({
      ...baseVarbsS.displayNameAndEditor,
      value: baseVarb("boolean"),
      leftOperandi: baseVarb("numObj"),
      rightOperandi: baseVarb("numObj"),
      operator: baseVarb("string"),
    }),
    numVarbItem: varbs({
      value: baseVarb("numObj"),
      valueEditor: baseVarb("numObj"),
      valueSourceName: baseVarb("editorValueSource"),
      ...baseVarbsS.displayNameAndEditor,
      ...baseVarbsS.loadableVarb,
    }),
    conditionalRowList: varbs({
      value: baseVarb("numObj"),
    }),
    property: varbs({
      ...baseVarbsS.savableSection,
      propertyMode: baseVarb("dealMode"),
      completionStatus: baseVarb("completionStatus"),
      streetAddress: baseVarb("string"),
      city: baseVarb("string"),
      state: baseVarb("string"),
      zipCode: baseVarb("string"),
      one: baseVarb("number"),
      likability: baseVarb("numObj"),
      yearBuilt: baseVarb("numObj"),

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
        "numBedroomsEditor",
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
      one: baseVarb("number"),
      numBedrooms: baseVarb("numObj"),
      ...baseVarbsS.periodicDollarsInput("targetRent"),
    }),
    miscOnetimeValue: varbs({
      valueSourceName: baseVarb("dollarsOrList"),
      valueDollarsEditor: baseVarb("numObj", dollars),
      valueDollars: baseVarb("numObj", dollars),
    }),
    miscPeriodicValue: varbs({
      valueSourceName: baseVarb("dollarsOrListOngoing"),
      ...baseVarbsS.periodicDollarsInput("valueDollars"),
    }),
    costOverrunValue: varbs({
      valueDollars: baseVarb("numObj", dollars),
      valuePercent: baseVarb("numObj", percent),
      valueDecimal: baseVarb("numObj", decimal),
      valueSourceName: baseVarb("overrunValueSource"),
      valueDollarsEditor: baseVarb("numObj", dollars),
      valuePercentEditor: baseVarb("numObj", percent),
    }),
    repairValue: varbs({
      valueDollars: baseVarb("numObj", dollars),
      valueSourceName: baseVarb("repairValueSource"),
      valueDollarsEditor: baseVarb("numObj", dollars),
    }),
    taxesValue: varbs({
      ...baseVarbsS.periodicDollarsInput("valueDollars"),
      valueSourceName: baseVarb("taxesAndHomeInsSource"),
    }),
    homeInsValue: varbs({
      ...baseVarbsS.periodicDollarsInput("valueDollars"),
      valueSourceName: baseVarb("taxesAndHomeInsSource"),
    }),
    utilityValue: varbs({
      ...baseVarbsS.periodicDollarsInput("valueDollars"),
      valueSourceName: baseVarb("utilityValueSource"),
    }),
    maintenanceValue: varbs({
      ...baseVarbsS.periodicDollarsInput("valueDollars"),
      valueSourceName: baseVarb("maintainanceValueSource"),
    }),
    capExValue: varbs({
      ...baseVarbsS.periodicDollarsInput("valueDollars"),
      valueSourceName: baseVarb("capExValueSource"),
    }),
    closingCostValue: varbs({
      valueDollars: baseVarb("numObj", dollars),
      valueDollarsEditor: baseVarb("numObj", dollars),
      valueSourceName: baseVarb("closingCostValueSource"),
    }),
    loan: varbs({
      ...baseVarbsS.savableSection,
      completionStatus: baseVarb("completionStatus"),
      financingMode: baseVarb("financingMode"),
      loanBaseDollars: baseVarb("numObj", dollars),
      ...varbsS.periodicPercentInput("interestRatePercent"),
      ...baseVarbsS.periodicDecimal("interestRateDecimal"),
      ...varbsS.monthsYearsInput("loanTerm"),

      isInterestOnly: baseVarb("boolean"),
      ...baseVarbsS.periodicDollars("interestOnlySimple"),
      ...baseVarbsS.periodicDollars("piFixedStandard"),
      ...baseVarbsS.periodicDollars("loanPayment"),
      ...baseVarbsS.periodicDollars("averagePrincipal"),
      ...baseVarbsS.periodicDollars("averageInterest"),
      ...baseVarbsS.periodicDollars("expenses"),

      piCalculationName: baseVarb("string"), // depreciated

      hasMortgageIns: baseVarb("boolean"),
      mortgageInsUpfront: baseVarb("numObj", dollars),
      mortgageInsUpfrontEditor: baseVarb("numObj", dollars),
      ...baseVarbsS.periodicDollarsInput("mortgageIns"),
      ...baseVarbs(
        "numObj",
        ["loanTotalDollars", "closingCosts", "fivePercentBaseLoan"] as const,
        dollars
      ),
    } as const),
    loanBaseValue: varbs({
      financingMode: baseVarb("financingMode"),
      completionStatus: baseVarb("completionStatus"),
      valueSourceName: baseVarb("loanBaseValueSource"),
      valueDollars: baseVarb("numObj", dollars),
    }),
    loanBaseExtra: varbs({
      hasLoanExtra: baseVarb("boolean"),
      valueSourceName: baseVarb("dollarsListOrZero"),
      valueDollars: baseVarb("numObj", dollars),
      valueDollarsEditor: baseVarb("numObj", dollars),
    }),
    customLoanBase: varbs({
      valueSourceName: baseVarb("dollarsOrList"),
      valueDollars: baseVarb("numObj", dollars),
      valueDollarsEditor: baseVarb("numObj", dollars),
    }),
    purchaseLoanValue: baseVarbsS.loanValue,
    repairLoanValue: baseVarbsS.loanValue,
    arvLoanValue: baseVarbsS.loanValue,

    mgmt: varbs({
      ...baseVarbsS.savableSection,
      completionStatus: baseVarb("completionStatus"),
      ...baseVarbsS.periodicDollars("basePayDollars"),
      ...baseVarbsS.periodicDollars("vacancyLossDollars"),
      ...baseVarbsS.periodicDollars("miscCosts"),
      miscOnetimeCosts: baseVarb("numObj", dollars),
      one: baseVarb("number"),
      basePayPercent: baseVarb("numObj", percent),
      vacancyLossPercent: baseVarb("numObj", percent),
      ...baseVarbsS.periodicDollars("expenses"),
    } as const),
    mgmtBasePayValue: varbs({
      valueSourceName: baseVarb("mgmtBasePayValueSource"),
      ...baseVarbsS.periodicDollarsInput("valueDollars"),
      valuePercentEditor: baseVarb("numObj", percent),
      valuePercent: baseVarb("numObj", percent),
      valueDecimal: baseVarb("numObj", decimal),
    }),
    vacancyLossValue: varbs({
      valueSourceName: baseVarb("vacancyLossValueSource"),
      ...baseVarbsS.periodicDollarsInput("valueDollars"),
      valuePercentEditor: baseVarb("numObj", percent),
      valuePercent: baseVarb("numObj", percent),
      valueDecimal: baseVarb("numObj", decimal),
    }),
    outputSection: varbs({
      ...baseVarbsS.savableSection,
      showOutputs: baseVarb("boolean"),
    }),
    deal: varbs({
      isArchived: baseVarb("boolean"),
      dealMode: baseVarb("dealMode"),
      ...baseVarbsS.savableSection,
      ...baseVarbsS.displayNameEditor,
      completionStatus: baseVarb("completionStatus"),
      displayNameSource: baseVarb("dealDisplayNameSource"),
      ...baseVarbsS.monthsYears("timeTillValueAddProfit"),
      ...baseVarbsS.periodicDollars("ongoingPiti"),
      ...baseVarbsS.periodicDollars("ongoingLoanPayment"),
      ...baseVarbsS.periodicDollars("expensesOngoing"),
      ...baseVarbsS.periodicDollars("averageNonPrincipalOngoing"),
      ...baseVarbsS.periodicDollars("cashFlow"),
      ...baseVarbsS.periodicDecimal("cocRoiDecimal"),
      ...baseVarbsS.periodicPercent("cocRoi"),

      ...baseVarbsS.monthsYears("refiLoanHolding"),
      ...baseVarbsS.monthsYears("purchaseLoanHolding"),

      totalInvestment: baseVarb("numObj", dollars),
      holdingCostTotal: baseVarb("numObj", dollars),
      preFinanceOneTimeExpenses: baseVarb("numObj", dollars),
      cashCostsPlusPurchaseLoanRepay: baseVarb("numObj", dollars),

      valueAddProfit: baseVarb("numObj", dollars),
      valueAddRoiDecimal: baseVarb("numObj", decimal),
      valueAddRoiPercent: baseVarb("numObj", percent),
      valueAddRoiPercentPerMonth: baseVarb("numObj", percent),
      valueAddRoiPercentAnnualized: baseVarb("numObj", percent),

      vaProfitOnSale: baseVarb("numObj", dollars),
      valueAddRoiOnSaleDecimal: baseVarb("numObj", decimal),
      vaRoiOnSalePercent: baseVarb("numObj", percent),
      valueAddRoiOnSalePercentPerMonth: baseVarb("numObj", percent),
      vaRoiOnSalePercentAnnualized: baseVarb("numObj", percent),

      refiLoanHoldingCost: baseVarb("numObj", dollars),
      purchaseLoanHoldingCost: baseVarb("numObj", dollars),
    }),
    financing: varbs({
      displayName: baseVarb("stringObj"),
      completionStatus: baseVarb("completionStatus"),
      financingMethod: baseVarb("financingMethod"),
      financingMode: baseVarb("financingMode"),
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
      one: baseVarb("number"),
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
      ...baseVarbs("numObj", ["two", "twelve"] as const),
      ...baseVarbs("boolean", ["propertyExists", "mgmtExists"] as const),
    }),
    feStore: varbs({
      dealCountOnLogin: baseVarb("number"),
      changesToSave: baseVarb("changesToSave"),
      changesSaving: baseVarb("changesSaving"),

      timeOfFailedSave: baseVarb("number"),
      timeOfChangeIdle: baseVarb("number"),
      timeOfLastChange: baseVarb("number"),
      timeOfSave: baseVarb("number"),

      ...baseVarbs("string", ["email", "userName"] as const),
      authStatus: baseVarb("authStatus"),
      userDataStatus: baseVarb("userDataStatus"),
      userDataFetchTryCount: baseVarb("number"),
      labSubscription: baseVarb("labSubscription"),
      labSubscriptionExp: baseVarb("number"),
    }),
    userInfo: varbs({
      ...baseVarbs("string", ["email", "userName"] as const),
      timeJoined: baseVarb("dateTime"),
    }),
    stripeSubscription: varbs({
      subId: baseVarb("string"),
      status: baseVarb("string"),
      priceIds: baseVarb("stringArray"),
      currentPeriodEnd: baseVarb("dateTime"),
    }),
    authInfoPrivate: varbs({
      authId: baseVarb("string"),
    }),
    stripeInfoPrivate: varbs({
      customerId: baseVarb("string"),
    } as const),
    userInfoPrivate: varbs({
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
