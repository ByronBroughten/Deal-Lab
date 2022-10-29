import { ChildName } from "../SectionsMeta/childSectionsDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/childSectionsDerived/ChildSectionName";
import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { Obj } from "../utils/Obj";
import { makeDefaultDealPack } from "./makeDefaultDealPack";
import { makeDefaultFeUserPack } from "./makeDefaultFeUser";
import { makeDefaultLoanPack } from "./makeDefaultLoanPack";
import { makeDefaultMainPack } from "./makeDefaultMainPack";
import { makeDefaultMgmtPack } from "./makeDefaultMgmtPack";
import { makeDefaultPropertyPack } from "./makeDefaultPropertyPack";
import { makeDefaultUserVarbItem } from "./makeDefaultUserVarbItem";
import { defaultPropertyChildrenMakers } from "./makePropertyDefaultChildren";

export const childDefaultMakers = {
  property: defaultPropertyChildrenMakers,
} as const;

type FunctionsMakeDefault<SN extends SectionNameByType> = {
  [S in SN]: () => SectionPack<S>;
};
class DefaultSectionPackMaker<SN extends SectionNameByType> {
  constructor(private makeDefaults: FunctionsMakeDefault<SN>) {}
  has(sectionName: any): sectionName is SN {
    return sectionName in this.makeDefaults;
  }
  hasDefaultChild<S extends SectionName, CN extends ChildName<S>>(
    sectionName: S,
    childName: CN
  ) {
    if (Obj.isKey(childDefaultMakers, sectionName)) {
      const childMakers = childDefaultMakers[sectionName];
      if (Obj.isKey(childMakers, childName)) {
        return true;
      }
    }
  }
  makeChildSectionPack<S extends SectionName, CN extends ChildName<S>>(
    sectionName: S,
    childName: CN
  ): SectionPack<ChildSectionName<S, CN>> {
    if (Obj.isKey(childDefaultMakers, sectionName)) {
      const childMakers = childDefaultMakers[sectionName];
      if (Obj.isKey(childMakers, childName)) {
        const childMaker = childMakers[childName] as () => SectionPack<any>;
        return childMaker();
      }
    }
    throw new Error(
      `There is no default child sectionPack for ${sectionName}.${childName}`
    );
  }
  makeSectionPack<S extends SN>(sectionName: S): SectionPack<S> {
    return this.makeDefaults[sectionName]();
  }
}

export const defaultMaker = new DefaultSectionPackMaker({
  userVarbItem: makeDefaultUserVarbItem,
  property: makeDefaultPropertyPack,
  mgmt: makeDefaultMgmtPack,
  loan: makeDefaultLoanPack,
  deal: makeDefaultDealPack,
  main: makeDefaultMainPack,
  feUser: makeDefaultFeUserPack,
} as const);
