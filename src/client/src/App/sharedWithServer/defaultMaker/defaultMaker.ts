import { SectionPack } from "../SectionPack/SectionPack";
import { SectionName } from "../SectionsMeta/SectionName";
import { makeDefaultDealPack } from "./makeDefaultDealPack";
import { makeDefaultLoanPack } from "./makeDefaultLoanPack";
import { makeDefaultMainPack } from "./makeDefaultMainPack";
import { makeDefaultMgmtPack } from "./makeDefaultMgmtPack";
import { makeDefaultPropertyPack } from "./makeDefaultPropertyPack";
import { makeMainTablePackMakers } from "./makeMainTablePackMakers";

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
  makeMainTablePack = makeMainTablePackMakers();
}

export const defaultMaker = new DefaultSectionPackMaker({
  property: makeDefaultPropertyPack,
  mgmt: makeDefaultMgmtPack,
  loan: makeDefaultLoanPack,
  deal: makeDefaultDealPack,
  main: makeDefaultMainPack,
} as const);
