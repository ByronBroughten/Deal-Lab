import { SimpleSectionName } from "../baseSectionsVarbs";
import { ChildName } from "./ChildName";
import { ChildSectionName } from "./ChildSectionName";
import { SectionPack } from "./SectionPack";

export type ChildSectionPack<
  SN extends SimpleSectionName,
  CN extends ChildName<SN>,
  CT extends ChildSectionName<SN, CN> = ChildSectionName<SN, CN>
> = SectionPack<CT>;

export type ChildArrPack<
  SN extends SimpleSectionName,
  CN extends ChildName<SN> = ChildName<SN>,
  CT extends ChildSectionName<SN, CN> = ChildSectionName<SN, CN>
> = {
  childName: CN;
  sectionPacks: SectionPack<CT>[];
};
