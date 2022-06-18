import { SectionPackRaw } from "../SectionPack/SectionPackRaw";
import { SectionPackBuilder } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultDealPack } from "./makeDefaultDealPack";
import { makeDefaultUser } from "./makeDefaultUser";

export function makeDefaultMainPack(): SectionPackRaw<"main"> {
  const main = new SectionPackBuilder();
  main.loadChild(makeDefaultDealPack());
  main.loadChild(makeDefaultUser());
  const childNames = [
    "analysisTable",
    "propertyTable",
    "loanTable",
    "mgmtTable",

    "login",
    "register",
  ] as const;
  for (const childName of childNames) {
    main.addChild(childName);
  }
  return main.makeSectionPack();
}
