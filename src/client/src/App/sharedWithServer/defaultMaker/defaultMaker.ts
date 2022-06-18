import { SectionPackRaw } from "../SectionPack/SectionPackRaw";
import { SectionName } from "../SectionsMeta/SectionName";
import { makeDefaultDealPack } from "./makeDefaultDealPack";
import { makeDefaultLoanPack } from "./makeDefaultLoanPack";
import { makeDefaultMainPack } from "./makeDefaultMainPack";
import { makeDefaultMgmtPack } from "./makeDefaultMgmtPack";
import { makeDefaultPropertyPack } from "./makeDefaultPropertyPack";

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
}

export const defaultMaker = new DefaultSectionPackMaker({
  property: makeDefaultPropertyPack,
  mgmt: makeDefaultMgmtPack,
  loan: makeDefaultLoanPack,
  analysis: makeDefaultDealPack,
  main: makeDefaultMainPack,
} as const);
