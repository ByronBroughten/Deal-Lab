import { SimpleSectionName } from "../baseSections";
import { SectionNameProp } from "../baseSectionsDerived/baseSectionInfo";
import { GeneralIdInfo } from "../baseSectionsUtils/baseIdInfo";
import { ChildName } from "./ChildName";
import { ParentName } from "./ParentName";

export interface RelChildInfo<SN extends SimpleSectionName = SimpleSectionName>
  extends GeneralIdInfo,
    SectionNameProp<SN> {
  idType: "children";
  id: ChildName<SN>;
}

export interface RelParentInfo<SN extends SimpleSectionName = SimpleSectionName>
  extends GeneralIdInfo,
    SectionNameProp<SN> {
  idType: "parent";
  id: ParentName<SN>;
}

// should I still use static and whatnot?

const relInfosS = {
  children() {},
};
