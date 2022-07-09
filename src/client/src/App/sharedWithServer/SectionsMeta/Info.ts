import { SimpleSectionName } from "./baseSections";
import { VarbProp } from "./baseSectionsDerived/baseVarbInfo";
import { StateValue } from "./baseSectionsUtils/baseValues/StateValueTypes";
import { Id } from "./baseSectionsUtils/id";
import {
  DescendantSectionName,
  SelfOrDescendantSectionName,
} from "./childSectionsDerived/DescendantSectionName";
import { ParentName, ParentNameSafe } from "./childSectionsDerived/ParentName";
import { SectionName, sectionNameS, SectionNameType } from "./SectionName";

export interface FeInfoByType<T extends SectionNameType = "all"> {
  sectionName: SectionName<T>;
  feId: string;
}
export type DbInfoByType<ST extends SectionNameType = "all"> = {
  sectionName: SectionName<ST>;
  dbId: string;
};

export interface FeSectionInfo<
  SN extends SimpleSectionName = SimpleSectionName
> {
  sectionName: SN;
  feId: string;
}
export interface SectionArrInfo<SN extends SectionName> {
  sectionName: SN;
  feIds: string;
}

export interface FeDescendantInfo<
  SN extends SectionName = SectionName<"hasChild">
> {
  sectionName: DescendantSectionName<SN>;
  feId: string;
}
export interface FeSelfOrDescendantInfo<SN extends SectionName> {
  sectionName: SelfOrDescendantSectionName<SN>;
  feId: string;
}
export interface FeParentInfo<SN extends SectionName> {
  sectionName: ParentName<SN>;
  feId: string;
}
export interface FeParentInfoSafe<SN extends SectionName> {
  sectionName: ParentNameSafe<SN>;
  feId: string;
}

export interface VarbInfo<SN extends SectionName = SectionName<"hasVarb">>
  extends FeSectionInfo<SN>,
    VarbProp {}

export interface VarbValueInfo<SN extends SectionName = SectionName<"hasVarb">>
  extends VarbInfo<SN> {
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
  isFeVarbInfo(value: any): value is VarbInfo {
    return (
      Id.is(value.feId) &&
      sectionNameS.is(value.sectionName) &&
      typeof value.varbName === "string"
    );
  },
};
