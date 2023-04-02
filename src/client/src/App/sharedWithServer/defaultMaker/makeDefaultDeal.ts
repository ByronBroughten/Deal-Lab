import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { GetterSection } from "../StateGetters/GetterSection";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import { makeDefaultLoanPack } from "./makeDefaultLoanPack";
import { makeDefaultMgmtPack } from "./makeDefaultMgmtPack";
import { makeDefaultProperty } from "./makeDefaultProperty";

const dealSectionNames = ["property", "financing", "mgmt"] as const;
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
  });
  const financing = deal.addAndGetChild("financing");
  financing.loadChild({
    childName: "loan",
    sectionPack: makeDefaultLoanPack(),
  });
  deal.loadChild({
    childName: "property",
    sectionPack: makeDefaultProperty(),
  });
  deal.loadChild({
    childName: "mgmt",
    sectionPack: makeDefaultMgmtPack(),
  });

  return deal.makeSectionPack();
}
