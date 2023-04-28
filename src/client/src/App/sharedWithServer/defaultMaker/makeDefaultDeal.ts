import { ChildName } from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { StateValue } from "../SectionsMeta/values/StateValue";
import { GetterSection } from "../StateGetters/GetterSection";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import { makeDefaultLoanPack } from "./makeDefaultLoanPack";
import { makeDefaultMgmtPack } from "./makeDefaultMgmtPack";
import { makeDefaultProperty } from "./makeDefaultProperty";

type ChildByDealMode = Record<StateValue<"dealMode">, ChildName<"deal">>;
const testPropertiesByType = <T extends ChildByDealMode>(t: T): T => t;
export const dealPropertiesByType = testPropertiesByType({
  buyAndHold: "buyAndHoldProperty",
  fixAndFlip: "fixAndFlipProperty",
});
export const dealSectionNames = ["property", "financing", "mgmt"] as const;
type DealSectionName = typeof dealSectionNames[number];

export function makeDefaultDealDisplayName(
  deal: GetterSection<"deal">
): string {
  const names = dealSectionNames.reduce((names, sectionName) => {
    names[sectionName] = deal.onlyChild(sectionName).stringValue("displayName");
    return names;
  }, {} as Record<DealSectionName, string>);
  return `${names.property} / ${names.financing} / ${names.mgmt}`;
}

export function makeDefaultDealPack(): SectionPack<"deal"> {
  const deal = PackBuilderSection.initAsOmniChild("deal");
  deal.updateValues({
    dealMode: "buyAndHold",
    displayNameSource: "defaultDisplayName",
  });
  const financing = deal.addAndGetChild("financing");
  financing.loadChild({
    childName: "loan",
    sectionPack: makeDefaultLoanPack(),
  });

  deal.loadChild({
    childName: "buyAndHoldProperty",
    sectionPack: makeDefaultProperty("buyAndHold"),
  });

  deal.loadChild({
    childName: "fixAndFlipProperty",
    sectionPack: makeDefaultProperty("fixAndFlip"),
  });

  // deal.loadChild({
  //   childName: "brrrrProperty",
  //   sectionPack: makeDefaultProperty(),
  // });

  deal.loadChild({
    childName: "property",
    sectionPack: makeDefaultProperty("buyAndHold"),
  });
  deal.loadChild({
    childName: "mgmt",
    sectionPack: makeDefaultMgmtPack(),
  });

  return deal.makeSectionPack();
}
