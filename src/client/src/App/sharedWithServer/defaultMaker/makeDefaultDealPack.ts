import { SectionPackRaw } from "../SectionPack/SectionPackRaw";
import { SectionPackBuilder } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultMgmtPack } from "./makeDefaultMgmtPack";
import { makeDefaultOutputList } from "./makeDefaultOutputList";
import { makeDefaultPropertyPack } from "./makeDefaultPropertyPack";

export function makeDefaultDealPack(): SectionPackRaw<"deal"> {
  const childNames = [
    "financing",
    "totalInsAndOuts",
    "final",
    "internalVarbList",
  ] as const;
  const main = new SectionPackBuilder();
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
