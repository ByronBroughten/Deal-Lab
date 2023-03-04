import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { makeDefaultDealPack } from "./makeDefaultDealPack";
import { makeDefaultDealPage } from "./makeDefaultDealPage";
import { makeDefaultFeUserPack } from "./makeDefaultFeUser";
import { makeDefaultLoanPack } from "./makeDefaultLoanPack";
import { makeDefaultMain } from "./makeDefaultMain";
import { makeDefaultMgmtPack } from "./makeDefaultMgmtPack";
import { makeDefaultOneTimeValue } from "./makeDefaultOneTimeValue";
import { makeDefaultOngoingValue } from "./makeDefaultOngoingValue";
import { makeDefaultProperty } from "./makeDefaultProperty";
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
  property: makeDefaultProperty,
  singleTimeValue: makeDefaultOneTimeValue,
  ongoingValue: makeDefaultOngoingValue,
  mgmt: makeDefaultMgmtPack,
  loan: makeDefaultLoanPack,
  deal: makeDefaultDealPack,
  main: makeDefaultMain,
  dealPage: makeDefaultDealPage,
  feUser: makeDefaultFeUserPack,
} as const);
