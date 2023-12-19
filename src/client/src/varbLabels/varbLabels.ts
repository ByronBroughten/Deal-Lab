import { externalLink } from "../sharedWithServer/Constants/externalLinks";
import {
  RelLocalVarbInfo,
  relVarbInfoS,
} from "../sharedWithServer/SectionInfos/RelVarbInfo";
import {
  SectionName,
  sectionNames,
} from "../sharedWithServer/sectionVarbsConfig/SectionName";
import { dealModeLabels } from "../sharedWithServer/sectionVarbsConfig/StateValue/unionValues";
import { SwitchTargetKey } from "../sharedWithServer/sectionVarbsConfig/allBaseSectionVarbs/baseSwitchNames";
import {
  VarbName,
  sectionVarbNames,
} from "../sharedWithServer/sectionVarbsConfigDerived/baseSectionsDerived/baseSectionsVarbsTypes";
import { StrictOmit } from "../sharedWithServer/utils/types";

const multis = {
  prepaids: text({
    inputLabel: "Prepaids",
    title: "Prepaids",
    info: `Monthly or annual costs that you pay for upfront. The most common prepaids are property taxes, home insurance, mortgage interest, and private mortgage insurance.\n\nThese are factored into your upfront cash needed. To avoid counting them twice for calculating investment metrics, however, they are not included in your upfront investment total.`,
  }),
  loanExtras: text({
    inputLabel: "Loan extras",
    title: "Loan extras",
    info: "This is for any additional upfront costs you intend to wrap into the loan. For example, You might wrap in closing costs.",
  }),
  dealMode: text({
    inputLabel: "Select type",
    title: "Deal Types",
    info: `${dealModeLabels.homeBuyer}: estimate the costs of a home intended to be used as a primary residence.\n\n${dealModeLabels.buyAndHold}: estimate the ongoing cashflow and return on investment of a rental property.\n\n${dealModeLabels.fixAndFlip}: estimate the return on investment of buying, fixing, and selling a property.\n\n${dealModeLabels.brrrr}: "Buy, Rehab, Rent, Refinance, Repeat". A more advanced type of deal whereby a fix and flip deal is turned into a rental property.`,
  }),
  closingCosts: text({
    inputLabel: "Closing costs",
    title: "Closing Costs",
    info: `Most loans require that the borrower pay a number of onetime fees—appraisal fees, title fees, government fees. Collectively, these fees are called closing costs.\n\nNote that closing costs don't include prepaid or escrow costs, such as prepaid home insurance or taxes.`,
  }),
  afterRepairValue: text({
    inputLabel: "After repair value",
    title: "After Repair Value",
    info: `This is the price that a property could feasibly sell for after planned rehab is complete.`,
  }),
  vacancyLoss: text({
    inputLabel: "Vacancy loss",
    title: "Vacancy Loss",
    info: `No property will be fully occupied 100% of the time. When tenants move out, it can sometimes take days or weeks to prepare their unit for another renter. To account for this, assume you will miss out on a certain portion of the property's rent.\n\nIf you're owner-managing the property and you're determined to keep vacancy low, a common method is to asume you will miss out on 5% of the rent; and if you're using a property manager or management company (who probably won't be quite as motivated as you), something like 10% is common to assume.`,
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
    valueSourceName: input("Base loan amount"),
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

function sit<SN extends SectionName>(
  sectionName: SN,
  partial: Partial<SectionInfoText<SN>>
): SectionInfoText<SN> {
  return {
    ...emptySctionInfoText(sectionName),
    ...partial,
  };
}

export type AllVarbLabels = { [SN in SectionName]: SectionInfoText<SN> };
export const varbLabels = checkAllVarbLabels({
  ...defaultSectionInfoTexts(),
  timespanEditor: sit("timespanEditor", {
    valueEditor: input("Timespan editor"),
    valueMonths: input("Months"),
    valueYears: input("Years"),
    valueEditorUnit: input("Editor unit"),
  }),
  periodicEditor: sit("periodicEditor", {
    valueEditor: input("Periodic editor"),
    valueMonthly: input("Monthly value"),
    valueYearly: input("Yearly value"),
    valueEditorFrequency: input("Editor frequency"),
  }),
  afterRepairValue: sit("afterRepairValue", {
    valueSourceName: text({
      inputLabel: "After repair value",
      title: "After Repair Value",
      info: "The expected value of a property after all the planned repairs have been made to it. This is useful for calculating gained equity for the property owner.",
    }),
    valueDollarsEditor: input("After repair value"),
    valueDollars: input("After repair value"),
  }),
  delayedCostValue: sit("delayedCostValue", {
    valueSourceName: text({
      inputLabel: "Delayed costs",
      title: "Delayed Costs",
      info: `Onetime expenses that you will have to pay for at some point but that you don't need to have the cash for at or around the time of purchasing a property. A good example is gutters: they're a common onetime expense that costs a lot, but you usually don't need them right away.\n\nThis is used for calculating your upfront investment total but it's left out of your upfront cash needed.`,
    }),
    valueDollars: input("Delayed costs"),
    valueDollarsEditor: input("Delayed costs"),
  }),
  ...prop("capExValue", {
    valueSourceName: text({
      inputLabel: "Capital expenses",
      title: "Capital Expenses",
      moreInfoLink: externalLink("capEx"),
      info: `Capital expenses, or CapEx, are the big expensive things that every property has that will eventually need to be replaced—the roof, furnace, water heater, etc. No long-term analysis of a property is complete without accounting for these.\n\nTo do so, simply go through each major capital expense and estimate how much it would cost to replace it and how many years a replacement would last. From there, the app will calculate how much you should budget per month for all of them together.\n\nWe included a handy template of national averages. Feel free to use that as a rough estimate or tailor it to suite your needs`,
    }),
    ...simplePeriodic("valueDollars", "Capital Expenses"),
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
      inputLabel: "Maintenance",
      title: "Maintenance",
      info: `Every property needs minor repairs from time to time. Doorknobs break. Oven igniters die. Pipes burst. To account for these and other miscellaneous things, there are a few common methods.\n\nOne is to assume you will spend $1 per property square foot per year. The idea is that the more square feet there are, the more opportunity for things to go wrong.\n\nAnother common method is to assume that miscellanious repairs will cost 1% of the property's dollar value per year. The reasoning is that more expensive properties may generally have more expensive components that require more expensive repairs.\n\nA third method is to use the average between the first two methods.\n\nThere are probably other, more creative methods out there. By selecting "custom amount", you are free to enter any equation that suits you.`,
    }),
    ...simplePeriodic("valueDollars", "Maintenance"),
  }),
  ...prop("costOverrunValue", {
    valueSourceName: text({
      inputLabel: "Cost overrun",
      title: "Cost Overrun",
      info: `Cost overrun is the sum of costs over the entirety of a project that were not anticipated upfront. Cost overrun is common, especially for larger projects.\n\nFor sizable rehab projects, it's common to factor in an extra 10-15% of the base rehab estimate for cost overrun. That may not be necessary for turnkey properties or light rehab.`,
    }),
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
  calculatedVarbs: sit("calculatedVarbs", {
    currentYear: input("Current year"),
    propertyAge: input("Property age"),
    onePercentPrice: input("1% Purchase price"),
    twoPercentPrice: input("2% Purchase price"),
    onePercentArv: input("1% After repair value"),
    twoPercentArv: input("2% After repair value"),
    ...simplePeriodic("fivePercentRent", "5% rent"),
    pricePerSqft: input("Price per sqft"),
    pricePerUnit: input("Price per unit"),
    arvPerSqft: input("After repair value per sqft"),
    rehabPerSqft: input("Rehab cost per sqft"),
    two: input("2"),
    twelve: input("12"),
    thirty: input("30"),
    threeHundred: input("300"),
    threeHundredPerUnit: input("300 per unit"),
    threeHundredPerUnitTimesTwelve: input("300 per unit times twelve"),
    ...simplePeriodic("tenPercentRent", "10% rent"),
    onePercentPricePlusSqft: input("sqft + 1% property price"),
    onePercentPriceSqftAverage: input("Average of sqft + 1% price"),
    onePercentArvPlusSqft: input("sqft + 1% property ARV"),
    onePercentArvSqftAverage: input("Average of sqft + 1% ARV"),
  }),
  ...prop("loanBaseValue", {
    valueSourceName: input("Base loan"),
    valueDollars: input("Base loan amount"),
  }),
  ...prop("loanBaseExtra", {
    valueSourceName: input("Extra costs covered by loan"),
    hasLoanExtra: multis.loanExtras,
    valueDollars: input("Extra cost covered by loan"),
    valueDollarsEditor: input("Extra cost covered by loan"),
  }),
  ...prop("customLoanBase", {
    valueSourceName: input("Base loan amount"),
    valueDollars: input("Base loan amount"),
    valueDollarsEditor: input("Base loan amount"),
  }),
  ...prop("closingCostValue", {
    valueSourceName: multis.closingCosts,
    valueDollars: input("Closing costs"),
    valueDollarsEditor: input("Closing costs"),
  }),
  ...prop("property", {
    propertyMode: multis.dealMode,
    purchasePrice: input("Purchase price"),
    sqft: input("Square feet"),
    yearBuilt: input("Year built"),
    singleMultiBrCount: input("Bedroom count"),
    singleMultiNumUnits: input("Unit count"),
    isRenting: text({
      inputLabel: "Rental income",
      title: "Rental income",
      info: "Rental income can help offset housing expenses. People sometimes rent out bedrooms, basements, or even whole additional units, in the case of multi-family properties.",
    }),
    isMultifamily: text({
      inputLabel: "Multi family",
      title: "Multi family properties",
      info: "Multi family properties have more than one unit. Think duplexes, triplexes, and so on. Properties like these can help offset ongoing costs by providing extra rental income.",
    }),
    numUnits: input("Unit count"),
    numUnitsEditor: input("Unit count"),
    numBedrooms: input("Bedroom count", { variableLabel: "BR Count" }),
    likability: input("Likability"),
    pricePerLikability: input("Price per likability"),
    sellingCosts: text({
      inputLabel: "Selling costs",
      title: "Selling Costs",
      info: "These are the costs associated with selling a property, such as to pay real estate agents, the title company, government fees, etc. They are commonly about 6% of the selling price.",
    }),
    ...simplePeriodic("expensesOngoing", "Average expenses", {
      variableLabel: "Average property expenses",
    }),
    ...simplePeriodic("targetRent", "Rent"),
    ...simplePeriodic("homeInsOngoing", "Home insurance"),
    ...simplePeriodic("taxesOngoing", "Taxes"),
    ...simplePeriodic("utilitiesOngoing", "Utilities"),
    rehabCost: input("Rehab cost"),
    rehabCostBase: input("Rehab cost base"),
    afterRepairValue: multis.afterRepairValue,
    afterRepairValueEditor: multis.afterRepairValue,
    ...simpleSpan("holdingPeriod", "Holding period", {
      title: "Holding Period",
      info: `This is the amount of time that a property is owned before its rehab is complete and it is either sold (in the case of fix and flip) or refinanced and rented out (in the case of brrrr).\n\nTypically, the longer the holding period, the more that costs will accumulate.`,
    }),
    holdingCostTotal: input("Holding costs", {
      variableLabel: "Property holding costs",
    }),
    miscOnetimeCosts: text({
      inputLabel: "Misc upfront costs",
      variableLabel: "Misc upfront property costs",
    }),
    upfrontExpenses: text({
      inputLabel: "Upfront expenses",
      variableLabel: "Upfront property expenses",
    }),
    ...simplePeriodic("taxesHolding", "Holding period taxes"),
    ...simplePeriodic("homeInsHolding", "Holding period home insurance"),
    ...simplePeriodic("utilitiesHolding", "Holding period utilities"),
    ...simplePeriodic("miscOngoingRevenue", "Misc revenue"),
    ...simplePeriodic("miscOngoingCosts", "Misc costs", {
      variableLabel: "Misc property costs",
    }),
    ...simplePeriodic("holdingCost", "Holding cost", {
      variableLabel: "Propety holding cost",
    }),
    ...simplePeriodic("revenueOngoing", "Revenue"),
  }),
  ...prop("unit", {
    numBedrooms: input("BR count"),
    ...simplePeriodic("targetRent", "Rent"),
  }),
  ...prop("capExList", simplePeriodic("total", "Total")),
  ...prop("capExItem", {
    ...simplePeriodic("valueDollars", "Item cost"),
    ...simpleSpan("lifespan", "Item lifespan"),
    costToReplace: input("Item cost to replace"),
  }),
  ...prop("repairValue", {
    valueSourceName: input("Repair costs"),
    valueDollars: text({
      inputLabel: "Repair cost",
      variableLabel: "Upfront repair cost",
    }),
    valueDollarsEditor: text({
      inputLabel: "Repair cost",
      variableLabel: "Upfront repair cost",
    }),
  }),
  ...prop("sellingCostValue", {
    valueSourceName: input("Selling costs"),
    valueDollars: input("Selling cost"),
    valueDollarsEditor: input("Selling cost"),
    valuePercent: input("Selling cost"),
    valuePercentEditor: input("Selling cost"),
    valueDecimal: input("Selling cost percent as decimal"),
  }),
  ...prop("utilityValue", {
    valueSourceName: input("Utilities"),
    ...simplePeriodic("valueDollars", "Utility costs"),
  }),

  ...prop("taxesValue", periodicAndSource("valueDollars", "Taxes")),
  ...prop("homeInsValue", periodicAndSource("valueDollars", "Home insurance")),
  ...prop("financing", {
    ...simplePeriodic("averagePrincipal", "Average principal payment"),
    ...simplePeriodic("averageInterest", "Average interest payment"),
    loanUpfrontExpenses: text({
      inputLabel: "Upfront loan costs",
    }),
    loanTotalDollars: text({
      inputLabel: "Loan total",
    }),
    loanPaymentMonthly: text({
      inputLabel: "Loan payment",
    }),
    loanPaymentYearly: text({
      inputLabel: "Loan payment",
    }),
    loanExpensesMonthly: text({
      inputLabel: "Ongoing expenses",
      variableLabel: "Loan expenses",
    }),
    loanExpensesYearly: text({
      inputLabel: "Ongoing epenses",
      variableLabel: "Loan expenses",
    }),
    ...simplePeriodic("mortgageIns", "Total mortgage insurance"),
    mortgageInsUpfront: input("Total upfront mortgage insurance"),
    ...simpleSpan("timeTillRefinance", "Time till refinance"),
    loanBaseDollars: input("Total loan base"),
    closingCosts: input("Total closing costs"),
  }),
  ...prop("mortgageInsUpfrontValue", {
    valueSourceName: input("Upfront mortgage insurance"),
    valueDollarsEditor: input("Upfront mortgage insurance"),
    percentLoanEditor: input("Upfront mortgage insurance"),
    decimalOfLoan: input("Upfront mortgage insurance decimal"),
  }),
  ...prop("mortgageInsPeriodicValue", {
    valueSourceName: input("Periodic mortgage insurance"),
    ...simplePeriodic("valueDollars", "Mortgage insurance"),
    ...simplePeriodic("percentLoan", "Mortgage insurance"),
    ...simplePeriodic("decimalOfLoan", "Mortgage insurance decimal"),
  }),
  prepaidPeriodic: sit("prepaidPeriodic", {
    valueSourceName: multis.prepaids,
    valueMonths: input("Prepaids"),
    valueYears: input("Prepaids"),
    valueDollarsEditor: input("Prepaids"),
  }),
  prepaidDaily: sit("prepaidDaily", {
    valueSourceName: multis.prepaids,
    valueDollarsEditor: input("Prepaids"),
    valueSpanEditor: input("Prepaids"),
  }),
  loan: sit("loan", {
    ...simplePeriodic("loanPayment", "Loan payment"),
    ...simplePeriodic("expenses", "Total loan expenses"),
    firstInterestPayment: input("First interest payment"),
    firstInterestPaymentOneDay: input("First one-day interest payment"),
    prepaidInterest: input("Prepaid interest"),
    prepaidTaxes: input("Prepaid taxes"),
    prepaidHomeIns: input("Prepaid home insurance"),
    prepaidTotal: multis.prepaids,
    closingCosts: multis.closingCosts,
    hasMortgageIns: text({
      inputLabel: "Mortgage insurance",
      title: "Mortgage Insurance",
      info: `Sometimes in order to get a loan you are required to pay for mortgage insurance. This tends to happen with loans where the borrower pays a low down payment—lower than 20%.\n\nMortgage insurance basically assures the bank that it will be able to recover its assets in the event that the borrower does not repay them, which makes it less risky for them to work with smaller down payments.\n\nYou may be required to pay the mortgage insurance in a lump sum at the time of closing, or as a recurring monthly payment, or both. To determine whether you'll need mortgage insurance and, if so, in what form and at what cost, either research the type of loan you're entering or ask your lender.`,
    }),
    loanBaseDollars: input("Base loan amount"),
    ...simplePeriodic("interestRatePercent", "Interest rate"),
    ...simplePeriodic("interestRateDecimal", "Interest rate as decimal"),
    ...simpleSpan("loanTerm", "Loan term"),
    ...simplePeriodic("piFixedStandard", "Principal and interest"),
    ...simplePeriodic("interestOnlySimple", "Interest only payment"),
    ...simplePeriodic("averagePrincipal", "Average principal payment"),
    ...simplePeriodic("averageInterest", "Average interest payment"),
    mortgageInsUpfront: input("Upfront mortgage insurance"),
    ...simplePeriodic("mortgageIns", "Mortgage insurance"),
    loanTotalDollars: input("Total loan amount"),
    fivePercentBaseLoan: input("5% base loan"),
  }),
  ...prop("mgmt", {
    ...simplePeriodic("basePayDollars", "Base pay", {
      variableLabel: "Mgmt base pay",
    }),
    basePayPercent: input("Base pay", { variableLabel: "Mgmt pase pay" }),
    ...simplePeriodic("expenses", "Expenses", {
      variableLabel: "Management expenses",
    }),
    ...simplePeriodic("vacancyLossDollars", "Vacancy loss"),
    vacancyLossPercent: input("Vacancy loss"),
    ...simplePeriodic("miscCosts", "Misc costs"),
    miscOnetimeCosts: input("Misc onetime costs"),
  }),
  ...prop("miscPeriodicValue", periodicAndSource("valueDollars", "Misc")),
  ...prop("miscOnetimeValue", {
    valueSourceName: input("Misc upfront costs"),
    valueDollars: input("Misc upfront costs"),
    valueDollarsEditor: input("Misc upfront costs"),
  }),
  ...prop("mgmtBasePayValue", {
    ...periodicAndSource("valueDollars", "Base pay", {
      variableLabel: "Mgmt base pay",
    }),
    valuePercentEditor: input("Base pay", {
      variableLabel: "Mgmt base pay percent",
    }),
    valuePercent: input("Base pay", {
      variableLabel: "Mgmt base pay percent",
    }),
    valueDecimal: input("Base pay percent as decimal"),
  }),
  ...prop("vacancyLossValue", {
    valueSourceName: multis.vacancyLoss,
    ...simplePeriodic("valueDollars", "Vacancy loss"),
    valuePercentEditor: input("Vacancy loss"),
    valuePercent: input("Vacancy loss"),
    valueDecimal: input("Vacancy loss percent as decimal"),
  }),
  ...prop("deal", {
    dealMode: multis.dealMode,
    ...simplePeriodic(
      "averageNonPrincipalOngoing",
      "Average non-principal cost",
      {
        title: "Average Non-Principal Cost",
        info: `The average cost of all ongoing expenses that would be associated with this deal—loan payments, taxes, property maintenance, etc.—minus the average principal portion of your loan payments over the duration of your loan(s).\n\nWhen you pay towards the loan principal, you gain equity in your property, so you don't really lose that money. Subtracting that from the rest of your expenses gives a better idea of how much money this deal would actually cost you per month, which you can compare to what you'd otherwise spend on rent and utilities as a renter.`,
      }
    ),
    ...simplePeriodic(
      "netNonPrincipalOngoing",
      "Average net non-principal costs",
      {
        title: "Average Net Non-Principal Cost",
        info: `The average cost of all ongoing expenses that would be associated with this deal—loan payments, taxes, property maintenance, etc.—minus any income from the property, and minus the average principal portion of your loan payments over the duration of your loan(s).\n\nWhen you pay towards the loan principal, you gain equity in your property, so you don't really lose that money. Subtracting that from the rest of your expenses gives a better idea of how much money this deal would actually cost you per month, which you can compare to what you'd otherwise spend as a renter for rent and utilities.`,
      }
    ),
    ...simplePeriodic("ongoingPiti", "PITI payment", {
      title: "PITI",
      info: `"PITI" stands for "principal and interest, taxes, and insurance". Often, these are the things included in the payments that homebuyers send to the bank every month.`,
    }),
    ...simplePeriodic("netExpensesOngoing", "Net expenses", {
      title: "Net expenses",
      info: "Net expenses are just a home's total expenses (including financing and property expenses) minus any income that the property produces.",
    }),
    ...simpleSpan("timeTillValueAddProfit", "Time till value add profit"),
    ...simpleSpan("purchaseLoanHolding", "Purchase loan holding period"),
    ...simpleSpan("refiLoanHolding", "Refi loan holding period"),
    purchaseLoanHoldingCost: input("Holding period purchase loan payment sum"),
    refiLoanHoldingCost: input("Holding period refi loan payment sum"),
    ...simplePeriodic("ongoingLoanPayment", "Loan payment"),
    ...simplePeriodic("expensesOngoing", "Average ongoing costs"),
    totalInvestment: text({
      inputLabel: "Total investment",
      title: "Total Investment",
      info: "The total amount of upfront cash needed for a deal after all loans have been applied.",
    }),
    cashCostsPlusPurchaseLoanRepay: input("Cash expenses and loan repayment"),
    preFinanceOneTimeExpenses: input("Pre-financing upfront costs"),
    holdingCostTotal: input("Total holding costs"),
    ...simplePeriodic("cocRoiDecimal", "CoC ROI Decimal"),
    cocRoiMonthly: multis.cocRoi("monthly"),
    cocRoiYearly: multis.cocRoi("yearly"),
    ...simplePeriodic("cashFlow", "Cash flow", {
      title: "Cash Flow",
      info: "The income that a property brings in every month or year, after expenses have been subtracted.",
    }),
    valueAddProfit: input("Value add profit"),
    valueAddRoiDecimal: input("VA ROI Decimal"),
    valueAddRoiPercent: text({
      inputLabel: "VA ROI",
      title: "Value Add Return on Investment",
      info: "The total profit from increasing a property's value after purchase, as a percent of the cash that was invested to do so",
    }),
    valueAddRoiPercentPerMonth: input("ROI percent per month"),
    valueAddRoiPercentAnnualized: text({
      inputLabel: "VA ROI annualized",
      title: "Annualized Return on Investment from Value Add",
      info: `The total profit from increasing a property's value after purchase, as a percent of the cash that was invested to do so, divided by the number of years—or by the fraction of years—that the holding period lasted.\n\nThis can be used to compare ROI from onetime windfall income with ongoing income from other types of investments.`,
    }),
    vaProfitOnSale: input("VA profit on sale", {
      title: "Value Add Profit on Sale",
      info: "The total profit from increasing a property's value, at the projected time of sale.",
    }),
    valueAddRoiOnSaleDecimal: input("VA ROI on sale decimal"),
    vaRoiOnSalePercent: text({
      inputLabel: "VA ROI on sale",
      title: "Value Add ROI on Sale",
      info: "The total profit from increasing a property's value after purchase, as a percent of the cash that was invested to do so, including selling costs.\n\nThis is useful if you plan on accessing the value added to a property by selling it, as opposed to by using a HELOC or something else.",
    }),
    valueAddRoiOnSalePercentPerMonth: input("VA ROI on sale per month"),
    vaRoiOnSalePercentAnnualized: text({
      inputLabel: "VA ROI on sale annualized",
      title: "Annualized ROI from Value Add on Sale",
      info: `The total profit from increasing a property's value after purchase, as a percent of the cash that was invested to do so, including selling costs, divided by the number of years—or by the fraction of years—that the holding period lasted.\n\nThis can be used to compare ROI from onetime windfall income with ongoing income from other types of investments.`,
    }),
  }),
  ...prop("onetimeItem", {
    valueDollars: input(relVarbInfoS.local("displayName")),
    valueDollarsEditor: input(relVarbInfoS.local("displayName")),
    valueSourceName: input(relVarbInfoS.local("displayName")),
  }),
  ...prop("onetimeList", {
    total: input("List total"),
  }),
  ...prop("periodicList", simplePeriodic("total", "List total")),
  ...prop("periodicItem", {
    valueSourceName: input(relVarbInfoS.local("displayName")),
    ...simplePeriodic("valueDollars", relVarbInfoS.local("displayName")),
  }),
  ...prop("numVarbItem", {
    valueSourceName: input(relVarbInfoS.local("displayName")),
    value: input(relVarbInfoS.local("displayName")),
    valueEditor: input(relVarbInfoS.local("displayName")),
  }),
  ...prop("boolVarbItem", {
    leftOperandi: input(""),
    rightOperandi: input(""),
  }),
  ...prop("conditionalRowList", { value: input("") }),
  ...prop("conditionalRow", {
    left: input(""),
    rightValue: input(""),
    then: input(""),
  }),
});

function periodicAndSource<BN extends string>(
  baseName: BN,
  inputLabel: VarbLabel,
  options: OptionsNext = {}
): {
  [T in "Monthly" | "Yearly" as `${BN}${T}`]: VarbInfoTextProps;
} & { valueSourceName: VarbInfoTextProps } {
  return {
    ...simplePeriodic(baseName, inputLabel, options),
    valueSourceName: input(inputLabel, options),
  };
}

function simplePeriodic<BN extends string>(
  baseName: BN,
  inputLabel: VarbLabel,
  { variableLabel, ...rest }: OptionsNext = {}
): {
  [T in "Monthly" | "Yearly" as `${BN}${T}`]: VarbInfoTextProps;
} {
  const labelBase = variableLabel ?? inputLabel;
  return {
    [`${baseName}${"Monthly"}`]: text({
      inputLabel,
      variableLabel:
        typeof labelBase === "string" ? labelBase + " monthly" : labelBase,
      ...rest,
    }),
    [`${baseName}${"Yearly"}`]: text({
      inputLabel,
      variableLabel:
        typeof labelBase === "string" ? labelBase + " yearly" : labelBase,
      ...rest,
    }),
  };
}

function simpleSpan<BN extends string>(
  baseName: BN,
  inputLabel: string,
  { variableLabel, ...rest }: OptionsNext = {}
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

type OptionsNext = Partial<StrictOmit<VarbInfoTextProps, "inputLabel">>;

export interface VarbInfoTextProps {
  inputLabel: VarbLabel;
  variableLabel: VarbLabel;
  title: string;
  info: string;
  moreInfoLink: string;
  sourceFinder: LabelSourceFinder;
}

function input(inputLabel: VarbLabel, options?: OptionsNext) {
  return text({ inputLabel, ...options });
}

function text({
  inputLabel = "",
  variableLabel = inputLabel,
  title = "",
  info = "",
  moreInfoLink = "",
  sourceFinder = null,
}: Partial<VarbInfoTextProps>): VarbInfoTextProps {
  return {
    inputLabel,
    variableLabel,
    title,
    info,
    moreInfoLink,
    sourceFinder,
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

function defaultSectionInfoTexts(): AllVarbLabels {
  return sectionNames.reduce((defaultTexts, sectionName) => {
    (defaultTexts[sectionName] as SectionInfoText<typeof sectionName>) =
      emptySctionInfoText(sectionName);
    return defaultTexts;
  }, {} as AllVarbLabels);
}

function checkAllVarbLabels<T extends AllVarbLabels>(t: T): T {
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

export type VarbLabel = string | RelLocalVarbInfo;
export type LabelOverrideSwitches = readonly DisplayOverrideSwitch[];
interface DisplayOverrideSwitch {
  switchInfo: RelLocalVarbInfo;
  switchValue: string;
  sourceInfo: RelLocalVarbInfo;
}

export type LabelSourceFinder = null | RelLocalVarbInfo | LabelOverrideSwitches;
