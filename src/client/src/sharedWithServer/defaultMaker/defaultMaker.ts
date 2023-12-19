import { SectionPack } from "../SectionPacks/SectionPack";
import { SectionName } from "../sectionVarbsConfig/SectionName";
import { makeDefaultDealPack } from "./makeDefaultDeal";
import { makeDefaultDealCompareMenu } from "./makeDefaultDealCompareMenu";
import { makeDefaultDealSystem } from "./makeDefaultDealSystem";
import { makeDefaultFeUserPack } from "./makeDefaultFeStore";
import { makeDefaultLoanPack } from "./makeDefaultLoanPack";
import { makeDefaultMain } from "./makeDefaultMain";
import { makeDefaultMgmt } from "./makeDefaultMgmt";
import { makeDefaultOutputSection } from "./makeDefaultOutputSection";
import { makeDefaultProperty } from "./makeDefaultProperty";
import { makeDefaultUserVarbItem } from "./makeDefaultUserVarbItem";
import {
  makeDefaultCapExItem,
  makeDefaultMiscPeriodicValue,
  makeDefaultPeriodicItem,
  makeDefaultUnit,
} from "./makeSimpleDefaults";

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

// The only children these default sections should have are children that are
// necessary for the section to function and display correctly.
export const defaultMaker = new DefaultSectionPackMaker({
  main: makeDefaultMain,
  miscPeriodicValue: makeDefaultMiscPeriodicValue,
  periodicItem: makeDefaultPeriodicItem,
  capExItem: makeDefaultCapExItem,
  property: makeDefaultProperty,
  unit: makeDefaultUnit,
  numVarbItem: makeDefaultUserVarbItem,
  dealCompareMenu: makeDefaultDealCompareMenu,
  outputSection: makeDefaultOutputSection,
  mgmt: makeDefaultMgmt,
  loan: makeDefaultLoanPack,
  deal: makeDefaultDealPack,
  dealSystem: makeDefaultDealSystem,
  feStore: makeDefaultFeUserPack,
} as const);
