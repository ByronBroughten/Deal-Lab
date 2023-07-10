import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { StateValue } from "../SectionsMeta/values/StateValue";
import { getDealModes } from "../SectionsMeta/values/StateValue/dealMode";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import { numObj } from "./../SectionsMeta/values/StateValue/NumObj";
import { makeExampleCapExList } from "./makeDefaultFeUser/makeExampleCapEx";
import {
  exampleAdvancedCapExProps,
  exampleSimpleCapExProps,
} from "./makeDefaultFeUser/makeExampleOngoingListsProps";

export function makeDefaultProperty(
  propertyMode: StateValue<"dealMode"> = "buyAndHold"
): SectionPack<"property"> {
  const property = PackBuilderSection.initAsOmniChild("property");
  property.updateValues({
    propertyMode,
    taxesHoldingPeriodicSwitch: "yearly",
    homeInsHoldingPeriodicSwitch: "yearly",
    expensesOngoingPeriodicSwitch: "yearly",
    targetRentPeriodicSwitch: "monthly",
    miscOngoingRevenuePeriodicSwitch: "monthly",
    revenueOngoingPeriodicSwitch: "monthly",
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

  const miscOngoingRevenue = property.addAndGetChild("miscOngoingRevenue");
  miscOngoingRevenue.addChild("periodicList");

  const miscOngoingCost = property.addAndGetChild("miscOngoingCost");
  miscOngoingCost.addChild("periodicList");

  const miscHoldingCost = property.addAndGetChild("miscHoldingCost");
  miscHoldingCost.addChild("periodicList");

  const MiscOnetimeValue = property.addAndGetChild("miscOnetimeCost");
  MiscOnetimeValue.addChild("onetimeList");

  const repairValue = property.addAndGetChild("repairValue");
  repairValue.addChild("onetimeList");

  const utilityHolding = property.addAndGetChild("utilityHolding");
  utilityHolding.addChild("periodicList");

  const utilityOngoing = property.addAndGetChild("utilityOngoing");
  utilityOngoing.addChild("periodicList");

  property.addChild("maintenanceOngoing");

  const capExValue = property.addAndGetChild("capExValueOngoing");
  const capExList = capExValue.addAndGetChild("capExList");

  if (propertyMode === "homeBuyer") {
    capExList.overwriteSelf(
      makeExampleCapExList("Homebuyer Example CapEx", exampleSimpleCapExProps)
    );
  } else {
    capExList.overwriteSelf(
      makeExampleCapExList("Homebuyer Example CapEx", exampleAdvancedCapExProps)
    );
  }

  return property.makeSectionPack();
}
