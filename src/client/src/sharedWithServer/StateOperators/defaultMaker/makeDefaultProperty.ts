import { StateValue } from "../../stateSchemas/StateValue";
import { getDealModes } from "../../stateSchemas/StateValue/dealMode";
import { numObj } from "../../stateSchemas/StateValue/NumObj";
import { SectionPack } from "../../StateTransports/SectionPack";
import { makeHomeAdvisorNahbCapExList } from "../exampleMakers/makeExampleCapEx";
import { makeDefault } from "./makeDefault";
import {
  makeDefaultMiscPeriodicValue,
  makeDefaultUnit,
} from "./makeSimpleDefaults";

export function makeDefaultProperty(
  propertyMode: StateValue<"dealMode"> = "buyAndHold"
): SectionPack<"property"> {
  return makeDefault("property", (property) => {
    property.updateValues({ propertyMode });

    property.addChild("unit", { sectionPack: makeDefaultUnit() });
    property.addChild("holdingPeriod");

    const taxAndHomeIns = [
      "taxesHolding",
      "taxesOngoing",
      "homeInsHolding",
      "homeInsOngoing",
    ] as const;

    taxAndHomeIns.forEach((childName) => {
      const child = property.addAndGetChild(childName, {
        sectionValues: { valueSourceName: "valueDollarsEditor" },
      });
      child.addChild("valueDollarsEditor", {
        sectionValues: {
          valueEditorFrequency: "yearly",
        },
      });
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
      valueSourceName: "valuePercentEditor",
      valuePercentEditor: numObj(costOverrunPercent),
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
