import { numObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/NumObj";
import { stringObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/StringObj";
import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";
import { makeExampleUserOngoingLists } from "./makeExampleUserOngoingLists";
import { makeExampleUserSingleTimeLists } from "./makeExampleUserSingleTimeLists";

export function makeExampleProperty(): SectionPack<"property"> {
  const property = PackBuilderSection.initAsOmniChild("property", {
    dbId: "exampleprop1",
  });
  property.addChild("upfrontRevenueListGroup");
  property.addChild("ongoingRevenueListGroup");

  const ongoingGroup = property.addAndGetChild("ongoingCostListGroup");
  ongoingGroup.loadChildren({
    childName: "ongoingList",
    sectionPacks: makeExampleUserOngoingLists(),
  });
  const upfrontGroup = property.addAndGetChild("upfrontCostListGroup");
  upfrontGroup.loadChildren({
    childName: "singleTimeList",
    sectionPacks: makeExampleUserSingleTimeLists(),
  });
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
  return property.makeSectionPack();
}
