import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { SectionName } from "../SectionsMeta/SectionName";
import { makeDefaultDealPack } from "./makeDefaultDeal";
import { makeDefaultDealSystem } from "./makeDefaultDealSystem";
import { makeDefaultFeUserPack } from "./makeDefaultFeUser";
import { makeDefaultLoanPack } from "./makeDefaultLoanPack";
import { makeDefaultMain } from "./makeDefaultMain";
import { makeDefaultMgmtPack } from "./makeDefaultMgmtPack";
import { makeDefaultOneTimeValue } from "./makeDefaultOneTimeValue";
import { makeDefaultOngoingValue } from "./makeDefaultOngoingValue";
import { makeDefaultOutputList } from "./makeDefaultOutputList";
import { makeDefaultProperty } from "./makeDefaultProperty";
import { makeDefaultUserVarbItem } from "./makeDefaultUserVarbItem";

type FunctionsMakeDefault<SN extends SectionName> = {
  [S in SN]: () => SectionPack<S>;
};
class DefaultSectionPackMaker<SN extends SectionName> {
  constructor(private makeDefaults: FunctionsMakeDefault<SN>) {}
  has(sectionName: any): sectionName is SN {
    return sectionName in this.makeDefaults;
  }
  makeSectionPack<S extends SN>(sectionName: S): SectionPack<S> {
    const defaultMaker = this.makeDefaults[sectionName];
    if (!defaultMaker) {
      throw new Error(
        `Indexing makeDefaults with "${sectionName}" yielded "${defaultMaker}"`
      );
    }
    return defaultMaker();
  }
}

export const defaultMaker = new DefaultSectionPackMaker({
  numVarbItem: makeDefaultUserVarbItem,
  property: makeDefaultProperty,
  singleTimeValue: makeDefaultOneTimeValue,
  ongoingValue: makeDefaultOngoingValue,
  mgmt: makeDefaultMgmtPack,
  loan: makeDefaultLoanPack,
  outputList: makeDefaultOutputList,
  deal: makeDefaultDealPack,
  main: makeDefaultMain,
  dealSystem: makeDefaultDealSystem,
  feStore: makeDefaultFeUserPack,
} as const);
