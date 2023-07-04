import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { StateValue } from "../SectionsMeta/values/StateValue";
import { getDealModes } from "../SectionsMeta/values/StateValue/dealMode";
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

  const taxesHomeInsOptions = {
    sectionValues: {
      valueSourceName: "valueDollarsPeriodicEditor",
      valueDollarsPeriodicSwitch: "yearly",
    },
  } as const;

  property.addChild("taxesHolding", taxesHomeInsOptions);
  property.addChild("homeInsHolding", taxesHomeInsOptions);

  property.addChild("taxesOngoing", taxesHomeInsOptions);
  property.addChild("homeInsOngoing", taxesHomeInsOptions);

  const costOverrunPercent = getDealModes("maybeNoRehab").includes(propertyMode)
    ? 0
    : 10;
  const overrun = property.addAndGetChild("costOverrunValue");
  overrun.updateValues({
    valuePercentEditor: numObj(costOverrunPercent),
    valueSourceName: "valuePercentEditor",
  });

  const sellingCost = property.addAndGetChild("sellingCostValue");
  sellingCost.addChild("onetimeList");

  const miscRevenue = property.addAndGetChild("miscRevenue");
  miscRevenue.addChild("periodicList");

  const miscOngoingCost = property.addAndGetChild("miscOngoingCost");
  miscOngoingCost.addChild("periodicList");

  const miscHoldingCost = property.addAndGetChild("miscHoldingCost");
  miscHoldingCost.addChild("periodicList");

  const miscOnetimeCost = property.addAndGetChild("miscOnetimeCost");
  miscOnetimeCost.addChild("onetimeList");

  const repairValue = property.addAndGetChild("repairValue");
  repairValue.addChild("onetimeList");

  const utilityHolding = property.addAndGetChild("utilityHolding");
  utilityHolding.addChild("periodicList");

  const utilityOngoing = property.addAndGetChild("utilityOngoing");
  utilityOngoing.addChild("periodicList");

  property.addChild("maintenanceOngoing");

  const capExValue = property.addAndGetChild("capExValue");
  capExValue.addChild("capExList");
  return property.makeSectionPack();
}
