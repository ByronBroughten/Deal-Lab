import {
  baseSectionVarbs,
  GeneralBaseSectionVarbs,
  TypeUniformityVarbProp,
} from "./allBaseSectionVarbs/baseSectionVarbs";
import { baseOptions } from "./allBaseSectionVarbs/baseUnits";
import { baseVarbs, bv, bvsS } from "./allBaseSectionVarbs/baseVarbs";
import { SectionName } from "./SectionName";

type GeneralAllBaseSectionVarbs = {
  [SN in SectionName]: GeneralBaseSectionVarbs;
};
const checkTypeUniformityVarbs = <
  TUVS extends Record<SectionName, TypeUniformityVarbProp>
>(
  tuvs: TUVS
) => tuvs;
const checkAllBaseSectionVarbs = <BSV extends GeneralAllBaseSectionVarbs>(
  bsv: BSV
) => {
  return bsv;
};

const varbs = baseSectionVarbs;
const dollars = baseOptions.dollars;
const percent = baseOptions.percent;
const decimal = baseOptions.decimal;

export function makeAllBaseSectionVarbs() {
  return checkTypeUniformityVarbs(
    checkAllBaseSectionVarbs({
      root: varbs(),
      omniParent: varbs(),
      main: varbs(),
      dbStore: varbs(),
      dealCompareCache: varbs(),
      dealSystem: varbs(),
      comparedDeal: varbs(),
      editorControls: varbs({ editedDealDbId: bv("string") }),
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
        createDealOfMode: bv("dealMode"),
        isCreatingDeal: bv("boolean"),
        dealDbIdToEdit: bv("string"),
      }),

      timespanEditor: varbs({
        valueEditor: bv("numObj"),
        valueEditorUnit: bv("timespan"),
        ...bvsS.timespan("value"),
      }),
      periodicEditor: varbs({
        valueEditor: bv("numObj"),
        valueEditorFrequency: bv("periodic"),
        ...bvsS.periodic2("value"),
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
        ...bvsS.savableSection,
        dealMode: bv("dealModePlusMixed"),
      }),
      variablesMenu: varbs({
        nameFilter: bv("string"),
        defaultViewEditor: bv("string"),
      }),
      proxyStoreItem: varbs({ dbId: bv("string") }),
      column: varbs({ varbInfo: bv("inEntityValue") }),
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
        ...bvsS.savableSection,
        total: bv("numObj", dollars),
        itemValueSource: bv("valueDollarsEditor"),
      }),

      onetimeItem: varbs({
        ...bvsS.displayNameAndEditor,
        valueDollars: bv("numObj", dollars),
        valueDollarsEditor: bv("numObj", dollars),
        valueSourceName: bv("valueDollarsEditor"),
      }),
      periodicList: varbs({
        ...bvsS.savableSection,
        ...bvsS.periodicDollars2("total"),
        itemValueSource: bv("valueDollarsEditor"),
        itemPeriodicSwitch: bv("periodic"),
      }),
      periodicItem: varbs({
        valueSourceName: bv("valueDollarsEditor"),
        ...bvsS.periodicDollars2("valueDollars"),
        ...bvsS.displayNameAndEditor,
      }),
      capExList: varbs({
        ...bvsS.savableSection,
        ...bvsS.periodicDollars2("total"),
        itemPeriodicSwitch: bv("periodic"),
      }),
      capExItem: varbs({
        ...bvsS.displayNameAndEditor,
        ...bvsS.periodicDollars2("valueDollars"),
        ...bvsS.timespan("lifespan"),
        costToReplace: bv("numObj", baseOptions.dollars),
      }),
      numVarbList: varbs({
        ...bvsS.savableSection,
        itemValueSource: bv("editorValueSource"),
      }),
      boolVarbList: varbs({
        ...bvsS.savableSection,
        itemValueSource: bv("editorValueSource"),
      }),
      outputList: varbs(bvsS.savableSection),
      outputItem: varbs(bvsS.loadableVarb),
      customVarb: varbs(bvsS.loadableVarb),
      boolVarbItem: varbs({
        ...bvsS.displayNameAndEditor,
        value: bv("boolean"),
        leftOperandi: bv("numObj"),
        rightOperandi: bv("numObj"),
        operator: bv("string"),
      }),
      numVarbItem: varbs({
        value: bv("numObj"),
        valueEditor: bv("numObj"),
        valueSourceName: bv("editorValueSource"),
        ...bvsS.displayNameAndEditor,
        ...bvsS.loadableVarb,
      }),
      conditionalRowList: varbs({
        value: bv("numObj"),
      }),
      property: varbs({
        ...bvsS.savableSection,
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
        ...bvsS.periodicDollars2("taxesHolding"),
        ...bvsS.periodicDollars2("homeInsHolding"),
        ...bvsS.periodicDollars2("utilitiesHolding"),

        ...bvsS.periodicDollars2("taxesOngoing"),
        ...bvsS.periodicDollars2("homeInsOngoing"),
        ...bvsS.periodicDollars2("utilitiesOngoing"),

        ...bvsS.timespan("holdingPeriod"),

        ...bvsS.periodicDollars2("targetRent"),
        ...bvsS.periodicDollars2("miscOngoingRevenue"),
        ...bvsS.periodicDollars2("miscOngoingCosts"),
        ...bvsS.periodicDollars2("holdingCost"),
        ...bvsS.periodicDollars2("revenueOngoing"),
        ...bvsS.periodicDollars2("expensesOngoing"),
      }),
      afterRepairValue: varbs({
        valueSourceName: bv("arvValueSource"),
        valueDollarsEditor: bv("numObj"),
        valueDollars: bv("numObj"),
      }),
      unit: varbs({
        one: bv("number"),
        numBedrooms: bv("numObj"),
        ...bvsS.periodicDollars2("targetRent"),
      }),
      miscOnetimeValue: varbs({
        valueSourceName: bv("dollarsOrList"),
        valueDollarsEditor: bv("numObj", dollars),
        valueDollars: bv("numObj", dollars),
      }),
      miscPeriodicValue: varbs({
        valueSourceName: bv("dollarsOrListOngoing"),
        ...bvsS.periodicDollars2("valueDollars"),
      }),
      mortgageInsUpfrontValue: varbs({
        valueSourceName: bv("mortgageInsUpfrontSource"),
        valueDollarsEditor: bv("numObj", dollars),
        percentLoanEditor: bv("numObj", percent),
        decimalOfLoan: bv("numObj", decimal),
      }),
      mortgageInsPeriodicValue: varbs({
        valueSourceName: bv("mortgageInsPeriodic"),
        ...bvsS.periodicDollars2("valueDollars"),
        ...bvsS.periodicPercent2("percentLoan"),
        ...bvsS.periodicDecimal2("decimalOfLoan"),
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
        ...bvsS.periodicDollars2("valueDollars"),
        valueSourceName: bv("taxesAndHomeInsSource"),
      }),
      homeInsValue: varbs({
        ...bvsS.periodicDollars2("valueDollars"),
        valueSourceName: bv("taxesAndHomeInsSource"),
      }),
      utilityValue: varbs({
        ...bvsS.periodicDollars2("valueDollars"),
        valueSourceName: bv("utilityValueSource"),
      }),
      maintenanceValue: varbs({
        ...bvsS.periodicDollars2("valueDollars"),
        valueSourceName: bv("maintainanceValueSource"),
      }),
      capExValue: varbs({
        ...bvsS.periodicDollars2("valueDollars"),
        valueSourceName: bv("capExValueSource"),
      }),
      loan: varbs({
        ...bvsS.savableSection,
        completionStatus: bv("completionStatus"),
        financingMode: bv("financingMode"),
        loanBaseDollars: bv("numObj", dollars),
        firstInterestPayment: bv("numObj", dollars),
        firstInterestPaymentOneDay: bv("numObj", dollars),

        ...bvsS.periodicPercent2("interestRatePercent"),
        ...bvsS.periodicDecimal2("interestRateDecimal"),
        ...bvsS.timespan("loanTerm"),

        prepaidInterest: bv("numObj", dollars),
        prepaidTaxes: bv("numObj", dollars),
        prepaidHomeIns: bv("numObj", dollars),
        prepaidTotal: bv("numObj", dollars),

        isInterestOnly: bv("boolean"),
        ...bvsS.periodicDollars2("interestOnlySimple"),
        ...bvsS.periodicDollars2("piFixedStandard"),
        ...bvsS.periodicDollars2("loanPayment"),
        ...bvsS.periodicDollars2("averagePrincipal"),
        ...bvsS.periodicDollars2("averageInterest"),
        ...bvsS.periodicDollars2("expenses"),
        hasMortgageIns: bv("boolean"),
        mortgageInsUpfront: bv("numObj", dollars),
        ...bvsS.periodicDollars2("mortgageIns"),
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
      purchaseLoanValue: varbs(bvsS.loanValue),
      repairLoanValue: varbs(bvsS.loanValue),
      arvLoanValue: varbs(bvsS.loanValue),
      closingCostValue: varbs({
        valueDollars: bv("numObj", dollars),
        valueDollarsEditor: bv("numObj", dollars),
        valueSourceName: bv("closingCostValueSource"),
      }),
      prepaidPeriodic: varbs({
        valueSourceName: bv("spanOrDollars"),
        valueDollarsEditor: bv("numObj"),
        ...bvsS.timespan("value"),
      }),
      prepaidDaily: varbs({
        valueSourceName: bv("spanOrDollars"),
        valueDollarsEditor: bv("numObj"),
        valueSpanEditor: bv("numObj"),
      }),
      mgmt: varbs({
        ...bvsS.savableSection,
        completionStatus: bv("completionStatus"),
        ...bvsS.periodicDollars2("basePayDollars"),
        ...bvsS.periodicDollars2("vacancyLossDollars"),
        ...bvsS.periodicDollars2("miscCosts"),
        miscOnetimeCosts: bv("numObj", dollars),
        one: bv("number"),
        basePayPercent: bv("numObj", percent),
        vacancyLossPercent: bv("numObj", percent),
        ...bvsS.periodicDollars2("expenses"),
      } as const),
      mgmtBasePayValue: varbs({
        valueSourceName: bv("mgmtBasePayValueSource"),
        ...bvsS.periodicDollars2("valueDollars"),
        valuePercentEditor: bv("numObj", percent),
        valuePercent: bv("numObj", percent),
        valueDecimal: bv("numObj", decimal),
      }),
      vacancyLossValue: varbs({
        valueSourceName: bv("vacancyLossValueSource"),
        ...bvsS.periodicDollars2("valueDollars"),
        valuePercentEditor: bv("numObj", percent),
        valuePercent: bv("numObj", percent),
        valueDecimal: bv("numObj", decimal),
      }),
      outputSection: varbs({
        ...bvsS.savableSection,
        showOutputs: bv("boolean"),
      }),
      deal: varbs({
        isArchived: bv("boolean"),
        dealMode: bv("dealMode"),
        ...bvsS.savableSection,
        ...bvsS.displayNameEditor,
        completionStatus: bv("completionStatus"),
        displayNameSource: bv("dealDisplayNameSource"),
        ...bvsS.timespan("timeTillValueAddProfit"),
        ...bvsS.periodicDollars2("ongoingPiti"),
        ...bvsS.periodicDollars2("ongoingLoanPayment"),
        ...bvsS.periodicDollars2("expensesOngoing"),
        ...bvsS.periodicDollars2("averageNonPrincipalOngoing"),
        ...bvsS.periodicDollars2("cashFlow"),
        ...bvsS.periodicDollars2("netNonPrincipalOngoing"),
        ...bvsS.periodicDollars2("netExpensesOngoing"),
        ...bvsS.periodicDecimal2("cocRoiDecimal"),
        ...bvsS.periodicPercent2("cocRoi"),

        ...bvsS.timespan("refiLoanHolding"),
        ...bvsS.timespan("purchaseLoanHolding"),

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
        ...bvsS.periodicDollars2("mortgageIns"),
        ...bvsS.periodicDollars2("loanExpenses"),
        ...bvsS.periodicDollars2("loanPayment"),
        ...bvsS.timespan("timeTillRefinance"),
        ...bvsS.periodicDollars2("averagePrincipal"),
        ...bvsS.periodicDollars2("averageInterest"),
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
    })
  );
}

export type AllBaseSectionVarbs = typeof allBaseSectionVarbs;
export const allBaseSectionVarbs = makeAllBaseSectionVarbs();
