import { ChildName } from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { ChildSectionPack } from "../SectionsMeta/sectionChildrenDerived/ChildSectionPack";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";

export type ChildSectionPackArrs<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> = {
  [C in CN]: ChildSectionPack<SN, C>[];
};

export type ChildPackInfo<
  SN extends SectionNameByType,
  CN extends ChildName<SN> = ChildName<SN>,
  CT extends ChildSectionName<SN, CN> = ChildSectionName<SN, CN>
> = {
  childName: CN;
  sectionPack: SectionPack<CT>;
};
