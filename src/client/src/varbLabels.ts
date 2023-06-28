import { SwitchTargetKey } from "./App/sharedWithServer/SectionsMeta/allBaseSectionVarbs/baseSwitchNames";
import {
  sectionVarbNames,
  VarbName,
} from "./App/sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import {
  SectionName,
  sectionNames,
} from "./App/sharedWithServer/SectionsMeta/SectionName";
import { dealModeLabels } from "./App/sharedWithServer/SectionsMeta/values/StateValue/unionValues";

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
  holdingPeriodMonths: text({
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

const loanValue = {
  offPercent: input("Down payment"),
  offDollars: input("Down payment"),
  amountPercent: input("Loan to value ratio"),
  amountDollars: input("Loan amount"),
} as const;

type InfoTexts = { [SN in SectionName]: SectionInfoText<SN> };
export const varbLabels = checkSectionInfoTexts({
  ...defaultSectionInfoTexts(),
  ...prop("capExValue", {
    valueSourceName: text({
      inputLabel: "Capital expenses",
      title: "Capital Expenses",
      info: `Capital expenses, or CapEx, are those big, expensive things that every property has and that will eventually need to be replaced—the roof, furnace, water heater, etc. No long-term analysis of a property is complete without accounting for these.\n\nA common (and easy) method to assume that all the CapEx costs together will average to about 5% of the property's rental income. But this can be pretty inaccurate.\n\nA more precise method is to go through each major capital expense and estimate both how much it would cost to replace it and how many years a replacement would last. From there, the app will calculate how much you should budget per month for each capital expense and add them all up.`,
    }),
  }),
  ...prop("purchaseLoanValue", loanValue),
  ...prop("repairLoanValue", loanValue),
  ...prop("arvLoanValue", loanValue),

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
    ...simpleOngoing("fivePercentRent", "5% rent"),
  }),
  ...prop("property", {
    propertyMode: multis.dealMode,
    purchasePrice: input("Purchase price"),
    sqft: input("Square feet"),
    numUnits: input("Unit count"),
    numBedrooms: input("BR count"),
    likability: input("Likability"),
    pricePerLikability: input("Price per likability"),
    sellingCosts: text({
      inputLabel: "Selling costs",
      title: "Selling Costs",
      info: "These are the costs associated with selling a property, such as to pay real estate agents, the title company, government fees, etc. They are commonly about 6% of the selling price.",
    }),
    ...simpleOngoing("expenses", "Property expenses"),
    ...simpleOngoing("targetRent", "Target rent"),
    ...simpleOngoing("homeInsOngoing", "Home insurance"),
    ...simpleOngoing("taxesOngoing", "Home insurance"),
    ...simpleOngoing("utilitiesOngoing", "Utilities"),
    rehabCost: input("Rehab cost"),
    rehabCostBase: input("Rehab cost base"),
    afterRepairValue: text({
      inputLabel: "After repair value",
      title: "After Repair Value",
      info: `This is the price that a property is sold at after repairs are made.`,
    }),
    holdingPeriodMonths: multis.holdingPeriodMonths,
    holdingPeriodSpanEditor: multis.holdingPeriodMonths,
  }),
  ...prop("closingCostValue", {
    valueSourceName: multis.closingCosts,
  }),
  ...prop("loanBaseExtra", {
    hasLoanExtra: multis.loanExtras,
  }),
  ...prop("financing", {
    ...simpleOngoing("averagePrincipal", "Average principal payment"),
    ...simpleOngoing("averageInterest", "Average interest payment"),
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
  }),
  ...prop("loan", {
    ...simpleOngoing("loanPayment", "Loan payment"),
    ...simpleOngoing("expenses", "Total loan expenses"),
    closingCosts: multis.closingCosts,
    hasMortgageIns: text({
      inputLabel: "Mortgage insurance",
      title: "Mortgage Insurance",
      info: `Sometimes in order to get a loan you are required to pay for mortgage insurance. This tends to happen with loans where the borrower pays a low down payment—lower than 20%.\n\nMortgage insurance basically assures the bank that it will be able to recover its assets in the event that the borrower does not repay them, which makes it less risky for them to work with smaller down payments.\n\nYou may be required to pay the mortgage insurance in a lump sum at the time of closing, or as a recurring monthly payment, or both. To determine whether you'll need mortgage insurance and, if so, in what form and at what cost, either research the type of loan you're entering or ask your lender.`,
    }),
  }),
  ...prop("mgmt", {
    ...simpleOngoing("basePayDollars", "Mgmt base pay"),
    ...simpleOngoing("expenses", "Management expenses"),
  }),
  ...prop("vacancyLossValue", {
    valueSourceName: multis.vacancyLoss,
  }),
  ...prop("deal", {
    dealMode: multis.dealMode,
    ...simpleOngoing("averageNonPrincipalCost", "Average non-principal costs", {
      title: "Average Non-Principal Cost",
      info: `The average monthly or yearly cost of all ongoing expenses that would be associated with this deal—property maintenance costs, taxes, loan payments, etc.—minus the average principal loan payment amount given the duration of your loan(s).\n\n
      When you pay towards your principal, you gain equity in your property, so you don't really lose that money. So by subtracting that from the rest of your expenses, you can get a better idea of how much money this deal would actually cost you per month.\n\nHomebuyers can use this to compare deal expenses to what they'd otherwise spend as renters.`,
    }),
    ...simpleOngoing("ongoingPiti", "PITI payments", {
      title: "PITI",
      info: `"PITI" stands for "principal and interest, taxes, and insurance". Often, these are the things included in the payments that homebuyers send to the bank every month.`,
    }),
    ...simpleOngoing("ongoingLoanPayment", "Loan payment"),
    ...simpleOngoing("expenses", "Average ongoing costs"),
    totalProfit: input("Total profit"),
    totalInvestment: text({
      inputLabel: "Total investment",
      title: "Total Investment",
      info: "The total amount of upfront cash needed for a deal after all loans have been applied.",
    }),
    cocRoiMonthly: multis.cocRoi("monthly"),
    cocRoiYearly: multis.cocRoi("yearly"),
    ...simpleOngoing("cashFlow", "Cash flow", {
      title: "Cash Flow",
      info: "The income that a property brings in every month or year, after expenses have been subtracted.",
    }),
    roiPercent: text({
      inputLabel: "ROI",
      title: "Return on Investment",
      info: "The total profit from increasing a property's value after purchase, as a percent of the cash that was invested to do so",
    }),
    roiPercentAnnualized: text({
      inputLabel: "ROI annualized",
      title: "Annualized Return on Investment",
      info: `The total profit from increasing a property's value after purchase, as a percent of the cash that was invested to do so, divided by the number of years—or by the fraction of years—that the holding period lasted.\n\nThis can be used to compare ROI from one-time windfall income with ongoing Cash on Cash ROI from other types of investments.`,
    }),
  }),
});

function simpleOngoing<BN extends string>(
  baseName: BN,
  inputLabel: string,
  options: { title?: string; info?: string } = {}
): {
  [T in "Monthly" | "Yearly" as `${BN}${T}`]: VarbInfoTextProps;
} {
  return {
    [`${baseName}${"Monthly"}`]: text({
      inputLabel,
      variableLabel: inputLabel + "Monthly",
      ...options,
    }),
    [`${baseName}${"Yearly"}`]: text({
      inputLabel,
      variableLabel: inputLabel + "Yearly",
      ...options,
    }),
  };
}

export interface VarbInfoTextProps {
  inputLabel: string;
  variableLabel: string;
  detailsLabel: string;
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
  detailsLabel = variableLabel,
  title = "",
  info = "",
}: Partial<VarbInfoTextProps>): VarbInfoTextProps {
  return {
    inputLabel,
    variableLabel,
    detailsLabel,
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
  return t;
}

export const capExItemizeDescription = `Itemizing CapEx is pretty easy, and it can be more accurate using a general rule of thumb like the 5% rent rule.\n\nFor each major capital expense item a property has, simply enter an estimate of the cost to replace that item and an estimate of how long the replacement would likely last. The app will calculate the rest.`;

export function getVarbLabels<SN extends SectionName, VN extends VarbName<SN>>(
  sectionName: SN,
  varbName: VN
): VarbInfoText {
  const sectionVarbs = varbLabels[sectionName];
  return (sectionVarbs as any)[varbName] as VarbInfoText;
}

export function variableLabel<SN extends SectionName, VN extends VarbName<SN>>(
  sectionName: SN,
  varbName: VN
): string {
  const labels = getVarbLabels(sectionName, varbName);
  if (!labels) {
    throw new Error(`varbLabels for ${sectionName}.${varbName} returned null.`);
  }
  if (labels.variableLabel) {
    return labels.variableLabel;
  } else {
    throw new Error(`Variable label for ${sectionName}.${varbName} is blank`);
  }
}
