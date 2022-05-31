import { SectionPackBuilder } from "../../../../../../StatePackers.ts/PackBuilderSection";
import { SectionPackRaw } from "../../../../../SectionPackRaw";
import { makeDefaultMgmtPack } from "./makeDefaultMgmtPack";
import { makeDefaultOutputList } from "./makeDefaultOutputList";
import { makeDefaultPropertyPack } from "./makeDefaultPropertyPack";

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
