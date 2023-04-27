import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { StateValue } from "../SectionsMeta/values/StateValue";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import { numObj } from "./../SectionsMeta/values/StateValue/NumObj";

export function makeDefaultProperty(
  propertyMode: StateValue<"dealMode"> = "buyAndHold"
): SectionPack<"property"> {
  const property = PackBuilderSection.initAsOmniChild("property");
  property.updateValues({
    propertyMode,
    taxesOngoingSwitch: "yearly",
    homeInsOngoingSwitch: "yearly",
    expensesOngoingSwitch: "yearly",
    targetRentOngoingSwitch: "monthly",
    miscRevenueOngoingSwitch: "monthly",
    revenueOngoingSwitch: "monthly",
  });

  const costOverrunPercent = propertyMode === "buyAndHold" ? 0 : 10;
  const overrun = property.addAndGetChild("costOverrunValue");
  overrun.updateValues({
    valuePercent: numObj(costOverrunPercent),
    valueSourceName: "valuePercentEditor",
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
