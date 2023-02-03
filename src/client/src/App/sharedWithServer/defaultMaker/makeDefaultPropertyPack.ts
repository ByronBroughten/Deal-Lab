import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeUtilityList } from "./makeDefaultFeUser/makeExampleOngoingLists";
import { blankPropertyUtilityProps } from "./makeDefaultFeUser/makeExampleOngoingListsProps";

export function makeDefaultPropertyPack(): SectionPack<"property"> {
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
  const utilityList = utilityValue.addAndGetChild("ongoingList");
  utilityList.loadSelf(makeUtilityList(blankPropertyUtilityProps));

  property.addChild("maintenanceValue");

  const capExValue = property.addAndGetChild("capExValue");
  capExValue.addChild("capExList");

  property.addChild("upfrontExpenseGroup");
  property.addChild("ongoingExpenseGroup");
  return property.makeSectionPack();
}
