import {
  VarbName,
  VarbNameWide,
} from "../baseSectionsDerived/baseSectionsVarbsTypes";
import { Id } from "../IdS";
import {
  ParentName,
  ParentNameSafe,
} from "../sectionChildrenDerived/ParentName";
import { SectionName } from "../SectionName";
import {
  SectionNameByType,
  sectionNameS,
  SectionNameType,
} from "../SectionNameByType";
import { StateValue } from "../values/StateValue";
import { SectionNameProp } from "./SectionNameProp";
import { VarbProp, VarbPropNext } from "./VarbInfoBase";

export interface FeInfoByType<T extends SectionNameType = "all"> {
  sectionName: SectionNameByType<T>;
  feId: string;
}
export type DbInfoByType<ST extends SectionNameType = "all"> = {
  sectionName: SectionNameByType<ST>;
  dbId: string;
};

export interface FeSectionInfo<SN extends SectionName = SectionName>
  extends SectionNameProp<SN> {
  feId: string;
}
export interface SectionArrInfo<SN extends SectionNameByType> {
  sectionName: SN;
  feIds: string;
}

export interface FeParentInfo<SN extends SectionNameByType> {
  sectionName: ParentName<SN>;
  feId: string;
}
export interface FeParentInfoSafe<SN extends SectionNameByType> {
  sectionName: ParentNameSafe<SN>;
  feId: string;
}

export interface FeVarbInfo<
  SN extends SectionNameByType = SectionNameByType<"hasVarb">
> extends FeSectionInfo<SN>,
    VarbProp {}

export interface SnVarbNames<
  SN extends SectionName = SectionName,
  VN extends VarbNameWide<SN> = VarbNameWide<SN>
> extends SectionNameProp<SN> {
  varbName: VN;
}

export interface FeVI<
  SN extends SectionName = SectionName,
  VN extends VarbNameWide<SN> = VarbNameWide<SN>
> extends SectionNameProp<SN> {
  varbName: VN;
}

export interface SectionVarbNames<
  SN extends SectionName = SectionName,
  VN extends VarbName<SN> = VarbName<SN>
> extends SectionNameProp<SN>,
    VarbPropNext<SN, VN> {}

export interface FeVarbInfoNext<
  SN extends SectionName = SectionName,
  VN extends VarbName<SN> = VarbName<SN>
> extends FeSectionInfo<SN>,
    VarbPropNext<SN, VN> {}

export interface FeVarbValueInfo<
  SN extends SectionNameByType = SectionNameByType<"hasVarb">
> extends FeVarbInfo<SN> {
  value: StateValue;
}

export const FeInfoS = {
  isVarbInfo(value: any): value is FeVarbInfo {
    return (
      Id.is(value.feId) &&
      sectionNameS.is(value.sectionName) &&
      typeof value.varbName === "string"
    );
  },
};
