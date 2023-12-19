import { SectionPack } from "../SectionPacks/SectionPack";
import { PackBuilderSection } from "../StateClasses/Packers/PackBuilderSection";
import { GetterSection } from "../StateGetters/GetterSection";
import { StateValue } from "../sectionVarbsConfig/StateValue";
import { makeDefaultLoanPack } from "./makeDefaultLoanPack";
import { makeDefaultMgmt } from "./makeDefaultMgmt";
import { makeDefaultProperty } from "./makeDefaultProperty";

const dealChildNames = [
  "property",
  "purchaseFinancing",
  "mgmtOngoing",
] as const;
type DealSectionName = (typeof dealChildNames)[number];

export function makeDefaultDealDisplayName(
  deal: GetterSection<"deal">
): string {
  const names = dealChildNames.reduce((names, sectionName) => {
    names[sectionName] = deal.onlyChild(sectionName).stringValue("displayName");
    return names;
  }, {} as Record<DealSectionName, string>);
  return `${names.property} / ${names.purchaseFinancing} / ${names.mgmtOngoing}`;
}

export function makeDefaultDealPack(
  dealMode: StateValue<"dealMode"> = "buyAndHold"
): SectionPack<"deal"> {
  const deal = PackBuilderSection.initAsOmniChild("deal");
  deal.updateValues({
    dealMode,
    displayNameSource: "displayNameEditor",
  });
  deal.addChild("property", {
    sectionPack: makeDefaultProperty(dealMode),
  });

  const purchaseFinancing = deal.addAndGetChild("purchaseFinancing", {
    sectionValues: { financingMode: "purchase" },
  });
  purchaseFinancing.addChild("loan", {
    sectionPack: makeDefaultLoanPack("purchase"),
  });
  purchaseFinancing.addChild("timeTillRefinance");

  const refiFinancing = deal.addAndGetChild("refiFinancing", {
    sectionValues: { financingMode: "refinance", financingMethod: "useLoan" },
  });
  refiFinancing.addChild("loan", {
    sectionPack: makeDefaultLoanPack("refinance"),
  });
  refiFinancing.addChild("timeTillRefinance");

  deal.addChild("mgmtOngoing", {
    sectionPack: makeDefaultMgmt(),
  });

  return deal.makeSectionPack();
}
