import { SectionPack } from "../SectionPack/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultDealPack } from "./makeDefaultDealPack";
import { makeDefaultUser } from "./makeDefaultUser";

export function makeDefaultMainPack(): SectionPack<"main"> {
  const main = PackBuilderSection.initAsMain();
  main.loadChild({
    childName: "deal",
    sectionPack: makeDefaultDealPack(),
  });
  main.loadChild({
    childName: "user",
    sectionPack: makeDefaultUser(),
  });

  const tableStoreNames = [
    "propertyTableStore",
    "loanTableStore",
    "mgmtTableStore",
    "dealTableStore",
  ] as const;

  for (const tableStoreName of tableStoreNames) {
    const tableStore = main.addAndGetChild(tableStoreName);
    tableStore.addChild("table");
  }

  const childNames = ["login", "register"] as const;
  for (const childName of childNames) {
    main.addChild(childName);
  }
  return main.makeSectionPack();
}
