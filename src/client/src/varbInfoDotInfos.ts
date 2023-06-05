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
  dealMode: {
    inputLabel: "Select type",
    title: "Deal Types",
    info: `${dealModeLabels.homeBuyer}: estimate the costs of a home intended to be used as a primary residence.\n\n${dealModeLabels.buyAndHold}: estimate the ongoing cashflow and return on investment of a rental property.\n\n${dealModeLabels.fixAndFlip}: estimate the return on investment of buying, fixing, and selling a property.\n\n${dealModeLabels.brrrr}: "Buy, Rehab, Rent, Refinance, Repeat". A more advanced type of deal whereby a fix and flip deal is turned into a rental property.`,
  },
  closingCosts: {
    inputLabel: "Closing costs",
    title: "Closing Costs",
    info: `Most loans require that the borrower pay a number of one-time fees—appraisal fees, title fees, government fees. Collectively, these fees are called closing costs.\n\nNote that closing costs don't include prepaid or escrow costs, such as prepaid home insurance or taxes.`,
  },
  vacancyLoss: {
    inputLabel: "Vacancy loss",
    title: "Vacancy Loss",
    info: `No property will be fully occupied 100% of the time. When tenants move out, it can sometimes take days or weeks to prepare their unit for another renter. To account for this, assume you will miss out on a certain portion of the property's rent.\n\nIf you're owner-managing the property and you're determined to keep vacancy low, a common method is to asume you will miss out on 5% of the rent; and if you're using a property manager or management company (who probably won't be quite as motivated as you), something like 10% is common to assume.`,
  },
} as const;

type InfoTexts = { [SN in SectionName]: SectionInfoText<SN> };
export const varbInfoDotConfig = checkSectionInfoTexts({
  ...defaultSectionInfoTexts(),
  ...prop("deal", {
    dealMode: multis.dealMode,
  }),
  ...prop("capExValue", {
    valueSourceName: {
      inputLabel: "Capital Expenses",
      title: "Capital Expenses",
      info: `Capital Expenses, or CapEx, are those big, expensive things every property has that will eventually need to be replaced—things like the roof, furnace, and water heater. No long-term analysis of a property is complete without accounting for these inevitable costs.\n\nA common (and easy) method to account for these is to assume that all the CapEx costs together will average to about 5% of the property's rental income.\n\nA more precise method is to go through each major capital expense and estimate both how much it would cost to replace it and how many years the replacements will last. From there, the app will calculate how much you should budget per month for each capital expense as well as their total.`,
    },
  }),
  ...prop("sellingCostValue", {
    valueSourceName: {
      inputLabel: "Selling costs",
      title: "Selling Costs",
      info: "Selling costs are the costs associated with selling a property, to pay for things things real estate agents, title fees, broker companies, etc.\n\nThese costs commonly add up to around 5-6% of the price that the property is being sold at.",
    },
  }),
  ...prop("maintenanceValue", {
    valueSourceName: {
      inputLabel: "Ongoing maintenance",
      title: "Ongoing Maintenance",
      info: `Every property needs minor repairs from time to time. Doorknobs break. Oven igniters die. Pipes burst. To account for these and other miscellaneous things, there are a few common methods.\n\nOne is to assume you will spend $1 per property square foot per year. The idea is that the more square feet there is, the more opportunity there is for something to go wrong.\n\nAnother common method is to assume that miscellanious repairs will cost 1% of the property's purchase price (or after repair value) per year. The reasoning is that more expensive properties may generally have more expensive components that require more expensive repairs.\n\nA third method is to just use the average between the first two methods.\n\nThere are probably other, more creative methods out there. By selecting the "custom amount" method, you are free to enter any equation that suits you.`,
    },
  }),
  ...prop("costOverrunValue", {
    valueSourceName: {
      inputLabel: "Cost overrun",
      title: "Cost Overrun",
      info: `Cost overrun is the sum of costs over the entirety of a project that were not anticipated upfront. Cost overrun is common, especially for larger projects.\n\nFor sizable rehab projects, it's common to factor in an extra 10-15% of the base rehab estimate for cost overrun. That may not be necessary for turnkey properties or light rehab.`,
    },
  }),
  ...prop("property", {
    propertyMode: multis.dealMode,
    afterRepairValue: {
      inputLabel: "After repair value",
      title: "After Repair Value",
      info: `This is the price that a property is sold at after repairs are made.`,
    },
    holdingPeriodSpanEditor: {
      inputLabel: "Holding period",
      title: "Holding Period",
      info: `This is the amount of time that a property is owned before its rehab is complete and it is either sold (in the case of fix and flip) or refinanced and rented out (in the case of brrrr).\n\nTypically, the longer the holding period, the more that costs will accumulate.`,
    },
  }),
  ...prop("closingCostValue", {
    valueSourceName: multis.closingCosts,
  }),
  ...prop("loan", {
    closingCosts: multis.closingCosts,
    hasMortgageIns: {
      inputLabel: "Mortgage insurance",
      title: "Mortgage Insurance",
      info: `Sometimes in order to get a loan you are required to pay for mortgage insurance. This tends to happen with loans where the borrower pays a low down payment—lower than 20%.\n\nMortgage insurance basically assures the bank that it will be able to recover its assets in the event that the borrower does not repay them, which makes it less risky for them to work with smaller down payments.\n\nYou may be required to pay the mortgage insurance in a lump sum at the time of closing, or as a recurring monthly payment, or both. To determine whether you'll need mortgage insurance and, if so, in what form and at what cost, either research the type of loan you're entering or ask your lender.`,
    },
  }),
  ...prop("vacancyLossValue", {
    valueSourceName: multis.vacancyLoss,
  }),
});

export interface VarbInfoTextProps {
  inputLabel: string;
  title: string;
  info: string;
}

export type VarbInfoText = VarbInfoTextProps | null;

type SectionInfoText<SN extends SectionName> = Record<
  VarbName<SN>,
  VarbInfoText
>;

function makeInfoText<SN extends SectionName>(
  partial: Partial<VarbInfoTextProps>
) {}
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
