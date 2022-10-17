import { numObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/NumObj";
import { stringObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/StringObj";
import { SectionPack } from "../../SectionsMeta/childSectionsDerived/SectionPack";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";
import { makeExampleUserOngoingLists } from "./makeExampleUserOngoingLists";
import { makeExampleUserSingleTimeLists } from "./makeExampleUserSingleTimeLists";

export function makeExampleProperties(): SectionPack<"property">[] {
  const feUser = PackBuilderSection.initAsOmniChild("feUser");
  const property = feUser.addAndGetChild("propertyMain");
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
    displayName: stringObj("140 Case"),
    price: numObj(185000),
  });
  property.addChild("unit", {
    dbVarbs: { targetRentMonthly: numObj(1500), numBedrooms: numObj(3) },
  });
  property.addChild("unit", {
    dbVarbs: { targetRentMonthly: numObj(1500), numBedrooms: numObj(3) },
  });

  return feUser.makeChildPackArr("propertyMain");
}
