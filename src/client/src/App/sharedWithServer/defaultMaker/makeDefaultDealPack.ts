import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultOutputList } from "./makeDefaultOutputList";
import { makeDefaultPropertyPack } from "./makeDefaultPropertyPack";

export function makeDefaultDealPack(): SectionPack<"deal"> {
  const childNames = ["financing", "mgmtGeneral"] as const;
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
  const propertyGeneral = deal.addAndGetChild("propertyGeneral");
  propertyGeneral.loadChild({
    childName: "property",
    sectionPack: makeDefaultPropertyPack(),
  });
  return deal.makeSectionPack();
}
