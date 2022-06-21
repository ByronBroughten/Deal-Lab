import { SectionPackRaw } from "../SectionPack/SectionPackRaw";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export function makeDefaultPropertyPack(): SectionPackRaw<"property"> {
  const main = PackBuilderSection.initAsMain();
  const property = main.addAndGetDescendant(
    ["deal", "propertyGeneral", "property"] as const,
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
    dbVarbs: {
      title: "Utilities",
      totalOngoingSwitch: "monthly",
      defaultValueSwitch: "labeledEquation",
      defaultOngoingSwitch: "monthly",
    },
  });
  property.addChild("ongoingCostList", {
    dbVarbs: {
      title: "CapEx",
      totalOngoingSwitch: "yearly",
      defaultValueSwitch: "labeledSpanOverCost",
      defaultOngoingSwitch: "yearly",
    },
  });
  property.addChild("upfrontCostList", {
    dbVarbs: { title: "Repairs" },
  });

  return property.makeSectionPack();
}
