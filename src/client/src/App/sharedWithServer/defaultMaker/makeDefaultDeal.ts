import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { StateValue } from "../SectionsMeta/values/StateValue";
import { GetterSection } from "../StateGetters/GetterSection";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import { makeDefaultLoanPack } from "./makeDefaultLoanPack";
import { makeDefaultMgmt } from "./makeDefaultMgmt";
import { makeDefaultProperty } from "./makeDefaultProperty";

export const dealSectionNames = [
  "property",
  "purchaseFinancing",
  "mgmt",
] as const;
type DealSectionName = (typeof dealSectionNames)[number];

export function makeDefaultDealDisplayName(
  deal: GetterSection<"deal">
): string {
  const names = dealSectionNames.reduce((names, sectionName) => {
    names[sectionName] = deal.onlyChild(sectionName).stringValue("displayName");
    return names;
  }, {} as Record<DealSectionName, string>);
  return `${names.property} / ${names.purchaseFinancing} / ${names.mgmt}`;
}

export function makeDefaultDealPack(
  dealMode: StateValue<"dealMode"> = "buyAndHold"
): SectionPack<"deal"> {
  const deal = PackBuilderSection.initAsOmniChild("deal");
  deal.updateValues({
    dealMode,
    displayNameSource: "displayNameEditor",
  });
  deal.loadChild({
    childName: "property",
    sectionPack: makeDefaultProperty(dealMode),
  });

  const purchaseFinancing = deal.addAndGetChild("purchaseFinancing", {
    sectionValues: { financingMode: "purchase" },
  });
  purchaseFinancing.loadChild({
    childName: "loan",
    sectionPack: makeDefaultLoanPack(),
  });

  const refiFinancing = deal.addAndGetChild("refiFinancing", {
    sectionValues: { financingMode: "refinance" },
  });
  refiFinancing.loadChild({
    childName: "loan",
    sectionPack: makeDefaultLoanPack(),
  });
  refiFinancing.updateValues({ financingMethod: "useLoan" });

  deal.loadChild({
    childName: "mgmt",
    sectionPack: makeDefaultMgmt(),
  });

  return deal.makeSectionPack();
}
