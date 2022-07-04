import { SimpleSectionName } from "../baseSections";
import { SectionNameProp } from "../baseSectionsDerived/baseSectionInfo";
import { GeneralIdInfo } from "../baseSectionsUtils/baseIdInfo";
import { ChildName } from "./ChildName";
import { ParentName } from "./ParentName";

export interface RelChildrenInfo<
  SN extends SimpleSectionName = SimpleSectionName,
  CN extends ChildName<SN> = ChildName<SN>
> extends GeneralIdInfo,
    SectionNameProp<SN> {
  idType: "children";
  id: CN;
}

export interface RelParentInfo<
  SN extends SimpleSectionName = SimpleSectionName,
  PN extends ParentName<SN> = ParentName<SN>
> extends GeneralIdInfo,
    SectionNameProp<SN> {
  idType: "parent";
  id: PN;
}

// depreciated.
export interface RelAllInfo<
  SN extends SimpleSectionName = SimpleSectionName,
  AN extends SimpleSectionName = SimpleSectionName
> extends GeneralIdInfo,
    SectionNameProp<SN> {
  idType: "all";
  id: AN;
}
export interface RelStaticInfo<
  SN extends SimpleSectionName = SimpleSectionName,
  STN extends SimpleSectionName = SimpleSectionName
> extends GeneralIdInfo,
    SectionNameProp<SN> {
  idType: "static";
  id: STN;
}
