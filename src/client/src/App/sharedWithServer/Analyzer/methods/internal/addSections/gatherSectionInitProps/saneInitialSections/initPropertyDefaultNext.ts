import { SectionPackBuilderNext } from "../../../../../../FeSections/HasSections/SectionPackBuilder";

const main = new SectionPackBuilderNext();
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

export const defaultProperty = property.selfSectionPack;
