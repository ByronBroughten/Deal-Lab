import { VarbProp, VarbPropNext } from "./baseSectionsDerived/baseVarbInfo";
import { StateValue } from "./baseSectionsVarbs/baseValues/StateValueTypes";
import { Id } from "./baseSectionsVarbs/id";
import { ParentName, ParentNameSafe } from "./childSectionsDerived/ParentName";
import { SectionName } from "./SectionName";
import {
  SectionNameByType,
  sectionNameS,
  SectionNameType,
} from "./SectionNameByType";

export interface FeInfoByType<T extends SectionNameType = "all"> {
  sectionName: SectionNameByType<T>;
  feId: string;
}
export type DbInfoByType<ST extends SectionNameType = "all"> = {
  sectionName: SectionNameByType<ST>;
  dbId: string;
};

export interface FeSectionInfo<SN extends SectionName = SectionName> {
  sectionName: SN;
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

export interface FeVarbInfoNext<SN extends SectionName>
  extends FeSectionInfo<SN>,
    VarbPropNext<SN> {}

export interface VarbValueInfo<
  SN extends SectionNameByType = SectionNameByType<"hasVarb">
> extends FeVarbInfo<SN> {
  value: StateValue;
}

export type VarbStringInfo = {
  sectionName: string;
  varbName: string;
  id: string;
  infoType: string;
};

export const noParentWarning = "no parent";

export const InfoS = {
  isFeVarbInfo(value: any): value is FeVarbInfo {
    return (
      Id.is(value.feId) &&
      sectionNameS.is(value.sectionName) &&
      typeof value.varbName === "string"
    );
  },
};
