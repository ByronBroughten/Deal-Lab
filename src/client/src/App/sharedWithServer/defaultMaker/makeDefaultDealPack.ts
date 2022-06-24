import { SectionPackRaw } from "../SectionPack/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultMgmtPack } from "./makeDefaultMgmtPack";
import { makeDefaultOutputList } from "./makeDefaultOutputList";
import { makeDefaultPropertyPack } from "./makeDefaultPropertyPack";

export function makeDefaultDealPack(): SectionPackRaw<"deal"> {
  const childNames = ["financing", "internalVarbList"] as const;
  const main = PackBuilderSection.initAsMain();
  const deal = main.addAndGetChild("deal");
  childNames.forEach((childName) => {
    deal.addChild(childName);
  });
  deal.loadChild(makeDefaultOutputList());

  const propertyGeneral = deal.addAndGetChild("propertyGeneral");
  propertyGeneral.loadChild(makeDefaultPropertyPack());

  const mgmtGeneral = deal.addAndGetChild("mgmtGeneral");
  mgmtGeneral.loadChild(makeDefaultMgmtPack());

  return deal.makeSectionPack();
}
