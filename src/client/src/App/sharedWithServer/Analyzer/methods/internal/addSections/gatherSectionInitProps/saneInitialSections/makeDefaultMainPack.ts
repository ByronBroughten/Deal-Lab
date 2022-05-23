import { SectionPackBuilder } from "../../../../../../SectionFocal/SectionPackBuilder";
import { SectionPackRaw } from "../../../../../SectionPackRaw";
import { makeDefaultDealPack } from "./makeDefaultDealPack";

export function makeDefaultMainPack(): SectionPackRaw<"main"> {
  const main = new SectionPackBuilder();
  main.loadChild(makeDefaultDealPack());
  return main.makeSectionPack();
}
