import { makeHomeAdvisorNahbCapExList } from "../exampleMakers/makeExampleCapEx";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { StateValue } from "../SectionsMeta/values/StateValue";
import { getDealModes } from "../SectionsMeta/values/StateValue/dealMode";
import { numObj } from "./../SectionsMeta/values/StateValue/NumObj";
import { makeDefault } from "./makeDefault";
import {
  makeDefaultHomeInsValue,
  makeDefaultMiscPeriodicValue,
  makeDefaultTaxesValue,
  makeDefaultUnit,
} from "./makeSimpleDefaults";

export function makeDefaultProperty(
  propertyMode: StateValue<"dealMode"> = "buyAndHold"
): SectionPack<"property"> {
  return makeDefault("property", (property) => {
    property.updateValues({ propertyMode });

    property.addChild("unit", { sectionPack: makeDefaultUnit() });
    property.addChild("holdingPeriod");

    property.addChild("taxesHolding", { sectionPack: makeDefaultTaxesValue() });
    property.addChild("homeInsHolding", {
      sectionPack: makeDefaultHomeInsValue(),
    });

    property.addChild("taxesOngoing", { sectionPack: makeDefaultTaxesValue() });
    property.addChild("homeInsOngoing", {
      sectionPack: makeDefaultHomeInsValue(),
    });

    const utilityHolding = property.addAndGetChild("utilityHolding");
    utilityHolding.addChild("valueDollarsEditor");
    utilityHolding.addChild("periodicList");

    const utilityOngoing = property.addAndGetChild("utilityOngoing");
    utilityOngoing.addChild("valueDollarsEditor");
    utilityOngoing.addChild("periodicList");

    const maintenanceOngoing = property.addAndGetChild("maintenanceOngoing");
    maintenanceOngoing.addChild("valueDollarsEditor");

    const capExValue = property.addAndGetChild("capExValueOngoing");
    capExValue.addChild("valueDollarsEditor");
    const capExList = capExValue.addAndGetChild("capExList");
    capExList.overwriteSelf(makeHomeAdvisorNahbCapExList());

    const repairValue = property.addAndGetChild("repairValue");
    repairValue.addChild("onetimeList");

    const costOverrunPercent = getDealModes("maybeNoRehab").includes(
      propertyMode
    )
      ? 0
      : 10;
    const overrun = property.addAndGetChild("costOverrunValue");
    overrun.updateValues({
      valuePercentEditor: numObj(costOverrunPercent),
      valueSourceName: "valuePercentEditor",
    });

    const sellingCost = property.addAndGetChild("sellingCostValue");
    sellingCost.addChild("onetimeList");

    const miscPeriodics = [
      "miscOngoingRevenue",
      "miscOngoingCost",
      "miscHoldingCost",
    ] as const;
    miscPeriodics.forEach((childName) => {
      property.addChild(childName, {
        sectionPack: makeDefaultMiscPeriodicValue(),
      });
    });

    const miscOnetimeValue = property.addAndGetChild("miscOnetimeCost");
    miscOnetimeValue.addChild("onetimeList");
  });
}
