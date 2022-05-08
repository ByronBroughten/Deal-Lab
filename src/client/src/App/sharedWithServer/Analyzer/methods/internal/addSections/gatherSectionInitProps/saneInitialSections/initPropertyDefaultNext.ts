import { SectionPackBuilder } from "../../../../../../FeSections/HasSections/SectionPackBuilder";

const main = new SectionPackBuilder();
const property = main.addAndGetDescendant(
  ["analysis", "propertyGeneral", "property"] as const,
  {
    dbVarbs: {
      taxesOngoingSwitch: "yearly",
      homeInsOngoingSwitch: "yearly",
      ongoingExpensesOngoingSwitch: "yearly",
      targetRentOngoingSwitch: "monthly",
      miscOngoingRevenueOngoingSwitch: "monthly",
      ongoingRevenueOngoingSwitch: "monthly",
    },
  }
);
property.addChild("ongoingCostList", {
  dbVarbs: { title: "Utilities" },
});
property.addChild("ongoingCostList", {
  dbVarbs: {
    title: "CapEx",
    totalOngoingSwitch: "yearly",
    defaultValueSwitch: "labeledSpanOverCost",
  },
});
property.addChild("upfrontCostList", {
  dbVarbs: { title: "Repairs" },
});
export const initProperty = property.sectionPack;
// I ought to test SectionPackBuilder
// Then on to creating a version of FullSection
// that can solve when it adds a section.
// Then integrate it into the new state.

// propertyDefault: [
//   {
//     dbId: dbIds.property,
//     dbVarbs: {
//       title: "",
//       price: dbNumObj(""),
//       sqft: dbNumObj(""),
//       taxesMonthly: dbNumObj(""),
//       taxesYearly: dbNumObj(""),
//       taxesOngoingSwitch: "yearly",
//       homeInsMonthly: dbNumObj(""),
//       homeInsYearly: dbNumObj(""),
//       homeInsOngoingSwitch: "yearly",
//       numUnits: dbNumObj(""),
//       numBedrooms: dbNumObj(""),
//       upfrontExpenses: dbNumObj("0"),
//       upfrontRevenue: dbNumObj("0"),
//       ongoingExpensesMonthly: dbNumObj("0"),
//       ongoingExpensesYearly: dbNumObj("0"),
//       ongoingExpensesOngoingSwitch: "yearly",
//       targetRentMonthly: dbNumObj("0"),
//       targetRentYearly: dbNumObj("0"),
//       targetRentOngoingSwitch: "monthly",
//       miscOngoingRevenueMonthly: dbNumObj("0"),
//       miscOngoingRevenueYearly: dbNumObj("0"),
//       miscOngoingRevenueOngoingSwitch: "monthly",
//       ongoingRevenueMonthly: dbNumObj("0"),
//       ongoingRevenueYearly: dbNumObj("0"),
//       ongoingRevenueOngoingSwitch: "monthly",
//     },
//     childDbIds: {
//       upfrontCostList: [dbIds.repairList],
//       upfrontRevenueList: [],
//       ongoingCostList: [],
//       ongoingRevenueList: [],
//       unit: [], // dbIds.unit1, dbIds.unit2
//     },
//   },
// ]
