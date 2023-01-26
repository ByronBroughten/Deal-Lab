import { stringObj } from "../SectionsMeta/allBaseSectionVarbs/baseValues/StringObj";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeUtilityList } from "./makeDefaultFeUser/makeExampleOngoingLists";
import { blankPropertyUtilityProps } from "./makeDefaultFeUser/makeExampleOngoingListsProps";
import { makeDefaultOngoingValue } from "./makeDefaultOngoingValue";

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
  property.addChild("upfrontExpenseGroup");

  const repairValue = property.addAndGetChild("repairValue");
  repairValue.addChild("singleTimeList");

  const utilityValue = property.addAndGetChild("utilityValue");
  const utilityList = utilityValue.addAndGetChild("ongoingList");
  utilityList.loadSelf(makeUtilityList(blankPropertyUtilityProps));

  property.addChild("ongoingExpenseGroup");

  const capEx = property.loadAndGetChild({
    childName: "capExCostValue",
    sectionPack: makeDefaultOngoingValue(),
  });
  capEx.updateValues({
    displayNameEditor: stringObj("CapEx"),
    isItemized: false,
    itemValueSwitch: "labeledSpanOverCost",
    valueSourceSwitch: "valueEditor",
  });
  const capExList = capEx.onlyChild("ongoingList");
  capExList.updateValues({
    itemValueSwitch: "labeledSpanOverCost",
    itemOngoingSwitch: "yearly",
  });

  const maintenance = property.loadAndGetChild({
    childName: "maintenanceCostValue",
    sectionPack: makeDefaultOngoingValue(),
  });
  maintenance.updateValues({
    displayNameEditor: stringObj("Misc Repairs"),
    isItemized: false,
    itemValueSwitch: "labeledEquation",
    valueSourceSwitch: "valueEditor",
  });

  return property.makeSectionPack();
}
