import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import { SectionName } from "../SectionsMeta/SectionName";
import { makeDefaultDealPack } from "./makeDefaultDealPack";
import { makeDefaultFeUserPack } from "./makeDefaultFeUser";
import { makeDefaultLoanPack } from "./makeDefaultLoanPack";
import { makeDefaultMainPack } from "./makeDefaultMainPack";
import { makeDefaultMgmtPack } from "./makeDefaultMgmtPack";
import { makeDefaultPropertyPack } from "./makeDefaultPropertyPack";

type FunctionsMakeDefault<SN extends SectionName> = {
  [S in SN]: () => SectionPack<S>;
};
class DefaultSectionPackMaker<SN extends SectionName> {
  constructor(private makeDefaults: FunctionsMakeDefault<SN>) {}
  has(sectionName: any): sectionName is SN {
    return sectionName in this.makeDefaults;
  }
  makeSectionPack<S extends SN>(sectionName: S): SectionPack<S> {
    return this.makeDefaults[sectionName]();
  }
}

export const defaultMaker = new DefaultSectionPackMaker({
  property: makeDefaultPropertyPack,
  mgmt: makeDefaultMgmtPack,
  loan: makeDefaultLoanPack,
  deal: makeDefaultDealPack,
  main: makeDefaultMainPack,
  feUser: makeDefaultFeUserPack,
} as const);
