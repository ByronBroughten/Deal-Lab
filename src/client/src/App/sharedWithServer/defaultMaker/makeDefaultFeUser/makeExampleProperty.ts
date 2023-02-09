import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { numObj } from "../../SectionsMeta/values/StateValue/NumObj";
import { stringObj } from "../../SectionsMeta/values/StateValue/StringObj";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";
import { makeDefaultPropertyPack } from "../makeDefaultPropertyPack";
import {
  makeExampleSingleTimeList,
  makeUtilityList,
} from "./makeExampleOngoingLists";
import {
  examplePropertyUtilityProps,
  examplePropetyRepairProps,
} from "./makeExampleOngoingListsProps";

export function makeExampleProperty(): SectionPack<"property"> {
  const property = PackBuilderSection.initAsOmniChild("property");
  property.loadSelf(makeDefaultPropertyPack());
  property.updater.updateDbId("exampleprop1");

  property.updater.updateValues({
    displayName: stringObj("Example Property"),
    price: numObj(250000),
    taxesOngoingEditor: numObj(2800),
    taxesOngoingSwitch: "yearly",
    homeInsOngoingEditor: numObj(1800),
    homeInsOngoingSwitch: "yearly",
    sqft: numObj(2500),
  });
  property.addChild("unit", {
    dbVarbs: { targetRentOngoingEditor: numObj(1500), numBedrooms: numObj(3) },
  });
  property.addChild("unit", {
    dbVarbs: { targetRentOngoingEditor: numObj(1500), numBedrooms: numObj(3) },
  });

  const repairValue = property.onlyChild("repairValue");
  const repairList = repairValue.onlyChild("singleTimeList");
  repairList.loadSelf(
    makeExampleSingleTimeList("Repairs", examplePropetyRepairProps)
  );

  const utilityValue = property.onlyChild("utilityValue");
  const utilityList = utilityValue.onlyChild("ongoingList");
  utilityList.loadSelf(makeUtilityList(examplePropertyUtilityProps));

  const maintenanceValue = property.onlyChild("maintenanceValue");
  maintenanceValue.updateValues({
    valueMode: "onePercentAndSqft",
  });

  return property.makeSectionPack();
}
