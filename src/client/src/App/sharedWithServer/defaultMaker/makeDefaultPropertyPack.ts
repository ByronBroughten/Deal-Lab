import { stringObj } from "../SectionsMeta/baseSectionsVarbs/baseValues/StringObj";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultSingleTimeValue } from "./makeDefaultSingleTimeValue";

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
  const repairValue = property.loadAndGetChild({
    childName: "repairCostValue",
    sectionPack: makeDefaultSingleTimeValue(),
  });
  repairValue.updateValues({
    displayNameEditor: stringObj("Repairs"),
    isItemized: false,
    itemValueSwitch: "labeledEquation",
    valueSourceSwitch: "valueEditor",
  });
  return property.makeSectionPack();
}
