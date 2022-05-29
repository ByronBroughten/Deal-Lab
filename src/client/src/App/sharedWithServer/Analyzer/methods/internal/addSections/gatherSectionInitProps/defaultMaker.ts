import { SectionName } from "../../../../../SectionsMeta/SectionName";
import { PackLoaderSection } from "../../../../../StatePackers.ts/PackLoaderSection";
import { SectionPackRaw } from "../../../../SectionPackRaw";
import { makeDefaultLoanPack } from "./saneInitialSections/initLoanDefaultNext";
import { makeDefaultMgmtPack } from "./saneInitialSections/initMgmtDefaultNext";
import { makeDefaultPropertyPack } from "./saneInitialSections/initPropertyDefaultNext";
import { makeDefaultDealPack } from "./saneInitialSections/makeDefaultDealPack";
import { makeDefaultMainPack } from "./saneInitialSections/makeDefaultMainPack";

type FunctionsMakeDefault<SN extends SectionName> = {
  [S in SN]: () => SectionPackRaw<S>;
};
class DefaultSectionPackMaker<SN extends SectionName> {
  constructor(private makeDefaults: FunctionsMakeDefault<SN>) {}
  has(sectionName: any): sectionName is SN {
    return sectionName in this.makeDefaults;
  }
  make<S extends SN>(sectionName: S): SectionPackRaw<S> {
    return this.makeDefaults[sectionName]();
  }
  initSectionsFromMain() {
    const sectionName = "main";
    if (this.has(sectionName)) {
      const mainPack = this.make(sectionName) as any as SectionPackRaw<"main">;
      return PackLoaderSection.initSectionsFromPack(mainPack);
    } else throw new Error(`"main" is not an option in this defaultMaker`);
  }
}

export const defaultMaker = new DefaultSectionPackMaker({
  property: makeDefaultPropertyPack,
  mgmt: makeDefaultMgmtPack,
  loan: makeDefaultLoanPack,
  analysis: makeDefaultDealPack,
  main: makeDefaultMainPack,
} as const);
