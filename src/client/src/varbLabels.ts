import { SwitchTargetKey } from "./App/sharedWithServer/SectionsMeta/allBaseSectionVarbs/baseSwitchNames";
import {
  sectionVarbNames,
  VarbName,
} from "./App/sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { sectionVarbValueName } from "./App/sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionValues";
import { RelLocalVarbInfo } from "./App/sharedWithServer/SectionsMeta/SectionInfo/RelVarbInfo";
import {
  SectionName,
  sectionNames,
} from "./App/sharedWithServer/SectionsMeta/SectionName";
import { dealModeLabels } from "./App/sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { ValueName } from "./App/sharedWithServer/SectionsMeta/values/ValueName";

const multis = {
  loanExtras: text({
    inputLabel: "Loan extras",
    title: "Loan extras",
    info: "This is for any additional costs that you intend to wrap into this loan, such as a portion of closing costs, for example.",
  }),
  dealMode: text({
    inputLabel: "Select type",
    title: "Deal Types",
    info: `${dealModeLabels.homeBuyer}: estimate the costs of a home intended to be used as a primary residence.\n\n${dealModeLabels.buyAndHold}: estimate the ongoing cashflow and return on investment of a rental property.\n\n${dealModeLabels.fixAndFlip}: estimate the return on investment of buying, fixing, and selling a property.\n\n${dealModeLabels.brrrr}: "Buy, Rehab, Rent, Refinance, Repeat". A more advanced type of deal whereby a fix and flip deal is turned into a rental property.`,
  }),
  closingCosts: text({
    inputLabel: "Closing costs",
    title: "Closing Costs",
    info: `Most loans require that the borrower pay a number of one-time fees—appraisal fees, title fees, government fees. Collectively, these fees are called closing costs.\n\nNote that closing costs don't include prepaid or escrow costs, such as prepaid home insurance or taxes.`,
  }),
  vacancyLoss: text({
    inputLabel: "Vacancy loss",
    title: "Vacancy Loss",
    info: `No property will be fully occupied 100% of the time. When tenants move out, it can sometimes take days or weeks to prepare their unit for another renter. To account for this, assume you will miss out on a certain portion of the property's rent.\n\nIf you're owner-managing the property and you're determined to keep vacancy low, a common method is to asume you will miss out on 5% of the rent; and if you're using a property manager or management company (who probably won't be quite as motivated as you), something like 10% is common to assume.`,
  }),
  holdingPeriod: text({
    inputLabel: "Holding period",
    title: "Holding Period",
    info: `This is the amount of time that a property is owned before its rehab is complete and it is either sold (in the case of fix and flip) or refinanced and rented out (in the case of brrrr).\n\nTypically, the longer the holding period, the more that costs will accumulate.`,
  }),
  cocRoi(period: SwitchTargetKey<"periodic">) {
    const words = {
      monthly: { start: "Monthly", unit: "month" },
      yearly: { start: "Annual", unit: "year" },
    } as const;
    const { start, unit } = words[period];
    return text({
      inputLabel: "CoC ROI",
      variableLabel: `CoC ROI ${period}`,
      title: `${start} Cash on Cash ROI`,
      info: `The profit an investment earns per ${unit}, as a percent of the cash that was initially invested`,
    });
  },
} as const;

function getLoanValue(loanForWhat: string) {
  return {
    offPercent: text({
      inputLabel: "Down payment",
      variableLabel: `${loanForWhat} down payment`,
    }),
    offPercentEditor: text({
      inputLabel: "Down payment",
      variableLabel: `${loanForWhat} down payment`,
    }),
    offDollars: text({
      inputLabel: "Down payment",
      variableLabel: `${loanForWhat} down payment`,
    }),
    offDollarsEditor: text({
      inputLabel: "Down payment",
      variableLabel: `${loanForWhat} down payment`,
    }),
    offDecimal: input("Down payment percent as decimal"),
    amountDecimal: input("Loan amount percent as decimal"),
    amountPercent: input("Loan amount"),
    amountPercentEditor: input("Loan amount"),
    amountDollars: input("Loan amount"),
    amountDollarsEditor: input("Loan amount"),
  };
}

type InfoTexts = { [SN in SectionName]: SectionInfoText<SN> };
export const varbLabels = checkSectionInfoTexts({
  ...defaultSectionInfoTexts(),
  ...prop("capExValue", {
    valueSourceName: text({
      inputLabel: "Capital expenses",
      title: "Capital Expenses",
      info: `Capital expenses, or CapEx, are those big, expensive things that every property has and that will eventually need to be replaced—the roof, furnace, water heater, etc. No long-term analysis of a property is complete without accounting for these.\n\nA common (and easy) method to assume that all the CapEx costs together will average to about 5% of the property's rental income. But this can be pretty inaccurate.\n\nA more precise method is to go through each major capital expense and estimate both how much it would cost to replace it and how many years a replacement would last. From there, the app will calculate how much you should budget per month for each capital expense and add them all up.`,
    }),
    ...simplePeriodic("valueDollars", "Capital Expenses"),
    valueDollarsPeriodicEditor: input("Capital Expenses"),
    // The editors should get their displayName from the active
    // valueDollars, yeah?
  }),
  ...prop("purchaseLoanValue", getLoanValue("Purchase")),
  ...prop("repairLoanValue", getLoanValue("Repair")),
  ...prop("arvLoanValue", getLoanValue("Arv")),

  ...prop("sellingCostValue", {
    valueSourceName: text({
      inputLabel: "Selling costs",
      title: "Selling Costs",
      info: "Selling costs are the costs associated with selling a property, to pay for things things real estate agents, title fees, broker companies, etc.\n\nThese costs commonly add up to around 5-6% of the price that the property is being sold at.",
    }),
  }),
  ...prop("maintenanceValue", {
    valueSourceName: text({
      inputLabel: "Ongoing maintenance",
      title: "Ongoing Maintenance",
      info: `Every property needs minor repairs from time to time. Doorknobs break. Oven igniters die. Pipes burst. To account for these and other miscellaneous things, there are a few common methods.\n\nOne is to assume you will spend $1 per property square foot per year. The idea is that the more square feet there is, the more opportunity there is for something to go wrong.\n\nAnother common method is to assume that miscellanious repairs will cost 1% of the property's purchase price (or after repair value) per year. The reasoning is that more expensive properties may generally have more expensive components that require more expensive repairs.\n\nA third method is to just use the average between the first two methods.\n\nThere are probably other, more creative methods out there. By selecting the "custom amount" method, you are free to enter any equation that suits you.`,
    }),
  }),
  ...prop("costOverrunValue", {
    valueSourceName: text({
      inputLabel: "Cost overrun",
      title: "Cost Overrun",
      info: `Cost overrun is the sum of costs over the entirety of a project that were not anticipated upfront. Cost overrun is common, especially for larger projects.\n\nFor sizable rehab projects, it's common to factor in an extra 10-15% of the base rehab estimate for cost overrun. That may not be necessary for turnkey properties or light rehab.`,
    }),
  }),
  ...prop("calculatedVarbs", {
    onePercentPrice: input("1% Purchase price"),
    twoPercentPrice: input("2% Purchase price"),
    ...simplePeriodic("fivePercentRent", "5% rent"),
    pricePerSqft: input("Price per sqft"),
    pricePerUnit: input("Price per unit"),
    arvPerSqft: input("After repair value per sqft"),
    rehabPerSqft: input("Rehab cost per sqft"),
    two: input("2"),
    twelve: input("12"),
    ...simplePeriodic("tenPercentRent", "10% rent"),
    onePercentPricePlusSqft: input("sqft + 1% property price"),
    onePercentPriceSqftAverage: input("Average of sqft + 1% price"),
  }),
  ...prop("loanBaseValue", {
    valueDollars: input("Base loan amount"),
  }),
  ...prop("loanBaseExtra", {
    hasLoanExtra: multis.loanExtras,
    valueDollars: input("Extra loan base amount"),
    valueDollarsEditor: input("Extra loan base amount"),
  }),
  ...prop("customLoanBase", {
    valueDollars: input("Base loan amount"),
    valueDollarsEditor: input("Base loan amount"),
  }),
  ...prop("closingCostValue", {
    valueSourceName: multis.closingCosts,
    value: input("Closing cost amount"),
    valueDollarsEditor: input("Closing cost amount"),
  }),
  ...prop("property", {
    propertyMode: multis.dealMode,
    purchasePrice: input("Purchase price"),
    sqft: input("Square feet"),
    numUnits: input("Unit count"),
    numUnitsEditor: input("Unit count"),
    numBedroomsEditor: input("BR count"),
    numBedrooms: input("BR count"),
    likability: input("Likability"),
    pricePerLikability: input("Price per likability"),
    sellingCosts: text({
      inputLabel: "Selling costs",
      title: "Selling Costs",
      info: "These are the costs associated with selling a property, such as to pay real estate agents, the title company, government fees, etc. They are commonly about 6% of the selling price.",
    }),
    ...simplePeriodic("expenses", "Property expenses"),
    ...simplePeriodic("targetRent", "Target rent"),
    ...simplePeriodic("homeInsOngoing", "Home insurance"),
    ...simplePeriodic("taxesOngoing", "Home insurance"),
    ...simplePeriodic("utilitiesOngoing", "Utilities"),
    rehabCost: input("Rehab cost"),
    rehabCostBase: input("Rehab cost base"),
    afterRepairValue: text({
      inputLabel: "After repair value",
      title: "After Repair Value",
      info: `This is the price that a property is sold at after repairs are made.`,
    }),
    holdingPeriodYears: multis.holdingPeriod,
    holdingPeriodMonths: multis.holdingPeriod,
    holdingPeriodSpanEditor: multis.holdingPeriod,
    holdingCostTotal: input("Property holding costs"),
    miscOnetimeCosts: text({
      inputLabel: "Misc onetime costs",
      variableLabel: "Misc onetime property costs",
    }),
    upfrontExpenses: text({
      inputLabel: "Upfront expenses",
      variableLabel: "Upfront property expenses",
    }),
    ...simplePeriodic("taxesHolding", "Holding period taxes"),
    ...simplePeriodic("homeInsHolding", "Holding period home insurance"),
    ...simplePeriodic("utilitiesHolding", "Holding period utilities"),
    ...simplePeriodic("miscRevenue", "Misc revenue"),
    ...simplePeriodic("miscCosts", "Misc costs", {
      variableLabel: "Misc property costs",
    }),
    ...simplePeriodic("holdingCost", "Holding cost", {
      variableLabel: "Propety holding cost",
    }),
    ...simplePeriodic("revenue", "Revenue"),
  }),
  ...prop("unit", {
    numBedrooms: input("BR count"),
    targetRentPeriodicEditor: input("Rent"),
    ...simplePeriodic("targetRent", "Rent"),
  }),
  ...prop("capExList", simplePeriodic("total", "Total")),
  ...prop("capExItem", {
    ...simplePeriodic("value", "Item cost"),
    ...simpleSpan("lifespan", "Item lifespan"),
    lifespanSpanEditor: input("Item lifespan"),
    costToReplace: input("Item cost to replace"),
  }),
  ...prop("repairValue", {
    valueDollars: text({
      inputLabel: "Repair cost",
      variableLabel: "Upfront repair cost",
    }),
    valueDollarsEditor: text({
      inputLabel: "Repair cost",
      variableLabel: "Upfront repair cost",
    }),
  }),
  ...prop("costOverrunValue", {
    valueDollars: text({
      inputLabel: "Cost overrun",
      variableLabel: "Upfront cost overrun",
    }),
    valueDollarsEditor: text({
      inputLabel: "Cost overrun",
      variableLabel: "Upfront cost overrun",
    }),
    valuePercent: text({
      inputLabel: "Cost overrun",
      variableLabel: "Upfront cost overrun",
    }),
    valuePercentEditor: text({
      inputLabel: "Cost overrun %",
      variableLabel: "Upfront cost overrun %",
    }),
    valueDecimal: input("Cost overrun percent as decimal"),
  }),
  ...prop("sellingCostValue", {
    valueDollars: input("Selling cost"),
    valueDollarsEditor: input("Selling cost"),
    valuePercent: input("Selling cost"),
    valuePercentEditor: input("Selling cost"),
    valueDecimal: input("Selling cost percent as decimal"),
  }),
  ...prop("utilityValue", {
    ...simplePeriodic("valueDollars", "Utility costs"),
    valueDollarsPeriodicEditor: input("Utility costs"),
  }),
  ...prop("maintenanceValue", {
    ...simplePeriodic("valueDollars", "Maintenance costs"),
    valueDollarsPeriodicEditor: input("Maintenance costs"),
  }),
  ...prop("taxesHolding", {
    ...simplePeriodic("valueDollars", "Taxes"),
    valueDollarsPeriodicEditor: input("Taxes"),
  }),
  ...prop("taxesOngoing", {
    ...simplePeriodic("valueDollars", "Taxes"),
    valueDollarsPeriodicEditor: input("Taxes"),
  }),
  ...prop("homeInsHolding", {
    ...simplePeriodic("valueDollars", "Home insurance"),
    valueDollarsPeriodicEditor: input("Home insurance"),
  }),
  ...prop("homeInsOngoing", {
    ...simplePeriodic("valueDollars", "Home insurance"),
    valueDollarsPeriodicEditor: input("Home insurance"),
  }),

  ...prop("financing", {
    ...simplePeriodic("averagePrincipal", "Average principal payment"),
    ...simplePeriodic("averageInterest", "Average interest payment"),
    loanUpfrontExpenses: text({
      inputLabel: "Upfront loan expenses",
    }),
    loanTotalDollars: text({
      inputLabel: "Total loan amount",
    }),
    loanPaymentMonthly: text({
      inputLabel: "Loan payment",
    }),
    loanPaymentYearly: text({
      inputLabel: "Loan payment",
    }),
    loanExpensesMonthly: text({
      inputLabel: "Loan expenses",
    }),
    loanExpensesYearly: text({
      inputLabel: "Loan expenses",
    }),
    ...simplePeriodic("mortgageIns", "Total mortgage insurance"),
    mortgageInsUpfront: input("Total upfront mortgage insurance"),
    ...simpleSpan("timeTillRefinance", "Time till refinance"),
    timeTillRefinanceSpanEditor: input("Time till refinance"),
    loanBaseDollars: input("Total loan base"),
    closingCosts: input("Total closing costs"),
  }),
  ...prop("loan", {
    ...simplePeriodic("loanPayment", "Loan payment"),
    ...simplePeriodic("expenses", "Total loan expenses"),
    closingCosts: multis.closingCosts,
    hasMortgageIns: text({
      inputLabel: "Mortgage insurance",
      title: "Mortgage Insurance",
      info: `Sometimes in order to get a loan you are required to pay for mortgage insurance. This tends to happen with loans where the borrower pays a low down payment—lower than 20%.\n\nMortgage insurance basically assures the bank that it will be able to recover its assets in the event that the borrower does not repay them, which makes it less risky for them to work with smaller down payments.\n\nYou may be required to pay the mortgage insurance in a lump sum at the time of closing, or as a recurring monthly payment, or both. To determine whether you'll need mortgage insurance and, if so, in what form and at what cost, either research the type of loan you're entering or ask your lender.`,
    }),
    loanBaseDollars: input("Base loan amount"),
    ...periodicInput("interestRatePercent", "Interest rate"),
    ...simplePeriodic("interestRateDecimal", "Interest rate as decimal"),
    ...spanInput("loanTerm", "Loan term"),
    ...simplePeriodic("piFixedStandard", "Principal and interest payment"),
    ...simplePeriodic("interestOnlySimple", "Interest only payment"),
    ...simplePeriodic("averagePrincipal", "Average principal payment"),
    ...simplePeriodic("averageInterest", "Average interest payment"),
    mortgageInsUpfront: input("Upfront mortgage insurance"),
    mortgageInsUpfrontEditor: input("Upfront mortgage insurance"),
    ...periodicInput("mortgageIns", "Mortgage insurance"),
    loanTotalDollars: input("Total loan amount"),
    fivePercentBaseLoan: input("5% base loan"),
  }),
  ...prop("mgmt", {
    ...simplePeriodic("basePayDollars", "Mgmt base pay"),
    basePayPercent: input("Mgmt base pay"),
    ...simplePeriodic("expenses", "Management expenses"),
    ...simplePeriodic("vacancyLossDollars", "Vacancy loss"),
    vacancyLossPercent: input("Vacancy loss"),
    ...simplePeriodic("miscCosts", "Misc costs"),
    miscOnetimeCosts: input("Misc onetime costs"),
  }),
  ...prop("miscOngoingCost", {
    ...simplePeriodic("valueDollars", "Misc costs"),
    valueDollarsPeriodicEditor: input("Misc costs"),
  }),
  ...prop("miscHoldingCost", {
    ...simplePeriodic("valueDollars", "Misc costs"),
    valueDollarsPeriodicEditor: input("Misc costs"),
  }),
  ...prop("miscOnetimeCost", {
    valueDollars: input("Misc onetime costs"),
    valueDollarsEditor: input("Misc onetime costs"),
  }),
  ...prop("miscRevenueValue", {
    ...simplePeriodic("valueDollars", "Misc revenue"),
    valueDollarsPeriodicEditor: input("Misc revenue"),
  }),
  ...prop("miscOngoingCost", {
    ...simplePeriodic("valueDollars", "Misc ongoing costs"),
    valueDollarsPeriodicEditor: input("Misc ongoing costs"),
  }),
  ...prop("mgmtBasePayValue", {
    ...simplePeriodic("valueDollars", "Mgmt base pay"),
    valueDollarsPeriodicEditor: input("Mgmt base pay"),
    valuePercentEditor: input("Mgmt base pay"),
    valuePercent: input("Mgmt base pay"),
    valueDecimal: input("Base pay percent as decimal"),
  }),
  ...prop("vacancyLossValue", {
    valueSourceName: multis.vacancyLoss,
    ...simplePeriodic("valueDollars", "Vacancy loss"),
    valueDollarsPeriodicEditor: input("Vacancy loss"),
    valuePercentEditor: input("Vacancy loss"),
    valuePercent: input("Vacancy loss"),
    valueDecimal: input("Vacancy loss percent as decimal"),
  }),
  ...prop("deal", {
    dealMode: multis.dealMode,
    ...simplePeriodic(
      "averageNonPrincipalCost",
      "Average non-principal costs",
      {
        title: "Average Non-Principal Cost",
        info: `The average monthly or yearly cost of all ongoing expenses that would be associated with this deal—property maintenance costs, taxes, loan payments, etc.—minus the average principal loan payment amount given the duration of your loan(s).\n\n
      When you pay towards your principal, you gain equity in your property, so you don't really lose that money. So by subtracting that from the rest of your expenses, you can get a better idea of how much money this deal would actually cost you per month.\n\nHomebuyers can use this to compare deal expenses to what they'd otherwise spend as renters.`,
      }
    ),
    ...simplePeriodic("ongoingPiti", "PITI payments", {
      title: "PITI",
      info: `"PITI" stands for "principal and interest, taxes, and insurance". Often, these are the things included in the payments that homebuyers send to the bank every month.`,
    }),
    ...simpleSpan("purchaseLoanHolding", "Purchase loan holding period"),
    ...simpleSpan("refiLoanHolding", "Refi loan holding period"),
    holdingPurchaseLoanPayment: input(
      "Holding period purchase loan payment sum"
    ),
    holdingRefiLoanPayment: input("Holding period refi loan payment sum"),
    allClosingCosts: input("All financing closing costs"),
    ...simplePeriodic("ongoingLoanPayment", "Loan payment"),
    ...simplePeriodic("expenses", "Average ongoing costs"),
    totalProfit: input("Total profit"),
    totalInvestment: text({
      inputLabel: "Total investment",
      title: "Total Investment",
      info: "The total amount of upfront cash needed for a deal after all loans have been applied.",
    }),
    cashExpensesPlusLoanRepay: input("Cash expenses and loan repayment"),
    preFinanceOneTimeExpenses: input("Pre-financing upfront costs"),
    totalHoldingLoanPayment: input("Total holding loan payment"),
    ...simplePeriodic("cocRoiDecimal", "CoC ROI Decimal"),
    cocRoiMonthly: multis.cocRoi("monthly"),
    cocRoiYearly: multis.cocRoi("yearly"),
    ...simplePeriodic("cashFlow", "Cash flow", {
      title: "Cash Flow",
      info: "The income that a property brings in every month or year, after expenses have been subtracted.",
    }),
    roiDecimal: input("ROI Decimal"),
    roiPercent: text({
      inputLabel: "ROI",
      title: "Return on Investment",
      info: "The total profit from increasing a property's value after purchase, as a percent of the cash that was invested to do so",
    }),
    roiPercentPerMonth: input("ROI percent per month"),
    roiPercentAnnualized: text({
      inputLabel: "ROI annualized",
      title: "Annualized Return on Investment",
      info: `The total profit from increasing a property's value after purchase, as a percent of the cash that was invested to do so, divided by the number of years—or by the fraction of years—that the holding period lasted.\n\nThis can be used to compare ROI from one-time windfall income with ongoing Cash on Cash ROI from other types of investments.`,
    }),
  }),

  ...prop("ongoingValue", periodicInput("value", "")),
  ...prop("virtualVarb", { value: input("") }),
  ...prop("conditionalRowList", { value: input("") }),
  ...prop("conditionalRow", {
    left: input(""),
    rightValue: input(""),
    then: input(""),
  }),
});

type Options = { title?: string; info?: string; variableLabel?: string };
function periodicInput<BN extends string>(
  baseName: BN,
  inputLabel: string,
  options: Options = {}
): {
  [T in
    | "Monthly"
    | "Yearly"
    | "PeriodicEditor" as `${BN}${T}`]: VarbInfoTextProps;
} {
  return {
    ...simplePeriodic(baseName, inputLabel, options),
    [`${baseName}PeriodicEditor`]: text({
      inputLabel,
      ...options,
      variableLabel: options.variableLabel ?? inputLabel,
    }),
  };
}

function simplePeriodic<BN extends string>(
  baseName: BN,
  inputLabel: string,
  { variableLabel, ...rest }: Options = {}
): {
  [T in "Monthly" | "Yearly" as `${BN}${T}`]: VarbInfoTextProps;
} {
  return {
    [`${baseName}${"Monthly"}`]: text({
      inputLabel,
      variableLabel: (variableLabel ?? inputLabel) + " monthly",
      ...rest,
    }),
    [`${baseName}${"Yearly"}`]: text({
      inputLabel,
      variableLabel: (variableLabel ?? inputLabel) + " yearly",
      ...rest,
    }),
  };
}

function spanInput<BN extends string>(
  baseName: BN,
  inputLabel: string,
  options: Options = {}
): {
  [T in "Months" | "Years" | "SpanEditor" as `${BN}${T}`]: VarbInfoTextProps;
} {
  return {
    ...simpleSpan(baseName, inputLabel, options),
    [`${baseName}SpanEditor`]: text({
      inputLabel,
      ...options,
      variableLabel: options.variableLabel ?? inputLabel,
    }),
  };
}

function simpleSpan<BN extends string>(
  baseName: BN,
  inputLabel: string,
  { variableLabel, ...rest }: Options = {}
): {
  [T in "Months" | "Years" as `${BN}${T}`]: VarbInfoTextProps;
} {
  return {
    [`${baseName}${"Months"}`]: text({
      inputLabel,
      variableLabel: (variableLabel ?? inputLabel) + " months",
      ...rest,
    }),
    [`${baseName}${"Years"}`]: text({
      inputLabel,
      variableLabel: (variableLabel ?? inputLabel) + " years",
      ...rest,
    }),
  };
}

export interface VarbInfoTextProps {
  inputLabel: DisplayName;
  variableLabel: DisplayName;
  title: string;
  info: string;
}

function input(inputLabel: string) {
  return text({ inputLabel });
}
// I either want it to be "" or inputLabel
function text({
  inputLabel = "",
  variableLabel = inputLabel,
  title = "",
  info = "",
}: Partial<VarbInfoTextProps>): VarbInfoTextProps {
  return {
    inputLabel,
    variableLabel,
    title,
    info,
  };
}

export type VarbInfoText = VarbInfoTextProps | null;

type SectionInfoText<SN extends SectionName> = Record<
  VarbName<SN>,
  VarbInfoText
>;

function emptySctionInfoText<SN extends SectionName>(
  sectionName: SN
): SectionInfoText<SN> {
  const varbNames = sectionVarbNames(sectionName);
  return varbNames.reduce((infoTexts, varbName) => {
    infoTexts[varbName] = null;
    return infoTexts;
  }, {} as SectionInfoText<SN>);
}
function prop<SN extends SectionName>(
  sectionName: SN,
  partial: Partial<SectionInfoText<SN>>
): Record<SN, SectionInfoText<SN>> {
  return {
    [sectionName]: {
      ...emptySctionInfoText(sectionName),
      ...partial,
    },
  } as Record<SN, SectionInfoText<SN>>;
}

function defaultSectionInfoTexts(): InfoTexts {
  return sectionNames.reduce((defaultTexts, sectionName) => {
    (defaultTexts[sectionName] as SectionInfoText<typeof sectionName>) =
      emptySctionInfoText(sectionName);
    return defaultTexts;
  }, {} as InfoTexts);
}

function checkSectionInfoTexts<T extends InfoTexts>(t: T): T {
  const pathsNeedingLabels = [];
  for (const sectionName of sectionNames) {
    const varbLs = t[sectionName];
    const varbNames = sectionVarbNames(sectionName);
    for (const varbName of varbNames) {
      const valueName = sectionVarbValueName(
        sectionName,
        varbName
      ) as ValueName;

      if (valueName === "numObj" && !varbLs[varbName]) {
        pathsNeedingLabels.push(`${sectionName}.${varbName}`);
      }
    }
  }

  if (pathsNeedingLabels.length > 0) {
    throw new Error(
      `The following varbs need labels:\n${pathsNeedingLabels.join("\n")}`
    );
  }

  return t;
}

export const capExItemizeDescription = `Itemizing CapEx is pretty easy, and it can be more accurate using a general rule of thumb like the 5% rent rule.\n\nFor each major capital expense item a property has, simply enter an estimate of the cost to replace that item and an estimate of how long the replacement would likely last. The app will calculate the rest.`;

export function getVarbLabels<SN extends SectionName, VN extends VarbName<SN>>(
  sectionName: SN,
  varbName: VN
): VarbInfoTextProps {
  const sectionVarbs = varbLabels[sectionName];
  const labels = (sectionVarbs as any)[varbName];
  if (!labels) {
    throw new Error(`Varb ${sectionName}.${varbName} has no labels.`);
  }
  return labels;
}

export function fixedVariableLabel<
  SN extends SectionName,
  VN extends VarbName<SN>
>(sectionName: SN, varbName: VN): string {
  const labels = getVarbLabels(sectionName, varbName);
  if (!labels) {
    throw new Error(`varbLabels for ${sectionName}.${varbName} returned null.`);
  }
  const { variableLabel } = labels;
  if (typeof variableLabel !== "string") {
    throw new Error(`variableLabel is not a string.`);
  } else if (!variableLabel) {
    throw new Error(`Variable label for ${sectionName}.${varbName} is blank`);
  } else {
    return variableLabel;
  }
}

export type DisplayName = string | RelLocalVarbInfo;