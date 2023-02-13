import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultLoanPack } from "./makeDefaultLoanPack";
import { makeDefaultMgmtPack } from "./makeDefaultMgmtPack";
import { makeDefaultOutputList } from "./makeDefaultOutputList";
import { makeDefaultProperty } from "./makeDefaultProperty";

export function makeDefaultDealPack(): SectionPack<"deal"> {
  const deal = PackBuilderSection.initAsOmniChild("deal", {
    dbVarbs: { dealMode: "buyAndHold" },
  });
  const financing = deal.addAndGetChild("financing");
  financing.loadChild({
    childName: "loan",
    sectionPack: makeDefaultLoanPack(),
  });

  deal.loadChild({
    childName: "dealOutputList",
    sectionPack: makeDefaultOutputList(),
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
