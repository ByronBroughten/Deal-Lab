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
    taxesHoldingPeriodicSwitch: "yearly",
    homeInsHoldingPeriodicSwitch: "yearly",
    expensesPeriodicSwitch: "yearly",
    targetRentPeriodicSwitch: "monthly",
    miscRevenuePeriodicSwitch: "monthly",
    revenuePeriodicSwitch: "monthly",
  });

  // property.addChild("taxesHolding");
  // property.addChild("homeInsHolding");
  property.addChild("taxesOngoing", {
    sectionValues: { valueDollarsPeriodicSwitch: "yearly" },
  });
  property.addChild("homeInsOngoing", {
    sectionValues: { valueDollarsPeriodicSwitch: "yearly" },
  });

  const costOverrunPercent = propertyMode === "buyAndHold" ? 0 : 10;
  const overrun = property.addAndGetChild("costOverrunValue");
  overrun.updateValues({
    valuePercent: numObj(costOverrunPercent),
    valueSourceName: "valuePercentEditor",
  });

  const sellingCost = property.addAndGetChild("sellingCostValue");
  sellingCost.addChild("onetimeList");

  const miscRevenue = property.addAndGetChild("miscRevenueValue");
  miscRevenue.addChild("ongoingList");

  const miscOngoingCost = property.addAndGetChild("miscOngoingCost");
  miscOngoingCost.addChild("ongoingList");

  const miscHoldingCost = property.addAndGetChild("miscHoldingCost");
  miscHoldingCost.addChild("ongoingList");

  const miscOnetimeCost = property.addAndGetChild("miscOnetimeCost");
  miscOnetimeCost.addChild("onetimeList");

  const repairValue = property.addAndGetChild("repairValue");
  repairValue.addChild("onetimeList");

  const utilityHolding = property.addAndGetChild("utilityHolding");
  utilityHolding.addChild("ongoingList");

  const utilityOngoing = property.addAndGetChild("utilityOngoing");
  utilityOngoing.addChild("ongoingList");

  property.addChild("maintenanceValue");

  const capExValue = property.addAndGetChild("capExValue");
  capExValue.addChild("capExList");
  return property.makeSectionPack();
}
