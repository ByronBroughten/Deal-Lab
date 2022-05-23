import { SectionPackBuilder } from "../../../../../../SectionFocal/SectionPackBuilder";
import { SectionPackRaw } from "../../../../../SectionPackRaw";
import { makeDefaultMgmtPack } from "./initMgmtDefaultNext";
import { makeDefaultPropertyPack } from "./initPropertyDefaultNext";
import { makeDefaultOutputList } from "./makeDefaultOutputList";

export function makeDefaultDealPack(): SectionPackRaw<"analysis"> {
  const main = new SectionPackBuilder();
  const deal = main.addAndGetChild("analysis");

  deal.addChild("financing");
  deal.addChild("totalInsAndOuts");
  deal.addChild("final");
  deal.addChild("dealVarbList");
  deal.loadChild(makeDefaultOutputList());

  const propertyGeneral = deal.addAndGetChild("propertyGeneral");
  propertyGeneral.loadChild(makeDefaultPropertyPack());

  const mgmtGeneral = deal.addAndGetChild("mgmtGeneral");
  mgmtGeneral.loadChild(makeDefaultMgmtPack());

  return deal.makeSectionPack();
}
