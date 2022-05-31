import { SectionPackBuilder } from "../../../../../../StatePackers.ts/PackBuilderSection";
import { SectionPackRaw } from "../../../../../SectionPackRaw";

export function makeDefaultPropertyPack(): SectionPackRaw<"property"> {
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

  return property.makeSectionPack();
}
