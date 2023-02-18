import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export function makeDefaultProperty(): SectionPack<"property"> {
  const property = PackBuilderSection.initAsOmniChild("property", {
    dbVarbs: {
      taxesOngoingSwitch: "yearly",
      homeInsOngoingSwitch: "yearly",
      expensesOngoingSwitch: "yearly",
      targetRentOngoingSwitch: "monthly",
      miscRevenueOngoingSwitch: "monthly",
      revenueOngoingSwitch: "monthly",
    },
  });
  const repairValue = property.addAndGetChild("repairValue");
  repairValue.addChild("singleTimeList");

  const utilityValue = property.addAndGetChild("utilityValue");
  utilityValue.addChild("ongoingList");

  property.addChild("maintenanceValue");

  const capExValue = property.addAndGetChild("capExValue");
  capExValue.addChild("capExList");

  property.addChild("upfrontExpenseGroup");
  property.addChild("ongoingExpenseGroup");
  return property.makeSectionPack();
}
