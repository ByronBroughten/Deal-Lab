import { SectionPackRaw } from "../../../../../../SectionPack/SectionPackRaw";
import { SectionPackBuilder } from "../../../../../../StatePackers.ts/PackBuilderSection";
import { makeDefaultDealPack } from "./makeDefaultDealPack";

export function makeDefaultMainPack(): SectionPackRaw<"main"> {
  const main = new SectionPackBuilder();
  main.loadChild(makeDefaultDealPack());
  main.addChild("analysisTable");
  return main.makeSectionPack();
}
