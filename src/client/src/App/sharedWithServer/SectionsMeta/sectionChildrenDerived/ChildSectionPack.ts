import { SectionName } from "../SectionName";
import { ChildName } from "./ChildName";
import { ChildSectionName } from "./ChildSectionName";
import { SectionPack } from "./SectionPack";

export type ChildSectionPack<
  SN extends SectionName,
  CN extends ChildName<SN>,
  CT extends ChildSectionName<SN, CN> = ChildSectionName<SN, CN>
> = SectionPack<CT>;

export type ChildArrPack<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>,
  CT extends ChildSectionName<SN, CN> = ChildSectionName<SN, CN>
> = {
  childName: CN;
  sectionPacks: SectionPack<CT>[];
};
