import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { makeDefaultDealPack } from "./makeDefaultDealPack";
import { makeDefaultFeUserPack } from "./makeDefaultFeUser";
import { makeDefaultLoanPack } from "./makeDefaultLoanPack";
import { makeDefaultMainPack } from "./makeDefaultMainPack";
import { makeDefaultMgmtPack } from "./makeDefaultMgmtPack";
import { makeDefaultPropertyPack } from "./makeDefaultPropertyPack";
import { makeDefaultSingleTimeValue } from "./makeDefaultSingleTimeValue";
import { makeDefaultUserVarbItem } from "./makeDefaultUserVarbItem";

type FunctionsMakeDefault<SN extends SectionNameByType> = {
  [S in SN]: () => SectionPack<S>;
};
class DefaultSectionPackMaker<SN extends SectionNameByType> {
  constructor(private makeDefaults: FunctionsMakeDefault<SN>) {}
  has(sectionName: any): sectionName is SN {
    return sectionName in this.makeDefaults;
  }
  makeSectionPack<S extends SN>(sectionName: S): SectionPack<S> {
    return this.makeDefaults[sectionName]();
  }
}

export const defaultMaker = new DefaultSectionPackMaker({
  userVarbItem: makeDefaultUserVarbItem,
  property: makeDefaultPropertyPack,
  singleTimeValue: makeDefaultSingleTimeValue,
  mgmt: makeDefaultMgmtPack,
  loan: makeDefaultLoanPack,
  deal: makeDefaultDealPack,
  main: makeDefaultMainPack,
  feUser: makeDefaultFeUserPack,
} as const);
