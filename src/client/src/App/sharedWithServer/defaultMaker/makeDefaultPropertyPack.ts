import { stringObj } from "../SectionsMeta/baseSectionsVarbs/baseValues/StringObj";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultOneTimeValue } from "./makeDefaultOneTimeValue";
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
  const repairValue = property.loadAndGetChild({
    childName: "repairCostValue",
    sectionPack: makeDefaultOneTimeValue(),
  });
  repairValue.updateValues({
    displayNameEditor: stringObj("Repairs"),
    isItemized: false,
    itemValueSwitch: "labeledEquation",
    valueSourceSwitch: "valueEditor",
  });

  property.addChild("ongoingExpenseGroup");
  const utilities = property.loadAndGetChild({
    childName: "utilityCostValue",
    sectionPack: makeDefaultOngoingValue(),
  });
  utilities.updateValues({
    displayNameEditor: stringObj("Utilities"),
    isItemized: false,
    itemValueSwitch: "labeledEquation",
    valueSourceSwitch: "valueEditor",
  });
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
