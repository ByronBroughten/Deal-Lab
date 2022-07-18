import { SectionPack } from "../SectionPack/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export function makeDefaultPropertyPack(): SectionPack<"property"> {
  const property = PackBuilderSection.initAsOmniChild("property", {
    dbVarbs: {
      taxesOngoingSwitch: "yearly",
      homeInsOngoingSwitch: "yearly",
      ongoingExpensesOngoingSwitch: "yearly",
      targetRentOngoingSwitch: "monthly",
      miscOngoingRevenueOngoingSwitch: "monthly",
      ongoingRevenueOngoingSwitch: "monthly",
    },
  });

  property.addChild("ongoingCostList", {
    dbVarbs: {
      displayName: "Utilities",
      totalOngoingSwitch: "monthly",
      defaultValueSwitch: "labeledEquation",
      defaultOngoingSwitch: "monthly",
    },
  });
  property.addChild("ongoingCostList", {
    dbVarbs: {
      displayName: "CapEx",
      totalOngoingSwitch: "yearly",
      defaultValueSwitch: "labeledSpanOverCost",
      defaultOngoingSwitch: "yearly",
    },
  });
  property.addChild("upfrontCostList", {
    dbVarbs: { displayName: "Repairs" },
  });

  return property.makeSectionPack();
}
