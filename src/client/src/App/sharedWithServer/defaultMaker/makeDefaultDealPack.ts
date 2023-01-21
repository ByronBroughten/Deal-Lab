import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultMgmtPack } from "./makeDefaultMgmtPack";
import { makeDefaultOutputList } from "./makeDefaultOutputList";
import { makeDefaultPropertyPack } from "./makeDefaultPropertyPack";

export function makeDefaultDealPack(): SectionPack<"deal"> {
  const deal = PackBuilderSection.initAsOmniChild("deal", {
    dbVarbs: { dealMode: "buyAndHold" },
  });
  deal.addChild("financing");
  deal.loadChild({
    childName: "dealOutputList",
    sectionPack: makeDefaultOutputList(),
  });
  deal.loadChild({
    childName: "property",
    sectionPack: makeDefaultPropertyPack(),
  });
  deal.loadChild({
    childName: "mgmt",
    sectionPack: makeDefaultMgmtPack(),
  });
  return deal.makeSectionPack();
}
