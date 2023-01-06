import { numObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/NumObj";
import { stringObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/StringObj";
import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";
import { makeDefaultPropertyPack } from "../makeDefaultPropertyPack";
import {
  makeCapExList,
  makeExampleSingleTimeList,
  makeUtilityList,
} from "./makeExampleOngoingLists";
import {
  examplePropertyCapExListProps,
  examplePropertyUtilityProps,
  examplePropetyRepairProps,
  priceSqftMiscRepairHybrid,
} from "./makeExampleOngoingListsProps";

export function makeExampleProperty(): SectionPack<"property"> {
  const property = PackBuilderSection.initAsOmniChild("property");
  property.loadSelf(makeDefaultPropertyPack());
  property.updater.updateDbId("exampleprop1");

  property.updater.updateValues({
    displayName: stringObj("Example Property"),
    price: numObj(250000),
    taxesYearly: numObj(2800),
    homeInsYearly: numObj(1800),
    sqft: numObj(2500),
  });
  property.addChild("unit", {
    dbVarbs: { targetRentMonthly: numObj(1500), numBedrooms: numObj(3) },
  });
  property.addChild("unit", {
    dbVarbs: { targetRentMonthly: numObj(1500), numBedrooms: numObj(3) },
  });

  const upfrontRepairValue = property.onlyChild("repairCostValue");
  upfrontRepairValue.updateValues({ isItemized: true });
  const repairList = upfrontRepairValue.onlyChild("singleTimeList");
  repairList.loadSelf(
    makeExampleSingleTimeList("Repairs", examplePropetyRepairProps)
  );

  const utilityValue = property.onlyChild("utilityCostValue");
  utilityValue.updateValues({ isItemized: true });
  const utilityList = utilityValue.onlyChild("ongoingList");
  utilityList.loadSelf(makeUtilityList(examplePropertyUtilityProps));

  const capExValue = property.onlyChild("capExCostValue");
  capExValue.updateValues({ isItemized: true });
  const capExList = capExValue.onlyChild("ongoingList");
  capExList.loadSelf(makeCapExList(examplePropertyCapExListProps));

  const ongoingRepairValue = property.onlyChild("maintenanceCostValue");
  ongoingRepairValue.updateValues({
    valueSourceSwitch: "valueEditor",
    valueEditor: priceSqftMiscRepairHybrid,
    isItemized: false,
  });

  return property.makeSectionPack();
}
