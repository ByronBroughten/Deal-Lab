import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { StateValue } from "../SectionsMeta/values/StateValue";
import { getDealModes } from "../SectionsMeta/values/StateValue/dealMode";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import { numObj } from "./../SectionsMeta/values/StateValue/NumObj";
import { makeHomeAdvisorNahbCapExList } from "./makeDefaultFeUser/makeExampleCapEx";

export function makeDefaultProperty(
  propertyMode: StateValue<"dealMode"> = "buyAndHold"
): SectionPack<"property"> {
  const property = PackBuilderSection.initAsOmniChild("property");
  property.updateValues({ propertyMode });

  const taxesHomeInsOptions = {
    sectionValues: {
      valueSourceName: "valueDollarsPeriodicEditor",
      valueDollarsPeriodicSwitch: "yearly",
    },
  } as const;

  property.addChild("unit");
  property.addChild("holdingPeriod");

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

  const miscOngoingCost = property.addAndGetChild("miscOngoingCost", {
    sectionValues: { valueSourceName: "listTotal" },
  });
  miscOngoingCost.addChild("periodicList");

  const miscHoldingCost = property.addAndGetChild("miscHoldingCost");
  miscHoldingCost.addChild("periodicList");

  const MiscOnetimeValue = property.addAndGetChild("miscOnetimeCost");
  MiscOnetimeValue.addChild("onetimeList");

  const repairValue = property.addAndGetChild("repairValue");
  repairValue.addChild("onetimeList");

  const utilityHolding = property.addAndGetChild("utilityHolding");
  utilityHolding.addChild("periodicList");

  const utilityOngoing = property.addAndGetChild("utilityOngoing", {
    // sectionValues: { valueSourceName: "listTotal" },
  });

  const utilityList = utilityOngoing.addAndGetChild("periodicList");
  // utilityList.overwriteSelf(makeNationalUtilityAverageList());

  property.addChild("maintenanceOngoing");

  const capExValue = property.addAndGetChild("capExValueOngoing");
  // sectionValues: { valueSourceName: "listTotal" },

  const capExList = capExValue.addAndGetChild("capExList");
  capExList.overwriteSelf(makeHomeAdvisorNahbCapExList());
  return property.makeSectionPack();
}
