import { SectionPack } from "../SectionPack/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultMgmtPack } from "./makeDefaultMgmtPack";
import { makeDefaultOutputList } from "./makeDefaultOutputList";
import { makeDefaultPropertyPack } from "./makeDefaultPropertyPack";

export function makeDefaultDealPack(): SectionPack<"deal"> {
  const childNames = ["financing"] as const;
  const deal = PackBuilderSection.initAsOmniChild("deal");
  childNames.forEach((childName) => {
    deal.addChild(childName);
  });
  deal.loadChild({
    childName: "dealOutputList",
    sectionPack: makeDefaultOutputList(),
  });

  const propertyGeneral = deal.addAndGetChild("propertyGeneral");
  propertyGeneral.loadChild({
    childName: "property",
    sectionPack: makeDefaultPropertyPack(),
  });

  const mgmtGeneral = deal.addAndGetChild("mgmtGeneral");
  mgmtGeneral.loadChild({
    childName: "mgmt",
    sectionPack: makeDefaultMgmtPack(),
  });

  return deal.makeSectionPack();
}
