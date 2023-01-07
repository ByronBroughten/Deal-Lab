import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultMgmtPack } from "./makeDefaultMgmtPack";
import { makeDefaultOutputList } from "./makeDefaultOutputList";
import { makeDefaultPropertyPack } from "./makeDefaultPropertyPack";

export function makeDefaultDealPack(): SectionPack<"deal"> {
  const childNames = ["propertyGeneral", "financing", "mgmtGeneral"] as const;
  const deal = PackBuilderSection.initAsOmniChild("deal", {
    dbVarbs: {
      showCalculationsStatus: "hide",
    },
  });
  childNames.forEach((childName) => {
    deal.addChild(childName);
  });
  deal.loadChild({
    childName: "dealOutputList",
    sectionPack: makeDefaultOutputList(),
  });
  const propertyGeneral = deal.onlyChild("propertyGeneral");
  propertyGeneral.loadChild({
    childName: "property",
    sectionPack: makeDefaultPropertyPack(),
  });
  const mgmtGeneral = deal.onlyChild("mgmtGeneral");
  mgmtGeneral.loadChild({
    childName: "mgmt",
    sectionPack: makeDefaultMgmtPack(),
  });
  return deal.makeSectionPack();
}
